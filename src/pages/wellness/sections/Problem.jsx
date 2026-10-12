import { Reveal } from '../ui'

const CONCERNS = [
  '머리 꼭대기가 무겁고 두피가 답답하게 느껴지는 날',
  '화장이 들뜨고 얼굴빛에 생기가 없어 보이는 오후',
  '옷을 입을 때 신경 쓰이는 복부 라인',
  '자고 일어나도 풀리지 않는 몸의 피로감',
  '하루를 마치면 딱딱하게 굳어 있는 등',
  '저녁이 되면 무겁게 느껴지는 다리',
]

const WHO = ['장시간 앉아서 근무하시는 분', '장시간 서서 근무하시는 분', '피로가 일상이 되신 분']

// 고민 구간: 문장 목록 대신 알약 칩으로 보여 주고, 마지막에 한 줄로 이어 준다.
export default function Problem() {
  return (
    <section id="problem" className="w-section w-section--ink w-concern">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Concern
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          충분히 쉬어도
          <br />
          개운하지 않다면
        </Reveal>

        <ul className="w-chips">
          {CONCERNS.map((text, i) => (
            <Reveal as="li" key={text} delay={i * 50}>
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
          피로는 매일 쌓이지만, 스스로를 돌보는 시간은 번번이 뒤로 밀립니다.
        </Reveal>

        <Reveal as="p" className="w-concern__turn">
          온몸을 따뜻하게 감싼 다음,
          <br />
          나의 고민 부위를 한 번 더 돌봅니다.
        </Reveal>
      </div>
    </section>
  )
}
