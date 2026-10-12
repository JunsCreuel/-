import { GELS } from '../data'
import { Eyebrow, Reveal } from '../ui'

export default function Gels() {
  return (
    <section id="gel" className="ws-gels">
      <div className="ws-container">
        <Reveal className="ws-head">
          <div>
            <Eyebrow>전용 젤</Eyebrow>
            <h2 className="ws-title">
              피부에 닿는 것까지,
              <br />
              <em className="ws-accent">전용</em>으로
            </h2>
          </div>
          <p className="ws-head__note">예뻐졌다는 관리할 때 오일 대신 디바이스마다 맞춘 전용 젤을 사용합니다.</p>
        </Reveal>

        <div className="ws-gels__list">
          {GELS.map((g) => (
            <Reveal as="article" key={g.no} className={`ws-gel${g.reverse ? ' is-reverse' : ''}`}>
              <div className={`ws-gel__photo${g.photo.white ? ' is-white' : ''}`}>
                <img src={g.photo.src} alt={g.photo.alt} width={g.photo.width} height={g.photo.height} loading="lazy" />
              </div>
              <div className="ws-gel__body">
                <p className="ws-method__label">
                  <span>{g.no}</span>
                  {g.label}
                </p>
                <h3 className="ws-gel__name">{g.name}</h3>
                <p className="ws-gel__en">{g.en}</p>
                <p className="ws-gel__text">{g.text}</p>
                <div className="ws-gel__ings">
                  <p className="ws-gel__ings-title">주요 성분</p>
                  <ul>
                    {g.ingredients.map((ing) => (
                      <li key={ing.name} className={ing.img ? 'has-img' : undefined}>
                        {ing.img && <img src={ing.img} alt="" width="72" height="72" loading="lazy" />}
                        <div>
                          <p className="ws-gel__ing-name">{ing.name}</p>
                          {ing.en && <p className="ws-gel__ing-en">{ing.en}</p>}
                          <p className="ws-gel__ing-text">{ing.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
