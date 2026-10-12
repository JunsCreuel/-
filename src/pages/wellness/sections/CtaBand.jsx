import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

// 페이지 맨 아래 마지막 CTA: 고객 상담과 창업·운영 상담을 나란히 둔다.
export default function CtaBand() {
  return (
    <section className="w-cta">
      <div className="w-container w-cta__inner">
        <Reveal as="h2" className="w-cta__title">
          온몸을 따뜻하게,
          <br />
          고민 부위는 더 세심하게.
        </Reveal>
        <Reveal delay={100} className="w-cta__actions">
          <button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>
            내게 맞는 관리 상담
          </button>
          <button type="button" className="w-btn" onClick={() => scrollToId('startup')}>
            창업·운영 상담
          </button>
        </Reveal>
      </div>
    </section>
  )
}
