import { BRANCHES, MARINE_OPEN, PHOTOS, SHOW_MARINE_INFO, displayAddress, mapHref, reserveAction, telHref } from '../data'
import { Folio } from '../editorial'
import QuickConsult from './QuickConsult'
import './yw-visit.css'

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

export default function CustomerCenter({ branch = BRANCHES.zai }) {
  const naver = reserveAction(branch)
  // 지점 안내: 지금 보는 지점이 아닌 다른 지점(마린시티점은 별도 페이지 없이 여기서만 알린다)
  const other = branch.id === 'zai' ? (MARINE_OPEN || SHOW_MARINE_INFO ? BRANCHES.marine : null) : BRANCHES.zai

  return (
    <section id="booking" className="yw-section yw-visit" data-theme="light">
      <div className="yw-wrap yw-visit__grid">
        <div id="visit" className="yw-visit__info">
          <Folio no="09" en="Reservation" />
          <h2 className="yw-h2">편하신 방법으로 예약해 주세요.</h2>

          <ul className="yw-visit__round">
            <li>
              <a href={telHref(branch.phone)} data-magnet="">
                <span className="yw-visit__circle">
                  <PhoneIcon />
                  <b>전화</b>
                </span>
                <small className="yw-visit__u">{branch.phone}</small>
              </a>
            </li>
            {naver.external && (
              <li>
                <a href={naver.href} {...NEW_TAB} data-magnet="">
                  <span className="yw-visit__circle">
                    <CalendarIcon />
                    <b>네이버 예약</b>
                  </span>
                  <small className="yw-visit__u">바로가기 ↗</small>
                  <span className="sr-only">(새 창)</span>
                </a>
              </li>
            )}
            <li>
              <a href={mapHref(branch)} {...NEW_TAB} data-magnet="">
                <span className="yw-visit__circle">
                  <PinIcon />
                  <b>지도</b>
                </span>
                <small className="yw-visit__u">네이버 지도 ↗</small>
                <span className="sr-only">(새 창)</span>
              </a>
            </li>
          </ul>

          <dl className="yw-visit__rows">
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
            {other && (
              <div>
                <dt>다른 지점</dt>
                <dd>
                  <b className="yw-visit__branch">{other.label}</b>
                  {displayAddress(other.address)}
                  <span className="yw-visit__branch-links">
                    <a href={telHref(other.phone)}>{other.phone}</a>
                    <a href={mapHref(other)} {...NEW_TAB}>
                      네이버 지도 ↗<span className="sr-only">(새 창)</span>
                    </a>
                  </span>
                </dd>
              </div>
            )}
          </dl>

          {naver.external && (
            <div className="yw-visit__qr">
              <img src={PHOTOS.qr} alt="네이버 예약 QR 코드" width="88" height="88" loading="lazy" decoding="async" />
              <p>
                QR을 스캔하고
                <br />
                휴대폰으로 바로 예약하세요
              </p>
            </div>
          )}
        </div>

        <div id="booking-form" className="yw-visit__form">
          <QuickConsult variant="light" listen />
        </div>
      </div>
    </section>
  )
}
