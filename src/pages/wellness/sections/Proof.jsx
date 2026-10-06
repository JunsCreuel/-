import { Reveal, Todo } from '../ui'

// 확인된 사실만 숫자로 보여 준다. 근거 없는 만족도/재등록률 같은 수치는 넣지 않는다.
const NUMBERS = [
  { big: '4년', title: '운영 기간' },
  { big: '100%', title: '예약제 운영' },
  { big: '2곳', title: '용호 자이점 · 마린시티점' },
]

export default function Proof() {
  return (
    <>
      <section id="proof" className="w-section">
        <div className="w-container">
          <ul className="w-numbers">
            {NUMBERS.map((n, i) => (
              <Reveal as="li" key={n.big} delay={i * 90} className="w-number">
                <strong>{n.big}</strong>
                <span>{n.title}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="reviews" className="w-section w-section--band">
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
