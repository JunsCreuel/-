import { useEffect, useRef, useState } from 'react'
import { PHOTOS, PICS } from '../data'
import { Folio, Footnote, InlineChip, Pic } from '../editorial'
import { clamp, prefersReducedMotion, useDragScroll } from '../motion'
import { pickForBooking } from '../scroll'
import './yw-equipment.css'

// No. 05 Equipment & Gel — 실제 매장 온열돔 카드와 디바이스 3종을 한 줄 트랙으로 묶는다.
// 데스크톱은 마우스로 끌어 넘기고(관성 후 카드에 맞춤), 트랙패드·화살표·←→ 키로도 넘긴다. 모바일은 네이티브 스와이프와 scroll-snap.
// 디바이스 카드에 마우스를 올리면(또는 '젤 보기') 기기 사진 위로 전용 젤 사진이 왼쪽에서 오른쪽으로 덮인다.
// 화장품·기기 광고 기준에 맞춰 사용 장면과 성분 출처만 적고 효능은 쓰지 않는다.

// 온열돔 이용 방식. 버튼을 누르면 상담 폼 1단계가 '온열 웜업'으로 미리 선택된 채 예약 장으로 내려간다.
const DOME_USES = [
  { id: 'solo', label: '단독 이용', text: '온열돔만 편안하게 이용합니다.', cta: '온열돔 단독 이용 상담' },
  { id: 'regular', label: '정기 이용', text: '방문 주기와 이용권 구성을 상담합니다.', cta: '정기 이용 상담' },
  { id: 'combo', label: '온열돔 + 집중관리', text: '온열돔 후 원하는 부위 하나를 더 관리합니다.', cta: '온열돔 + 집중관리 상담' },
]

// 디바이스와 기기별 전용 제품(이전 Gel 섹션의 성분 목록을 그대로 옮겼다).
// gel 사진은 pic(PICS, 실사 장면 → cover) 또는 src(제품 누끼 → contain + 흰 바탕)다.
const DEVICES = [
  {
    no: '02',
    en: 'FACE',
    name: '페이스 갈바닉',
    sub: '얼굴 · 교체형 헤드',
    photo: PHOTOS.faceGalvanic,
    alt: '갈바닉 기기 본체와 교체형 헤드 3종',
    gel: [{ pic: PICS.eqFaceGel, alt: '브러시로 크림을 펴 바르는 옆얼굴' }],
    gelCaption: ['전용 젤과 함께 사용합니다'],
    ingredients: null,
  },
  {
    no: '03',
    en: 'BODY',
    name: '바디 갈바닉',
    sub: '바디 · 넓은 면적 컨덕터',
    photo: PHOTOS.bodyGalvanic,
    alt: '바디 갈바닉 기기 앞면',
    gel: [{ src: PHOTOS.gelShaping, alt: '파란색 튜브의 에이지락 바디 쉐이핑 젤' }],
    gelCaption: ['에이지락 바디 쉐이핑 젤 · 300 mL'],
    ingredients: [
      { icon: PHOTOS.ingKelp, iconAlt: '초록빛 해조류', name: '호스테일켈프 추출물', en: 'Laminaria Digitata Extract', desc: '바다에서 자라는 갈조류에서 얻은 성분' },
      { icon: PHOTOS.ingTheobromine, iconAlt: '맑은 물방울 구조', name: '테오브로민', en: 'Theobromine', desc: '카카오에 들어 있는 성분' },
    ],
  },
  {
    no: '04',
    en: 'BODY',
    name: '웰스파',
    sub: '하체 · 팔뚝 · 복부',
    photo: PHOTOS.wellspa,
    alt: '웰스파 바디 디바이스 앞면과 헤드',
    gel: [
      { src: PHOTOS.gelSerum, alt: '손바닥에 덜어 낸 에이지락 바디 세럼' },
      { src: PHOTOS.gelActivating, alt: '손바닥에 짜내는 에이지락 바디 액티베이팅 젤' },
    ],
    gelCaption: ['에이지락 바디 세럼 · 100 mL', '에이지락 바디 액티베이팅 젤 · 150 mL'],
    // 바디 세럼과 바디 액티베이팅 젤의 성분(겹치는 '에이지락 블렌드'는 한 번만)
    ingredients: [
      { name: '바디 실루엣 블렌드', desc: '식물 유래 성분 복합체' },
      { name: 'AI 펩타이드', desc: '펩타이드 성분' },
      { name: '타라열매 & 코토니 추출물', desc: '식물에서 얻은 추출물' },
      { name: '스킨 컨디셔닝 블렌드', desc: '마카다미아넛오일, 해바라기씨오일 추출물, 알란토인, 판테놀' },
      { name: '서양벌노랑이꽃 추출물', desc: '꽃에서 얻은 식물 추출물' },
      { name: '록샘파이어 추출물', desc: '바닷가 식물에서 얻은 추출물' },
      { name: '윈터체리뿌리 추출물', desc: '식물 뿌리에서 얻은 추출물' },
      { name: '에이지락 블렌드', desc: '세월의 흐름에 따른 피부 고민을 케어하는 프리미엄 블렌드' },
    ],
  },
]

