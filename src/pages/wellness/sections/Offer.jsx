import { BRANCHES, reserveAction } from '../data'
import { Reveal, Todo } from '../ui'

// 가격은 사이트 어디에도 표기하지 않는다. 관리 이름과 할인 비율만 보여 준다.
const TREATMENTS = ['등관리', '복부관리', '하체관리', '전신 후면 관리', '림프절관리', '풀 바디 웜업 + 아로마테라피']

export default function Offer() {
  const reserve = reserveAction(BRANCHES.zai)

  return (
    <section id="offer" className="w-section w-section--green w-offer">
      <div className="w-container w-offer__inner">
        <Reveal as="p" className="w-eyebrow">
          확장 이전 오픈 기념
        </Reveal>
        <Reveal className="w-offer__big" role="img" aria-label="첫 방문 50%">
          <span aria-hidden="true">첫 방문</span>
          <strong aria-hidden="true">
            50<small>%</small>
          </strong>
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          처음 오시는 분께,
          <br />
          가장 따뜻한 첫인사
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          새 공간으로 옮겨 온 기념으로
          <br />
          첫 방문 고객께 관리 50% 혜택을 드려요.
        </Reveal>

        <Reveal delay={160} className="w-offer__targets">
          <p className="w-offer__label">대상 관리</p>
          <ul className="w-offer__list">
            {TREATMENTS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <Todo>대상 관리 범위</Todo>
        </Reveal>

        <Reveal as="p" delay={200} className="w-offer__cond">
          첫 방문 1인 1회 한정 · 100% 예약제 <Todo>전단지 지참 조건 · 이벤트 종료일</Todo>
        </Reveal>

        <Reveal delay={240} className="w-offer__cta">
          <a className="w-btn w-btn--light" href={reserve.href} target="_blank" rel="noopener noreferrer">
            첫 방문 50% 예약하기
          </a>
          <p>관리별 상세 안내는 예약 시 친절히 알려 드려요.</p>
        </Reveal>
      </div>
    </section>
  )
}
