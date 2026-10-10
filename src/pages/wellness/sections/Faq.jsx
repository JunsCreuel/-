import { Reveal } from '../ui'

const FAQS = [
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
