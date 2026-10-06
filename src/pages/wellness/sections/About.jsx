import { Reveal } from '../ui'

// 이 브랜드의 차별점: 전신 온열돔 관리와 손으로 진행하는 아웃케어의 결합.
const METHODS = [
  {
    no: '01',
    en: 'HEAT DOME',
    ko: '온열돔 · 전신웜업케어',
    text: '전신을 감싸는 깊고 균일한 온열감으로 몸을 먼저 준비시킵니다. 발한 케어, 말초 순환 케어, 체온 기반 컨디션 케어가 편안한 휴식감 속에서 이어지며, 관리 전 과정에서 실시간으로 상태를 확인합니다.',
  },
  {
    no: '02',
    en: 'OUT CARE',
    ko: '아웃케어',
    text: '온열로 준비된 몸에 손으로 직접 진행하는 집중 부위 관리입니다. 두피-얼굴, 어깨와 등, 하체처럼 굳고 무거운 부위를 손길로 세심하게 관리합니다.',
  },
]

const BEFORE = ['어깨가 올라가 있는 긴장감', '머리의 무거움과 두피의 답답함', '무겁게 느껴지는 걸음']
const AFTER = ['몸 전체에 남는 온기', '한결 가벼워진 머리와 편안한 얼굴', '가벼워진 발걸음']

export default function About() {
  return (
    <section id="about" className="w-section">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          Our Method
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          온열돔과 아웃케어,
          <br />
          두 가지 방식의 결합
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          WELLNESS STUDIO는 전신 온열돔 관리와 손으로 진행하는 아웃케어를 하나의 흐름으로 설계합니다. 기기에만 의존하지 않고, 손으로
          완성하는 관리입니다.
        </Reveal>

        <div className="w-method__rows">
          {METHODS.map((m, i) => (
            <Reveal key={m.no} delay={i * 90} className="w-method__row">
              <p className="w-method__no">{m.no}</p>
              <div>
                <p className="w-method__en">{m.en}</p>
                <h3 className="w-method__ko">{m.ko}</h3>
              </div>
              <p className="w-method__text">{m.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="w-method__eq">
          온열이 몸을 준비시키고,
          <br />
          아웃케어가 완성합니다.
        </Reveal>
        <Reveal as="p" className="w-method__note">
          관리의 마무리에는 뉴스킨 제품과 갈바닉, 웰스파 등의 관리 기기를 함께 사용합니다.
        </Reveal>

        <Reveal className="w-feel">
          <h3 className="w-feel__title">관리 전후의 컨디션</h3>
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
          <p className="w-feel__note">체감은 개인에 따라 다를 수 있습니다.</p>
        </Reveal>
      </div>
    </section>
  )
}
