import { Reveal } from '../ui'

const PAINS = [
  '하루 끝, 어깨와 목이 먼저 무너지는 날',
  '자고 일어나도 몸이 개운하지 않은 아침',
  '저녁이면 다리가 무겁고 붓는 느낌',
  '머리가 지끈, 두피가 답답한 오후',
  '주말에도 풀리지 않는 월요일의 몸',
]

const WHO = ['오래 앉아 일하는 분', '하루 종일 서 있는 분', '늘 피곤한 분']

export default function Problem() {
  return (
    <>
      <section id="problem" className="w-section w-section--band">
        <div className="w-container">
          <Reveal as="p" className="w-eyebrow">
            혹시 요즘,
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            쉬어도 쉰 것 같지 않은
            <br />
            날이 많으세요?
          </Reveal>

          <ul className="w-pains">
            {PAINS.map((text, i) => (
              <Reveal as="li" key={text} delay={i * 70} className="w-pain">
                {text}
              </Reveal>
            ))}
          </ul>

          <Reveal as="ul" className="w-who">
            {WHO.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </Reveal>

          <Reveal as="p" className="w-bridge">
            피로는 쌓이는데,
            <br />
            나를 돌보는 시간은 늘 뒤로 밀립니다.
          </Reveal>
        </div>
      </section>

      <section className="w-section w-section--green w-turn">
        <div className="w-container">
          <Reveal as="p" className="w-turn__text">
            기계만으로는 닿지 않는 곳이 있습니다.
            <br />
            손이 닿아야 풀리는 곳이 있습니다.
          </Reveal>
        </div>
      </section>
    </>
  )
}
