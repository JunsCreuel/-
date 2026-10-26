import { PARENT_STORE_COUNT, PICS, PROGRAMS } from '../data'
import { ParenLink, Pic } from '../editorial'
import { PAGES, pageHref } from '../pages'
import { openProgram } from '../scroll'
import './yw-home.css'

// 메인 전용 짧은 블록. 자세한 내용은 위쪽 메뉴의 페이지(pages.js)에 있고, 메인에서는 한눈에 보고 넘어가게만 한다.

// 브랜드 한 단락 + 숫자 세 개 + 매장 사진
export function HomeIntro() {
  return (
    <section className="yw-section yw-hintro" data-theme="light" aria-labelledby="hintro-title">
      <div className="yw-wrap yw-hintro__grid">
        <div className="yw-hintro__text">
          <h2 id="hintro-title" className="yw-h2">
            온기로 시작해,
            <br />
            손끝으로 완성합니다.
          </h2>
          <p className="yw-hintro__lead">
            예뻐졌다 WELLNESS STUDIO는 예뻐졌다가 쉼을 더해 만든 자매 브랜드입니다. 국내산 원적외선 온열돔으로 몸을 따뜻하게
            데운 뒤, 두피·얼굴·바디를 1:1로 관리합니다.
          </p>
          <dl className="yw-hintro__nums">
            <div>
              <dt>{PARENT_STORE_COUNT}+</dt>
              <dd>본 브랜드 예뻐졌다 매장</dd>
            </div>
            <div>
              <dt>1:1</dt>
              <dd>100% 예약제 관리</dd>
            </div>
            <div>
              <dt>
                40<small>분</small>
              </dt>
              <dd>온열돔 전신 웜업</dd>
            </div>
          </dl>
          <ParenLink href={pageHref(PAGES.brand)}>브랜드 소개 보기</ParenLink>
        </div>
        <figure className="yw-hintro__photo">
          <Pic pic={PICS.aboutNeck} sizes="(min-width: 64rem) 46vw, 92vw" />
        </figure>
      </div>
    </section>
  )
}

// 관리 프로그램 사진 카드. 누르면 관리 프로그램 페이지에서 그 관리를 펼쳐 보여 준다(새 탭은 페이지 맨 위).
export function HomePrograms() {
  return (
    <section id="programs" className="yw-section yw-hprog" data-theme="light" aria-labelledby="hprog-title">
      <div className="yw-wrap">
        <div className="yw-hprog__head">
          <h2 id="hprog-title" className="yw-h2">
            첫 방문 관리 메뉴
          </h2>
          <ParenLink href={pageHref(PAGES.program)}>관리 프로그램 전체 보기</ParenLink>
        </div>
        <ul className="yw-hprog__list">
          {PROGRAMS.map((p) => (
            <li key={p.id}>
              <a
                className="yw-pcard"
                href={pageHref(PAGES.program)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                  e.preventDefault()
                  openProgram(p.id)
                }}
              >
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

// 큰 영문 띠(매장 사인 문구). 천천히 흐르고, 모션 줄이기에서는 멈춰 있다. 장식이라 보조기기에는 한 번만 읽힌다.
const LINE = 'Beauty Begins with Wellness'
export function HomeMarquee() {
  return (
    <section className="yw-hmarq" data-theme="light" aria-label={LINE}>
      <div className="yw-hmarq__track" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>{LINE}</span>
        ))}
      </div>
    </section>
  )
}
