import { REVIEWS } from '../data'
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

        <ul className="w-reviews">
          {REVIEWS.map((r, i) => (
            <Reveal as="li" key={r.photo.src} delay={i * 90} className="w-review">
              <div className="w-review__photo">
                <img
                  src={r.photo.src}
                  alt={r.photo.alt}
                  width={r.photo.width}
                  height={r.photo.height}
                  loading="lazy"
                  decoding="async"
                  style={r.photo.position ? { objectPosition: r.photo.position } : undefined}
                />
              </div>
              <blockquote className="w-review__text">{r.text}</blockquote>
              <p className="w-review__who">NAVER 리뷰 · 방문 고객</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
