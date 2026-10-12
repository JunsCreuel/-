import { REVIEWS } from '../data'
import { Eyebrow, Reveal } from '../ui'

export default function Proof() {
  return (
    <section id="reviews" className="ws-reviews">
      <div className="ws-container">
        <Reveal className="ws-head">
          <div>
            <Eyebrow>고객 후기</Eyebrow>
            <h2 className="ws-title">
              다녀가신 분들의 <em className="ws-accent">이야기</em>
            </h2>
          </div>
          <p className="ws-head__note">관리를 받고 직접 남겨 주신 네이버 리뷰입니다.</p>
        </Reveal>

        <div className="ws-review-grid">
          {REVIEWS.map((r, i) => (
            <Reveal as="article" key={r.photo.src} delay={i * 90} className="ws-review">
              <img
                src={r.photo.src}
                alt={r.photo.alt}
                width={r.photo.width}
                height={r.photo.height}
                loading="lazy"
                style={r.photo.position ? { objectPosition: r.photo.position } : undefined}
              />
              <div className="ws-review__body">
                <p className="ws-review__mark" aria-hidden="true">
                  “
                </p>
                <blockquote>{r.text}</blockquote>
                <p className="ws-review__who">방문 고객 · 네이버 리뷰</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="ws-footnote">고객이 직접 작성한 후기를 그대로 옮겼습니다. 체감은 개인에 따라 다를 수 있습니다.</p>
      </div>
    </section>
  )
}
