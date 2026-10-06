import { Reveal } from '../ui'

const FAQS = [
  {
    q: '처음 방문하는데 어떤 관리를 받아야 할지 고민됩니다.',
    a: '상담 예약 시 불편하신 부위와 현재 컨디션을 말씀해 주시면, 첫 방문에 적합한 관리를 안내해 드립니다.',
  },
  {
    q: '온열돔 관리가 처음인데 괜찮을까요?',
    a: '누워서 휴식하시는 방식으로 진행하며, 관리 중에는 실시간으로 상태를 확인합니다. 건강상 염려되는 부분이 있으시면 예약 시 미리 알려 주시기 바랍니다.',
  },
  {
    q: '예약 없이 방문할 수 있나요?',
    a: '100% 예약제로 운영하고 있습니다. 상담 예약 신청 또는 전화로 일정을 확정해 주시기 바랍니다. 첫 방문 혜택은 예약 시 함께 안내해 드립니다.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="w-section">
      <div className="w-container w-faq">
        <Reveal as="p" className="w-eyebrow">
          FAQ
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          자주 묻는 질문
        </Reveal>

        <Reveal className="w-faq__list">
          {FAQS.map((item) => (
            <details key={item.q} className="w-faq__item" name="w-faq">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
