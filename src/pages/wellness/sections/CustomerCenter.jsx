import { BRANCHES, mapHref, reserveAction, telHref } from '../data'
import { Reveal } from '../ui'

// 상담 예약과 오시는 길을 하나로 합친 구간. 큰 전화번호와 영업시간을 먼저 보여 준다.
export default function CustomerCenter({ branch = BRANCHES.zai }) {
  const naver = reserveAction(branch)

  return (
    <section id="booking" className="w-section w-cc">
      <div className="w-container w-cc__grid">
        <div className="w-cc__main">
          <Reveal as="p" className="w-label">
            Reservation
          </Reveal>
          <Reveal as="h2" delay={80} className="w-display">
            Customer
            <br />
            Center
            <span className="w-display__sub">상담 예약</span>
          </Reveal>
          <Reveal as="p" delay={120} className="w-lead">
            네이버 예약 또는 전화로 원하는 관리와 일정을 문의해 주세요. 첫 방문 고객께는 모든 관리 50% 혜택이 적용됩니다.
          </Reveal>
          <Reveal delay={160} className="w-hero__actions">
            {naver.external && (
              <a className="w-btn w-btn--primary" href={naver.href} target="_blank" rel="noopener noreferrer">
                네이버에서 예약하기 ↗
              </a>
            )}
            <a className="w-btn" href={telHref(branch.phone)}>
              전화로 관리 상담
            </a>
          </Reveal>
          <p className="w-method__note">
            두피 · 얼굴 · 복부 · 전신 집중관리 · 온열돔 단독 이용 중 관심 있는 관리를 말씀해 주세요. 소요시간과 비용, 온열돔 포함 여부를 예약 전에 안내드립니다.
          </p>
        </div>

        <Reveal className="w-cc__panel" id="visit">
          <span className="w-cc__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.55 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.55 3.5a1 1 0 0 1-.25 1z" />
            </svg>
          </span>
          <p className="w-cc__label">{branch.label} 전화</p>
          <a className="w-cc__tel" href={telHref(branch.phone)}>
            {branch.phone}
          </a>
          <dl className="w-cc__rows">
            <div>
              <dt>영업시간</dt>
              <dd>{branch.hours}</dd>
            </div>
            <div>
              <dt>주소</dt>
              <dd>{branch.address}</dd>
            </div>
          </dl>
          <a className="w-btn w-btn--arrow" href={mapHref(branch)} target="_blank" rel="noopener noreferrer">
            네이버 지도
          </a>
        </Reveal>
      </div>
    </section>
  )
}