const CARD_COUNT = DEVICES.length + 1
const pad2 = (n) => String(n).padStart(2, '0')

// 카드마다 트랙이 멈출 수 있는 scrollLeft(scroll-padding 반영, 0~max). offsetLeft라 기울기(transform)의 영향을 받지 않는다.
function snapPoints(track) {
  const max = Math.max(0, track.scrollWidth - track.clientWidth)
  const cards = Array.from(track.querySelectorAll('.yw-eq__card'))
  let padL = parseFloat(getComputedStyle(track).scrollPaddingLeft)
  if (Number.isNaN(padL)) padL = cards[0]?.offsetLeft ?? 0 // 계산값을 px로 못 읽으면 첫 카드 자리를 기준으로
  return cards.map((card) => clamp(card.offsetLeft - padL, 0, max))
}

// 첫 카드: 실제 매장 온열돔. 이용 방식 칩(radiogroup)을 고르면 한 줄 설명과 버튼 문구가 함께 바뀐다.
function DomeCard() {
  const [use, setUse] = useState(DOME_USES[0].id)
  const radios = useRef([])
  const current = DOME_USES.find((u) => u.id === use)

  const onRadioKey = (e) => {
    const n = DOME_USES.length
    let i = DOME_USES.findIndex((u) => u.id === use)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + n) % n
    else if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = n - 1
    else return
    e.preventDefault()
    e.stopPropagation() // 트랙의 ←→ 넘기기로 번지지 않게
    setUse(DOME_USES[i].id)
    radios.current[i]?.focus()
  }

  return (
    <article id="warm-ritual" className="yw-eq__card yw-eq__card--dome">
      <figure className="yw-eq__photo">
        <Pic pic={PICS.review1} sizes="(min-width: 64rem) 34rem, 82vw" alt="용호 자이점 전신 온열돔" />
        <figcaption>용호 자이점 온열돔</figcaption>
      </figure>
      <div className="yw-eq__body">
        <p className="yw-eq__no">
          <span className="yw-eq__num">01</span>
          <span className="yw-eq__dot"> · </span>
          <span className="yw-eq__en">WARM UP</span>
        </p>
        <h3 className="yw-eq__name">전신 온열돔</h3>
        <p className="yw-eq__sub">누워서 쉬어 가는 전신 온열</p>
        <div className="yw-eq__uses" role="radiogroup" aria-label="온열돔 이용 방식" onKeyDown={onRadioKey}>
          {DOME_USES.map((u, i) => (
            <button
              key={u.id}
              ref={(el) => {
                radios.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={u.id === use}
              tabIndex={u.id === use ? 0 : -1}
              className="yw-eq__chip"
              data-cursor=""
              onClick={() => setUse(u.id)}
            >
              {u.label}
            </button>
          ))}
        </div>
        <div className="yw-eq__usebox" aria-live="polite">
          <p key={use} className="yw-eq__use">
            {current.text}
          </p>
        </div>
        <button
          type="button"
          className="yw-btn yw-btn--ink yw-eq__cta"
          data-magnet
          data-cursor=""
          onClick={() => pickForBooking({ area: '온열 웜업', label: current.cta })}
        >
          <span>{current.cta}</span>
        </button>
      </div>
    </article>
  )
}

// 디바이스 카드: 흰 바탕 기기 사진 위에 전용 젤 사진 면이 겹쳐 있다. 마우스 기기는 올리면, 터치·키보드는 '젤 보기'로 덮인다.
function DeviceCard({ d }) {
  const [gelOn, setGelOn] = useState(false)
  return (
    <article className={`yw-eq__card${gelOn ? ' is-gel' : ''}`}>
      <div className="yw-eq__media">
        <img className="yw-eq__device" src={d.photo} alt={d.alt} loading="lazy" decoding="async" />
        <div className={`yw-eq__gel${d.gel.length > 1 ? ' yw-eq__gel--two' : ''}`} aria-hidden={!gelOn}>
          {d.gel.map((g) =>
            g.pic ? (
              <Pic key={g.alt} pic={g.pic} sizes="(min-width: 64rem) 22rem, 82vw" alt={g.alt} className="yw-eq__gelimg" />
            ) : (
              <img key={g.alt} src={g.src} alt={g.alt} className="yw-eq__gelimg yw-eq__gelimg--cut" loading="lazy" decoding="async" />
            ),
          )}
          <p className="yw-eq__gelcap">
            {d.gelCaption.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      </div>
      <div className="yw-eq__body">
        <p className="yw-eq__no">
          <span className="yw-eq__num">{d.no}</span>
          <span className="yw-eq__dot"> · </span>
          <span className="yw-eq__en">{d.en}</span>
        </p>
        <h3 className="yw-eq__name">{d.name}</h3>
        <p className="yw-eq__sub">{d.sub}</p>
        <button type="button" className="yw-eq__gelbtn" aria-pressed={gelOn} data-cursor="" onClick={() => setGelOn((v) => !v)}>
          <span className="sr-only">{d.name} </span>
          {gelOn ? '기기 보기' : '젤 보기'}
        </button>
        {d.ingredients && (
          <details className="yw-eq__ing">
            <summary data-cursor="">주요 성분</summary>
            <ul>
              {d.ingredients.map((ing) => (
                <li key={ing.name} className={ing.icon ? 'has-icon' : undefined}>
                  {ing.icon && <img src={ing.icon} alt={ing.iconAlt} width="72" height="72" loading="lazy" decoding="async" />}
                  <div>
                    <p className="yw-eq__ingname">{ing.name}</p>
                    {ing.en && <p className="yw-eq__ingen">{ing.en}</p>}
                    <p className="yw-eq__ingdesc">{ing.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  )
}

export default function Equipment() {
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const [nav, setNav] = useState({ idx: 1, atStart: true, atEnd: false })

  useDragScroll(trackRef, { itemSelector: '.yw-eq__card' })

  // 트랙 스크롤을 rAF로 묶어 진행 막대(--p, --vis), 카운터, 양 끝 화살표, 속도 기울기(--skew)를 갱신한다.
  useEffect(() => {
    const track = trackRef.current
    const bar = barRef.current
    if (!track) return undefined
    const reduced = prefersReducedMotion()
    let raf = 0
    let last = track.scrollLeft
    let skewTimer = 0
    let byScroll = false // 크기 변화로 scrollLeft가 바뀐 것은 기울이지 않는다
    const prev = { idx: 1, atStart: true, atEnd: false }

    const update = () => {
      raf = 0
      const tilt = byScroll
      byScroll = false
      const left = track.scrollLeft
      const max = track.scrollWidth - track.clientWidth
      const p = max > 0 ? clamp(left / max, 0, 1) : 0
      const vis = track.scrollWidth ? clamp(track.clientWidth / track.scrollWidth, 0, 1) : 1
      if (bar) {
        bar.style.setProperty('--p', p.toFixed(4))
        bar.style.setProperty('--vis', vis.toFixed(4))
      }

      const atStart = left < 4
      const atEnd = left > max - 4
      // 가장 왼쪽(멈춤 위치가 가장 가까운) 카드 번호. 끝까지 넘겼으면 마지막 카드로 센다.
      let idx = 1
      if (atEnd && max > 4) {
        idx = CARD_COUNT
      } else {
        let best = Infinity
        snapPoints(track).forEach((x, i) => {
          const dist = Math.abs(x - left)
          if (dist < best - 0.5) {
            best = dist
            idx = i + 1
          }
        })
      }
      if (idx !== prev.idx || atStart !== prev.atStart || atEnd !== prev.atEnd) {
        prev.idx = idx
        prev.atStart = atStart
        prev.atEnd = atEnd
        setNav({ idx, atStart, atEnd })
      }

      if (!reduced && tilt) {
        const dx = left - last
        if (dx !== 0) {
          track.style.setProperty('--skew', `${clamp(dx * -0.15, -4, 4).toFixed(2)}deg`)
          clearTimeout(skewTimer)
          skewTimer = setTimeout(() => track.style.setProperty('--skew', '0deg'), 120)
        }
      }
      last = left
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onScroll = () => {
      byScroll = true
      kick()
    }
    update()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', kick)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(kick) : null
    ro?.observe(track)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', kick)
      ro?.disconnect()
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(skewTimer)
    }
  }, [])

  // 한 카드씩 앞뒤로. 카드 폭이 달라(온열돔이 넓다) 고정 폭 대신 다음·이전 멈춤 위치로 간다.
  const go = (dir) => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    const left = track.scrollLeft
    const points = snapPoints(track)
    let target = dir > 0 ? points.find((x) => x > left + 4) : [...points].reverse().find((x) => x < left - 4)
    if (target === undefined) target = dir > 0 ? max : 0
    track.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const onTrackKey = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      go(e.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    <section id="equipment" className="yw-section yw-eq" data-theme="light">
      <div className="yw-wrap yw-eq__head">
        <div className="yw-eq__intro">
          <Folio no="05" en="Equipment & Gel" />
          <h2 className="yw-h2">온열돔과 세 가지 디바이스</h2>
          <p className="yw-lead">
            오일 대신 <InlineChip pic={PICS.chipGel} /> 디바이스마다 맞춘 전용 젤을 사용합니다.
          </p>
        </div>
        <div className="yw-eq__nav">
          <span className="yw-eq__count" aria-hidden="true">
            <b>{pad2(nav.idx)}</b> / {pad2(CARD_COUNT)}
          </span>
          <button type="button" className="yw-eq__arrow" aria-label="이전 장비" data-magnet disabled={nav.atStart} onClick={() => go(-1)}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="yw-eq__arrow" aria-label="다음 장비" data-magnet disabled={nav.atEnd} onClick={() => go(1)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div
        className="yw-eq__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="장비와 전용 젤"
        aria-roledescription="carousel"
        data-cursor="끌기"
        onKeyDown={onTrackKey}
      >
        <DomeCard />
        {DEVICES.map((d) => (
          <DeviceCard key={d.no} d={d} />
        ))}
      </div>

      <div className="yw-eq__bar" ref={barRef} aria-hidden="true" />

      <div className="yw-wrap">
        <Footnote>
          뉴스킨 디바이스와 기기별 전용 제품을 사용하며, 구성은 프로그램에 따라 다르고 체감은 개인에 따라 다를 수 있습니다. 기기·제품 사진에는 이해를
          돕기 위한 AI 생성 이미지가 포함되어 있습니다. NU SKIN, ageLOC은 Nu Skin Enterprises, Inc.의 상표입니다. 100% 예약제 · 이용시간과 비용, 정기 이용
          구성은 상담 시 안내합니다.
        </Footnote>
      </div>
    </section>
  )
}
