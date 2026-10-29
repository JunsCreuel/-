import { useEffect, useRef, useState } from 'react'
import { BRANCHES, OFFER_TERM, OFFER_TERM_FULL, PROGRAMS, SALE_COUNT, SHOW_OFFER, SHOW_PRICES, won } from '../data'
import { Folio, ParenLink } from '../editorial'
import { clamp, hasFinePointer, prefersReducedMotion, useInView } from '../motion'
import { scrollToId } from '../scroll'
import { CURTAIN, SECTION } from '../tw'

// No. 07 First Visit — 절취선 티켓 한 장(에스프레소 커튼 위).
// 첫 방문 50%는 상시 할인이 아니다. 할인가(sale)가 있는 관리에만(전신 후면 관리, 풀 바디 웜업케어는 제외),
// 첫 방문 고객 1인 1회 한정, 티켓팅 시 첫 방문가 적용, 1회 관리 시 별도 재료 비용(data.js OFFER_TERM·OFFER_TERM_FULL).
// 50%는 늘 'N개 관리'(SALE_COUNT)와 조건 알약(OFFER_TERM)과 한 덩어리로 보인다. 이벤트가 끝나면 data.js SHOW_OFFER를 false로 바꾸면 이 섹션이 사라진다.
const SALE = PROGRAMS.filter((p) => p.sale)

// 티켓 아래 작은 줄: 전체 조건(OFFER_TERM_FULL) 뒤에 이용 안내를 잇는다. ' · ' 덩어리 사이에서만 줄이 바뀌고,
// 가운뎃점은 덩어리 앞 틈에 놓여 줄 머리로 넘어간 덩어리의 점은 잘려 보이지 않는다(줄 끝·줄 머리에 '·'가 홀로 남지 않게, 글자는 DOM에 그대로).
const TICKET_NOTES = [...OFFER_TERM_FULL.split(' · '), '전단지 없이 적용', '100% 예약제']

// 티켓 기울기(±4°)와 빛 반사 위치. 마우스 기기에서만 rAF lerp로 따라가고, 다 따라가면 멈춘다.
const TILT_KEYS = ['rx', 'ry', 'gx', 'gy']
const REST = { rx: 0, ry: 0, gx: 50, gy: 50 }

// 티켓: 연두 종이 한 장. 반원 홈은 두 원형 구멍(--mask-a·--mask-b)으로 뚫는다(좁은 화면은 가로 절취선의 좌우, 넓은 화면은 세로 절취선의 위아래).
// 들어오면 살짝 기운 채 아래에서 올라오고, 등장(1s)이 끝나면 기울기가 전환 없이 바로 따라간다(lerp는 JS).
const TICKET =
  'relative mx-auto grid w-[min(72rem,100%)] gap-[clamp(1.25rem,3vw,2.5rem)] rounded-3xl bg-(--w-highlight) p-(--tp) text-ink shadow-[0_0_0_1px_color-mix(in_srgb,var(--w-ink)_10%,transparent),0_18px_40px_-24px_color-mix(in_srgb,var(--w-ink)_35%,transparent)] ticket-mask [--tp:clamp(1.5rem,3vw,2.75rem)] [--stub:13rem] [--notch:1rem] [--mask-a:radial-gradient(circle_var(--notch)_at_0_var(--cut,calc(100%_-_9rem)),#0000_98%,#000)] [--mask-b:radial-gradient(circle_var(--notch)_at_100%_var(--cut,calc(100%_-_9rem)),#0000_98%,#000)] [&_:focus-visible]:outline-espresso motion-reduce:opacity-100 motion-reduce:[transform:none] motion-reduce:transition-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_var(--stub)] lg:gap-x-[clamp(1.5rem,3vw,2.75rem)] lg:pr-0 lg:[--mask-a:radial-gradient(circle_var(--notch)_at_calc(100%_-_var(--stub)_+_1px)_0,#0000_98%,#000)] lg:[--mask-b:radial-gradient(circle_var(--notch)_at_calc(100%_-_var(--stub)_+_1px)_100%,#0000_98%,#000)]'
const TICKET_OUT =
  'opacity-0 [transform:perspective(70rem)_rotateX(calc(var(--rx,0)_*_1deg))_rotateY(calc(var(--ry,0)_*_1deg))_translateY(2.5rem)_rotate(-2.5deg)]'
const TICKET_IN =
  'opacity-100 [transform:perspective(70rem)_rotateX(calc(var(--rx,0)_*_1deg))_rotateY(calc(var(--ry,0)_*_1deg))_translateY(0)_rotate(0deg)]'
