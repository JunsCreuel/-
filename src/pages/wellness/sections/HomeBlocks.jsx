import { useRef } from 'react'
import { PICS, PROGRAMS } from '../data'
import { ParenLink, Pic } from '../editorial'
import { useInView } from '../motion'
import { PAGES, pageHref } from '../pages'
import { openProgram } from '../scroll'
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

// 메인 전용 짧은 블록. 자세한 내용은 위쪽 메뉴의 페이지(pages.js)에 있고, 메인에서는 한눈에 보고 넘어가게만 한다.

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
