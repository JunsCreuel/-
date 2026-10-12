import { scrollToId } from '../scroll'
import { Eyebrow, Reveal } from '../ui'

const STORY = [
  { mark: '시작', title: '예뻐졌다 오픈', text: '한 분 한 분의 컨디션을 살피는 관리에서 시작했습니다.' },
  { mark: '40+', num: true, title: '4년 만에 40개 이상의 매장', text: '같은 관리 철학이 40개가 넘는 매장으로 이어졌습니다.' },
  { mark: '지금', now: true, title: 'WELLNESS STUDIO 용호점', text: '업그레이드된 장비와 프로그램으로 확장 이전해 다시 문을 열었습니다.' },
]

const METHODS = [
  {
    no: '01',
    label: '온열돔 · 전신웜업케어',
    a: '온기',
    b: '휴식',
    text: '온열돔에 편히 누워 있는 동안 몸 전체가 깊고 고르게 데워집니다. 땀과 함께 긴장이 풀리면서 다음 관리를 받을 준비가 됩니다.',
  },
  {
    no: '02',
    label: '아웃케어',
    a: '손길',
    b: '디바이스',
    text: '따뜻해진 몸에 손길과 갈바닉·웰스파 디바이스로 고민 부위를 집중 관리합니다. 어깨와 등, 복부, 하체처럼 무거운 곳을 하나씩 풀어 드립니다.',
  },
  {
    no: '03',
    label: '두피-얼굴 관리',
    a: '두피',
    b: '얼굴',
    text: '두피 클렌징부터 얼굴 근막 케어까지 한 흐름으로 이어집니다. 머리는 가볍게, 얼굴은 생기 있게 마무리합니다.',
  },
]

export default function About() {
  return (
    <section id="about" className="ws-about">
      <div className="ws-container">
        <Reveal className="ws-about__intro">
          <Eyebrow center>웰니스 스튜디오 이야기</Eyebrow>
          <p className="ws-about__statement">
            온기로 풀고,
            <br />
            손끝으로 <em className="ws-accent">완성</em>합니다.
          </p>
          <p className="ws-about__lead">
            예뻐졌다 WELLNESS STUDIO는 온열돔으로 몸을 먼저 따뜻하게 준비한 뒤 손길과 디바이스로 고민 부위를 하나씩 살핍니다. 두피부터
            얼굴과 바디까지, 한 번의 방문으로 이어지는 토탈 케어입니다.
          </p>
        </Reveal>

        <Reveal className="ws-story">
          <div className="ws-head">
            <div>
              <Eyebrow>예뻐졌다의 4년</Eyebrow>
              <h3 id="ws-story-title" className="ws-story__title">
                4년, 40개 이상의 매장.
                <br />
                그리고 다시, <em className="ws-accent">용호점</em>.
              </h3>
            </div>
            <p className="ws-head__note">
              예뻐졌다는 문을 연 지 4년 만에 40개가 넘는 매장과 함께하는 브랜드가 되었습니다. 그 시간 동안 쌓은 관리 노하우에 한층
              업그레이드된 장비와 프로그램을 더해 용호점이 예뻐졌다 WELLNESS STUDIO로 새롭게 문을 열었습니다.
            </p>
          </div>
          <ol className="ws-story__steps">
            {STORY.map((s) => (
              <li key={s.title} className={s.now ? 'is-now' : undefined}>
                <p className={`ws-story__mark${s.num ? ' is-num' : ''}`}>{s.mark}</p>
                <p className="ws-story__step-title">{s.title}</p>
                <p className="ws-story__step-text">{s.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="ws-methods">
          {METHODS.map((m, i) => (
            <Reveal as="article" key={m.no} delay={i * 90} className="ws-method">
              <p className="ws-method__label">
                <span>{m.no}</span>
                {m.label}
              </p>
              <h3 className="ws-method__title">
                {m.a} <span className="ws-accent">+</span>
                <br />
                {m.b}
              </h3>
              <p className="ws-method__text">{m.text}</p>
              <button type="button" className="ws-more" onClick={() => scrollToId('programs')}>
                자세히 보기 →
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
