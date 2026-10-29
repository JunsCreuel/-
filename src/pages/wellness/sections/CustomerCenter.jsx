import { BRANCHES, PHOTOS, displayAddress, mapHref, reserveAction, telHref } from '../data'
import { Folio } from '../editorial'
import QuickConsult from './QuickConsult'
import { H2, SECTION } from '../tw'

// No. 09 Reservation — 전화·네이버 예약·지도를 큰 원형 버튼 3개로 모으고, 영업시간·주소(데스크톱은 QR까지) 옆에 첫 화면과 같은 간편 상담 카드를 둔다.
// 위에서 고른 관리는 간편 상담 카드가 'w:pick' 이벤트로 이어받아 '관심 관리'로 붙인다. #visit(오시는 길) 앵커도 이 장 왼쪽 열이다.
// 모바일 순서(머리 → 원형 버튼 → 정보 → 폼)가 DOM 순서와 같다.

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5l2.2 2.2 4.8-4.7" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  )
}

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' }

// 원형 연락 버튼: 올리거나(마우스) 포커스하면 원이 아래부터 에스프레소로 차오르고 아래 글에 밑줄이 그어진다.
// 터치에서는 누르는 동안만 차오른다.
const ROUND_LINK =
  'group grid justify-items-center gap-2 text-center text-espresso no-underline [-webkit-tap-highlight-color:transparent] focus-visible:outline-none'
const CIRCLE =
  'grid aspect-square w-[clamp(5.25rem,9vw,7.5rem)] place-content-center justify-items-center gap-[0.3rem] rounded-full border-2 border-espresso bg-[linear-gradient(var(--w-espresso)_0_0)] bg-size-[100%_0%] bg-bottom bg-no-repeat text-espresso [transition:background-size_0.45s_var(--yw-ease),color_0.3s_ease,scale_0.2s_ease] motion-reduce:transition-none group-focus-visible:bg-size-[100%_100%] group-focus-visible:text-white group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-accent-deep group-active:scale-97 group-active:bg-size-[100%_100%] group-active:text-white motion-reduce:group-active:scale-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-size-[100%_100%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-white [&_b]:max-w-[4.2em] [&_b]:text-[0.85rem] [&_b]:leading-[1.2] [&_b]:font-semibold [&_b]:tracking-[-0.01em] [&_b]:break-keep lg:[&_b]:max-w-none lg:[&_b]:text-[0.9rem] [&_svg]:size-[1.4rem] [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.6]'
const UNDER =
  'bg-[linear-gradient(currentColor,currentColor)] bg-size-[0_1px] bg-position-[0_100%] bg-no-repeat pb-[0.1em] font-label text-[0.78rem] tracking-[0.01em] whitespace-nowrap text-muted transition-[background-size] duration-200 ease-yw motion-reduce:transition-none group-focus-visible:bg-size-[100%_1px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-size-[100%_1px]'

export default function CustomerCenter({ branch = BRANCHES.zai }) {
  const naver = reserveAction(branch)

  return (
    <section id="booking" className={`${SECTION} bg-(--w-band)`} data-theme="light">
      <div className="mx-auto w-full max-w-(--yw-max) grid gap-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-[clamp(2rem,5vw,4.5rem)]">
        {/* 왼쪽 정보 열은 폼보다 짧다. 열 전체가 내비 아래에 다 들어오는 높은 화면에서만 폼을 따라 내려오며 옆에 머문다 */}
        <div
          id="visit"
          className="min-w-0 [@media(min-width:64rem)_and_(min-height:52rem)]:sticky [@media(min-width:64rem)_and_(min-height:52rem)]:top-[calc(var(--w-nav-h)+2rem)]"
        >
          <Folio ko="예약" />
          <h2 className={`${H2} text-balance`}>편하신 방법으로 예약해 주세요.</h2>

          <ul className="mt-[clamp(1.75rem,4vw,2.5rem)] flex max-w-[30rem] justify-between gap-[clamp(0.5rem,2vw,1rem)] lg:max-w-none lg:justify-start lg:gap-4 [&>li]:min-w-0">
            <li>
              <a href={telHref(branch.phone)} data-magnet="" className={ROUND_LINK}>
                <span className={CIRCLE}>
                  <PhoneIcon />
                  <b>전화</b>
                </span>
                <small className={UNDER}>{branch.phone}</small>
              </a>
            </li>
            {naver.external && (
              <li>
                <a href={naver.href} {...NEW_TAB} data-magnet="" className={ROUND_LINK}>
                  <span className={CIRCLE}>
                    <CalendarIcon />
                    <b>네이버 예약</b>
                  </span>
                  <small className={UNDER}>바로가기 ↗</small>
                  <span className="sr-only">(새 창)</span>
                </a>
              </li>
            )}
            <li>
              <a href={mapHref(branch)} {...NEW_TAB} data-magnet="" className={ROUND_LINK}>
                <span className={CIRCLE}>
                  <PinIcon />
                  <b>지도</b>
                </span>
                <small className={UNDER}>네이버 지도 ↗</small>
                <span className="sr-only">(새 창)</span>
              </a>
            </li>
          </ul>

          <dl className="mt-[clamp(1.75rem,4vw,2.5rem)] border-b border-line [&_dd]:text-[0.97rem] [&_dd]:leading-7 [&_dd]:text-ink [&_dt]:text-[0.85rem] [&_dt]:leading-7 [&_dt]:text-muted [&>div]:grid [&>div]:grid-cols-[6rem_minmax(0,1fr)] [&>div]:gap-4 [&>div]:border-t [&>div]:border-line [&>div]:py-3">
            {branch.hours && (
              <div>
                <dt>영업시간</dt>
                <dd>{branch.hours}</dd>
              </div>
            )}
            <div>
              <dt>오시는 길</dt>
              <dd>{displayAddress(branch.address)}</dd>
            </div>
          </dl>

          {naver.external && (
            <div className="mt-6 hidden items-center gap-4 text-[0.88rem] leading-[1.6] text-muted lg:flex">
              <img
                className="size-[88px] flex-none rounded-xl border border-line bg-white p-[5px]"
                src={PHOTOS.qr}
                alt="네이버 예약 QR 코드"
                width="88"
                height="88"
                loading="lazy"
                decoding="async"
              />
              <p>
                QR을 스캔하고
                <br />
                휴대폰으로 바로 예약하세요
              </p>
            </div>
          )}
        </div>

        <div id="booking-form" className="min-w-0">
          <QuickConsult listen />
        </div>
      </div>
    </section>
  )
}
