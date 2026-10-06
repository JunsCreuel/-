import { BRANCHES, reserveAction } from '../data'
import { Reveal } from '../ui'

// 가격은 사이트 어디에도 표기하지 않는다. 관리 이름과 할인 비율만 보여 준다.
// 이벤트는 올해 안까지 운영할 예정이고 종료일은 화면에 적지 않는다. 종료 시 이 섹션을 내리거나 문구를 바꾼다.
const TREATMENTS = ['두피 관리', '얼굴 관리', '전신웜업케어', '바디 케어', '림프 케어']

export default function Offer() {
  const reserve = reserveAction(BRANCHES.zai)

  return (
    <section id="offer" className="w-section w-section--green w-offer">
      <div className="w-container w-offer__inner">
        <Reveal as="p" className="w-eyebrow">
          이사 기념
        </Reveal>
        <Reveal className="w-offer__big" role="img" aria-label="첫 방문 50%">
          <span aria-hidden="true">첫 방문</span>
          <strong aria-hidden="true">
            50<small>%</small>
          </strong>
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          처음 오시는 날,
          <br />
          반값으로 와 보세요.
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          자리를 넓혀 옮긴 기념으로 처음 오시는 분께 인사를 드려요.
          <br />
          전단지가 없어도 첫 방문이면 똑같이 해 드려요. 한 분에 한 번이에요.
        </Reveal>

        <Reveal delay={160} className="w-offer__targets">
          <p className="w-offer__label">모든 관리가 대상이에요</p>
          <ul className="w-offer__list">
            {TREATMENTS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="p" delay={200} className="w-offer__cond">
          한 분당 1회 · 100% 예약제
        </Reveal>

        <Reveal delay={240} className="w-offer__cta">
          <a className="w-btn w-btn--light" href={reserve.href} target="_blank" rel="noopener noreferrer">
            첫 방문 50% 예약하기
          </a>
          <p>관리별 자세한 안내는 예약하실 때 말씀드릴게요.</p>
        </Reveal>
      </div>
    </section>
  )
}
