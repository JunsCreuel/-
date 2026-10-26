import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { BRANCHES, BRAND, displayAddress, mapHref, MARINE_OPEN, OPEN_BRANCHES, reserveAction, SHOW_MARINE_INFO, telHref } from './data'
import { goToMenu } from './scroll'
import './wellness-footer.css'

// 약관·방침 문서. 눌리지 않는 글자는 링크처럼 오해되므로 href가 있는 항목만 보여 준다.
// 문서가 준비되면 href에 주소를 넣는다(CCTV 방침은 CCTV를 운영할 때만). 개인정보처리방침은 WellnessPrivacy(#/wellness/privacy).
const POLICIES = [
  { label: '이용약관', href: null },
  { label: '개인정보처리방침', href: '#/wellness/privacy', strong: true },
]
const SHOWN_POLICIES = POLICIES.filter((p) => p.href)
// 마린시티점 주소·전화(별도 페이지가 없어도 지점 안내로 보여 준다)
const SHOW_MARINE = MARINE_OPEN || SHOW_MARINE_INFO

export default function WellnessFooter({ items }) {
  const { zai, marine } = BRANCHES
  const naver = reserveAction(zai)

  return (
    <footer className="w-footer">
      <div className="w-footer__main">
        <div className="w-container">
          <BrandLogo variant="nav" />
          <div className="w-footer__rule" />

          <div className="w-footer__grid">
            <div className="w-footer__info">
              <p>상호명 : {BRAND.company}</p>
              <p>
                <span>대표 : {BRAND.representative}</span>
                <span className="w-footer__sep" aria-hidden="true">|</span>
                <span>사업자등록번호 : {BRAND.bizNo}</span>
              </p>
              <p>
                <span>
                  {SHOW_MARINE ? zai.label : '주소'} : {displayAddress(zai.address)}
                </span>
                <span className="w-footer__sep" aria-hidden="true">|</span>
                <span>
                  TEL : <a href={telHref(zai.phone)}>{zai.phone}</a>
                </span>
              </p>
              {SHOW_MARINE && (
                <p>
                  <span>
                    {marine.label} : {displayAddress(marine.address)}
                  </span>
                  <span className="w-footer__sep" aria-hidden="true">|</span>
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
                    <span className="w-footer__sep" aria-hidden="true">|</span>
                    {marine.label} {marine.hours}
                  </>
                )}
              </p>
            </div>

            <div className="w-footer__cols">
              <ul className="w-footer__col">
                <li>
                  <a className="is-ext" href={naver.href} target="_blank" rel="noopener noreferrer">
                    네이버 예약
                  </a>
                </li>
                <li>
                  <a className="is-ext" href={mapHref(zai)} target="_blank" rel="noopener noreferrer">
                    네이버 지도
                  </a>
                </li>
              </ul>
              <ul className="w-footer__col">
                {items.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => goToMenu(item)}>
                      {item.label}
                    </button>
                  </li>
                ))}
                {OPEN_BRANCHES.length > 1 &&
                  OPEN_BRANCHES.map((b) => (
                    <li key={b.id}>
                      <Link to={b.path}>{b.label}</Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-footer__bar">
        <div className="w-container w-footer__bar-inner">
          <p className="w-footer__copy">
            ⓒ 2026 {BRAND.ko} {BRAND.name}. All rights reserved.
          </p>
          {SHOWN_POLICIES.length > 0 && (
            <ul className="w-footer__policies" aria-label="약관 및 방침">
              {SHOWN_POLICIES.map((p) => (
                <li key={p.label}>
                  <a href={p.href} className={p.strong ? 'is-strong' : undefined}>
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
