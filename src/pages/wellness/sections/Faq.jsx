import { useState } from 'react'
import { Reveal } from '../ui'

const CUSTOMER_FAQS = [
  { q: '온열돔만 이용할 수도 있나요?', a: '네, 온열돔 단독 이용도 가능합니다. 정기적으로 방문하고 싶으신 분은 이용권 구성을 상담해 주세요. 원하는 부위의 아웃케어를 함께 선택할 수도 있습니다.' },
  { q: '아웃케어는 어떤 관리인가요?', a: '온열돔 이용 후 고민 부위를 한 번 더 세심하게 돌보는 집중관리입니다. 페이스 갈바닉, 바디 갈바닉, 웰스파를 부위와 프로그램에 맞춰 활용하며, 모든 코스에 세 기기가 모두 포함되는 것은 아닙니다.' },
  { q: '관리 시간과 가격은 어떻게 되나요?', a: '선택한 부위와 관리 구성에 따라 달라집니다. 총 소요시간, 비용, 온열돔 포함 여부를 예약 전에 안내해 드립니다.' },
  {
    q: '처음 방문하는데 어떤 관리를 받아야 할지 고민됩니다.',
    a: '상담 예약 시 불편하신 부위와 현재 컨디션을 말씀해 주시면, 첫 방문에 적합한 관리를 안내해 드립니다.',
  },
  {
    q: '온열돔 관리가 처음인데 괜찮을까요?',
    a: '누워서 휴식하시는 방식으로 진행하며, 관리 중에는 상태와 불편함을 확인합니다. 건강상 염려되는 부분이 있으시면 예약 시 미리 알려 주시기 바랍니다.',
  },
  {
    q: '예약 없이 방문할 수 있나요?',
    a: '100% 예약제로 운영하고 있습니다. 네이버 예약 또는 전화로 일정을 확정해 주시기 바랍니다. 첫 방문 혜택은 예약 시 함께 안내해 드립니다.',
  },
]

// 창업 FAQ: 확정되지 않은 조건은 단정하지 않고 상담 안내로 연결한다.
const STARTUP_FAQS = [
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

export default function Faq() {
  const [tab, setTab] = useState('customer')
  const current = TABS.find((t) => t.id === tab)

  return (
    <section id="faq" className="w-section">
      <div className="w-container w-faq">
        <Reveal as="p" className="w-eyebrow">
          FAQ
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          자주 묻는 질문
        </Reveal>

        <div className="w-faq__tabs" role="tablist" aria-label="질문 구분">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`faq-tab-${t.id}`}
              aria-selected={t.id === tab}
              aria-controls="faq-panel"
              className={t.id === tab ? 'is-active' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Reveal className="w-faq__list" role="tabpanel" id="faq-panel" aria-labelledby={`faq-tab-${tab}`}>
          {current.faqs.map((item) => (
            <details key={`${tab}-${item.q}`} className="w-faq__item" name="w-faq">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
