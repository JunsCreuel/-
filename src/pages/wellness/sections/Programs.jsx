import { PHOTOS } from '../data'
import { Reveal } from '../ui'

// 용호점 시그니처 관리: 두피 · 얼굴 · 온열돔. 사진이 없는 항목은 단색 블록으로 처리한다.
const SIGNATURE = [
  {
    no: '01',
    title: '두피 관리',
    sub: 'BASIC · PREMIUM',
    photo: null,
    tags: ['문제성 두피', '두피 열 다운'],
    text: '머리가 지끈하고 두피가 답답한 날엔 두피부터 만져 보세요. 머리 꼭대기에 열이 오른 날엔 시원하게 식혀 드리고, 두피가 예민한 분은 천천히 풀어 드려요. 얼굴과 승모까지 이어서 받는 헤드스파 패키지도 있어요.',
  },
  {
    no: '02',
    title: '얼굴 관리',
    sub: '',
    photo: null,
    soft: true,
    tags: ['모공개선', '피부 온도 내리기', '수분리프팅'],
    text: '화장이 들뜨고 얼굴이 푸석한 날엔 얼굴 관리를 받아 보세요. 모공이 신경 쓰이는 날도, 얼굴이 달아올라 열이 오른 날도, 건조해서 당기는 날도 맞는 관리가 있어요.',
  },
  {
    no: '03',
    title: '전신웜업케어',
    sub: '온열돔',
    photo: { src: PHOTOS.candleLeg, alt: '촛불 아래에서 종아리를 관리하는 손', width: 736, height: 1308 },
    tags: [],
    text: '그냥 누워 계시면 돼요. 몸이 따뜻하게 풀리는 동안 땀도 나고, 손발 끝까지 따뜻해져요. 오늘은 아무것도 하기 싫은 날에 어울려요.',
  },
]

const OTHERS = [
  {
    title: '바디 케어',
    sub: '등 · 하체 · 복부 · 전신 후면',
    photo: { src: PHOTOS.back, alt: '등을 부드럽게 관리하는 두 손', width: 736, height: 986 },
    text: '하루 종일 앉아 있거나 서 있던 몸은 등과 다리에 다 쌓여요. 그 자리를 손으로 하나씩 풀어 드려요. 등과 하체는 온열돔으로 먼저 데운 다음에 들어가요.',
  },
  {
    title: '림프 케어',
    sub: '림프절 · 풀 바디 웜업 + 아로마테라피',
    photo: { src: PHOTOS.leg, alt: '다리를 부드럽게 쓸어 주는 손', width: 720, height: 1280 },
    text: '저녁에 다리가 무겁고 양말 자국이 깊게 남는 날, 겨드랑이와 서혜부, 목 쪽을 따라 부드럽게 쓸어 드려요.',
  },
]

function Photo({ photo, no, title, soft }) {
  if (!photo) {
    return (
      <div className={`w-photo w-photo--block${soft ? ' is-soft' : ''}`} aria-hidden="true">
        <span>{no}</span>
        <em>{title}</em>
      </div>
    )
  }
  return (
    <figure className="w-photo">
      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
    </figure>
  )
}

export default function Programs() {
  return (
    <section id="programs" className="w-section w-section--band">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          받을 수 있는 관리
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          오늘 제일 힘든 데부터
          <br />
          말씀해 주세요
        </Reveal>

        <Reveal as="p" className="w-prog-head">
          용호점 시그니처 관리
        </Reveal>
        <div className="w-programs">
          {SIGNATURE.map((p) => (
            <article key={p.no} className="w-program">
              <Reveal mode="toggle" className="w-program__media">
                <Photo photo={p.photo} no={p.no} title={p.title} soft={p.soft} />
              </Reveal>
              <Reveal className="w-program__body">
                <p className="w-program__no">{p.no}</p>
                <h3>{p.title}</h3>
                {p.sub && <p className="w-program__sub">{p.sub}</p>}
                <p className="w-program__text">{p.text}</p>
                {p.tags.length > 0 && (
                  <ul className="w-tags">
                    {p.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal as="p" className="w-prog-head w-prog-head--later">
          그 밖의 관리
        </Reveal>
        <ul className="w-others">
          {OTHERS.map((o) => (
            <Reveal as="li" key={o.title} className="w-other">
              <Photo photo={o.photo} title={o.title} />
              <h3>{o.title}</h3>
              <p className="w-program__sub">{o.sub}</p>
              <p className="w-other__text">{o.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
