import { REVIEWS } from '../data'
import { Folio, Footnote } from '../editorial'
import ReviewCarousel from '../ReviewCarousel'

// 07 Voices — 실제 매장 사진을 앞세운 후기. 머리는 폴리오와 큰 'Review' 한 단어, 오른쪽에 출처 배지.
// 후기 원문(REVIEWS.text)은 고치지 않고 그대로 보여 준다.
export default function Proof() {
  return (
    <section id="reviews" className="yw-section yw-voices" data-theme="light">
      <div className="yw-wrap yw-voices__head">
        <div>
          <Folio no="06" en="Voices" />
          <h2 className="yw-display yw-voices__title">Review</h2>
        </div>
        <p className="yw-voices__badge">
          <i aria-hidden="true">N</i>
          네이버 리뷰 · 방문 고객
        </p>
      </div>

      <ReviewCarousel reviews={REVIEWS} />

      <div className="yw-wrap yw-voices__foot">
        <Footnote>고객이 직접 작성한 후기를 그대로 옮겼습니다. 체감은 개인에 따라 다를 수 있습니다.</Footnote>
      </div>
    </section>
  )
}
