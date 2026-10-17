import { useEffect, useRef, useState } from 'react'
import { BRANCHES, OFFER_TERM, PICS, SALE_COUNT, SHOW_OFFER } from '../data'
import { ParenLink, SplitLines } from '../editorial'
import { clamp, easeOutCubic, hasFinePointer, onScrollFrame, prefersReducedMotion } from '../motion'
import { scrollToId } from '../scroll'
import QuickConsult from './QuickConsult'
import './yw-hero.css'

// 01 Hero — 온기 렌즈
// 세피아로 식어 있는 사진 위에서 커서(터치는 탭) 주변 원 안만 따뜻한 색으로 살아난다. 스크롤을 시작하면 사진 전체가 데워진다(--warm).
// 같은 사진을 세 겹(세피아 바탕 · 데워지는 전체 · 렌즈 창) 겹치지만 URL이 같아 한 번만 받는다.
// 모션 줄이기, 또는 마우스가 없는 저사양·데이터 절약 기기에서는 렌즈 없이 컬러 사진 한 장만 둔다.
// 첫 화면에서 바로 예약·가맹 상담을 남길 수 있게 간편 상담 카드(QuickConsult)를 둔다(휴대폰은 제목 아래, 데스크톱은 오른쪽).

const SWEEP_MS = 1200
const LERP = 0.12
const HINT_MS = 4500

// 분위기 사진(글 뒤 장식이라 alt 비움). 48rem 미만과 세로로 긴 화면(세로 태블릿 등)은 세로 crop을 쓴다.
// 가로 3:2 사진을 세로 화면에 cover로 깔면 팔 한 부분만 크게 남기 때문이다.
function HeroPicture({ priority = false }) {
  const pic = PICS.heroWarm
  return (
    <picture>
      <source media="(max-width: 47.99rem), (max-aspect-ratio: 4/5)" srcSet={PICS.heroWarmM.srcSet} sizes="100vw" />
      <img
        src={pic.src}
        srcSet={pic.srcSet}
        sizes="100vw"
        width={pic.width}
        height={pic.height}
        alt=""
        decoding="async"
        {...(priority ? { loading: 'eager', fetchPriority: 'high' } : {})}
      />
    </picture>
  )
}

function detectMode() {
  if (typeof window === 'undefined') return { reduced: true, fine: false, lens: false }
  const reduced = prefersReducedMotion()
  const fine = hasFinePointer()
  const conn = navigator.connection
  const weak = !fine && (!!conn?.saveData || (navigator.hardwareConcurrency || 8) <= 4)
  return { reduced, fine, lens: !reduced && !weak }
}

