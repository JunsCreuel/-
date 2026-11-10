import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import {
  BRANCHES,
  OFFER_TERM,
  OFFER_TERM_FULL,
  PICS,
  PROGRAMS,
  SALE_COUNT,
  SHOW_OFFER,
  SHOW_PRICES,
  won,
} from '../data'
import { Folio, ParenLink, Pic, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView, useMediaQuery } from '../motion'
import { pickForBooking } from '../scroll'
import { BTN_INK, CURTAIN_LIGHT, H2, SECTION } from '../tw'

// 펼친 줄 사진(모바일·태블릿)의 대체 텍스트. 분위기 사진이라 장면만 적고 '마사지' 같은 말은 쓰지 않는다.
const ALT = {
  'scalp-detox': '세면대에 누운 채 두피를 감싸는 두 손',
  'scalp-face': '볼에 세럼을 떨어뜨리는 장면',
  'back-lymph': '등이 드러난 드레스 뒷모습',
  abdomen: '옆구리에 손을 얹은 허리 라인',
  lower: '햇살이 비치는 다리 라인',
  'full-back': '수건을 걸친 채 드러난 등',
  'lymph-node': '햇살이 비치는 쇄골과 어깨 라인',
  warmup: '목 뒤에 손을 얹은 물기 어린 어깨',
}

const TOTAL = String(PROGRAMS.length).padStart(2, '0')
const numberOf = (i) => String(i + 1).padStart(2, '0')


// 필터 탭: 전체 + PROGRAMS.group 순서대로. 탭 글자는 가운뎃점 앞뒤 공백을 뺀다(두피 · 얼굴 → 두피·얼굴).
// 개수는 화면에 쓰지 않고 보조기기에만 알린다.
const FILTERS = [
  { id: 'all', label: '전체', count: PROGRAMS.length },
  ...[...new Set(PROGRAMS.map((p) => p.group))].map((g) => ({
    id: g,
    label: g.replace(/\s*·\s*/g, '·'),
    count: PROGRAMS.filter((p) => p.group === g).length,
  })),
]

const matches = (filter, p) => filter === 'all' || p.group === filter

// 화면에 쓰는 이름: ' + '로 이어진 이름은 '앞 이름'과 '+ 뒤 이름'을 각각 한 덩어리(inline-block)로 묶는다(데이터는 그대로).
// 줄이 바뀔 때는 덩어리 사이에서만 바뀌어 '풀 바디 웜업케어 / + 아로마테라피'가 된다(+가 줄 끝에 홀로 남지 않고,
// 줄 바꿈 없는 공백으로 붙이면 크롬의 text-wrap: balance가 '풀 바디 / 웜업케어 + …'로 치우치게 나누는 문제도 없다).
// 덩어리 하나가 칸보다 넓으면 그 안에서 다시 줄이 바뀌어 넘치지 않는다.
function DisplayName({ label }) {
  const parts = label.split(' + ')
  if (parts.length === 1) return label
  return parts.map((part, i) => (
    <Fragment key={part}>
      {i > 0 && ' '}
      <span className="inline-block">{i > 0 ? `+ ${part}` : part}</span>
    </Fragment>
  ))
}

// 첫 방문가는 가격·이벤트가 모두 켜져 있고 할인(sale)이 있는 관리에만 보인다. 조건 안내도 그때만 보인다.
const onSale = (p) => SHOW_PRICES && SHOW_OFFER && !!p.sale
const SHOW_TERMS = SHOW_PRICES && SHOW_OFFER && SALE_COUNT > 0

// 조건 문구(data.js OFFER_TERM_FULL 그대로)를 ' · ' 앞뒤 덩어리로 감싸, 좁은 화면에서는 덩어리 사이에서만 줄이 바뀌게 한다.
// 휴대폰에서는 두 덩어리를 두 줄로 쌓고 가운뎃점을 눈에만 숨긴다(줄 끝에 '·'가 홀로 남지 않게). 글자는 DOM에 그대로 남는다.
function Terms() {
  return OFFER_TERM_FULL.split(' · ').map((part, i) => (
    <Fragment key={part}>
      {i > 0 && <span className="max-sm:sr-only"> · </span>}
      <span className="inline-block max-sm:block">{part}</span>
    </Fragment>
  ))
}

