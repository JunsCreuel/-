import { PHOTOS } from '../data'
import { Reveal } from '../ui'

const PROGRAMS = [
  {
    no: '01',
    title: '전신웜업케어',
    sub: '온열돔',
    photo: { src: PHOTOS.candleLeg, alt: '촛불 아래에서 종아리를 관리하는 손', width: 736, height: 1308 },
    lines: ['깊고 균일한 온열감 속에서', '발한과 말초 순환까지 케어합니다.', '가장 편안한 휴식을 경험해 보세요.'],
  },
  {
    no: '02',
    title: '바디 케어',
    sub: '등 · 하체 · 복부 · 전신 후면',
    photo: { src: PHOTOS.back, alt: '등을 부드럽게 관리하는 두 손', width: 736, height: 986 },
    lines: ['오래 앉고 오래 서는 하루가 쌓인 곳을', '손으로 풀어 드립니다.', '등·하체 관리는 온열돔과 함께 진행해요.'],
  },
  {
    no: '03',
    title: '림프 케어',
    sub: '림프절 · 풀 바디 웜업 + 아로마테라피',
    photo: { src: PHOTOS.leg, alt: '다리를 부드럽게 쓸어 주는 손', width: 720, height: 1280 },
    lines: ['무겁고 둔한 날, 겨드랑이 · 서혜부 · 목을 따라', '림프 순환을 부드럽게 케어합니다.'],
  },
  {
    // 사진이 준비되기 전까지는 단색 블록으로 처리한다.
    no: '04',
    title: '헤드스파',
    sub: '두피 · 얼굴 · 승모',
    photo: null,
    lines: ['머리부터 승모까지, 쉼을 완성합니다.', '두피 관리는 BASIC · PREMIUM 두 단계로 준비했어요.'],
  },
]

export default function Programs() {
  return (
    <section id="programs" className="w-section w-section--band">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow">
          Program
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          몸이 필요한 만큼,
          <br />
          골라 받는 관리
        </Reveal>

        <div className="w-programs">
          {PROGRAMS.map((p) => (
            <article key={p.no} className="w-program">
              <Reveal mode="toggle" className="w-program__media">
                {p.photo ? (
                  <figure className="w-photo">
                    <img
                      src={p.photo.src}
                      alt={p.photo.alt}
                      width={p.photo.width}
                      height={p.photo.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ) : (
                  <div className="w-photo w-photo--block" aria-hidden="true">
                    <span>{p.no}</span>
                    <em>{p.title}</em>
                  </div>
                )}
              </Reveal>
              <Reveal className="w-program__body">
                <p className="w-program__no">{p.no}</p>
                <h3>{p.title}</h3>
                <p className="w-program__sub">{p.sub}</p>
                <p className="w-program__text">
                  {p.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
