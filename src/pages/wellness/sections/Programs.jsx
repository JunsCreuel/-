import { PROGRAM_GROUPS, BRANCHES, won } from '../data'
import { Eyebrow, Reveal } from '../ui'

const STATS = [
  { value: '4', unit: '년', text: '예뻐졌다의 관리 노하우' },
  { value: '40', sign: '+', text: '함께하는 예뻐졌다 매장' },
  { value: '100', sign: '%', text: '100% 예약제 · 1:1 프라이빗 관리' },
  { value: '8', unit: '가지 관리', text: '두피부터 림프까지 8가지 관리' },
  { value: '50', sign: '%', text: '확장 이전 오픈 기념 할인', accent: true },
]

export default function Programs() {
  const booking = BRANCHES.zai.booking

  return (
    <>
      <section className="ws-stats" aria-label="스튜디오 한눈에 보기">
        <div className="ws-container ws-stats__grid">
          {STATS.map((s) => (
            <Reveal key={s.text} className="ws-stat">
              <p className={`ws-stat__value${s.accent ? ' is-accent' : ''}`}>
                {s.value}
                {s.sign && <small>{s.sign}</small>}
                {s.unit && <span>{s.unit}</span>}
              </p>
              <p className="ws-stat__text">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="programs" className="ws-programs">
        <div className="ws-container">
          <Reveal className="ws-head">
            <div>
              <Eyebrow>프로그램</Eyebrow>
              <h2 className="ws-title">
                나에게 맞는 <em className="ws-accent">관리</em> 고르기
              </h2>
            </div>
            <p className="ws-head__note">
              오늘 가장 신경 쓰이는 곳부터 골라 보세요. 처음이라면 상담에서 컨디션에 맞는 관리를 함께 정해 드립니다.
            </p>
          </Reveal>

          {PROGRAM_GROUPS.map((g) => (
            <div key={g.no} className="ws-menu">
              <Reveal className="ws-menu__head">
                {g.photo && (
                  <span className="ws-menu__thumb">
                    <img src={g.photo} alt="" width="72" height="72" loading="lazy" />
                  </span>
                )}
                <div>
                  <p className="ws-menu__no">{g.no}</p>
                  <h3 className="ws-menu__title">{g.title}</h3>
                </div>
              </Reveal>
              <div className="ws-menu__grid">
                {g.items.map((p) => (
                  <Reveal as="article" key={p.name} className="ws-item">
                    <div className="ws-item__head">
                      <h4 className="ws-item__name">{p.name}</h4>
                      <span className="ws-tag">{p.time}</span>
                      {p.badge && <span className="ws-tag ws-tag--dark">{p.badge}</span>}
                    </div>
                    <p className="ws-item__text">{p.text}</p>
                    <p className="ws-item__price">
                      {p.sale ? (
                        <>
                          <s>{won(p.price)}</s>
                          <span className="ws-item__off">50%</span>
                          <strong>{won(p.sale)}</strong>
                        </>
                      ) : (
                        <strong>{won(p.price)}</strong>
                      )}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          <Reveal className="ws-notebar">
            <p>가격은 네이버 예약 기준입니다. 관리 구성과 소요시간은 컨디션에 따라 달라질 수 있으며 예약 전에 안내해 드립니다.</p>
            {booking && (
              <a className="ws-btn ws-btn--sm" href={booking} target="_blank" rel="noopener noreferrer">
                네이버에서 예약하기 ↗
              </a>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