export default function Hero() {
  const heroRef = useRef(null)
  const lensRef = useRef(null)
  const lensInRef = useRef(null)
  const [mode] = useState(detectMode)
  const [hintGone, setHintGone] = useState(false)

  // 스크롤 데워짐: 히어로가 보일 때만 허브를 구독해 --warm(0~1)을 쓴다. 모션 줄이기면 0으로 둔다.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || mode.reduced) return undefined
    let last = -1
    const update = () => {
      const r = hero.getBoundingClientRect()
      const warm = clamp(-r.top / Math.max(1, r.height * 0.6), 0, 1)
      if (Math.abs(warm - last) < 0.001) return
      last = warm
      hero.style.setProperty('--warm', warm.toFixed(3))
    }
    let unsub = null
    if (typeof IntersectionObserver === 'undefined') {
      unsub = onScrollFrame(update)
      return () => unsub()
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!unsub) unsub = onScrollFrame(update)
      } else if (unsub) {
        update() // 빠르게 지나가도 끝 값으로 맞춘다
        unsub()
        unsub = null
      }
    })
    io.observe(hero)
    return () => {
      io.disconnect()
      unsub?.()
    }
  }, [mode.reduced])

  // 온기 렌즈
  useEffect(() => {
    const hero = heroRef.current
    const lens = lensRef.current
    const lensIn = lensInRef.current
    if (!mode.lens || !hero || !lens || !lensIn) return undefined
    const fine = mode.fine
    let alive = true
    let hw = 0
    let hh = 0
    let base = 0 // 기본 반지름(px)
    let lx = 0
    let ly = 0
    let tx = 0
    let ty = 0
    let r = 0
    let shownR = -1
    let pv = 0 // 포인터 속도(16ms당 px, 감쇠)
    let lastMoveT = 0
    let lastPX = 0
    let lastPY = 0
    let sweep = null
    let raf = 0
    let lastT = 0
    let visible = true
    let hinted = false
    let opened = false // 스윕이 시작되거나 사용자가 움직이기 전까지 원은 닫혀 있다
    let taken = false // 사용자가 먼저 움직였으면 스윕은 건너뛴다

    const hideHint = () => {
      if (hinted) return
      hinted = true
      setHintGone(true)
    }

    const measure = () => {
      const rect = hero.getBoundingClientRect()
      hw = rect.width
      hh = rect.height
      hero.style.setProperty('--hw', `${hw.toFixed(1)}px`)
      hero.style.setProperty('--hh', `${hh.toFixed(1)}px`)
      base = fine ? 0.14 * Math.max(window.innerWidth, window.innerHeight) : 0.34 * window.innerWidth
    }

    const render = () => {
      lens.style.transform = `translate3d(${(lx - r).toFixed(1)}px, ${(ly - r).toFixed(1)}px, 0)`
      lensIn.style.transform = `translate3d(${(r - lx).toFixed(1)}px, ${(r - ly).toFixed(1)}px, 0)`
      if (Math.abs(r - shownR) >= 0.25) {
        shownR = r
        lens.style.setProperty('--r', `${r.toFixed(1)}px`)
      }
    }

    const tick = (now) => {
      raf = 0
      const dt = lastT ? clamp(now - lastT, 1, 64) : 16
      lastT = now
      if (sweep) {
        if (!sweep.start) sweep.start = now
        const t = clamp((now - sweep.start) / SWEEP_MS, 0, 1)
        const e = easeOutCubic(t)
        lx = tx = sweep.fx + (sweep.x - sweep.fx) * e
        ly = ty = sweep.fy + (sweep.y - sweep.fy) * e
        if (t >= 1) sweep = null
      } else {
        const k = 1 - (1 - LERP) ** (dt / 16)
        lx += (tx - lx) * k
        ly += (ty - ly) * k
      }
      pv *= 0.85 ** (dt / 16)
      const rT = !opened ? 0 : fine ? clamp(base + pv * 0.4, base, (base / 0.14) * 0.2) : base
      r += (rT - r) * Math.min(1, 0.2 * (dt / 16))
      const settled = !sweep && Math.abs(tx - lx) < 0.3 && Math.abs(ty - ly) < 0.3 && pv < 0.5 && Math.abs(rT - r) < 0.3
      if (settled) {
        lx = tx
        ly = ty
        r = rT
        pv = 0
      }
      render()
      if (!settled && visible) raf = requestAnimationFrame(tick)
      else lastT = 0
    }

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick)
    }

    measure()
    // 시작 전: 렌즈는 반지름 0으로 첫 스윕 출발점에 둔다
    const from = fine ? [0.5, 0.55] : [0.3, 0.6]
    const to = fine ? [0.72, 0.34] : [0.68, 0.36]
    lx = tx = from[0] * hw
    ly = ty = from[1] * hh
    render()

    // 첫 스윕: 바탕 사진이 준비되면 (가운데 → 오른쪽 위) 1.2초 미끄러지며 원이 열린다
    const startSweep = () => {
      if (!alive || taken || opened) return
      opened = true
      sweep = { start: 0, fx: lx, fy: ly, x: to[0] * hw, y: to[1] * hh }
      kick()
    }
    const img = hero.querySelector('.yw-hero__base img')
    const sweepTimer = setTimeout(startSweep, 2500) // 사진이 늦으면 그냥 시작
    if (img?.decode) {
      img
        .decode()
        .catch(() => {})
        .then(() => requestAnimationFrame(startSweep))
    }

    const take = (x, y) => {
      taken = true
      opened = true
      sweep = null
      tx = x
      ty = y
      hideHint()
      kick()
    }

    const local = (e) => {
      const rect = hero.getBoundingClientRect()
      return [e.clientX - rect.left, e.clientY - rect.top]
    }

    // 마우스·펜: 목표만 바꾸고 rAF가 늦게 따라간다. 빠르게 움직이면 원이 조금 커진다.
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      const [x, y] = local(e)
      const now = performance.now()
      if (lastMoveT && now - lastMoveT < 100) {
        const v = (Math.hypot(e.clientX - lastPX, e.clientY - lastPY) / Math.max(1, now - lastMoveT)) * 16
        pv = pv * 0.5 + v * 0.5
      }
      lastMoveT = now
      lastPX = e.clientX
      lastPY = e.clientY
      take(x, y)
    }

    // 터치: 탭한 자리로 옮겨 가고 닿으면 멈춘다(무한 루프 없음). 버튼·링크를 누를 때는 그대로 둔다.
    const onDown = (e) => {
      if (e.pointerType === 'mouse') return
      if (e.target.closest?.('a, button, form, .yw-quick')) return
      const [x, y] = local(e)
      take(x, y)
    }

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            const pw = hw
            const ph = hh
            measure()
            if (pw && ph) {
              // 크기가 바뀌면 같은 비율 자리에 둔다
              lx *= hw / pw
              tx *= hw / pw
              ly *= hh / ph
              ty *= hh / ph
            }
            kick()
            if (!raf) render()
          })
        : null
    ro?.observe(hero)

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (!visible && raf) {
              cancelAnimationFrame(raf)
              raf = 0
              lastT = 0
            } else if (visible) {
              kick()
            }
          })
        : null
    io?.observe(hero)

    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerdown', onDown, { passive: true })
    const hintTimer = setTimeout(hideHint, HINT_MS)

    return () => {
      alive = false
      clearTimeout(sweepTimer)
      clearTimeout(hintTimer)
      if (raf) cancelAnimationFrame(raf)
      ro?.disconnect()
      io?.disconnect()
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerdown', onDown)
    }
  }, [mode.lens, mode.fine])

  return (
    <section
      id="top"
      ref={heroRef}
      className={`yw-section yw-hero${mode.lens ? '' : ' yw-hero--plain'}`}
      data-theme="dark"
      data-cursor-off
    >
      <div className="yw-hero__media" aria-hidden="true">
        {mode.lens ? (
          <>
            <div className="yw-hero__layer yw-hero__base">
              <HeroPicture priority />
            </div>
            <div className="yw-hero__layer yw-hero__full">
              <HeroPicture />
            </div>
            <div className="yw-hero__lens" ref={lensRef}>
              <div className="yw-hero__lens-in" ref={lensInRef}>
                <HeroPicture />
              </div>
            </div>
          </>
        ) : (
          <div className="yw-hero__layer yw-hero__full">
            <HeroPicture priority />
          </div>
        )}
      </div>
      <div className="yw-hero__shade" aria-hidden="true" />

      <p className="yw-hero__mast">
        <span>WELLNESS STUDIO</span>
        <span className="yw-hero__mast-r">BUSAN · YONGHO ZAI</span>
      </p>

      <div className="yw-wrap yw-hero__text">
        {SHOW_OFFER && (
          <p className="yw-hero__chip">
            {OFFER_TERM} · {SALE_COUNT}개 관리 50%
          </p>
        )}
        <SplitLines
          as="h1"
          trigger="mount"
          className="yw-hero__title"
          lines={['오늘보다 더 예쁜,', <em key="e">내일의 나.</em>]}
        />
        <p className="yw-hero__kicker">
          관리 후 가장 먼저 듣는 말, <b>“예뻐졌다”</b>
        </p>
        <QuickConsult />
        {/* 휴대폰은 간편 상담 카드가 첫 화면을 차지하므로 '나에게 맞는 관리 찾기'를 큰 버튼 대신 괄호 링크로 줄인다 */}
        <div className="yw-hero__actions">
          <button type="button" className="yw-btn yw-btn--cream yw-hero__find" data-magnet onClick={() => scrollToId('concern')}>
            <span>나에게 맞는 관리 찾기</span>
          </button>
          <ParenLink onClick={() => scrollToId('concern')} tone="light" className="yw-hero__find-m">
            나에게 맞는 관리 찾기
          </ParenLink>
          <ParenLink href={BRANCHES.zai.booking} external tone="light">
            네이버 예약
          </ParenLink>
        </div>
      </div>

      {mode.lens && (
        <p className={`yw-hero__hint${hintGone ? ' is-gone' : ''}`} aria-hidden="true">
          {mode.fine ? '커서를 움직여 보세요' : '사진을 눌러 보세요'}
        </p>
      )}

      <dl className="yw-hero__info">
        <div>
          <dt className="sr-only">위치</dt>
          <dd>부산 용호 · GS하이츠자이 상가</dd>
        </div>
        <div>
          <dt className="sr-only">영업시간</dt>
          <dd>{BRANCHES.zai.hours}</dd>
        </div>
        <div>
          <dt className="sr-only">예약</dt>
          <dd>100% 예약제 · 1:1</dd>
        </div>
      </dl>

      <span className="yw-hero__scroll" aria-hidden="true">
        Scroll
      </span>
    </section>
  )
}
