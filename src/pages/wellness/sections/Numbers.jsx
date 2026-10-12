import { NUMBERS } from '../data'
import { Reveal } from '../ui'

// 숫자로 보는 스튜디오 (4년·40+·100%·8가지 관리·50%)
export default function Numbers() {
  return (
    <section className="w-nums" aria-label="스튜디오 한눈에 보기">
      <ul className="w-container w-nums__list">
        {NUMBERS.map((item, i) => (
          <Reveal as="li" key={item.label} delay={i * 60} className={item.accent ? 'is-accent' : undefined}>
            <p className="w-nums__big">
              {item.n}
              <small>{item.unit}</small>
            </p>
            <p className="w-nums__label">{item.label}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
