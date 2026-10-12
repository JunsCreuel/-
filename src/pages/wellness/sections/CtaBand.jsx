import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

// 페이지 맨 아래 마지막 CTA
export default function CtaBand() {
  return (
    <section className="w-section w-cta">
      <div className="w-container w-cta__inner">
        <Reveal as="h2" className="w-cta__title">
          오늘보다 더 예쁜,
          <br />
          <em>내일의 나.</em>
        </Reveal>
        <Reveal delay={100} className="w-cta__actions">
          <button type="button" className="w-btn w-btn--primary w-btn--arrow" onClick={() => scrollToId('booking')}>
            예약하기
          </button>
          <button type="button" className="w-btn" onClick={() => scrollToId('startup')}>
            창업·운영 상담
          </button>
        </Reveal>
      </div>
    </section>
  )
}
