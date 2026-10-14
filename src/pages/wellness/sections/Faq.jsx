import { useRef, useState } from 'react'
import { OFFER_TERM, PARENT_STORE_COUNT, PICS, SALE_COUNT, SHOW_OFFER, STARTUP_COSTS, STARTUP_COSTS_NOTE } from '../data'
import { Folio, Pic } from '../editorial'
import { prefersReducedMotion } from '../motion'
import { Reveal } from '../ui'
import './yw-faq.css'

const CUSTOMER_FAQS = [
  { q: '온열돔만 이용할 수도 있나요?', a: '네, 온열돔 단독 이용도 가능합니다. 정기적으로 방문하고 싶으신 분은 이용권 구성을 상담해 주세요. 원하는 부위의 아웃케어를 함께 선택할 수도 있습니다.' },
  { q: '아웃케어는 어떤 관리인가요?', a: '온열돔 이용 후 고민 부위를 한 번 더 세심하게 돌보는 집중관리입니다. 페이스 갈바닉, 바디 갈바닉, 웰스파를 부위와 프로그램에 맞춰 활용하며, 모든 코스에 세 기기가 모두 포함되는 것은 아닙니다.' },
  { q: '관리 시간과 가격은 어떻게 되나요?', a: '프로그램별 소요시간과 가격은 프로그램 메뉴에서 확인하실 수 있습니다. 관리 구성에 따라 달라질 수 있어 총 소요시간, 비용, 온열돔 포함 여부를 예약 전에 다시 안내해 드립니다.' },
  {
    q: '처음 방문하는데 어떤 관리를 받아야 할지 고민됩니다.',
    a: '상담 예약 시 불편하신 부위와 현재 컨디션을 말씀해 주시면, 첫 방문에 적합한 관리를 안내해 드립니다.',
  },
  {
    q: '온열돔 관리가 처음인데 괜찮을까요?',
    a: '누워서 휴식하시는 방식으로 진행하며, 관리 중에는 상태와 불편함을 확인합니다. 건강상 염려되는 부분이 있으시면 예약 시 미리 알려 주시기 바랍니다.',
  },
  {
    q: '남성도 관리받을 수 있나요?',
    a: '네, 남녀 모두 이용하실 수 있습니다. 1:1 예약제로 운영해 편안하게 관리받으실 수 있습니다.',
  },
  {
    q: '예약 없이 방문할 수 있나요?',
    // 첫 방문 50%는 상시 할인이 아니라 조건부라 범위(SALE_COUNT)와 조건(OFFER_TERM, 첫 방문 티켓 예약)을 함께 쓴다.
    // 이벤트를 내리면(SHOW_OFFER=false) 이 문장도 함께 빠진다.
    a: `100% 예약제로 운영하고 있습니다. 네이버 예약 또는 전화로 일정을 확정해 주시기 바랍니다.${
      SHOW_OFFER ? ` 첫 방문 혜택(${SALE_COUNT}개 관리 50%)은 ${OFFER_TERM}이며, 첫 방문 티켓으로 예약하실 때 적용됩니다.` : ''
    }`,
  },
]

// 창업 FAQ: 확정되지 않은 조건은 단정하지 않고 상담 안내로 연결한다. 금액은 확정된 것(STARTUP_COSTS)만 쓴다.
const ROYALTY = STARTUP_COSTS.find((c) => c.id === 'royalty')

const STARTUP_FAQS = [
  {
    q: '예뻐졌다와 예뻐졌다 웰니스 스튜디오는 어떤 관계인가요?',
    a: `예뻐졌다 웰니스 스튜디오는 매장이 ${PARENT_STORE_COUNT}개 이상인 예뻐졌다의 파생 브랜드입니다. 그래서 웰니스 스튜디오 창업은 처음 창업하시는 것과 똑같이 신규 창업으로 진행됩니다.`,
  },
  ...(ROYALTY
    ? [
        {
          q: '로열티는 얼마인가요?',
          a: `로열티는 ${ROYALTY.amount}${ROYALTY.note ? `(${ROYALTY.note})` : ''}입니다. ${STARTUP_COSTS_NOTE}`,
        },
      ]
    : []),
  {
    q: '창업 상담은 어떻게 신청하나요?',
    a: '전화로 상담을 신청해 주세요. 희망 지역, 준비 단계, 궁금한 내용을 알려 주시면 상담 가능한 범위를 안내해 드립니다.',
  },
  {
    q: '창업 준비 과정은 어떻게 진행되나요?',
    a: '준비 과정과 일정은 희망 지역과 준비 단계를 확인한 뒤 상담에서 안내해 드립니다.',
  },
  {
    q: '제품 및 장비 관련 상담도 가능한가요?',
    a: '온열돔과 디바이스 구성에 관한 문의는 상담 시 안내해 드립니다. 구체적인 구성과 조건은 상담에서 확인해 주시기 바랍니다.',
  },
]

