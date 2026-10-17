import { useEffect, useId, useRef, useState } from 'react'
import { BRANCHES, PICS, PROGRAMS, SHOW_PRICES, won } from '../data'
import { ParenLink, Pic, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView } from '../motion'
import { pickForBooking } from '../scroll'
import './yw-dome.css'

// 온열돔 스포트라이트 — 어두운 장 가운데 오각형 그래프와 온열돔 누끼, 꼭짓점마다 풀 바디 웜업의 다섯 가지 구성.
// 꼭짓점 이름(탭)을 누르거나 ←→로 고르면 아래 설명이 바뀐다. 화면에 보이는 동안 3.6초마다 다음 꼭짓점으로 넘어가고,
// 사용자가 한 번 고르면 자동 넘김을 멈춘다(모션 줄이기에서는 처음부터 넘기지 않는다).
// 오각형은 수치가 아니라 구성을 보여 주는 장식이다. 효능(혈류·면역·지방 등)은 쓰지 않고 실제로 하는 일만 적는다.

const POINTS = [
  { id: 'warm', label: '전신 웜업', text: '편하게 누운 채, 온열돔 안에서 몸을 천천히 따뜻하게 데웁니다.' },
  { id: 'aroma', label: '아로마', text: '그날 컨디션에 맞는 아로마를 바르고 시작합니다.' },
  { id: 'rest', label: '깊은 휴식', text: '아무것도 하지 않고 40분 동안 누워서 쉬어 갑니다.' },
  { id: 'focus', label: '집중관리', text: '원하시면 온열돔 뒤에 고민 부위 하나를 이어서 관리합니다.' },
  { id: 'private', label: '프라이빗', text: '100% 예약제로, 한 분씩 프라이빗하게 진행합니다.' },
]

const WARMUP = PROGRAMS.find((p) => p.id === 'warmup')
const STEP = 3600
const R = 140 // 오각형 반지름(viewBox -200~200 기준)
const pad = (n) => String(n).padStart(2, '0')

// i번째 꼭짓점 좌표(맨 위에서 시작해 시계 방향).
function vertex(i, r) {
  const a = ((-90 + 72 * i) * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)]
}

const ring = (r) =>
  POINTS.map((_, i) =>
    vertex(i, r)
      .map((n) => n.toFixed(1))
      .join(','),
  ).join(' ')

