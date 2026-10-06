import { BRAND, BRANCHES, reserveAction, telHref } from '../data'
import { Reveal, Todo } from '../ui'

const FAQS = [
  {
    q: '처음인데, 어떤 관리를 받아야 할지 모르겠어요.',
    a: '요즘 고민되는 부위와 컨디션을 예약할 때 말씀해 주세요. 첫 방문에 맞는 관리를 안내해 드려요.',
  },
  {
    q: '온열돔은 처음인데 괜찮을까요?',
    a: '누워서 편안하게 쉬는 방식이에요. 관리 중에는 실시간으로 상태를 살피며 진행합니다. 걱정되는 점이 있다면 예약 시 미리 말씀해 주세요.',
    todo: '온열돔 이용 제한 안내(임산부·특정 질환 등) 필요 여부',
  },
  {
    q: '예약 없이 방문해도 되나요?',
    a: '100% 예약제로 운영돼요. 전화 또는 네이버 예약으로 미리 예약해 주세요. 첫 방문 이벤트도 예약할 때 함께 안내해 드려요.',
  },
]

export default function FaqCta() {
  const { zai } = BRANCHES
  const reserve = reserveAction(zai)

  return (
    <>
      <section id="faq" className="w-section">
        <div className="w-container w-faq">
          <Reveal as="p" className="w-eyebrow">
            FAQ
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            궁금한 점,
            <br />
            미리 답해 드릴게요
          </Reveal>

          <Reveal className="w-faq__list">
            {FAQS.map((item) => (
              <details key={item.q} className="w-faq__item" name="w-faq">
                <summary>{item.q}</summary>
                <p>
                  {item.a} {item.todo && <Todo>{item.todo}</Todo>}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="booking" className="w-section w-section--green w-cta">
        <div className="w-container w-cta__inner">
          <Reveal as="p" className="w-eyebrow">
            {BRAND.tagline}
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            건강한 오늘이,
            <br />
            더 밝은 내일을 만듭니다.
          </Reveal>
          <Reveal as="p" delay={120} className="w-lead">
            첫 방문 50% 혜택, 지금 예약하고 시작해 보세요.
          </Reveal>
          <Reveal delay={180} className="w-cta__actions">
            <a className="w-btn w-btn--light" href={reserve.href} target="_blank" rel="noopener noreferrer">
              네이버로 예약하기
            </a>
            <a className="w-btn w-btn--ghost" href={telHref(zai.phone)}>
              전화 {zai.phone}
            </a>
          </Reveal>
          <Reveal as="p" delay={220} className="w-cta__note">
            100% 예약제 · 첫 방문 1인 1회 한정
          </Reveal>
        </div>
      </section>
    </>
  )
}
