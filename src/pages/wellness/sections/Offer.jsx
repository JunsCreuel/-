import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

// 가격은 사이트 어디에도 표기하지 않는다. 관리 이름과 할인 비율만 보여 준다.
// 이벤트는 올해 안까지 운영할 예정이고 종료일은 화면에 적지 않는다. 종료 시 이 섹션을 내리거나 문구를 바꾼다.
const TREATMENTS = ['두피-얼굴 관리', '전신웜업케어', '바디 케어', '림프 케어']

export default function Offer() {
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
          첫 방문 고객 혜택
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          확장 이전 오픈을 기념하여 첫 방문 고객께 모든 관리를 50% 혜택으로 제공합니다.
          <br />
          전단지 지참과 관계없이 적용되며, 고객 1인당 1회에 한합니다.
        </Reveal>

        <Reveal delay={160} className="w-offer__targets">
          <p className="w-offer__label">대상 관리 · 전 관리</p>
          <ul className="w-offer__list">
            {TREATMENTS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="p" delay={200} className="w-offer__cond">
          고객 1인 1회 · 100% 예약제
        </Reveal>

        <Reveal delay={240} className="w-offer__cta">
          <button type="button" className="w-btn w-btn--light" onClick={() => scrollToId('booking')}>
            상담 예약하기
          </button>
          <p>관리별 상세 안내는 상담 예약 시 안내해 드립니다.</p>
        </Reveal>
      </div>
    </section>
  )
}
