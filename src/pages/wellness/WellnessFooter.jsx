import { BRAND, BRANCHES, telHref } from './data'
import { Todo } from './ui'
import './wellness-footer.css'

// 약관/방침 문서가 준비되기 전까지는 링크 없이 항목만 보여 준다.
const POLICIES = ['이용약관', '개인정보처리방침', '영상정보처리기기운영관리방침', '사업자정보확인']

export default function WellnessFooter() {
  const { zai, marine } = BRANCHES

  return (
    <footer className="w-footer">
      <div className="w-container">
        <p className="w-footer__brand">{BRAND.en}</p>

        <ul className="w-footer__policies" aria-label="약관 및 방침">
          {POLICIES.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>

        <div className="w-footer__cols">
          <div>
            <h3 className="w-footer__head">BUSINESS</h3>
            <dl className="w-footer__list">
              <div>
                <dt>상호</dt>
                <dd>
                  {BRAND.ko} <Todo>상호/법인명</Todo>
                </dd>
              </div>
              <div>
                <dt>대표</dt>
                <dd>
                  <Todo>대표자명</Todo>
                </dd>
              </div>
              <div>
                <dt>사업자등록번호</dt>
                <dd>
                  <Todo>사업자등록번호</Todo>
                </dd>
              </div>
              <div>
                <dt>통신판매업 신고</dt>
                <dd>
                  <Todo>신고번호 / 해당 없음</Todo>
                </dd>
              </div>
              <div>
                <dt>{zai.name}</dt>
                <dd>
                  {zai.address}
                  <br />
                  TEL <a href={telHref(zai.phone)}>{zai.phone}</a>
                </dd>
              </div>
              <div>
                <dt>{marine.name}</dt>
                <dd>
                  {marine.address}
                  <br />
                  TEL <a href={telHref(marine.phone)}>{marine.phone}</a>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="w-footer__head">CONTACT</h3>
            <dl className="w-footer__list">
              <div>
                <dt>제휴 및 영업제안</dt>
                <dd>
                  <Todo>이메일</Todo>
                </dd>
              </div>
              <div>
                <dt>마케팅 제안</dt>
                <dd>
                  <Todo>이메일</Todo>
                </dd>
              </div>
              <div>
                <dt>CS 관련 문의</dt>
                <dd>
                  <Todo>이메일</Todo>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="w-footer__copy">
          Copyright ⓒ 2026 {BRAND.en}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
