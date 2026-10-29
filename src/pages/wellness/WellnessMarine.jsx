import { Link } from 'react-router-dom'
import { BRANCHES, telHref } from './data'
import Consult from './sections/Consult'
import Visit from './sections/Visit'
import { scrollToId } from './scroll'
import { W_ACTIONS, W_BAND, W_BTN_PRIMARY, W_CONTAINER, W_EYEBROW, W_LEAD, W_LINK, W_TITLE } from './tw'
import { Reveal, Todo } from './ui'

// 마린시티점은 확정된 정보가 주소·전화뿐이라, 나머지는 자리표시로 두고 별도 페이지로 안내한다.
export default function WellnessMarine() {
  const branch = BRANCHES.marine

  return (
    <>
      <section id="intro" className="relative overflow-hidden bg-white px-(--w-gutter) pt-[clamp(3rem,9vw,6rem)] pb-[clamp(3rem,9vw,5rem)]">
        <div className={`${W_CONTAINER} [transform:translate3d(calc(var(--hx,0)_*_3px),calc(var(--hy,0)_*_2px),0)] will-change-transform motion-reduce:[transform:none] min-[900px]:max-w-[40rem]`}>
          <Reveal as="p" className={W_EYEBROW}>
            WELLNESS STUDIO
          </Reveal>
          <Reveal as="h1" delay={80} className="mt-[1.4rem] text-[clamp(2rem,5.6vw,3.1rem)] leading-[1.36] text-balance">
            마린시티점
          </Reveal>
          <Reveal as="p" delay={160} className="mt-4 max-w-[34rem] text-[clamp(1rem,2.6vw,1.08rem)] leading-[1.95] text-pretty text-muted">
            WELLNESS STUDIO의 자매 지점입니다.
          </Reveal>
          <Reveal as="p" delay={200} className="mt-[1.1rem] text-[0.88rem] tracking-[0.02em] text-muted">
            {branch.address}
          </Reveal>
          <Reveal delay={260} className={W_ACTIONS}>
            <button type="button" className={W_BTN_PRIMARY} onClick={() => scrollToId('booking')}>
              상담 예약하기
            </button>
            <Link className={W_LINK} to={BRANCHES.zai.path}>
              용호 자이점 보기 →
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="programs" className={W_BAND}>
        <div className={W_CONTAINER}>
          <Reveal as="p" className={W_EYEBROW}>
            Program
          </Reveal>
          <Reveal as="h2" delay={80} className={W_TITLE}>
            마린시티점 프로그램
          </Reveal>
          <Reveal as="p" delay={120} className={W_LEAD}>
            <Todo>프로그램: 자이점과 동일 여부 / 지점 고유 관리</Todo>
            <br />
            <Todo>사진</Todo> <Todo>첫 방문 이벤트 적용 여부</Todo>
          </Reveal>
          <Reveal delay={160} className={W_ACTIONS}>
            <a className={W_BTN_PRIMARY} href={telHref(branch.phone)}>
              문의 전화 {branch.phone}
            </a>
            <Link className={W_LINK} to={BRANCHES.zai.path}>
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
