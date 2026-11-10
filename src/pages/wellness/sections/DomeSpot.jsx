import { useEffect, useId, useRef, useState } from 'react'
import { BRANCHES, PICS, PROGRAMS, SHOW_PRICES, won } from '../data'
import { ParenLink, Pic, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView } from '../motion'
import { pickForBooking } from '../scroll'
import { BTN_CREAM, CURTAIN, DARK, H2_TYPE, SECTION } from '../tw'

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

// 꼭짓점 이름(탭): 그래프 위 HTML 버튼이라 좌표는 --x/--y(%)로 받고, 위쪽 세 개는 점 위에, 아래 두 개는 점 아래에 선다
const TAB =
  'group/tab absolute top-(--y) left-(--x) grid min-h-11 min-w-11 -translate-x-1/2 cursor-pointer justify-items-center gap-[0.1rem] rounded-[0.9rem] border border-transparent bg-transparent px-[0.65rem] py-[0.3rem] [font-family:inherit] text-[clamp(0.78rem,2.6vw,0.95rem)] leading-[1.25] font-medium whitespace-nowrap text-[color-mix(in_srgb,var(--yw-cream)_78%,transparent)] [transition:opacity_0.3s_ease_calc(0.5s_+_var(--i)_*_0.05s),color_0.3s_ease,background-color_0.3s_ease,border-color_0.3s_ease] focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream aria-selected:border-champagne aria-selected:bg-champagne aria-selected:text-espresso motion-reduce:opacity-100 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:border-[color-mix(in_srgb,var(--w-champagne)_70%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-cream [@media(hover:hover)_and_(pointer:fine)]:hover:aria-selected:text-espresso'

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

  return (
    <section id="warm-dome" className={`${SECTION} ${DARK} ${CURTAIN} overflow-clip`} data-theme="dark" data-curtain aria-labelledby="warm-dome-title">
      {/* 휴대폰: 머리 → 그래프 → 설명·버튼을 가운데 정렬로 쌓는다. 데스크톱: 왼쪽 머리·설명, 오른쪽 그래프 */}
      <div className="mx-auto w-full max-w-(--yw-max) grid justify-items-center gap-[clamp(1.75rem,5vw,2.5rem)] text-center [grid-template-areas:'copy'_'chart'_'detail'] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:justify-items-start lg:gap-x-[clamp(3rem,6vw,6rem)] lg:gap-y-10 lg:text-left lg:[grid-template-areas:'copy_chart'_'detail_chart']">
        <div className="[grid-area:copy]">
          {/* 좁은 폰: 가운데 선을 빼고 두 덩어리가 각각 한 줄로 선다 */}
          <p className="mx-0 mt-0 mb-[1.4rem] flex items-center justify-center gap-[0.85rem] font-label text-[0.75rem] leading-[1.4] font-normal tracking-[0.18em] text-champagne uppercase normal-nums lg:justify-start [@media(max-width:24rem)]:flex-wrap [@media(max-width:24rem)]:gap-x-[0.85rem] [@media(max-width:24rem)]:gap-y-[0.35rem]">
            <span className="whitespace-nowrap">Signature Warm-up</span>
            <i className="h-px w-[clamp(2rem,8vw,4.5rem)] bg-[color-mix(in_srgb,var(--w-champagne)_60%,transparent)] [@media(max-width:24rem)]:hidden" aria-hidden="true" />
            <span className="font-sans tracking-[0.08em] whitespace-nowrap">풀 바디 웜업케어</span>
          </p>
          <SplitLines
            id="warm-dome-title"
            // 320 폭에서도 '따뜻하게 쉬어 가세요.'가 한 줄에 들어가게 휴대폰에서는 화면 폭을 따른다
            className={`${H2_TYPE} m-0 text-[clamp(1.7rem,8.4vw,3.2rem)] text-cream [&_em]:text-champagne [&_em]:not-italic`}
            lines={[
              <>
                <em>40분</em>, 누워서
              </>,
              '따뜻하게 쉬어 가세요.',
            ]}
          />
          <p className="mx-auto mt-4 mb-0 max-w-[28ch] text-[clamp(0.95rem,2.6vw,1.05rem)] leading-[1.7] break-keep text-[color-mix(in_srgb,var(--yw-cream)_72%,transparent)] lg:mx-0">
            아로마로 시작해 온기로 채우는, 웰니스 스튜디오의 풀 바디 웜업케어
          </p>
        </div>

        <div
          ref={chartRef}
          className="w-[min(100%,30rem)] [grid-area:chart] lg:w-[min(100%,34rem)] lg:self-center lg:justify-self-center"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          {/* 꼭짓점 이름 버튼이 들어갈 자리만큼 위·아래로 살짝 넓힌다. 가운데에는 샴페인 온기가 옅게 번진다 */}
          <div className="relative mt-6 mb-2 aspect-square before:absolute before:inset-[14%] before:rounded-[50%] before:bg-[radial-gradient(circle,color-mix(in_srgb,var(--w-champagne)_26%,transparent)_0%,transparent_68%)] before:content-['']">
            <svg className="absolute inset-0 size-full overflow-visible" viewBox="-200 -200 400 400" aria-hidden="true" focusable="false">
              {[1 / 3, 2 / 3, 1].map((k) => (
                <polygon
                  key={k}
                  className={`fill-none stroke-1 transition-[stroke-dashoffset] duration-600 ease-yw [stroke-dasharray:1] motion-reduce:transition-none motion-reduce:[stroke-dashoffset:0] ${
                    k === 1 ? 'stroke-[color-mix(in_srgb,var(--w-champagne)_45%,transparent)]' : 'stroke-[color-mix(in_srgb,var(--w-champagne)_26%,transparent)]'
                  } ${drawn ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:1]'}`}
                  points={ring(R * k)}
                  pathLength="1"
                />
              ))}
              {POINTS.map((p, i) => {
                const [x, y] = vertex(i, R)
                return (
                  <line
                    key={p.id}
                    className={`stroke-1 transition-[stroke] duration-400 ease-[ease] motion-reduce:transition-none ${
                      i === active ? 'stroke-champagne' : 'stroke-[color-mix(in_srgb,var(--w-champagne)_18%,transparent)]'
                    }`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                  />
                )
              })}
              <polygon
                className={`origin-center fill-[color-mix(in_srgb,var(--w-champagne)_14%,transparent)] stroke-champagne stroke-2 transition-transform delay-150 duration-600 ease-yw [stroke-linejoin:round] [transform-box:fill-box] motion-reduce:[transform:none] motion-reduce:transition-none ${
                  drawn ? '[transform:none]' : '[transform:scale(0)]'
                }`}
                points={ring(R * 0.86)}
              />
              {POINTS.map((p, i) => {
                const [x, y] = vertex(i, R)
                return (
                  <circle
                    key={p.id}
                    className={`stroke-champagne stroke-2 [transition:opacity_0.3s_ease_calc(0.4s_+_var(--i)_*_0.05s),fill_0.3s_ease] motion-reduce:opacity-100 motion-reduce:transition-none ${
                      i === active ? 'fill-champagne' : 'fill-espresso'
                    } ${drawn ? 'opacity-100' : 'opacity-0'}`}
                    cx={x}
                    cy={y}
                    r="5"
                    style={{ '--i': i }}
                  />
                )
              })}
            </svg>

            {/* 가운데 온열돔 누끼 */}
            <div
              className={`absolute top-1/2 left-1/2 w-[56%] -translate-x-1/2 -translate-y-[46%] [transition:opacity_0.5s_ease_0.2s,scale_0.6s_var(--yw-ease)_0.2s] motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
                drawn ? 'scale-100 opacity-100' : 'scale-92 opacity-0'
              }`}
            >
              <Pic
                pic={PICS.domeCut}
                sizes="(min-width: 64rem) 18rem, 52vw"
                alt="전신 온열돔"
                className="block h-auto w-full [filter:drop-shadow(0_18px_24px_rgb(0_0_0/0.45))]"
              />
            </div>

            <div role="tablist" aria-label="풀 바디 웜업케어 구성" onKeyDown={onKey}>
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
                    className={`${TAB} ${i === 2 || i === 3 ? 'translate-y-0' : '-translate-y-full'} ${drawn ? 'opacity-100' : 'opacity-0'}`}
                    style={{ '--x': `${50 + (x / 400) * 100}%`, '--y': `${50 + (y / 400) * 100}%`, '--i': i }}
                    data-cursor=""
                    onClick={() => choose(i)}
                  >
                    <small className="font-label text-[0.75rem] leading-none font-normal tracking-[0.12em] text-champagne normal-nums group-aria-selected/tab:text-accent-deep">
                      {pad(i + 1)}
                    </small>
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid w-[min(100%,30rem)] justify-items-center gap-[1.4rem] [grid-area:detail] lg:justify-items-start">
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            className="min-h-[7.5rem] w-full rounded-[1.1rem] border border-[color-mix(in_srgb,var(--w-champagne)_28%,transparent)] bg-[color-mix(in_srgb,var(--yw-cream)_5%,transparent)] px-[1.35rem] py-[1.2rem]"
          >
            <p
              key={point.id}
              className="m-0 grid animate-dome-text gap-[0.35rem] text-[0.95rem] leading-[1.65] break-keep text-[color-mix(in_srgb,var(--yw-cream)_78%,transparent)] motion-reduce:animate-none"
            >
              <span className="font-label text-[0.75rem] leading-none font-normal tracking-[0.14em] text-champagne normal-nums">
                {pad(active + 1)} <i className="text-[color-mix(in_srgb,var(--w-champagne)_55%,transparent)] not-italic">/ {pad(POINTS.length)}</i>
              </span>
              <strong className="font-serif text-[1.25rem] leading-[1.35] font-normal text-cream normal-nums">{point.label}</strong>
              {point.text}
            </p>
          </div>

          {WARMUP && (
            <p className="m-0 grid gap-[0.2rem] text-[0.92rem] font-medium text-[color-mix(in_srgb,var(--yw-cream)_88%,transparent)]">
              {WARMUP.label}
              <span className="font-num text-[0.88rem] font-normal text-champagne tabular-nums">
                {WARMUP.time}
                {SHOW_PRICES && ` · ${won(WARMUP.price)}`}
              </span>
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <button
              type="button"
              className={BTN_CREAM}
              data-magnet
              data-cursor=""
              onClick={() => pickForBooking({ area: '온열 웜업', programId: WARMUP?.id, label: WARMUP?.label })}
            >
              <span>지금 예약하기</span>
            </button>
            <ParenLink href={BRANCHES.zai.booking} external tone="light">
              네이버 예약
            </ParenLink>
          </div>
        </div>
      </div>
    </section>
  )
}
