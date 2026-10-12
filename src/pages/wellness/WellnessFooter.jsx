import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { BRAND, BRANCHES, MARINE_OPEN, OPEN_BRANCHES, PHOTOS, mapHref, reserveAction, telHref } from './data'
import { scrollToId } from './scroll'
import './wellness-footer.css'
import './wellness-home.css'

// 딥그린 푸터: 태그라인 + 예약 버튼, 브랜드 · 오시는 길 · 예약 문의 · QR, 맨 아래 사업자 정보.
// 홈의 "오시는 길" 메뉴는 이 푸터(id="location")로 이동한다.
export default function WellnessFooter() {
  const { zai, marine } = BRANCHES
  const naver = reserveAction(zai)
  const visits = MARINE_OPEN ? [zai, marine] : [zai]

  return (
    <footer id="location" className="w-footer">
      <div className="w-footer__main">
        <div className="w-footer__top">
          <p className="w-footer__tagline">
            오늘은 건강하게,
            <br />
            내일은 더 <em>환하게.</em>
          </p>
          <button type="button" className="ws-btn ws-btn--light" onClick={() => scrollToId('booking')}>
            예약하기
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M0 6h16M11 1l5 5-5 5" />
            </svg>
          </button>
        </div>

        <div className="w-footer__grid">
          <div className="w-footer__brand">
            <BrandLogo variant="nav" />
            <p className="w-footer__words">온열 · 회복 · 두피 · 얼굴 · 바디</p>
            {OPEN_BRANCHES.length > 1 && (
              <ul className="w-footer__branches">
                {OPEN_BRANCHES.map((b) => (
                  <li key={b.id}>
                    <Link to={b.path}>{b.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {visits.map((b) => (
            <div key={b.id} className="w-footer__col">
              <p className="w-footer__label">오시는 길 · {b.label}</p>
              <p>{b.address}</p>
              {b.hours && <p className="w-footer__muted">{b.hours}</p>}
              <a className="w-footer__link" href={mapHref(b)} target="_blank" rel="noopener noreferrer">
                네이버 지도 ↗
              </a>
            </div>
          ))}

          <div className="w-footer__col">
            <p className="w-footer__label">예약 문의</p>
            <a className="w-footer__tel" href={telHref(zai.phone)}>
              {zai.phone}
            </a>
            {naver.external && (
              <a className="w-footer__link" href={naver.href} target="_blank" rel="noopener noreferrer">
                네이버 예약 ↗
              </a>
            )}
          </div>

          <div className="w-footer__qr">
            <img src={PHOTOS.qrBooking} alt="네이버 예약 QR 코드" width="112" height="112" loading="lazy" />
            <p>
              QR을 스캔하고
              <br />
              휴대폰으로
              <br />
              바로 예약하세요
            </p>
          </div>
        </div>
      </div>

      <div className="w-footer__bar">
        <div className="w-footer__bar-inner">
          <p>
            상호명 : {BRAND.company} · 대표 : {BRAND.representative} · 사업자등록번호 : {BRAND.bizNo}
          </p>
          <p>ⓒ 2026 {BRAND.company}</p>
        </div>
      </div>
    </footer>
  )
}