// 프레임 사진: 8장을 겹쳐 두고 켜진 사진(data-on)만 왼쪽→오른쪽으로 와이프되며 살짝 줄어든다.
// 직전 사진(data-prev)은 그 아래에 남고, 내려간 사진은 .4s 뒤(위 사진이 다 덮은 뒤)에 바로 접힌다
const FRAME_IMG = 'absolute inset-0 size-full max-w-none object-cover motion-reduce:scale-100 motion-reduce:transition-none'
const FRAME_OFF = 'z-0 scale-106 [clip-path:inset(0_100%_0_0)] [transition:clip-path_0s_linear_0.4s,scale_0s_linear_0.4s]'
const FRAME_PREV = 'z-1 scale-100 [clip-path:inset(0)] [transition:clip-path_0s_linear_0.4s,scale_0s_linear_0.4s]'
const FRAME_ON = 'z-2 scale-100 [clip-path:inset(0)] [transition:clip-path_0.4s_var(--yw-ease),scale_0.5s_var(--yw-ease)]'

// 한 줄은 두 단이다. 윗단 [이름(+BEST) · 정가 · 얇은 +], 아랫단 [소요 시간 ····· 첫 방문가]. 데스크톱은 번호 칸이 앞에 붙는다.
// 윗단은 이름 첫 줄 기준선에 정가(데스크톱은 번호도)를 맞추고, +는 이름 첫 글줄 가운데에 둔다(줄 높이가 달라도 같은 자리).
// 줄 전체가 버튼이라 누르는 면은 44px보다 넓다. 포커스 링은 줄 바깥으로 살짝 띄운다(링은 줄의 clip 여유 0.4rem 안)
const TOGGLE =
  "group/toggle grid min-h-11 w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_1.25rem] items-baseline gap-x-[clamp(0.85rem,3vw,1.25rem)] border-x-0 border-t border-b-0 border-line bg-transparent px-0 py-[clamp(1.15rem,2.6vw,1.4rem)] text-left [font:inherit] text-inherit [-webkit-tap-highlight-color:transparent] [--yw-menu-name:clamp(1.05rem,4.2vw,1.3rem)] [grid-template-areas:'name_regular_plus'_'meta_meta_.'] focus-visible:outline-offset-[0.2rem] lg:grid-cols-[2.25rem_minmax(0,1fr)_auto_1.25rem] lg:gap-x-6 lg:[--yw-menu-name:clamp(1.25rem,1.6vw,1.5rem)] lg:[grid-template-areas:'no_name_regular_plus'_'._meta_meta_.']"

// 글자 탭: 비활성은 muted, 활성은 잉크 + 아래 1.5px 브론즈 밑줄. 글자가 짧아도 누르는 면이 넓도록 보이지 않는 영역을 좌우로 넓힌다
const TAB =
  "relative inline-flex min-h-11 flex-none cursor-pointer items-center border-0 bg-transparent p-0 font-sans text-[0.92rem] leading-[1.3] font-medium tracking-[0.01em] whitespace-nowrap text-muted normal-nums [-webkit-tap-highlight-color:transparent] transition-[color] duration-250 ease-[ease] before:absolute before:inset-y-0 before:-inset-x-[0.6rem] before:content-[''] after:absolute after:right-0 after:bottom-[0.45rem] after:left-0 after:h-[1.5px] after:scale-x-0 after:scale-y-100 after:bg-bronze after:transition-[scale] after:duration-200 after:ease-yw after:content-[''] aria-pressed:text-ink aria-pressed:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink"

