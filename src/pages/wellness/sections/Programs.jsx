import { PHOTOS } from '../data'
import { Reveal } from '../ui'

// 시그니처 관리: 두피-얼굴 관리(하나의 프로그램)와 온열돔 관리.
const SIGNATURE = [
  {
    no: '01',
    title: '두피-얼굴 관리',
    sub: 'BASIC · PREMIUM',
    // 원본이 236×354px 썸네일이라 큰 칸에서 흐려지지 않도록 폭을 제한한다. 큰 원본이 오면 small을 지운다.
    photo: { src: PHOTOS.scalp, alt: '머리를 뒤로 기대고 두피 관리를 받는 모습', width: 236, height: 354, small: true },
    tags: ['문제성 두피', '두피 열 다운', '모공개선', '피부 온도 내리기', '수분리프팅'],
    text: '두피에서 얼굴까지 하나의 흐름으로 이어지는 관리입니다. 두피의 열감과 답답함, 얼굴의 건조함과 피부 컨디션을 함께 관리하며, 승모 관리를 더한 헤드스파 코스도 운영합니다.',
  },
  {
    no: '02',
    title: '전신웜업케어',
    sub: '온열돔',
    photo: { src: PHOTOS.candleLeg, alt: '촛불 아래에서 종아리를 관리하는 손', width: 736, height: 1308 },
    tags: [],
    text: '전신 온열돔 안에서 진행하는 관리입니다. 깊고 균일한 온열감과 편안한 휴식감 속에서 발한 케어, 말초 순환 케어, 체온 기반 컨디션 케어가 이어집니다.',
  },
]

const OTHERS = [
  {
    title: '바디 케어',
    sub: '등 · 하체 · 복부 · 전신 후면',
    photo: { src: PHOTOS.back, alt: '등을 부드럽게 관리하는 두 손', width: 736, height: 986 },
    text: '등과 하체 관리는 온열돔과 함께 진행하며, 하루 동안 쌓인 긴장으로 굳은 부위를 아웃케어로 집중 관리합니다.',
  },
  {
    title: '림프 케어',
    sub: '림프절 · 풀 바디 웜업 + 아로마테라피',
    photo: { src: PHOTOS.leg, alt: '다리를 부드럽게 쓸어 주는 손', width: 720, height: 1280 },
    text: '겨드랑이와 서혜부, 목을 따라 이어지는 림프 순환 케어입니다. 풀 바디 웜업과 아로마테라피를 함께 구성했습니다.',
  },
]

function Photo({ photo }) {
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
          Program
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          프로그램 구성
        </Reveal>

        <Reveal as="p" className="w-prog-head">
          시그니처 관리
        </Reveal>
        <div className="w-programs">
          {SIGNATURE.map((p) => (
            <article key={p.no} className="w-program">
              <Reveal mode="toggle" className={`w-program__media${p.photo.small ? ' w-program__media--small' : ''}`}>
                <Photo photo={p.photo} />
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
              <Photo photo={o.photo} />
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
