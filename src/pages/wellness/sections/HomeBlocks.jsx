import { BRANCHES, BRAND_STORY, PICS, PROGRAMS } from '../data'
import { Folio, ParenLink, Pic } from '../editorial'
import { PAGES, pageHref } from '../pages'
import { scrollToId } from '../scroll'
import './yw-home.css'

// 메인 전용 짧은 블록. 자세한 내용은 하위 페이지(pages.js)에 있고, 여기서는 한눈에 보고 넘어가게만 한다.

// 짧은 브랜드 문구 + 브랜드 페이지로
export function HomeIntro() {
  return (
    <section className="yw-section yw-hintro" data-theme="light" aria-label="브랜드 소개">
      <div className="yw-wrap">
        <Folio ko="브랜드 소개" />
        <p className="yw-hintro__lead">{BRAND_STORY}</p>
        <ParenLink href={pageHref(PAGES.brand)} className="yw-hintro__more">
          브랜드 소개 보기
        </ParenLink>
      </div>
    </section>
  )
}

// 관리 프로그램 사진 카드. 카드를 누르면 관리 프로그램(가격표) 페이지로 간다.
export function HomePrograms() {
  return (
    <section id="programs" className="yw-section yw-hprog" data-theme="light" aria-labelledby="hprog-title">
      <div className="yw-wrap">
        <div className="yw-hprog__head">
          <div>
            <Folio ko="관리 프로그램" />
            <h2 id="hprog-title" className="yw-h2">
              첫 방문 관리 메뉴
            </h2>
          </div>
          <ParenLink href={pageHref(PAGES.program)}>관리 프로그램 보기</ParenLink>
        </div>
        <ul className="yw-hprog__list">
          {PROGRAMS.map((p) => (
            <li key={p.id}>
              <a className="yw-pcard" href={pageHref(PAGES.program)}>
                <Pic pic={PICS[p.pic]} sizes="(min-width: 64rem) 22vw, 46vw" />
                <span className="yw-pcard__group">{p.group}</span>
                <span className="yw-pcard__name">{p.label}</span>
                <span className="yw-pcard__time">{p.time}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// 낮은 상담 유도 띠(마지막 장)
export function HomeCta() {
  return (
    <section className="yw-hcta" data-theme="light" aria-labelledby="hcta-title">
      <div className="yw-wrap yw-hcta__in">
        <h2 id="hcta-title" className="yw-hcta__title">
          오늘을 돌보는,
          <br />
          <em>웰니스 스튜디오.</em>
        </h2>
        <div className="yw-hcta__actions">
          <button type="button" className="yw-btn yw-btn--ink" data-magnet data-cursor="" onClick={() => scrollToId('booking')}>
            <span>예약하기</span>
          </button>
          <ParenLink href={BRANCHES.zai.booking} external>
            네이버 예약
          </ParenLink>
          <ParenLink href={pageHref(PAGES.startup)}>창업·운영 상담</ParenLink>
        </div>
      </div>
    </section>
  )
}