// 왼쪽 sticky 프레임(데스크톱 전용, 장식). 8장을 겹쳐 두고 켜진 사진(data-on)만 왼쪽→오른쪽으로 와이프해 연다.
// 직전 사진(data-prev)은 와이프가 끝날 때까지 바로 아래에 남겨 빈틈이 보이지 않게 한다.
// 겹친 사진은 clip-path로 가려져 있어 브라우저 지연 로딩이 시작되지 않는다. 프레임이 가까워지면(화면 한 장 앞) 8장을 한꺼번에 받는다.
// 등장 판정도 clip-path가 없는 figure로 한다(프레임 자체는 처음에 완전히 가려져 있다).
function MenuFrame({ frame, imgRefs, onWiped }) {
  const figRef = useRef(null)
  const inView = useInView(figRef, { threshold: 0.2 })
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined')
  const current = PROGRAMS[frame.on]

  useEffect(() => {
    const el = figRef.current
    if (!el || near) return undefined
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  return (
    <aside className="sticky top-[calc(var(--w-nav-h)_+_2rem)] self-start" aria-hidden="true">
      {/* 화면이 낮은 노트북에서도 프레임과 캡션이 한 화면에 들어오도록 폭을 높이에 맞춰 줄인다 */}
      <figure ref={figRef} className="m-0 w-[min(100%,calc((100svh_-_var(--w-nav-h)_-_7rem)_*_0.8))]" data-menu-figure>
        <div
          className={`relative aspect-[4/5] overflow-clip rounded-[1.25rem] bg-ivory transition-[clip-path] duration-400 ease-yw motion-reduce:[clip-path:none] motion-reduce:transition-none ${
            inView ? '[clip-path:inset(0_round_1.25rem)]' : '[clip-path:inset(0_100%_0_0_round_1.25rem)]'
          }`}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'clip-path' && e.target.hasAttribute('data-on')) onWiped()
          }}
        >
          {PROGRAMS.map((p, i) => (
            <Pic
              key={p.id}
              pic={PICS[p.pic]}
              sizes="(min-width: 90rem) 33rem, 36vw"
              alt=""
              loading={near ? 'eager' : 'lazy'}
              className={`${FRAME_IMG} ${i === frame.on ? FRAME_ON : i === frame.prev ? FRAME_PREV : FRAME_OFF}`}
              imgRef={(el) => {
                imgRefs.current[i] = el
              }}
              data-on={i === frame.on ? '' : undefined}
              data-prev={i === frame.prev ? '' : undefined}
            />
          ))}
        </div>
        <figcaption className="mt-[0.9rem] font-label text-[0.75rem] leading-[1.4] font-normal tracking-[0.12em] text-muted lining-nums tabular-nums [&_b]:font-medium [&_b]:text-ink">
          {current.group} · <b>{numberOf(frame.on)}</b> / {TOTAL}
        </figcaption>
      </figure>
    </aside>
  )
}