// 마우스 기기: 커서를 따라오는 빛(등장이 끝난 뒤 올려 두면 보인다)
const GLOW =
  "[@media(hover:hover)_and_(pointer:fine)]:before:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:before:absolute [@media(hover:hover)_and_(pointer:fine)]:before:inset-0 [@media(hover:hover)_and_(pointer:fine)]:before:z-1 [@media(hover:hover)_and_(pointer:fine)]:before:rounded-[inherit] [@media(hover:hover)_and_(pointer:fine)]:before:bg-[radial-gradient(28rem_circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.45),transparent_60%)] [@media(hover:hover)_and_(pointer:fine)]:before:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:before:mix-blend-soft-light [@media(hover:hover)_and_(pointer:fine)]:before:transition-opacity [@media(hover:hover)_and_(pointer:fine)]:before:duration-500 [@media(hover:hover)_and_(pointer:fine)]:before:ease-[ease] [@media(hover:hover)_and_(pointer:fine)]:before:content-[''] motion-reduce:before:hidden motion-reduce:before:transition-none"
const GLOW_ON = '[@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-100'

// 절취선 너머 스텁: 좁은 화면은 아래(가로 점선), 태블릿은 버튼과 링크를 한 줄에, 넓은 화면은 오른쪽(세로 점선)
const STUB =
  'relative -mx-(--tp) mt-0 -mb-(--tp) flex flex-col items-stretch justify-center gap-4 [border-top:2px_dashed_rgb(46_50_38/0.3)] px-(--tp) pt-[calc(var(--tp)_*_0.9)] pb-(--tp) sm:max-lg:flex-row sm:max-lg:flex-wrap sm:max-lg:items-center sm:max-lg:gap-x-7 sm:max-lg:gap-y-3 lg:mx-0 lg:-my-(--tp) lg:items-center lg:[border-top:0] lg:[border-left:2px_dashed_rgb(46_50_38/0.3)] lg:px-7 lg:py-(--tp)'
// '예약하기': 좁은 화면은 폭 100% 알약, 넓은 화면은 아래에서 차오르는 원. 자석 이동은 공통 transform이 맡아 여기서는 scale만 쓴다
const ROUND =
  'inline-flex min-h-[3.25rem] w-full cursor-pointer items-center justify-center rounded-full border-2 border-espresso bg-espresso px-6 py-[0.7rem] [font-family:inherit] text-[0.97rem] leading-[1.3] font-semibold tracking-[0.02em] text-white active:scale-97 sm:max-lg:w-auto sm:max-lg:min-w-[16rem] lg:aspect-square lg:min-h-0 lg:rounded-[50%] lg:w-32 lg:bg-transparent lg:bg-[linear-gradient(var(--w-espresso)_0_0)] lg:bg-size-[100%_0%] lg:bg-bottom lg:bg-no-repeat lg:p-0 lg:font-serif lg:text-[1.05rem] lg:font-medium lg:tracking-[0] lg:text-espresso lg:normal-nums lg:[transition:transform_0.55s_cubic-bezier(0.2,0.8,0.2,1),background-size_0.45s_var(--yw-ease),color_0.3s_ease] motion-reduce:transition-none lg:motion-reduce:transition-none lg:focus-visible:bg-size-[100%_100%] lg:focus-visible:text-white [@media(min-width:64rem)_and_(hover:hover)_and_(pointer:fine)]:hover:bg-size-[100%_100%] [@media(min-width:64rem)_and_(hover:hover)_and_(pointer:fine)]:hover:text-white'

export default function Offer() {
  if (!SHOW_OFFER) return null
  return <OfferTicket />
}

