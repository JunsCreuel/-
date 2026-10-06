import { useT } from '../content-context'
import { BRANCHES, reserveAction } from '../data'
import T from '../T'
import { Reveal } from '../ui'

// 가격은 사이트 어디에도 표기하지 않는다. 관리 이름과 할인 비율만 보여 준다.
// 이벤트는 올해 안까지 운영할 예정이고 종료일은 화면에 적지 않는다. 종료 시 이 섹션을 내리거나 문구를 바꾼다.
const TREATMENTS = ['두피 관리', '얼굴 관리', '전신웜업케어', '바디 케어', '림프 케어']

export default function Offer() {
  const reserve = reserveAction(BRANCHES.zai)
  const t = useT()

  return (
    <section id="offer" className="w-section w-section--green w-offer">
      <div className="w-container w-offer__inner">
        <Reveal as="p" className="w-eyebrow">
          <T k="offer.eyebrow" single>
            이사 기념
          </T>
        </Reveal>
        <Reveal className="w-offer__big" role="img" aria-label={`첫 방문 ${t('offer.num', '50')}%`}>
          <span aria-hidden="true">
            <T k="offer.label" single>
              첫 방문
            </T>
          </span>
          <strong aria-hidden="true">
            <T k="offer.num" single>
              50
            </T>
            <small>%</small>
          </strong>
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          <T k="offer.title">{'처음 오시는 날,\n반값으로 와 보세요.'}</T>
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          <T k="offer.lead">
            {'자리를 넓혀 옮긴 기념으로 처음 오시는 분께 인사를 드려요.\n전단지가 없어도 첫 방문이면 똑같이 해 드려요. 한 분에 한 번이에요.'}
          </T>
        </Reveal>

        <Reveal delay={160} className="w-offer__targets">
          <p className="w-offer__label">
            <T k="offer.targetsLabel" single>
              모든 관리가 대상이에요
            </T>
          </p>
          <ul className="w-offer__list">
            {TREATMENTS.map((name, i) => (
              <li key={name}>
                <T k={`offer.target.${i}`} single>
                  {name}
                </T>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="p" delay={200} className="w-offer__cond">
          <T k="offer.cond" single>
            한 분당 1회 · 100% 예약제
          </T>
        </Reveal>

        <Reveal delay={240} className="w-offer__cta">
          <a className="w-btn w-btn--light" href={reserve.href} target="_blank" rel="noopener noreferrer">
            <T k="offer.cta" single>
              첫 방문 50% 예약하기
            </T>
          </a>
          <p>
            <T k="offer.note">관리별 자세한 안내는 예약하실 때 말씀드릴게요.</T>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
