import { useEffect, useRef } from 'react'
import { OFFER_TERM, OFFER_TERM_FULL, SALE_COUNT, SHOW_OFFER } from '../data'
import { scrollToId } from '../scroll'
import { BTN_INK, SECTION } from '../tw'

// 첫 방문 이벤트 — 연두 티켓 한 장. 관리별 가격은 바로 위 관리 메뉴에 있으므로 여기서는 혜택과 조건, 예약 버튼만 둔다.
// 첫 방문 50%는 상시 할인이 아니다. 할인가(sale)가 있는 관리에만, 첫 방문 고객 1인 1회 한정,
// 티켓팅 시 첫 방문가 적용, 1회 관리 시 별도 재료 비용(data.js OFFER_TERM·OFFER_TERM_FULL).
// 50%는 늘 'N개 관리'(SALE_COUNT)와 조건(OFFER_TERM)과 한 덩어리로 보인다. 이벤트가 끝나면 data.js SHOW_OFFER를 false로 바꾸면 이 섹션이 사라진다.

// 티켓 아래 작은 줄: 전체 조건(OFFER_TERM_FULL) 뒤에 이용 안내를 잇는다. ' · ' 덩어리 사이에서만 줄이 바뀌고,
// 가운뎃점은 덩어리 앞 틈에 놓여 줄 머리로 넘어간 덩어리의 점은 잘려 보이지 않는다(줄 끝·줄 머리에 '·'가 홀로 남지 않게, 글자는 DOM에 그대로).
const TICKET_NOTES = [...OFFER_TERM_FULL.split(' · '), '전단지 없이 적용', '100% 예약제']

// 티켓: 연두 종이 한 장. 반원 홈은 두 원형 구멍(--mask-a·--mask-b)으로 뚫는다(좁은 화면은 가로 절취선의 좌우, 넓은 화면은 세로 절취선의 위아래)
const TICKET =
  'relative mx-auto grid w-[min(56rem,100%)] gap-[clamp(1.25rem,3vw,2.5rem)] rounded-card bg-(--w-highlight) p-(--tp) text-ink ticket-mask [--tp:clamp(1.5rem,3vw,2.5rem)] [--stub:14rem] [--notch:0.75rem] [--mask-a:radial-gradient(circle_var(--notch)_at_0_var(--cut,calc(100%_-_7rem)),#0000_98%,#000)] [--mask-b:radial-gradient(circle_var(--notch)_at_100%_var(--cut,calc(100%_-_7rem)),#0000_98%,#000)] [&_:focus-visible]:outline-espresso md:grid-cols-[minmax(0,1fr)_var(--stub)] md:pr-0 md:[--mask-a:radial-gradient(circle_var(--notch)_at_calc(100%_-_var(--stub)_+_1px)_0,#0000_98%,#000)] md:[--mask-b:radial-gradient(circle_var(--notch)_at_calc(100%_-_var(--stub)_+_1px)_100%,#0000_98%,#000)]'
// 절취선 너머: 좁은 화면은 아래(가로 점선), 넓은 화면은 오른쪽(세로 점선)
const STUB =
  'relative -mx-(--tp) mt-0 -mb-(--tp) flex items-center justify-center [border-top:2px_dashed_rgb(46_50_38/0.3)] px-(--tp) pt-[calc(var(--tp)_*_0.9)] pb-(--tp) md:mx-0 md:-my-(--tp) md:[border-top:0] md:[border-left:2px_dashed_rgb(46_50_38/0.3)] md:px-6 md:py-(--tp)'

export default function Offer() {
  if (!SHOW_OFFER) return null
  return <OfferTicket />
}

function OfferTicket() {
  const ticketRef = useRef(null)
  const stubRef = useRef(null)

  // 좁은 화면의 좌우 반원 홈: 버튼 칸이 시작하는 높이(가로 절취선)를 --cut으로 넘긴다.
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

  return (
    <section id="offer" className={`${SECTION} pt-0`} data-theme="light" aria-labelledby="offer-title">
      <div className="mx-auto w-full max-w-(--yw-max)">
        <article ref={ticketRef} className={TICKET}>
          <div className="min-w-0">
            <h2 id="offer-title" className="m-0 [font:inherit] tracking-[0] text-ink" aria-label={`${OFFER_TERM}, ${SALE_COUNT}개 관리 50%`}>
              <span className="block font-serif text-[1.05rem] leading-[1.4] font-medium tracking-[-0.01em]" aria-hidden="true">
                첫 방문 혜택
              </span>
              {/* 50%와 'N개 관리'는 같은 줄의 한 덩어리. 할인율은 세어 올리지 않고 처음부터 실제 숫자로 보인다 */}
              <span className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-[0.1rem]" aria-hidden="true">
                <strong className="font-serif text-[clamp(3.5rem,14vw,5rem)] leading-[1] font-medium tracking-[-0.02em] text-espresso tabular-nums">
                  50<small className="ml-[0.04em] text-[0.45em]">%</small>
                </strong>
                <span className="font-serif text-[1.25rem] leading-[1.3] font-normal tracking-[-0.01em] whitespace-nowrap">{SALE_COUNT}개 관리</span>
                <span className="text-[0.95rem] leading-[1.3] font-semibold whitespace-nowrap text-accent-deep">{OFFER_TERM}</span>
              </span>
            </h2>
            <p className="mt-4 max-w-[30em] break-keep">
              티켓팅 시 관리 메뉴의 {SALE_COUNT}개 관리에 첫 방문가(50%)가 적용됩니다.
            </p>
            {/* 조건·안내 덩어리는 통째로 다음 줄로 넘어간다. 가운뎃점은 덩어리 앞 틈(column-gap)에 놓여,
                덩어리가 줄 머리로 넘어가면 상자 왼쪽 밖으로 나가 잘린다(줄 끝에 '·'가 홀로 남지 않는다) */}
            <p className="mt-2 flex flex-wrap gap-x-[1.1em] overflow-clip text-[0.82rem] leading-[1.6] break-keep text-[color-mix(in_srgb,var(--w-ink)_70%,transparent)]">
              {TICKET_NOTES.map((note, i) => (
                <span key={note} className="relative">
                  {i > 0 && <span className="absolute right-full w-[1.1em] text-center"> · </span>}
                  {note}
                </span>
              ))}
            </p>
          </div>

          <div ref={stubRef} className={STUB}>
            <button type="button" className={`${BTN_INK} max-md:w-full`} data-cursor="" onClick={() => scrollToId('booking')}>
              <span>예약하기</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}
