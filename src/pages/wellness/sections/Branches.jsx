import { BRANCHES, MARINE_OPEN, SHOW_MARINE_INFO, displayAddress, mapHref, telHref } from '../data'
import { Folio } from '../editorial'
import './yw-branches.css'

// 지점 안내 — 지점마다 카드 한 장(지점명 · 주소 · 영업시간 · 전화 · 지도 · 예약). 휴대폰 1열, 태블릿부터 2열.
// 마린시티점은 별도 페이지 없이 이 카드로만 알린다(SHOW_MARINE_INFO).
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' }

export default function Branches() {
  const list = [BRANCHES.zai, ...(MARINE_OPEN || SHOW_MARINE_INFO ? [BRANCHES.marine] : [])]

  return (
    <section id="branches" className="yw-section yw-branches" data-theme="light" aria-labelledby="branches-title">
      <div className="yw-wrap">
        <Folio ko="지점 안내" />
        <h2 id="branches-title" className="yw-h2">
          가까운 지점을 찾아 주세요.
        </h2>

        <ul className="yw-branches__list">
          {list.map((b) => (
            <li key={b.id} className="yw-branches__card">
              <h3 className="yw-branches__name">{b.label}</h3>
              <dl className="yw-branches__rows">
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
              <div className="yw-branches__actions">
                <a className="yw-btn yw-btn--ink" href={telHref(b.phone)}>
                  <span>전화하기</span>
                </a>
                <a className="yw-branches__link" href={mapHref(b)} {...NEW_TAB}>
                  네이버 지도 ↗<span className="sr-only">(새 창)</span>
                </a>
                {b.booking && (
                  <a className="yw-branches__link" href={b.booking} {...NEW_TAB}>
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
