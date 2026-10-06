import { Link } from 'react-router-dom'
import { OPEN_BRANCHES, mapHref, reserveAction, telHref } from '../data'
import { scrollToId } from '../scroll'
import { Reveal, Todo } from '../ui'

// 지점 탭 + 선택한 지점의 오시는 길. 오픈한 지점이 둘 이상일 때만 탭을 보여 준다.
export default function Visit({ branch }) {
  const reserve = reserveAction(branch)

  return (
    <section id="visit" className="w-section w-section--band">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          Visit
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          오시는 길
        </Reveal>

        {OPEN_BRANCHES.length > 1 && (
          <Reveal as="nav" className="w-tabs" aria-label="지점 선택">
            {OPEN_BRANCHES.map((b) => (
              <Link
                key={b.id}
                to={b.path}
                aria-current={b.id === branch.id ? 'page' : undefined}
                className={b.id === branch.id ? 'is-active' : undefined}
              >
                {b.label}
              </Link>
            ))}
          </Reveal>
        )}

        <Reveal className="w-visit">
          <h3>{branch.label}</h3>
          <dl className="w-visit__list">
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
                <button type="button" className="w-linkish" onClick={() => scrollToId('booking')}>
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
