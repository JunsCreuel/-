import { useCallback, useEffect, useRef, useState } from 'react'
import { PICS } from '../data'
import { Folio, Footnote, Pic, SplitLines } from '../editorial'
import { clamp, easeOutCubic, prefersReducedMotion, useInView, useMediaQuery, useScrollProgress } from '../motion'
import './yw-story.css'

// No. 01 Our Story와 No. 02 Ritual(관리 네 단계 온기 다이얼).
// 관리 순서는 데스크톱(64rem 이상, 모션 줄이기 아님)에서 고정 무대라 스크롤 진행률이 곧 다이얼 값이다.
// 다이얼이나 단계 버튼을 움직이면 거꾸로 페이지가 그 자리로 스크롤된다. 그 밖에서는 다이얼을 끌고 놓으면 가까운 단계에 맞춰진다.

const STEPS = [
  { ko: '상담', en: 'CONSULTATION', text: '오늘의 컨디션과 신경 쓰이는 부위를 먼저 여쭙니다.' },
  { ko: '온열돔 웜업', en: 'HEAT DOME', text: '전신 온열돔에 편히 누워 몸을 데웁니다.' },
  { ko: '아웃케어', en: 'OUT CARE', text: '고른 부위를 손길과 디바이스로 한 번 더 관리합니다.' },
  { ko: '마무리', en: 'FINISH', text: '피부 상태와 편안함을 확인하고 일상 관리법을 알려 드립니다.' },
]
const STEP_PICS = [PICS.ritual1, PICS.ritual2, PICS.ritual3, PICS.ritual4]
const LAST = STEPS.length - 1
const SNAP_MS = 350
const two = (n) => String(n).padStart(2, '0')

// 단계가 넘어갈수록 바탕이 데워진다. 온열돔 무렵 가장 따뜻하고 마무리에서 살짝 식는다.
const warmAt = (t) => Math.min(0.85, Math.sin((Math.PI * Math.min(t, 1.6)) / 3.2) * 0.85 + (t > 2 ? -(t - 2) * 0.15 : 0))

// 키보드 화살표 ±1단계에 쓰는 화살표 키 방향
const KEY_DIR = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }

