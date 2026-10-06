import { Reveal } from '../ui'

// 머리·얼굴 장면과 몸 장면을 절반씩 둔다.
const PAINS = [
  '머리를 감아도 두피가 답답하고, 머리 꼭대기가 띵한 날.',
  '화장이 들뜨고 얼굴에 생기가 없어 보이는 오후.',
  '엘리베이터 거울을 보다가 한쪽 어깨가 올라가 있는 걸 알게 된 날.',
  '자고 일어났는데도 몸이 안 풀려 있는 아침.',
  '아이 재우고 겨우 앉았는데 등이 돌처럼 딱딱한 저녁.',
  '저녁이면 양말 자국이 깊게 남는 다리.',
]

const WHO = ['하루 종일 앉아 일하는 분', '하루 종일 서 있는 분', '늘 피곤하다는 말이 입에 붙은 분']

export default function Problem() {
  return (
    <>
      <section id="problem" className="w-section w-section--band">
        <div className="w-container">
          <Reveal as="p" className="w-eyebrow">
            상담하다 보면 이런 말씀을 자주 하세요
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            혹시 요즘, 이러세요?
          </Reveal>

          <ul className="w-pains">
            {PAINS.map((text, i) => (
              <Reveal as="li" key={text} delay={(i % 2) * 70} className="w-pain">
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
            다들 참고 넘기잖아요.
            <br />
            그러다 보면 어느새 그게 내 몸의 기본값이 돼요.
          </Reveal>
        </div>
      </section>

      <section className="w-section w-section--green w-turn">
        <div className="w-container">
          <Reveal as="p" className="w-turn__text">
            온열돔은 몸을 데워 줘요.
            <br />
            두피와 얼굴, 굳은 어깨는 결국 손이 가야 풀려요.
          </Reveal>
        </div>
      </section>
    </>
  )
}
