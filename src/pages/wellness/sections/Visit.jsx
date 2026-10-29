import { Link } from 'react-router-dom'
import { OPEN_BRANCHES, mapHref, reserveAction, telHref } from '../data'
import { scrollToId } from '../scroll'
import { W_BAND, W_CONTAINER, W_EYEBROW, W_TITLE } from '../tw'
import { Reveal, Todo } from '../ui'

// 지점 탭 + 선택한 지점의 오시는 길. 오픈한 지점이 둘 이상일 때만 탭을 보여 준다.
export default function Visit({ branch }) {
  const reserve = reserveAction(branch)

  return (
    <section id="visit" className={W_BAND}>
      <div className={W_CONTAINER}>
        <Reveal as="p" className={W_EYEBROW}>
          Visit
        </Reveal>
        <Reveal as="h2" delay={80} className={W_TITLE}>
          오시는 길
        </Reveal>

        {OPEN_BRANCHES.length > 1 && (
          <Reveal as="nav" className="mt-[1.8rem] flex gap-[1.8rem] border-b border-line" aria-label="지점 선택">
            {OPEN_BRANCHES.map((b) => (
              <Link
                key={b.id}
                to={b.path}
                aria-current={b.id === branch.id ? 'page' : undefined}
                className={`-mb-px border-b-2 py-[0.7rem] text-[0.95rem] ${b.id === branch.id ? 'border-b-ink font-semibold text-ink' : 'border-b-transparent text-muted'}`}
              >
                {b.label}
              </Link>
            ))}
          </Reveal>
        )}

        <Reveal className="mt-[1.8rem]">
          <h3 className="mb-4 text-[1.35rem]">{branch.label}</h3>
          <dl className="grid border-b border-(--w-hair) [&_a]:underline [&_a]:underline-offset-[0.25em] [&_dt]:text-[0.85rem] [&_dt]:tracking-[0.04em] [&_dt]:text-muted [&>div]:grid [&>div]:gap-x-4 [&>div]:gap-y-[0.1rem] [&>div]:border-t [&>div]:border-(--w-hair) [&>div]:py-[0.95rem] min-[640px]:[&>div]:grid-cols-[6rem_1fr]">
            <div>
              <dt>주소</dt>
              <dd>
                {branch.address}
              </dd>
            </div>
            <div>
              <dt>영업시간</dt>
              <dd>{branch.hours ?? <Todo>영업시간 · 휴무일</Todo>}</dd>
            </div>
            <div>
              <dt>전화</dt>
              <dd>
                <a href={telHref(branch.phone)}>{branch.phone}</a>
              </dd>
            </div>
            <div>
              <dt>예약</dt>
              <dd>
                <button type="button" className="cursor-pointer border-0 bg-transparent p-0 [font:inherit] text-inherit underline underline-offset-[0.25em]" onClick={() => scrollToId('booking')}>
                  상담 예약
                </button>
                {reserve.external && (
                  <>
                    {' · '}
                    <a href={reserve.href} target="_blank" rel="noopener noreferrer">
                      네이버 예약
                    </a>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>지도</dt>
              <dd>
                <a href={mapHref(branch)} target="_blank" rel="noopener noreferrer">
                  네이버 지도
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
