import { BRANCHES, displayAddress, mapHref, reserveAction, telHref } from '../data'
import QuickConsult from './QuickConsult'
import { H2, RULE, SECTION } from '../tw'

// 상담 예약 — 왼쪽에 예약 수단(전화·네이버 예약)과 영업시간·오시는 길을 줄로 적고, 오른쪽에 간편 상담 카드를 둔다.
// 위에서 고른 관리는 간편 상담 카드가 'w:pick' 이벤트로 이어받아 '관심 관리'로 붙인다. #visit(오시는 길) 앵커도 이 장 왼쪽 열이다.
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' }
const LINK = 'text-inherit underline underline-offset-[0.25em]'

export default function CustomerCenter({ branch = BRANCHES.zai }) {
  const naver = reserveAction(branch)

  return (
    <section id="booking" className={`${SECTION} ${RULE}`} data-theme="light">
      <div className="mx-auto grid w-full max-w-(--yw-max) gap-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-[clamp(2rem,5vw,4.5rem)]">
        <div id="visit" className="min-w-0">
          <h2 className={`${H2} text-balance`}>편하신 방법으로 예약해 주세요.</h2>

          <dl className="mt-[clamp(1.75rem,4vw,2.5rem)] border-b border-line [&_dd]:m-0 [&_dd]:text-[0.97rem] [&_dd]:leading-7 [&_dd]:text-ink [&_dt]:text-[0.85rem] [&_dt]:leading-7 [&_dt]:text-muted [&>div]:grid [&>div]:grid-cols-[6rem_minmax(0,1fr)] [&>div]:gap-4 [&>div]:border-t [&>div]:border-line [&>div]:py-3">
            <div>
              <dt>전화</dt>
              <dd>
                <a className={`${LINK} tabular-nums`} href={telHref(branch.phone)}>
                  {branch.phone}
                </a>
              </dd>
            </div>
            {naver.external && (
              <div>
                <dt>네이버 예약</dt>
                <dd>
                  <a className={LINK} href={naver.href} {...NEW_TAB}>
                    예약 페이지 열기 ↗<span className="sr-only">(새 창)</span>
                  </a>
                </dd>
              </div>
            )}
            {branch.hours && (
              <div>
                <dt>영업시간</dt>
                <dd>{branch.hours}</dd>
              </div>
            )}
            <div>
              <dt>오시는 길</dt>
              <dd>
                {displayAddress(branch.address)}{' '}
                <a className={`${LINK} whitespace-nowrap`} href={mapHref(branch)} {...NEW_TAB}>
                  지도 ↗<span className="sr-only">(새 창)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div id="booking-form" className="min-w-0">
          <QuickConsult listen />
        </div>
      </div>
    </section>
  )
}
