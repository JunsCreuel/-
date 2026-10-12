import { PROGRAMS, SHOW_PRICES } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

// 첫 방문 50% 할인은 정가 옆에 할인가가 있는 프로그램에만 적용된다(전신 후면 관리, 풀 바디 웜업케어는 제외).
// 이벤트는 올해 안까지 운영할 예정이고 종료일은 화면에 적지 않는다. 종료 시 이 섹션을 내리거나 문구를 바꾼다.
const TREATMENTS = PROGRAMS.filter((p) => p.sale).map((p) => p.title)

export default function Offer() {
  return (
    <section id="offer" className="w-section w-section--ink w-offer">
      <div className="w-container w-offer__inner">
        <Reveal as="p" className="w-eyebrow">
          확장 이전 오픈 기념 이벤트
        </Reveal>
        <Reveal className="w-offer__big" role="img" aria-label="첫 방문 혜택 50%">
          <span aria-hidden="true">첫 방문 혜택</span>
          <strong aria-hidden="true">
            50<small>%</small>
          </strong>
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          새로워진 예뻐졌다, 첫 방문은 반값으로
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          용호점 확장 이전을 기념해 첫 방문 고객께 관리{SHOW_PRICES ? ' 요금' : ''}을 50% 할인해 드립니다.
          <br />
          전단지가 없어도 적용되며 고객 1인 1회에 한합니다.
        </Reveal>

        <Reveal delay={160} className="w-offer__targets">
          <p className="w-offer__label">할인 적용 관리</p>
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
            지금 예약하기
          </button>
        </Reveal>
      </div>
    </section>
  )
}
