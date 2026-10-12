import { DEVICES } from '../data'
import { Eyebrow, Reveal } from '../ui'

export default function Equipment() {
  return (
    <section id="equipment" className="ws-equipment">
      <div className="ws-container">
        <Reveal className="ws-head">
          <div>
            <Eyebrow>장비 소개</Eyebrow>
            <h2 className="ws-title">
              따뜻하게 풀고,
              <br />
              <em className="ws-accent">섬세하게</em> 가꾸다
            </h2>
          </div>
          <p className="ws-head__note">관리의 시작은 온열돔이 맡고, 섬세한 마무리는 부위별 디바이스가 맡습니다.</p>
        </Reveal>

        <div className="ws-devices">
          {DEVICES.map((d, i) => (
            <Reveal as="article" key={d.no} delay={i * 90} className="ws-device">
              <div className="ws-device__photo">
                <img src={d.photo.src} alt={d.photo.alt} width={d.photo.width} height={d.photo.height} loading="lazy" />
              </div>
              <p className="ws-method__label">
                <span>{d.no}</span>
                {d.name}
              </p>
              <h3 className="ws-device__name">
                {d.name} <small>{d.sub}</small>
              </h3>
              <p className="ws-device__point">{d.point}</p>
              <p className="ws-device__text">{d.text}</p>
              <ul className="ws-chips">
                {d.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <p className="ws-footnote">
          사용하는 디바이스와 관리 구성은 프로그램에 따라 다르며, 예약 전에 안내해 드립니다. 체감은 개인에 따라 다를 수 있습니다.
        </p>
      </div>
    </section>
  )
}
