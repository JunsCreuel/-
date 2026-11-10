import { LISTED_BRANCHES, displayAddress, mapHref, telHref } from '../data'
import { BTN_INK, H2, RULE, SECTION } from '../tw'

// 지점 안내 — 지점마다 한 칸(지점명 · 주소 · 영업시간 · 전화 · 지도 · 예약). 휴대폰 1열, 태블릿부터 2열. 카드 없이 선으로만 나눈다.
// 마린시티점은 별도 페이지 없이 이 카드로만 알린다(SHOW_MARINE_INFO).
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' }

export default function Branches() {
  const list = LISTED_BRANCHES

  return (
    <section id="branches" className={`${SECTION} ${RULE}`} data-theme="light" aria-labelledby="branches-title">
      <div className="mx-auto w-full max-w-(--yw-max)">
        <h2 id="branches-title" className={`${H2} m-0`}>
          지점 안내
        </h2>

        <ul className="m-0 mt-[clamp(1.75rem,4vw,2.5rem)] grid list-none gap-10 p-0 md:grid-cols-2 md:gap-[clamp(2rem,5vw,4.5rem)]">
          {list.map((b) => (
            <li
              key={b.id}
              id={`branch-${b.id}`}
              className="flex flex-col"
            >
              <h3 className="m-0 font-serif text-[clamp(1.25rem,2.4vw,1.5rem)] leading-[1.3] font-medium tracking-[-0.01em]">{b.label}</h3>
              <dl className="m-0 mt-4 border-t border-line-strong [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-[0.25em] [&_dd]:m-0 [&_dd]:break-keep [&_dd]:text-ink [&_dt]:text-muted [&>div]:grid [&>div]:grid-cols-[4.5rem_minmax(0,1fr)] [&>div]:gap-3 [&>div]:border-b [&>div]:border-line [&>div]:py-[0.7rem] [&>div]:text-[0.92rem] [&>div]:leading-[1.6]">
                <div>
                  <dt>주소</dt>
                  <dd>{displayAddress(b.address)}</dd>
                </div>
                {b.hours && (
                  <div>
                    <dt>영업시간</dt>
                    <dd>{b.hours}</dd>
                  </div>
                )}
                <div>
                  <dt>전화</dt>
                  <dd>
                    <a href={telHref(b.phone)}>{b.phone}</a>
                  </dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
                <a className={BTN_INK} href={telHref(b.phone)}>
                  <span>전화하기</span>
                </a>
                <a className="inline-flex min-h-11 items-center text-[0.9rem] text-ink underline underline-offset-[0.25em]" href={mapHref(b)} {...NEW_TAB}>
                  네이버 지도 ↗<span className="sr-only">(새 창)</span>
                </a>
                {b.booking && (
                  <a className="inline-flex min-h-11 items-center text-[0.9rem] text-ink underline underline-offset-[0.25em]" href={b.booking} {...NEW_TAB}>
                    네이버 예약 ↗<span className="sr-only">(새 창)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
