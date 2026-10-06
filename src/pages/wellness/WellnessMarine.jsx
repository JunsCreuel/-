import { Link } from 'react-router-dom'
import { BRANCHES, telHref } from './data'
import Consult from './sections/Consult'
import Visit from './sections/Visit'
import { scrollToId } from './scroll'
import { Reveal, Todo } from './ui'
import './wellness-sections.css'

// 마린시티점은 확정된 정보가 주소·전화뿐이라, 나머지는 자리표시로 두고 별도 페이지로 안내한다.
export default function WellnessMarine() {
  const branch = BRANCHES.marine

  return (
    <>
      <section id="intro" className="w-hero w-hero--simple">
        <div className="w-container w-hero__text">
          <Reveal as="p" className="w-eyebrow">
            WELLNESS STUDIO
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            마린시티점
          </Reveal>
          <Reveal as="p" delay={160} className="w-hero__sub">
            WELLNESS STUDIO의 자매 지점입니다.
          </Reveal>
          <Reveal as="p" delay={200} className="w-hero__place">
            {branch.address}
          </Reveal>
          <Reveal delay={260} className="w-hero__actions">
            <button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>
              상담 예약하기
            </button>
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
            마린시티점 프로그램
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

      <Consult branch={branch} />
      <Visit branch={branch} />
    </>
  )
}
