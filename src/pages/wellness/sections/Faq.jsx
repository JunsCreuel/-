import { Eyebrow, Reveal } from '../ui'

const FAQS = [
  {
    q: '처음 방문하는데 어떤 관리를 받아야 할지 고민됩니다.',
    a: '예약하실 때 불편한 부위와 요즘 컨디션을 말씀해 주세요. 첫 방문에 잘 맞는 관리를 함께 골라 드립니다.',
  },
  {
    q: '온열돔 관리가 처음인데 괜찮을까요?',
    a: '편하게 누워서 쉬는 방식이라 처음이어도 부담 없이 이용하실 수 있습니다. 이용 중에는 계속 상태를 확인하며, 건강상 염려되는 부분이 있다면 예약 시 미리 알려 주세요.',
  },
  {
    q: '남성도 관리받을 수 있나요?',
    a: '네, 남녀 모두 이용하실 수 있습니다. 1:1 예약제로 운영해 편안하게 관리받으실 수 있습니다.',
  },
  {
    q: '예약 없이 방문할 수 있나요?',
    a: '100% 예약제로 운영합니다. 네이버 예약이나 전화로 일정을 먼저 잡아 주세요. 첫 방문 혜택은 예약할 때 함께 안내해 드립니다.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="ws-faq" aria-labelledby="ws-faq-title">
      <div className="ws-container ws-faq__inner">
        <Reveal className="ws-faq__head">
          <Eyebrow>궁금한 점</Eyebrow>
          <h2 id="ws-faq-title" className="ws-faq__title">
            자주 묻는 질문
          </h2>
        </Reveal>
        <Reveal className="ws-faq__list">
          {FAQS.map((item, i) => (
            <details key={item.q} name="ws-faq" open={i === 0}>
              <summary>
                {item.q}
                <span aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
