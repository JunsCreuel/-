import { BRAND, BRANCHES, reserveAction, telHref } from '../data'
import { Reveal } from '../ui'

const FAQS = [
  {
    q: '뭘 받아야 할지 모르겠어요.',
    a: '처음엔 다 막막하죠. 오늘 제일 불편한 데가 머리인지 얼굴인지 몸인지만 말씀해 주세요. 거기에 맞는 관리를 같이 골라 볼게요.',
  },
  {
    q: '온열돔, 처음인데 괜찮을까요?',
    a: '그냥 누워 계시면 돼요. 누워 계시는 동안에도 계속 상태를 보고 있고요. 불편하시면 바로 말씀해 주세요. 몸에 걱정되는 데가 있으면 예약할 때 미리 알려 주시고요.',
  },
  {
    q: '예약 안 하고 가도 돼요?',
    a: '저희는 예약하신 분만 받아요. 전화나 네이버로 시간 잡고 오시면 됩니다. 첫 방문 50%도 예약하실 때 같이 말씀드릴게요.',
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
            자주 물어보시는 것들
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

      <section id="booking" className="w-section w-section--green w-cta">
        <div className="w-container w-cta__inner">
          <Reveal as="p" className="w-eyebrow">
            {BRAND.tagline}
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            이번 주에 한 번,
            <br />
            쉬어 가세요.
          </Reveal>
          <Reveal as="p" delay={120} className="w-lead">
            첫 방문 50%는 한 분에 한 번이에요. 시간은 전화나 네이버로 잡아 주세요.
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
            {zai.hours} · 100% 예약제
          </Reveal>
        </div>
      </section>
    </>
  )
}
