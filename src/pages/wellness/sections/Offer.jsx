import { PROGRAM_GROUPS } from '../data'
import { scrollToId } from '../scroll'
import { Eyebrow, Reveal } from '../ui'
import { Arrow } from './Hero'

// 할인 적용 관리는 네이버 예약에 할인가(sale)가 있는 메뉴에서 자동으로 뽑는다.
const ON_SALE = PROGRAM_GROUPS.flatMap((g) => g.items).filter((p) => p.sale)

export default function Offer() {
  return (
    <section id="offer" className="ws-offer">
      <div className="ws-container">
        <Eyebrow className="ws-eyebrow--light">확장 이전 오픈 기념 이벤트</Eyebrow>
        <Reveal className="ws-offer__big" role="img" aria-label="첫 방문 혜택 50%">
          <span aria-hidden="true">첫 방문 혜택</span>
          <strong aria-hidden="true">
            50<small>%</small>
          </strong>
        </Reveal>
        <div className="ws-offer__grid">
          <Reveal>
            <h2 className="ws-offer__title">새로워진 예뻐졌다, 첫 방문은 반값으로</h2>
            <p className="ws-offer__text">
              용호점 확장 이전을 기념해 첫 방문 고객께 관리 요금을 50% 할인해 드립니다. 전단지가 없어도 적용되며 고객 1인 1회에
              한합니다.
            </p>
          </Reveal>
          <Reveal delay={100} className="ws-offer__side">
            <p className="ws-offer__label">할인 적용 관리</p>
            <ul className="ws-offer__list">
              {ON_SALE.map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
            <div className="ws-actions">
              <button type="button" className="ws-btn ws-btn--light" onClick={() => scrollToId('booking')}>
                지금 예약하기
                <Arrow />
              </button>
              <p className="ws-offer__cond">고객 1인 1회 · 100% 예약제</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
