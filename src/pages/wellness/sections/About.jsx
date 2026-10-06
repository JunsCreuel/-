import { Reveal } from '../ui'

const STEPS = [
  { no: '01', title: '전신웜업', text: '온열돔에 누워 쉬는 동안, 깊고 균일한 온기가 몸 전체를 감쌉니다.' },
  { no: '02', title: '아웃케어', text: '뭉치고 무거운 곳은 손으로 직접, 집중해서 관리합니다.' },
  { no: '03', title: '마무리', text: '뉴스킨 제품과 관리 기기로 컨디션을 차분히 정돈합니다.' },
]

const BEFORE = ['어깨가 올라가 있고', '걸음이 무겁고', '머리가 멍한 느낌']
const AFTER = ['온기가 남아 몸이 풀리고', '숨이 한결 깊어지고', '발걸음이 가벼운 느낌']

export default function About() {
  return (
    <section id="about" className="w-section">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          예뻐졌다 웰니스스튜디오의 방식
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          온열돔으로 데우고,
          <br />
          손끝으로 마무리합니다.
        </Reveal>

        <ol className="w-steps">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.no} delay={i * 90} className="w-step">
              <span className="w-step__no">{step.no}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal as="p" className="w-safety">
          관리 중에는 실시간으로 상태를 살피며 진행합니다.
        </Reveal>

        <Reveal className="w-feel">
          <h3 className="w-feel__title">관리 전과 후, 이런 느낌이에요</h3>
          <div className="w-feel__grid">
            <div className="w-feel__col">
              <p className="w-feel__label">관리 전</p>
              <ul>
                {BEFORE.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
            <div className="w-feel__col is-after">
              <p className="w-feel__label">관리 후</p>
              <ul>
                {AFTER.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="w-feel__note">관리 후 느낌은 개인에 따라 다를 수 있습니다.</p>
        </Reveal>
      </div>
    </section>
  )
}
