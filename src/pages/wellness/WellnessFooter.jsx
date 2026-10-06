import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { BRAND, BRANCHES, MARINE_OPEN, OPEN_BRANCHES, mapHref, reserveAction, telHref } from './data'
import { scrollToId } from './scroll'
import './wellness-footer.css'

// 약관/방침 문서가 준비되기 전까지는 링크 없이 항목만 보여 준다.
const POLICIES = ['이용약관', '개인정보처리방침', '영상정보처리기기운영관리방침', '사업자정보확인']

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
                대표 : {BRAND.representative} | 사업자등록번호 : {BRAND.bizNo}
              </p>
              <p>
                {MARINE_OPEN ? zai.name : '주소'} : {zai.address} | TEL : <a href={telHref(zai.phone)}>{zai.phone}</a>
              </p>
              {MARINE_OPEN && (
                <p>
                  {marine.name} : {marine.address} | TEL : <a href={telHref(marine.phone)}>{marine.phone}</a>
                </p>
              )}
              <p>
                영업시간 : {MARINE_OPEN && `${zai.name} `}
                {zai.hours}
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
                    <button type="button" onClick={() => scrollToId(item.id)}>
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
          <p className="w-footer__copy">COPYRIGHT ⓒ 2026 {BRAND.name} ALL RIGHTS RESERVED</p>
          <ul className="w-footer__policies" aria-label="약관 및 방침">
            {POLICIES.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
