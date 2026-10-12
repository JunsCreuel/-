import { REVIEWS } from '../data'
import ReviewCarousel from '../ReviewCarousel'
import { Reveal } from '../ui'

export default function Proof() {
  return (
    <section id="reviews" className="w-section">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Customer review
        </Reveal>
        <Reveal as="h2" delay={80} className="w-display">
          Review
          <span className="w-display__sub">다녀가신 분들의 이야기</span>
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          관리를 받고 직접 남겨 주신 네이버 리뷰입니다.
        </Reveal>
      </div>
      <ReviewCarousel reviews={REVIEWS} />
      <div className="w-container">
        <p className="w-method__note">고객이 직접 작성한 후기를 그대로 옮겼습니다. 체감은 개인에 따라 다를 수 있습니다.</p>
      </div>
    </section>
  )
}
