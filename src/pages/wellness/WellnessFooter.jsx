import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { BRANCHES, BRAND, displayAddress, mapHref, MARINE_OPEN, OPEN_BRANCHES, reserveAction, SHOW_MARINE_INFO, telHref } from './data'
import { goToMenu } from './scroll'

// 약관·방침 문서. 눌리지 않는 글자는 링크처럼 오해되므로 href가 있는 항목만 보여 준다.
// 문서가 준비되면 href에 주소를 넣는다(CCTV 방침은 CCTV를 운영할 때만). 개인정보처리방침은 WellnessPrivacy(#/wellness/privacy).
const POLICIES = [
  { label: '이용약관', href: null },
  { label: '개인정보처리방침', href: '#/wellness/privacy', strong: true },
]
const SHOWN_POLICIES = POLICIES.filter((p) => p.href)
// 마린시티점 주소·전화(별도 페이지가 없어도 지점 안내로 보여 준다)
const SHOW_MARINE = MARINE_OPEN || SHOW_MARINE_INFO

// 사업자 정보 사이의 '|'. 좁은 화면(600px 미만)에서는 숨기고 항목마다 줄을 바꾼다(줄 끝에 '|'가 남지 않게).
const SEP = 'mx-[0.55em] text-line-strong max-[599px]:hidden'
// 오른쪽 링크 두 열의 항목(누르는 영역 44px 이상, 겉모양은 글자만)
const COL_ITEM =
  'inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-left [font-family:inherit] [font-size:inherit] [font-weight:inherit] [line-height:inherit] text-ink hover:underline hover:underline-offset-[0.3em]'
const COL = 'flex flex-col items-start'

export default function WellnessFooter({ items }) {
  const { zai, marine } = BRANCHES
  const naver = reserveAction(zai)

  return (
    <footer
      data-site-footer
      className="border-t border-line bg-(--w-bg) text-[0.85rem] leading-[2] text-ink [&_[data-logo=nav]]:[--u:min(0.46px,calc((100vw_-_2_*_var(--w-gutter))/774))]">
      <div className="px-(--w-gutter) pt-[clamp(3rem,7vw,5.5rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto w-full max-w-(--w-max)">
          <BrandLogo variant="nav" />
          <div className="mx-0 mt-[1.8rem] mb-8 h-px bg-line" />

          <div className="grid gap-[2.6rem] min-[900px]:grid-cols-[1.7fr_1fr] min-[900px]:gap-16">
            <div className="max-[599px]:[&_p>span:not([aria-hidden])]:block [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline [&_a]:underline-offset-[0.25em] [&_p]:m-0 [&_p]:text-muted">
              <p>상호명 : {BRAND.company}</p>
              <p>
                <span>대표 : {BRAND.representative}</span>
                <span className={SEP} aria-hidden="true">
                  |
                </span>
                <span>사업자등록번호 : {BRAND.bizNo}</span>
              </p>
              <p>
                <span>
                  {SHOW_MARINE ? zai.label : '주소'} : {displayAddress(zai.address)}
                </span>
                <span className={SEP} aria-hidden="true">
                  |
                </span>
                <span>
                  TEL : <a href={telHref(zai.phone)}>{zai.phone}</a>
                </span>
              </p>
              {SHOW_MARINE && (
                <p>
                  <span>
                    {marine.label} : {displayAddress(marine.address)}
                  </span>
                  <span className={SEP} aria-hidden="true">
                  |
                </span>
                  <span>
                    TEL : <a href={telHref(marine.phone)}>{marine.phone}</a>
                  </span>
                </p>
              )}
              <p>
                영업시간 : {SHOW_MARINE && `${zai.label} `}
                {zai.hours}
                {SHOW_MARINE && marine.hours && (
                  <>
                    <span className={SEP} aria-hidden="true">
                  |
                </span>
                    {marine.label} {marine.hours}
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-0 min-[900px]:ml-auto min-[900px]:max-w-96">
              <ul className={COL}>
                <li>
                  <a className={`${COL_ITEM} after:text-[0.8em] after:content-['_↗']`} href={naver.href} target="_blank" rel="noopener noreferrer">
                    네이버 예약
                  </a>
                </li>
                <li>
                  <a className={`${COL_ITEM} after:text-[0.8em] after:content-['_↗']`} href={mapHref(zai)} target="_blank" rel="noopener noreferrer">
                    네이버 지도
                  </a>
                </li>
              </ul>
              <ul className={COL}>
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${COL_ITEM} relative before:absolute before:inset-y-0 before:-inset-x-[0.6rem] before:content-['']`}
                      onClick={() => goToMenu(item)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                {OPEN_BRANCHES.length > 1 &&
                  OPEN_BRANCHES.map((b) => (
                    <li key={b.id}>
                      <Link to={b.path} className={COL_ITEM}>
                        {b.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-(--w-band) px-(--w-gutter) pt-[1.1rem] pb-[calc(1.1rem+env(safe-area-inset-bottom))] min-[900px]:pb-[1.1rem]">
        <div className="mx-auto w-full max-w-(--w-max) flex flex-wrap items-center justify-between gap-x-8 gap-y-[0.4rem]">
          <p className="m-0 text-[0.75rem] tracking-[0.06em] text-muted">
            ⓒ 2026 {BRAND.ko} {BRAND.name}. All rights reserved.
          </p>
          {SHOWN_POLICIES.length > 0 && (
            <ul className="flex flex-wrap gap-x-[1.3rem] gap-y-0 text-[0.78rem] text-muted" aria-label="약관 및 방침">
              {SHOWN_POLICIES.map((p) => (
                <li key={p.label}>
                  <a href={p.href} className={p.strong ? 'font-bold text-ink' : undefined}>
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