const TABS = [
  { id: 'customer', label: '고객 FAQ', faqs: CUSTOMER_FAQS },
  { id: 'startup', label: '창업 FAQ', faqs: STARTUP_FAQS },
]

// 질문을 열 때 답이 높이 0에서 부드럽게 펼쳐진다(Web Animations API). 닫힘과 모션 줄이기는 즉시.
function onItemToggle(e) {
  const item = e.currentTarget
  if (!item.open || prefersReducedMotion()) return
  const ans = item.querySelector('.yw-faq__a')
  if (!ans?.animate) return
  ans.animate([{ height: '0px', opacity: 0 }, { height: `${ans.scrollHeight}px`, opacity: 1 }], {
    duration: 320,
    easing: 'cubic-bezier(.2,.7,.2,1)',
  })
}

// 09 Q&A — 왼쪽에 고정된 제목·탭·아치 사진, 오른쪽에 큰 질문 목록. 한 번에 하나만 열린다(details name).
export default function Faq() {
  const [tab, setTab] = useState('customer')
  // 탭을 한 번이라도 바꾼 뒤에만 질문이 순서대로 올라온다(첫 화면에서는 그대로 둔다).
  const [switched, setSwitched] = useState(false)
  const tabRefs = useRef([])
  const current = TABS.find((t) => t.id === tab)

  function select(id) {
    if (id === tab) return
    setTab(id)
    setSwitched(true)
  }

  // ←→(그리고 Home·End)로 탭을 옮기면서 바로 고른다. 포커스는 고른 탭 하나에만 머문다(roving tabindex).
  function onTabKey(e) {
    const i = TABS.findIndex((t) => t.id === tab)
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next < 0) return
    e.preventDefault()
    select(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="faq" className="yw-section yw-curtain--light yw-faq" data-theme="light">
      <div className="yw-wrap yw-faq__grid">
        <div className="yw-faq__side">
          <Folio no="08" en="Q&A" />
          <h2 className="yw-display yw-faq__title">FAQ</h2>

          <div className="yw-faq__tabs" role="tablist" aria-label="질문 구분" onKeyDown={onTabKey}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`faq-tab-${t.id}`}
                aria-selected={t.id === tab}
                aria-controls="faq-panel"
                tabIndex={t.id === tab ? 0 : -1}
                className={`yw-faq__tab${t.id === tab ? ' is-active' : ''}`}
                onClick={() => select(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Reveal variant="wipe" className="yw-faq__photo">
            <Pic pic={PICS.faqArch} sizes="20rem" />
          </Reveal>
        </div>

        <div
          key={tab}
          className={`yw-faq__list${switched ? ' is-switched' : ''}`}
          role="tabpanel"
          id="faq-panel"
          aria-labelledby={`faq-tab-${tab}`}
        >
          {current.faqs.map((item, i) => (
            <details
              key={item.q}
              name="w-faq"
              className="yw-faq__item"
              style={{ '--i': i }}
              // 고객 탭의 첫 질문만 처음부터 열어 둔다. 목록은 탭마다 새로 그려지므로 이 값은 마운트 때만 쓰인다.
              open={tab === 'customer' && i === 0}
              onToggle={onItemToggle}
            >
              <summary>
                <span className="yw-faq__q">{item.q}</span>
                <i className="yw-faq__icon" aria-hidden="true" />
              </summary>
              <div className="yw-faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