// 05 Menu: 호텔 스파 메뉴판처럼 8개 관리를 한 줄씩 훑는다. 줄에는 이름 · 소요 시간 / 정가 · 첫 방문가만 둔다.
// 첫 방문가(50%)는 상시 할인이 아니라 조건부라, 목록 위 안내와 각주에 조건(OFFER_TERM_FULL)을 함께 쓴다.
// 데스크톱(64rem 이상)은 왼쪽 sticky 프레임 사진이 활성 줄(마우스·포커스·화면 가운데 줄)을 따라 와이프로 바뀐다.
// 모바일·태블릿은 줄에 사진을 두지 않고, 펼치면 사진이 위에서 아래로 열린다.
export default function Programs() {
  const wide = useMediaQuery('(min-width: 64rem)')
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const [seen, setSeen] = useState(() => new Set()) // 한 번이라도 펼친 줄(펼침 사진은 그때 받는다)
  const [frame, setFrame] = useState({ on: 0, prev: null }) // 프레임에 켜진 사진과 그 아래 남겨 둔 직전 사진
  const active = frame.on

  const listRef = useRef(null)
  const rowRefs = useRef([])
  const imgRefs = useRef([])
  const pointerInside = useRef(false)

  const activate = useCallback((i) => {
    setFrame((f) => (f.on === i ? f : { on: i, prev: prefersReducedMotion() ? null : f.on }))
  }, [])

  // 와이프가 끝나면(transitionend) 직전 사진을 내린다. 이벤트가 오지 않는 경우를 위해 예비 타이머도 둔다.
  const clearPrev = useCallback(() => setFrame((f) => (f.prev === null ? f : { ...f, prev: null })), [])
  useEffect(() => {
    if (frame.prev === null) return undefined
    const t = setTimeout(clearPrev, 1000)
    return () => clearTimeout(t)
  }, [frame, clearPrev])

  // 다음·이전 사진은 미리 디코드해 둔다(교체 때 깜빡이지 않게).
  useEffect(() => {
    if (!wide) return
    ;[active - 1, active + 1].forEach((j) => {
      const img = imgRefs.current[j]
      if (img?.decode) img.decode().catch(() => {})
    })
  }, [active, wide])

  // 마우스가 목록 밖에 있을 때는 화면 가운데(위아래 48%를 뺀 띠)를 지나는 줄이 활성 줄이 된다. 데스크톱에서만.
  // 키보드로 목록 안을 이동하는 중에는 포커스한 줄을 따른다(Tab 스크롤로 가운데 줄이 바뀌어도 사진이 튀지 않게).
  useEffect(() => {
    if (!wide || typeof IntersectionObserver === 'undefined') return undefined
    const keyboardInside = () => {
      const el = document.activeElement
      return !!el && !!listRef.current?.contains(el) && el.matches(':focus-visible')
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (pointerInside.current || keyboardInside()) return
        entries.forEach((entry) => {
          const el = entry.target
          if (!entry.isIntersecting || el.inert) return
          activate(Number(el.dataset.index))
        })
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rowRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [wide, activate])

  function choose(id) {
    if (id === filter) return
    setFilter(id)
    setOpenId(null)
    if (!matches(id, PROGRAMS[active])) {
      const first = PROGRAMS.findIndex((p) => matches(id, p))
      if (first >= 0) activate(first)
    }
  }

  // 위쪽 메뉴에서 고른 분류(scroll.js goToMenu → 'w:program-filter'): 그 분류 탭을 켠다.
  const chooseRef = useRef(choose)
  useEffect(() => {
    chooseRef.current = choose
  })
  useEffect(() => {
    const onFilter = (e) => {
      if (FILTERS.some((f) => f.id === e.detail?.id)) chooseRef.current(e.detail.id)
    }
    window.addEventListener('w:program-filter', onFilter)
    return () => window.removeEventListener('w:program-filter', onFilter)
  }, [])

  function toggle(id) {
    setOpenId((cur) => (cur === id ? null : id))
    setSeen((s) => (s.has(id) ? s : new Set(s).add(id)))
  }

  return (
    <section id="programs" className={`${SECTION} ${CURTAIN_LIGHT} overflow-clip bg-white`} data-theme="light" data-curtain>
      <div className="mx-auto w-full max-w-(--yw-max) grid gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {wide && <MenuFrame frame={frame} imgRefs={imgRefs} onWiped={clearPrev} />}

        <div className="relative z-1 min-w-0">
          {/* 64rem 미만: 머리는 세로로, 탭은 한 줄로 두고 좁으면 가로로 민다 */}
          <div className="mb-[clamp(1rem,2.4vw,1.6rem)] flex flex-wrap items-end justify-between gap-x-8 gap-y-4 max-lg:block">
            <div>
              <Folio ko="관리 프로그램" />
              <SplitLines as="h2" className={H2} lines={['첫 방문 관리 메뉴']} />
            </div>
            <div
              className="flex gap-x-[clamp(1.25rem,3.6vw,2rem)] gap-y-0 max-lg:mx-[calc(-1_*_var(--w-gutter))] max-lg:mt-3 max-lg:mb-0 max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:px-(--w-gutter) max-lg:py-0 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="관리 종류"
            >
              {FILTERS.map((f) => (
                <button key={f.id} type="button" className={TAB} aria-pressed={filter === f.id} onClick={() => choose(f.id)}>
                  {f.label}
                  <span className="sr-only"> {f.count}개</span>
                </button>
              ))}
            </div>
          </div>

          {/* 목록 바로 위 조건 안내. 좁은 화면에서 두 줄이 되면 둘째 줄이 문구 시작에 맞춰 들어간다 */}
          {SHOW_TERMS && (
            <p className="mx-0 mt-0 mb-[clamp(0.75rem,2vw,1rem)] flex items-baseline gap-x-[0.6rem] text-[0.8rem] leading-[1.65] break-keep text-muted">
              {/* 라벨 뒤 짧은 브론즈 선(메뉴판의 점선 대신) */}
              <b className="flex-none font-medium whitespace-nowrap text-accent-deep after:ml-[0.6rem] after:inline-block after:h-px after:w-[0.9rem] after:bg-bronze after:align-[0.3em] after:content-['']">
                첫 방문가<span className="sr-only">:</span>
              </b>
              <span className="min-w-0">
                <Terms />
              </span>
            </p>
          )}

          <ul
            ref={listRef}
            className="border-b border-line"
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') pointerInside.current = true
            }}
            onPointerLeave={() => {
              pointerInside.current = false
            }}
          >
            {PROGRAMS.map((p, i) => {
              const out = !matches(filter, p)
              const open = openId === p.id
              const on = i === active
              const sale = onSale(p)
              const panelId = `yw-menu-${p.id}`
              return (
                // 필터에서 빠진 줄은 높이 0으로 접히며 사라진다(줄 선은 안쪽 버튼에 있어 함께 접힌다)
                <li
                  key={p.id}
                  ref={(el) => {
                    rowRefs.current[i] = el
                  }}
                  data-index={i}
                  className={`grid [transition:grid-template-rows_0.3s_var(--yw-ease),opacity_0.2s_ease] motion-reduce:transition-none ${out ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]'}`}
                  inert={out}
                  onPointerEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                >
                  {/* 펼쳐진 줄에서는 포커스 링이 잘리지 않게 조금 여유를 둔다 */}
                  <div className={`min-h-0 overflow-clip ${out ? '' : '[overflow-clip-margin:0.4rem]'}`}>
                    <button
                      type="button"
                      className={TOGGLE}
                      aria-expanded={open}
                      aria-controls={panelId}
                      data-cursor=""
                      onClick={() => toggle(p.id)}
                    >
                      {/* 윗단: (번호) 이름 · 정가 · + / 아랫단: 소요 시간 · 첫 방문가. 보조기기는 이름 → 시간 → 가격 문장 순으로 읽는다.
                          활성 줄(마우스·포커스·화면 가운데 줄)은 바탕을 칠하지 않고 이름과 번호만 짙은 브론즈(데스크톱) */}
                      <span
                        className={`hidden font-en text-[1.05rem] leading-none font-normal tracking-[0.02em] lining-nums transition-[color] duration-300 ease-[ease] [grid-area:no] motion-reduce:transition-none lg:block ${
                          on ? 'text-muted lg:text-accent-deep' : 'text-muted'
                        }`}
                        aria-hidden="true"
                      >
                        {numberOf(i)}
                      </span>
                      {/* 이름 뒤 여백: 이름과 정가 사이가 정가와 + 사이보다 늘 넓게 남는다 */}
                      <span
                        className={`block min-w-0 pr-2 font-serif text-(length:--yw-menu-name) leading-[1.4] font-normal tracking-[-0.01em] text-balance break-keep normal-nums transition-[color] duration-300 ease-[ease] [grid-area:name] [overflow-wrap:break-word] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/toggle:text-accent-deep ${
                          on ? 'text-ink lg:text-accent-deep' : 'text-ink'
                        }`}
                      >
                        <DisplayName label={p.label} />
                        {/* 인기 표시: 알약 대신 이름 옆 작은 브론즈 글자 하나 */}
                        {p.badge && (
                          <span className="ml-[0.6em] align-[0.32em] font-label text-[0.75rem] leading-none font-medium tracking-[0.14em] whitespace-nowrap text-accent-deep normal-nums">
                            {p.badge}
                          </span>
                        )}
                      </span>
                      {SHOW_PRICES && (
                        <span
                          className="text-right font-sans text-[0.95rem] leading-[1.4] font-medium tracking-[0.01em] whitespace-nowrap text-ink lining-nums tabular-nums [grid-area:regular]"
                          aria-hidden="true"
                        >
                          {won(p.price)}
                        </span>
                      )}
                      {/* 원 테두리 없는 얇은 +. 펼치면 45° 돌아 ×가 된다. 정가와 같은 글꼴·글줄로 기준선을 함께 쓰고,
                          선 굵기가 줄마다 들쭉날쭉하지 않도록 SVG로 그린다 */}
                      <span
                        className={`w-5 self-baseline justify-self-end text-center font-sans text-[0.95rem] leading-[1.4] font-normal text-espresso normal-nums transition-[color] duration-250 ease-[ease] [grid-area:plus] motion-reduce:transition-none ${
                          open ? '' : '[@media(hover:hover)_and_(pointer:fine)]:group-hover/toggle:text-accent-deep'
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          className={`inline-block size-[1em] overflow-visible fill-none stroke-current align-[-0.14em] transition-[rotate] duration-200 ease-yw [stroke-width:1.25px] motion-reduce:transition-none [&_path]:[vector-effect:non-scaling-stroke] ${
                            open ? 'rotate-45' : 'group-focus-visible/toggle:rotate-90 [@media(hover:hover)_and_(pointer:fine)]:group-hover/toggle:rotate-90'
                          }`}
                          viewBox="0 0 16 16"
                          focusable="false"
                        >
                          <path d="M8 0v16M0 8h16" />
                        </svg>
                      </span>
                      {/* 아랫단: 왼쪽 소요 시간, 오른쪽 첫 방문가(정가 아래, 오른쪽 끝 맞춤). 자리가 모자라면 첫 방문가만 다음 줄 오른쪽으로 */}
                      <span className="mt-[0.3rem] flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-[0.15rem] [grid-area:meta]">
                        <span className="font-label text-[0.8rem] leading-[1.4] font-normal tracking-[0.03em] whitespace-nowrap text-muted normal-nums">{p.time}</span>
                        {sale && (
                          <span className="ml-auto text-right text-[0.82rem] leading-[1.4] whitespace-nowrap text-accent-deep lining-nums tabular-nums [&_b]:font-medium" aria-hidden="true">
                            첫 방문가 <b>{won(p.sale)}</b>
                          </span>
                        )}
                      </span>
                      {SHOW_PRICES && (
                        <span className="sr-only">
                          {sale
                            ? `정가 ${won(p.price)}, 첫 방문가 ${won(p.sale)}, ${OFFER_TERM}`
                            : `정가 ${won(p.price)}`}
                        </span>
                      )}
                    </button>

                    {/* 펼침 패널: (사진) · 설명 · 가격 상세 · 버튼. 휴대폰은 세로로, 태블릿은 사진 옆에, 데스크톱은 이름 칸에 맞춰 들여 쓴다 */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-yw motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      id={panelId}
                      inert={!open}
                    >
                      <div className="min-h-0 overflow-clip">
                        <div className="grid gap-[1.1rem] pb-[1.6rem] sm:max-lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] sm:max-lg:content-center sm:max-lg:gap-x-7 sm:max-lg:gap-y-4 sm:max-lg:[grid-template-areas:'fig_text'_'fig_actions'] lg:gap-5 lg:pt-0 lg:pr-11 lg:pb-[1.9rem] lg:pl-[3.75rem]">
                          {/* 모바일·태블릿의 펼침 사진: 위에서 아래로 열린다 */}
                          {!wide && (
                            <figure
                              className={`m-0 aspect-[16/10] overflow-clip rounded-2xl bg-ivory transition-[clip-path] duration-300 ease-yw motion-reduce:transition-none sm:max-lg:[grid-area:fig] ${
                                open ? '[clip-path:inset(0_round_1rem)] motion-reduce:[clip-path:none]' : '[clip-path:inset(0_0_100%_0_round_1rem)]'
                              }`}
                            >
                              {seen.has(p.id) && (
                                <Pic
                                  pic={PICS[p.pic]}
                                  sizes="(min-width: 40rem) 20rem, 90vw"
                                  alt={ALT[p.id]}
                                  loading="eager"
                                  className="size-full object-cover"
                                />
                              )}
                            </figure>
                          )}
                          <div className="@container grid min-w-0 content-start gap-[0.65rem] sm:max-lg:self-end sm:max-lg:[grid-area:text]">
                            <p className="text-[0.95rem] leading-[1.7] text-pretty break-keep text-muted">{p.note}</p>
                            {SHOW_PRICES && (
                              <p className="text-[0.88rem] leading-[1.6] break-keep text-ink lining-nums tabular-nums [&_b]:font-medium [&_b]:text-accent-deep">
                                <span className="inline-block">정가 {won(p.price)}</span>
                                {sale && (
                                  <>
                                    {' · '}
                                    <b className="inline-block">첫 방문가 {won(p.sale)}</b>
                                  </>
                                )}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 max-sm:flex-col max-sm:items-stretch max-sm:gap-[0.35rem] max-sm:[&>button]:w-full sm:max-lg:self-start sm:max-lg:[grid-area:actions]">
                            <button
                              type="button"
                              className={BTN_INK}
                              data-magnet
                              onClick={() => pickForBooking({ area: p.area, programId: p.id, label: p.label })}
                            >
                              <span>이 관리로 상담</span>
                            </button>
                            <ParenLink href={BRANCHES.zai.booking} external className="max-sm:justify-center">
                              네이버 예약
                            </ParenLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-7 flex flex-wrap items-start justify-end gap-x-10 gap-y-3">
            <ParenLink href={BRANCHES.zai.booking} external className="flex-none">
              네이버에서 예약하기
            </ParenLink>
          </div>
        </div>
      </div>
    </section>
  )
}