function OfferTicket() {
  const ticketRef = useRef(null)
  const stubRef = useRef(null)
  const listRef = useRef(null)
  const inView = useInView(ticketRef, { threshold: 0.3 })
  // 좁은 화면에서는 목록이 티켓 아래쪽에 있으므로 목록이 보일 때 금액을 내린다.
  const listInView = useInView(listRef, { threshold: 0.3 })
  const reduced = prefersReducedMotion()
  const [settled, setSettled] = useState(false)
  const settledRef = useRef(false)

  // 등장(1s)이 끝난 뒤에야 기울기를 받는다. 등장 전환이 매 프레임 기울기를 늦게 따라가지 않도록 전환을 끈다.
  useEffect(() => {
    if (!inView) return undefined
    const t = setTimeout(() => {
      settledRef.current = true
      setSettled(true)
    }, 1050)
    return () => clearTimeout(t)
  }, [inView])

  // 좁은 화면의 좌우 반원 홈: 스텁이 시작하는 높이(가로 절취선)를 --cut으로 넘긴다.
  useEffect(() => {
    const el = ticketRef.current
    const stub = stubRef.current
    if (!el || !stub) return undefined
    const set = () => el.style.setProperty('--cut', `${stub.offsetTop + 1}px`)
    set()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 마우스를 티켓 위에서 움직이면 기울고 빛이 따라오며, 벗어나면 제자리로 돌아온다.
  useEffect(() => {
    const el = ticketRef.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined
    const cur = { ...REST }
    const tgt = { ...REST }
    let raf = 0

    const write = () => {
      el.style.setProperty('--rx', cur.rx.toFixed(3))
      el.style.setProperty('--ry', cur.ry.toFixed(3))
      el.style.setProperty('--gx', `${cur.gx.toFixed(2)}%`)
      el.style.setProperty('--gy', `${cur.gy.toFixed(2)}%`)
    }
    const tick = () => {
      let moving = false
      TILT_KEYS.forEach((k) => {
        const d = tgt[k] - cur[k]
        if (Math.abs(d) > 0.01) {
          cur[k] += d * 0.1
          moving = true
        } else {
          cur[k] = tgt[k]
        }
      })
      write()
      raf = moving ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !settledRef.current) return
      const r = el.getBoundingClientRect()
      const nx = clamp((e.clientX - r.left) / Math.max(1, r.width), 0, 1)
      const ny = clamp((e.clientY - r.top) / Math.max(1, r.height), 0, 1)
      tgt.rx = (ny - 0.5) * -8
      tgt.ry = (nx - 0.5) * 8
      tgt.gx = nx * 100
      tgt.gy = ny * 100
      kick()
    }
    const onLeave = () => {
      Object.assign(tgt, REST)
      kick()
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const run = reduced || listInView
  const shown = inView || reduced

  return (
    <section id="offer" className={`${SECTION} ${CURTAIN} overflow-clip bg-white text-ink`} data-theme="light" data-curtain aria-labelledby="offer-title">
      <div className="mx-auto w-full max-w-(--yw-max)">
        <article
          ref={ticketRef}
          className={`${TICKET} ${GLOW} ${shown ? TICKET_IN : TICKET_OUT} ${
            settled ? `transition-opacity duration-300 ease-[ease] ${GLOW_ON}` : 'transition-[transform,opacity] duration-[0.4s,0.3s] ease-[var(--yw-ease),ease]'
          }`}
        >
          <div className="min-w-0 lg:flex lg:flex-col">
            <Folio ko="이벤트" />
            <h2 id="offer-title" className="mx-0 mt-[0.4rem] mb-0 [font:inherit] tracking-[0] text-ink" aria-label={`${OFFER_TERM}, ${SALE_COUNT}개 관리 50%`}>
              <span className="block font-serif text-[1.05rem] leading-[1.4] font-medium tracking-[-0.01em] text-ink normal-nums" aria-hidden="true">
                첫 방문 혜택
              </span>
              {/* 50%와 'N개 관리'는 같은 줄의 한 덩어리 */}
              <span className="mt-[0.6rem] flex flex-wrap items-baseline gap-x-2 gap-y-[0.1rem]" aria-hidden="true">
                <strong
                  className={`-mt-[0.06em] bg-[linear-gradient(100deg,var(--w-espresso),var(--w-bronze)_45%,var(--w-champagne)_60%,var(--w-espresso))] bg-size-[220%_100%] bg-clip-text pt-[0.06em] pr-[0.04em] pb-0 pl-0 font-en text-[clamp(5rem,26vw,7rem)] leading-[0.85] font-medium tracking-[-0.02em] text-transparent lining-nums tabular-nums lg:text-[clamp(6rem,12vw,11rem)] ${
                    shown ? 'animate-ticket-grad motion-reduce:animate-none' : ''
                  }`}
                >
                  {/* 할인율·가격은 세어 올리지 않고 처음부터 실제 숫자로 보인다(중간 숫자가 잘못된 할인으로 보이지 않게) */}
                  50
                  <small className="ml-[0.04em] text-[0.4em]">%</small>
                </strong>
                <span className="font-serif text-[1.3rem] leading-[1.3] font-normal tracking-[-0.01em] whitespace-nowrap text-ink normal-nums">{SALE_COUNT}개 관리</span>
              </span>
              {/* 50% 바로 아래의 조건 알약(상시 할인이 아님을 큰 숫자와 한 덩어리로 보인다). 버튼처럼 보이지 않게 테두리만 둔다 */}
              <span
                className="mt-4 flex w-fit max-w-full items-center gap-[0.5em] rounded-full border-[1.5px] border-espresso px-[1em] py-[0.42em] font-sans text-[0.9rem] leading-[1.3] font-semibold tracking-[0] text-espresso normal-nums before:size-[0.38em] before:flex-none before:rounded-[50%] before:bg-bronze before:content-['']"
                aria-hidden="true"
              >
                {OFFER_TERM}
              </span>
            </h2>
            <p className="mt-[1.2rem] max-w-[26em] font-serif text-[1.1rem] leading-[1.65] font-normal tracking-[-0.01em] normal-nums">
              티켓팅 시 아래 {SALE_COUNT}개 관리에 첫 방문가(50%)가 적용됩니다.
            </p>
            {/* 조건·안내 덩어리는 통째로 다음 줄로 넘어간다. 가운뎃점은 덩어리 앞 틈(column-gap)에 놓여,
                덩어리가 줄 머리로 넘어가면 상자 왼쪽 밖으로 나가 잘린다(줄 끝에 '·'가 홀로 남지 않는다) */}
            <p className="mt-[0.6rem] flex flex-wrap gap-x-[1.1em] overflow-clip text-[0.82rem] leading-[1.6] break-keep text-[color-mix(in_srgb,var(--w-ink)_70%,transparent)] lg:mt-auto lg:pt-6">
              {TICKET_NOTES.map((note, i) => (
                <span key={note} className="relative">
                  {i > 0 && <span className="absolute right-full w-[1.1em] text-center"> · </span>}
                  {note}
                </span>
              ))}
            </p>
          </div>

          <div className="min-w-0 lg:self-center">
            <p id="offer-list-label" className="mb-[0.7rem] text-[0.85rem] leading-[1.4] font-semibold text-accent-deep">
              첫 방문가 적용 관리
            </p>
            <ul ref={listRef} aria-labelledby="offer-list-label">
              {SALE.map((p, i) => (
                <PriceRow key={p.id} program={p} i={i} run={run} />
              ))}
            </ul>
          </div>

          <div ref={stubRef} className={STUB}>
            <button
              type="button"
              className={ROUND}
              data-magnet
              data-cursor=""
              onClick={() => scrollToId('booking')}
            >
              <span>예약하기</span>
            </button>
            <ParenLink href={BRANCHES.zai.booking} external tone="ink" className="self-center">
              네이버 예약
            </ParenLink>
          </div>
        </article>
      </div>
    </section>
  )
}

// 첫 방문가 적용 관리 한 줄: 정가(취소선) → 첫 방문가. 금액은 세어 내리지 않고 처음부터 실제 첫 방문가로 보인다.
// 티켓(조건이 함께 보이는 곳) 안에서만 취소선을 쓴다. 보조기기에는 '정가 130,000원, 첫 방문가 65,000원'으로 읽힌다.
function PriceRow({ program: p, i, run }) {

  return (
    <li
      className={`grid grid-cols-[minmax(0,1fr)] items-baseline gap-x-3 gap-y-[0.15rem] [border-top:1px_dashed_rgb(46_50_38/0.25)] py-[0.8rem] transition-opacity delay-[calc(var(--i,0)_*_50ms)] duration-300 ease-[ease] last:[border-bottom:1px_dashed_rgb(46_50_38/0.25)] motion-reduce:opacity-100 motion-reduce:transition-none sm:grid-cols-[minmax(0,1fr)_auto] ${
        run ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ '--i': i }}
    >
      <span className="text-[0.98rem] leading-[1.45] font-medium">{p.label}</span>
      {SHOW_PRICES && (
        <>
          <span className="inline-flex items-baseline gap-[0.45rem] justify-self-end font-label leading-[1.3] whitespace-nowrap lining-nums tabular-nums" aria-hidden="true">
            {/* 정가 취소선: 금액이 다 보인 뒤 왼쪽부터 그어진다 */}
            <s
              className={`relative text-[0.86em] text-[rgb(29_26_23/0.55)] no-underline after:absolute after:inset-x-[-0.1em] after:top-[52%] after:bottom-auto after:h-px after:origin-left after:bg-bronze after:transition-transform after:delay-[calc(var(--i,0)_*_50ms_+_0.3s)] after:duration-300 after:ease-yw after:content-[''] motion-reduce:after:scale-x-100 motion-reduce:after:transition-none ${
                run ? 'after:scale-x-100' : 'after:scale-x-0'
              }`}
            >
              {won(p.price)}
            </s>
            <i className="text-[0.8em] text-bronze not-italic">→</i>
            {/* 금액 자리 폭을 고정해 자릿수가 달라도 흔들리지 않게 한다 */}
            <b className="inline-block min-w-[4.7em] text-right text-[1.08em] font-medium text-espresso">{won(p.sale)}</b>
          </span>
          <span className="sr-only">
            정가 {won(p.price)}, 첫 방문가 {won(p.sale)}
          </span>
        </>
      )}
    </li>
  )
}
