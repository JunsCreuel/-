import T from '../T'
import { Reveal } from '../ui'

const STEPS = [
  {
    no: '먼저',
    title: '누워서 데우기',
    text: '온열돔에는 그냥 누워 계시면 돼요. 몸 안쪽까지 따뜻해지고, 땀이 나는 분도 있어요. 그동안은 아무것도 안 하셔도 됩니다.',
  },
  {
    no: '그다음',
    title: '손으로 풀기',
    text: '손이 들어가요. 두피와 얼굴, 어깨와 등처럼 유난히 굳은 곳은 시간을 더 써서 만져요. 끝나고는 뉴스킨 제품으로 마무리하고, 갈바닉이나 웰스파 같은 기기를 같이 쓰기도 해요.',
  },
]

const BEFORE = ['어깨가 귀 쪽으로 올라가 있어요', '머리가 멍하고 두피가 답답해요', '걸음이 무거워요']
const AFTER = ['온기가 남아 몸이 풀려 있어요', '머리가 한결 맑고 얼굴이 편안해요', '집 가는 걸음이 가벼워요']

export default function About() {
  return (
    <section id="about" className="w-section">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          <T k="about.eyebrow" single>
            저희가 하는 방식
          </T>
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          <T k="about.title">{'먼저 몸을 데우고,\n굳은 자리는 손으로 풀어요.'}</T>
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          <T k="about.lead">예뻐졌다는 말은 몸이 풀린 다음에 오는 거라고 생각해요. 그래서 순서를 이렇게 잡았어요.</T>
        </Reveal>

        <ol className="w-steps">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.no} delay={i * 90} className="w-step">
              <span className="w-step__no">
                <T k={`about.step.${i}.no`} single>
                  {step.no}
                </T>
              </span>
              <h3>
                <T k={`about.step.${i}.title`} single>
                  {step.title}
                </T>
              </h3>
              <p>
                <T k={`about.step.${i}.text`}>{step.text}</T>
              </p>
            </Reveal>
          ))}
        </ol>

        <Reveal as="p" className="w-safety">
          <T k="about.safety">누워 계시는 동안에도 계속 상태를 보고 있어요.</T>
        </Reveal>

        <Reveal className="w-feel">
          <h3 className="w-feel__title">
            <T k="about.feel.title" single>
              관리 전후, 대략 이런 느낌일 수 있어요
            </T>
          </h3>
          <div className="w-feel__grid">
            <div className="w-feel__col">
              <p className="w-feel__label">
                <T k="about.feel.beforeLabel" single>
                  들어올 땐
                </T>
              </p>
              <ul>
                {BEFORE.map((text, i) => (
                  <li key={text}>
                    <T k={`about.before.${i}`} single>
                      {text}
                    </T>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-feel__col is-after">
              <p className="w-feel__label">
                <T k="about.feel.afterLabel" single>
                  나갈 땐
                </T>
              </p>
              <ul>
                {AFTER.map((text, i) => (
                  <li key={text}>
                    <T k={`about.after.${i}`} single>
                      {text}
                    </T>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="w-feel__note">
            <T k="about.feel.note" single>
              느낌은 사람마다 달라요.
            </T>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
