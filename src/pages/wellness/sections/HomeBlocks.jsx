import { useRef } from 'react'
import { PICS, PROGRAMS } from '../data'
import { InlineChip, ParenLink, Pic } from '../editorial'
import { useInView, useScrollParallax } from '../motion'
import { PAGES, pageHref } from '../pages'
import { openProgram, scrollToId } from '../scroll'
import './yw-home.css'

// 화면에 들어오면 마스크가 걷히듯 열리는 사진 틀(모션 줄이기에서는 처음부터 열려 있다)
function RevealFrame({ className = '', children, threshold = 0.25 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold })
  return (
    <div ref={ref} className={`yw-reveal${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

// 천천히 도는 원형 글자 배지. 누르면 상담 예약으로 간다.
const BADGE_TEXT = 'BEAUTY BEGINS WITH WELLNESS · BEAUTY BEGINS WITH WELLNESS · '
function SpinBadge() {
  return (
    <button type="button" className="yw-badge" onClick={() => scrollToId('booking')} aria-label="상담 예약">
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs>
          <path id="yw-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href="#yw-badge-circle" textLength="488">
            {BADGE_TEXT}
          </textPath>
        </text>
      </svg>
      <span className="yw-badge__mid" aria-hidden="true">
        상담
        <br />
        예약
      </span>
    </button>
  )
}

// 메인 전용 짧은 블록. 자세한 내용은 위쪽 메뉴의 페이지(pages.js)에 있고, 메인에서는 한눈에 보고 넘어가게만 한다.

// 브랜드 한 단락 + 매장 사진(숫자 나열 없이 글과 사진만)
export function HomeIntro() {
  return (
    <section className="yw-section yw-hintro" data-theme="light" aria-labelledby="hintro-title">
      <div className="yw-wrap yw-hintro__grid">
        <div className="yw-hintro__text">
          <h2 id="hintro-title" className="yw-h2 yw-hintro__title">
            온기로 <InlineChip pic={PICS.menuWarmup} /> 시작해,
            <br />
            손끝으로 <InlineChip pic={PICS.condScalp} /> 완성합니다.
          </h2>
          <p className="yw-hintro__lead">
            예뻐졌다 WELLNESS STUDIO는 예뻐졌다가 쉼을 더해 만든 자매 브랜드입니다. 국내산 원적외선 온열돔으로 몸을 따뜻하게
            데운 뒤, 두피·얼굴·바디를 1:1로 관리합니다.
          </p>
          <ParenLink href={pageHref(PAGES.brand)}>브랜드 소개 보기</ParenLink>
        </div>
        <div className="yw-hintro__visual">
          <RevealFrame className="yw-hintro__photo">
            <ParallaxPic pic={PICS.aboutNeck} sizes="(min-width: 64rem) 46vw, 92vw" />
          </RevealFrame>
          <SpinBadge />
        </div>
      </div>
    </section>
  )
}

// 스크롤에 따라 사진이 틀 안에서 살짝 다른 속도로 움직인다
function ParallaxPic(props) {
  const ref = useRef(null)
  useScrollParallax(ref, 36)
  return (
    <div ref={ref} className="yw-parallax">
      <Pic {...props} />
    </div>
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
          {PROGRAMS.map((p, i) => (
            <li key={p.id} style={{ '--d': `${(i % 4) * 90}ms` }}>
              <RevealFrame threshold={0.15}>
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
              </RevealFrame>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
