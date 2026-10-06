import { Link } from 'react-router-dom'
import { BRANCHES, reserveAction, telHref } from './data'
import Visit from './sections/Visit'
import T from './T'
import { Reveal, Todo } from './ui'
import './wellness-sections.css'

// 마린시티점은 확정된 정보가 주소·전화뿐이라, 나머지는 자리표시로 두고 별도 페이지로 안내한다.
export default function WellnessMarine() {
  const branch = BRANCHES.marine
  const reserve = reserveAction(branch)

  return (
    <>
      <section id="intro" className="w-hero w-hero--simple">
        <div className="w-container w-hero__text">
          <Reveal as="p" className="w-eyebrow">
            <T k="marine.eyebrow" single>
              예뻐졌다 웰니스스튜디오
            </T>
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            <T k="marine.title" single>
              마린시티점
            </T>
          </Reveal>
          <Reveal as="p" delay={160} className="w-hero__sub">
            <T k="marine.sub">{'해운대 마린시티에도 저희 가게가 하나 더 있어요.\n그쪽이 가까우시면 이쪽으로 오세요.'}</T>
          </Reveal>
          <Reveal as="p" delay={200} className="w-hero__place">
            {branch.address}
          </Reveal>
          <Reveal delay={260} className="w-hero__actions">
            <a className="w-btn w-btn--primary" href={reserve.href}>
              전화로 예약하기 {branch.phone}
            </a>
            <Link className="w-link" to={BRANCHES.zai.path}>
              용호 자이점 보기 →
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="programs" className="w-section w-section--band">
        <div className="w-container">
          <Reveal as="p" className="w-eyebrow">
            Program
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            <T k="marine.programs.title" single>
              마린시티점 프로그램
            </T>
          </Reveal>
          <Reveal as="p" delay={120} className="w-lead">
            <Todo>프로그램: 자이점과 동일 여부 / 지점 고유 관리</Todo>
            <br />
            <Todo>사진</Todo> <Todo>첫 방문 이벤트 적용 여부</Todo>
          </Reveal>
          <Reveal delay={160} className="w-hero__actions">
            <a className="w-btn w-btn--primary" href={telHref(branch.phone)}>
              문의 전화 {branch.phone}
            </a>
            <Link className="w-link" to={BRANCHES.zai.path}>
              자이점 프로그램 먼저 보기 →
            </Link>
          </Reveal>
        </div>
      </section>

      <Visit branch={branch} />
    </>
  )
}