export default function DomeSpot() {
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(() => !!prefersReducedMotion())
  const [hover, setHover] = useState(false)
  const chartRef = useRef(null)
  const tabs = useRef([])
  const drawn = useInView(chartRef, { threshold: 0.35 })
  const visible = useInView(chartRef, { once: false, threshold: 0.35 })
  const uid = useId()
  const tabId = (i) => `${uid}-tab-${i}`
  const panelId = `${uid}-panel`

  // 보이는 동안만 다음 꼭짓점으로 넘긴다. 마우스를 올려 두거나 한 번 고르면 멈춘다.
  useEffect(() => {
    if (touched || hover || !visible) return undefined
    const t = setTimeout(() => setActive((a) => (a + 1) % POINTS.length), STEP)
    return () => clearTimeout(t)
  }, [active, touched, hover, visible])

  function choose(i, focus = false) {
    setTouched(true)
    setActive(i)
    if (focus) tabs.current[i]?.focus()
  }

  function onKey(e) {
    const n = POINTS.length
    let i = active
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (active + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (active - 1 + n) % n
    else if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = n - 1
    else return
    e.preventDefault()
    choose(i, true)
  }

  const point = POINTS[active]
  const [ax, ay] = vertex(active, R)

  return (
    <section id="warm-dome" className="yw-section yw-dark yw-curtain yw-dome" data-theme="dark" aria-labelledby="warm-dome-title">
      <div className="yw-wrap yw-dome__grid">
        <div className="yw-dome__copy">
          <p className="yw-dome__kicker">
            <span>Signature Warm-up</span>
            <i aria-hidden="true" />
            <span>풀 바디 웜업케어</span>
          </p>
          <SplitLines
            id="warm-dome-title"
            className="yw-h2 yw-dome__title"
            lines={[
              <>
                <em>40분</em>, 누워서
              </>,
              '따뜻하게 쉬어 가세요.',
            ]}
          />
          <p className="yw-dome__sub">아로마로 시작해 온기로 채우는, 웰니스 스튜디오의 풀 바디 웜업케어</p>
        </div>

        <div
          ref={chartRef}
          className={`yw-dome__chart${drawn ? ' is-in' : ''}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <div className="yw-dome__plot" style={{ '--ax': `${50 + (ax / 400) * 100}%`, '--ay': `${50 + (ay / 400) * 100}%` }}>
            <svg viewBox="-200 -200 400 400" aria-hidden="true" focusable="false">
              {[1 / 3, 2 / 3, 1].map((k) => (
                <polygon key={k} className={`yw-dome__ring${k === 1 ? ' is-outer' : ''}`} points={ring(R * k)} pathLength="1" />
              ))}
              {POINTS.map((p, i) => {
                const [x, y] = vertex(i, R)
                return <line key={p.id} className={`yw-dome__axis${i === active ? ' is-on' : ''}`} x1="0" y1="0" x2={x} y2={y} />
              })}
              <polygon className="yw-dome__shape" points={ring(R * 0.86)} />
              {POINTS.map((p, i) => {
                const [x, y] = vertex(i, R)
                return (
                  <circle
                    key={p.id}
                    className={`yw-dome__dot${i === active ? ' is-on' : ''}`}
                    cx={x}
                    cy={y}
                    r="5"
                    style={{ '--i': i }}
                  />
                )
              })}
            </svg>

            <span className="yw-dome__pulse" aria-hidden="true" />

            <div className="yw-dome__pic">
              <Pic pic={PICS.domeCut} sizes="(min-width: 64rem) 18rem, 52vw" alt="전신 온열돔" />
            </div>

            <div className="yw-dome__tabs" role="tablist" aria-label="풀 바디 웜업케어 구성" onKeyDown={onKey}>
              {POINTS.map((p, i) => {
                const [x, y] = vertex(i, R + 16)
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    aria-selected={i === active}
                    aria-controls={panelId}
                    tabIndex={i === active ? 0 : -1}
                    className={`yw-dome__tab yw-dome__tab--${i === 2 || i === 3 ? 'below' : 'above'}`}
                    style={{ '--x': `${50 + (x / 400) * 100}%`, '--y': `${50 + (y / 400) * 100}%`, '--i': i }}
                    data-cursor="보기"
                    onClick={() => choose(i)}
                  >
                    <small>{pad(i + 1)}</small>
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="yw-dome__detail">
          <div id={panelId} role="tabpanel" aria-labelledby={tabId(active)} className="yw-dome__panel">
            <p key={point.id} className="yw-dome__point">
              <span className="yw-dome__no">
                {pad(active + 1)} <i>/ {pad(POINTS.length)}</i>
              </span>
              <strong>{point.label}</strong>
              {point.text}
            </p>
          </div>

          {WARMUP && (
            <p className="yw-dome__menu">
              {WARMUP.label}
              <span>
                {WARMUP.time}
                {SHOW_PRICES && ` · ${won(WARMUP.price)}`}
              </span>
            </p>
          )}

          <div className="yw-dome__cta">
            <button
              type="button"
              className="yw-btn yw-btn--cream"
              data-magnet
              data-cursor="예약"
              onClick={() => pickForBooking({ area: '온열 웜업', programId: WARMUP?.id, label: WARMUP?.label })}
            >
              <span>지금 예약하기</span>
            </button>
            <ParenLink href={BRANCHES.zai.booking} external>
              네이버 예약
            </ParenLink>
          </div>
        </div>
      </div>
    </section>
  )
}
