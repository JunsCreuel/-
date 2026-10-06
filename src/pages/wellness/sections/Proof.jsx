import { Reveal, Todo } from '../ui'

export default function Proof() {
  return (
    <>
      <section id="reviews" className="w-section">
        <div className="w-container">
          <Reveal as="p" className="w-eyebrow">
            Review
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            고객 후기
          </Reveal>
          <p className="w-todo-note">
            <Todo>실제 후기 3건 + 사진 노출 동의</Todo>
          </p>

          <ul className="w-reviews">
            {[0, 1, 2].map((i) => (
              <Reveal as="li" key={i} delay={i * 90} className="w-review" aria-hidden="true">
                <div className="w-review__photo" />
                <div className="w-review__body">
                  <p className="w-review__who">○○○ 님 · 받은 관리</p>
                  <span className="w-bar-line" />
                  <span className="w-bar-line is-short" />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
