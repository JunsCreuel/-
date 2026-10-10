import { REVIEWS } from '../data'
import ReviewCarousel from '../ReviewCarousel'
import { Reveal } from '../ui'

export default function Proof() {
  return (
    <section id="reviews" className="w-section">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          Review
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          고객 후기
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          네이버 리뷰에 남겨 주신 고객 후기입니다.
        </Reveal>
      </div>
      <ReviewCarousel reviews={REVIEWS} />
    </section>
  )
}