export default function About() {
  const ritualRef = useRef(null)
  const dialRef = useRef(null)
  const dialWrapRef = useRef(null)
  const imgRefs = useRef([])
  const tRef = useRef(0) // 지금 다이얼 값(0~3, 소수)
  const stepRef = useRef(0)
  const tweenRef = useRef({ raf: 0, to: -1 })
  const goalRef = useRef({ to: -1, at: 0 }) // 이동 중인 목표 단계(키를 빠르게 연달아 누를 때 기준)
  const touchRef = useRef(null) // 손가락으로 다이얼을 누른 동안: 누른 자리, 가로로 끌기 시작했는지(live), 브라우저가 옮기려던 값(v), 스크롤로 넘어갔는지
  const [step, setStep] = useState(0)
  const [hintOff, setHintOff] = useState(false)

  const reduced = prefersReducedMotion()
  // 화면이 너무 낮으면 고정 무대의 내용이 잘리므로 높이도 함께 본다.
  const pinned = useMediaQuery('(min-width: 64rem) and (min-height: 36rem)') && !reduced
  const hintSeen = useInView(dialWrapRef, { threshold: 0.9 })

  // 다이얼 값 t(0~3)를 화면에 그린다. React 상태는 반올림한 단계가 바뀔 때만 바꾼다.
  const apply = useCallback((raw) => {
    const t = clamp(raw, 0, LAST)
    tRef.current = t
    const root = ritualRef.current
    if (!root) return
    imgRefs.current.forEach((img, i) => {
      if (img) img.style.opacity = Math.max(0, 1 - Math.abs(t - i)).toFixed(3)
    })
    root.style.setProperty('--t', (t / LAST).toFixed(4))
    root.style.setProperty('--warm', warmAt(t).toFixed(4))
    if (dialRef.current) dialRef.current.value = String(Math.round(t * 100))
    const s = Math.round(t)
    if (s !== stepRef.current) {
      stepRef.current = s
      setStep(s)
      // 이웃 장면을 미리 디코드해 겹쳐 바뀔 때 깜빡이지 않게 한다.
      for (const j of [s + 1, s - 1]) imgRefs.current[j]?.decode?.().catch(() => {})
    }
    if (Math.abs(t - goalRef.current.to) < 0.01) goalRef.current.to = -1
  }, [])

  // 고정 무대: 스크롤 진행률 → 다이얼
  useScrollProgress(ritualRef, { mode: 'pin', enabled: pinned, onProgress: (p) => apply(p * LAST) })

  const stopTween = useCallback(() => {
    if (tweenRef.current.raf) cancelAnimationFrame(tweenRef.current.raf)
    tweenRef.current = { raf: 0, to: -1 }
  }, [])

  // 고정 없는 모드: 가까운 단계로 easeOutCubic 350ms. 모션 줄이기면 바로 맞춘다.
  const tweenTo = useCallback(
    (target) => {
      if (tweenRef.current.raf && tweenRef.current.to === target) return
      stopTween()
      const from = tRef.current
      if (prefersReducedMotion() || Math.abs(target - from) < 0.001) {
        apply(target)
        return
      }
      const start = performance.now()
      const tick = (now) => {
        const k = Math.min(1, (now - start) / SNAP_MS)
        apply(from + (target - from) * easeOutCubic(k))
        tweenRef.current = k < 1 ? { raf: requestAnimationFrame(tick), to: target } : { raf: 0, to: -1 }
      }
      tweenRef.current = { raf: requestAnimationFrame(tick), to: target }
    },
    [apply, stopTween],
  )

  // 고정 무대에서 다이얼 값 t에 해당하는 스크롤 위치로 이동한다.
  const scrollToT = (t, behavior) => {
    const el = ritualRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    window.scrollTo({ top: window.scrollY + r.top + (t / LAST) * (r.height - window.innerHeight), behavior })
  }

  const goTo = (i) => {
    const target = clamp(i, 0, LAST)
    goalRef.current = { to: target, at: performance.now() }
    if (pinned) scrollToT(target, 'smooth')
    else tweenTo(target)
  }

  // 지금 기준 단계: 이동 중이면 그 목표, 아니면 보이는 단계
  const baseStep = () => {
    const g = goalRef.current
    return g.to >= 0 && performance.now() - g.at < 1000 ? g.to : Math.round(tRef.current)
  }

  const endHint = () => {
    if (!hintOff) setHintOff(true)
  }

  const onDialInput = (e) => {
    const g = touchRef.current
    if (g && !g.live) {
      // Blink(안드로이드 크롬)는 트랙에 손가락이 닿는 순간 값을 그 자리로 옮기고 input을 낸다. 세로 스크롤일 수 있으므로
      // 가로로 끌기 시작하기 전에는 반영하지 않고 원래 값으로 되돌린다(스크롤 없이 손을 떼면 onDialTouchEnd가 그 단계로 옮긴다).
      g.v = Number(e.currentTarget.value)
      e.currentTarget.value = String(Math.round(tRef.current * 100))
      return
    }
    const v = Number(e.currentTarget.value)
    endHint()
    goalRef.current.to = -1
    if (!pinned) stopTween()
    apply(v / 100)
    if (pinned) scrollToT(v / 100, 'auto')
  }

  // 손가락(터치)으로 누르면 가로로 8px 넘게, 세로보다 크게 움직였을 때부터 다이얼 끌기로 본다.
  // 브라우저가 세로 스크롤로 가져가면(pointercancel) 끌기가 아니다. 마우스·펜·키보드는 이전과 같다.
  const onDialPointerDown = (e) => {
    touchRef.current = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY, live: false, v: null, scrolled: false } : null
  }

  const onDialPointerMove = (e) => {
    const g = touchRef.current
    if (!g || g.live || e.pointerType !== 'touch') return
    const dx = Math.abs(e.clientX - g.x)
    if (dx > 8 && dx > Math.abs(e.clientY - g.y)) g.live = true
  }

  const onDialPointerCancel = () => {
    if (touchRef.current) touchRef.current.scrolled = true
  }

  // 손을 뗄 때 끝낸다(pointercancel 뒤에도 세로 스크롤이 이어지는 동안 오는 input을 막아야 해서 touchend까지 기다린다).
  // 끌지도 스크롤하지도 않은 짧은 탭이면 이전처럼 누른 자리의 단계로 간다.
  const onDialTouchEnd = () => {
    const g = touchRef.current
    touchRef.current = null
    if (g && !g.live && !g.scrolled && g.v !== null) {
      endHint()
      goTo(Math.round(g.v / 100))
    }
  }

  const onDialTouchCancel = () => {
    touchRef.current = null
  }

  const onDialKey = (e) => {
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      endHint()
      goTo(e.key === 'Home' ? 0 : LAST)
      return
    }
    const dir = KEY_DIR[e.key]
    if (!dir) return
    e.preventDefault()
    endHint()
    goTo(baseStep() + dir)
  }

  // 고정 없는 모드: 손을 떼면(pointerup·change) 가까운 단계로 맞춘다. 이미 어떤 단계로 옮겨 가는 중(탭으로 고른 단계 등)이면 그대로 둔다.
  useEffect(() => {
    const dial = dialRef.current
    if (!dial || pinned) return undefined
    const snap = () => {
      if (tweenRef.current.raf) return
      tweenTo(Math.round(tRef.current))
    }
    dial.addEventListener('change', snap)
    dial.addEventListener('pointerup', snap)
    dial.addEventListener('pointercancel', snap)
    return () => {
      dial.removeEventListener('change', snap)
      dial.removeEventListener('pointerup', snap)
      dial.removeEventListener('pointercancel', snap)
    }
  }, [pinned, tweenTo])

  useEffect(() => stopTween, [stopTween])

  // 고정이 풀리면(창 크기 변경 등) 두 장면 사이에 멈춰 있지 않게 가까운 단계로 맞춘다.
  useEffect(() => {
    if (!pinned) apply(Math.round(tRef.current))
  }, [pinned, apply])

  // 다이얼이 처음 보이면 두 번째 장면을 미리 디코드한다.
  useEffect(() => {
    if (hintSeen) imgRefs.current[1]?.decode?.().catch(() => {})
  }, [hintSeen])

  const cls = `yw-ritual${pinned ? ' is-pinned' : ''}${hintSeen && !hintOff && !reduced ? ' is-hint' : ''}`

  return (
    <section id="about" className="yw-section yw-story" data-theme="light">
      <div className="yw-wrap yw-story__head">
        <div className="yw-story__lead">
          <Folio no="01" en="Our Story" />
          <SplitLines
            as="h2"
            className="yw-story__title"
            lines={['온기로 시작해,', '손끝으로 완성합니다.']}
          />
        </div>
      </div>


      <div id="ritual" ref={ritualRef} className={cls}>
        <div className="yw-ritual__stage">
          <div className="yw-wrap yw-ritual__grid">
            <div className="yw-ritual__head">
              <Folio no="02" en="Ritual" />
              <h3 className="yw-ritual__title">한 번의 방문, 네 단계</h3>
            </div>

            <figure
              className="yw-ritual__arch"
              data-cursor="다음 장면"
              onClick={() => {
                endHint()
                goTo((baseStep() + 1) % STEPS.length)
              }}
            >
              {STEP_PICS.map((pic, i) => (
                <Pic
                  key={STEPS[i].en}
                  pic={pic}
                  sizes="(min-width: 64rem) 36vw, 90vw"
                  aria-hidden="true"
                  imgRef={(el) => {
                    imgRefs.current[i] = el
                  }}
                />
              ))}
              <span className="yw-ritual__count" aria-hidden="true">
                {two(step + 1)} / {two(STEPS.length)}
              </span>
            </figure>

            <div className="yw-ritual__body">
              <div className="yw-ritual__steps" role="group" aria-label="관리 단계 바로가기">
                {STEPS.map((s, i) => (
                  <button
                    key={s.en}
                    type="button"
                    className="yw-ritual__step"
                    aria-pressed={step === i}
                    onClick={() => {
                      endHint()
                      goTo(i)
                    }}
                  >
                    <b>{two(i + 1)}</b>
                    <span>{s.ko}</span>
                    <small>{s.en}</small>
                  </button>
                ))}
              </div>

              <ol className="yw-ritual__texts">
                {STEPS.map((s, i) => (
                  <li
                    key={s.en}
                    className="yw-ritual__text"
                    data-active={step === i ? '' : undefined}
                    aria-current={step === i ? 'step' : undefined}
                  >
                    {s.text}
                  </li>
                ))}
              </ol>

              <div ref={dialWrapRef} className="yw-ritual__dialwrap">
                <span className="yw-ritual__nudge" aria-hidden="true">
                  <svg viewBox="0 0 28 12" width="28" height="12" focusable="false">
                    <path d="M1 6h26M6 1.5 1.5 6 6 10.5M22 1.5 26.5 6 22 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  ref={dialRef}
                  className="yw-ritual__dial"
                  type="range"
                  min="0"
                  max="300"
                  step="1"
                  defaultValue="0"
                  aria-label="관리 단계"
                  aria-valuetext={`${step + 1}단계, ${STEPS[step].ko}`}
                  onChange={onDialInput}
                  onKeyDown={onDialKey}
                  onPointerDown={onDialPointerDown}
                  onPointerMove={onDialPointerMove}
                  onPointerCancel={onDialPointerCancel}
                  onTouchEnd={onDialTouchEnd}
                  onTouchCancel={onDialTouchCancel}
                />
              </div>
              <p className="yw-ritual__hint">
                {pinned ? (
                  '스크롤하거나 끌어서 단계 넘기기'
                ) : (
                  <>
                    <span aria-hidden="true">← </span>끌어서 단계 넘기기<span aria-hidden="true"> →</span>
                  </>
                )}
              </p>

              <Footnote>
                온열돔 단독 이용도 가능합니다. 온열돔 포함 여부와 사용하는 디바이스는 프로그램에 따라 다르며, 예약 전에 안내해 드립니다.
              </Footnote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
