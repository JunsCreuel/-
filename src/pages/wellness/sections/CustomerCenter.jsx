import { BRANCHES, PHOTOS, displayAddress, mapHref, reserveAction, telHref } from '../data'
import BookingSteps from '../BookingSteps'
import { Reveal } from '../ui'

// 상담 예약과 오시는 길을 하나로 합친 구간: 큰 전화번호·영업시간·주소·네이버 예약·QR, 그리고 상담 신청 3단계
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
            <span className="w-display__sub">나를 위한 시간, 지금 예약해 보세요.</span>
          </Reveal>
          <Reveal as="p" delay={120} className="w-lead">
            원하는 관리와 시간을 남겨 주시면 확인 후 연락드려 일정을 잡아 드립니다. 네이버 예약이나 전화로도 바로 예약하실 수 있습니다.
          </Reveal>

          <Reveal delay={160} className="w-cc__panel" id="visit">
            <span className="w-cc__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.55 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.55 3.5a1 1 0 0 1-.25 1z" />
              </svg>
            </span>
            <p className="w-cc__label">전화 예약 · {branch.label}</p>
            <a className="w-cc__tel" href={telHref(branch.phone)}>
              {branch.phone}
            </a>
            <dl className="w-cc__rows">
              <div>
                <dt>영업시간</dt>
                <dd>{branch.hours}</dd>
              </div>
              <div>
                <dt>오시는 길</dt>
                <dd>
                  {displayAddress(branch.address)}
                  <a className="w-cc__link" href={mapHref(branch)} target="_blank" rel="noopener noreferrer">
                    네이버 지도 ↗
                  </a>
                </dd>
              </div>
              {naver.external && (
                <div>
                  <dt>네이버 예약</dt>
                  <dd>
                    <a className="w-cc__link w-cc__link--solo" href={naver.href} target="_blank" rel="noopener noreferrer">
                      바로가기 ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <div className="w-cc__qr">
              <img src={PHOTOS.qr} alt="네이버 예약 QR 코드" width="88" height="88" loading="lazy" />
              <p>
                QR을 스캔하고
                <br />
                휴대폰으로 바로 예약하세요
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="w-cc__form">
          <BookingSteps />
        </Reveal>
      </div>
    </section>
  )
}
