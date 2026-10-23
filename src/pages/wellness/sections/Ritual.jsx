import { PICS } from '../data'
import { Folio, Footnote, Pic } from '../editorial'
import './yw-ritual.css'

// 브랜드 페이지 — 한 번의 방문이 이어지는 네 단계. 사진과 짧은 설명을 나란히 둔다(휴대폰 2열, 데스크톱 4열).
const STEPS = [
  { ko: '상담', en: 'Consultation', pic: PICS.ritual1, text: '오늘의 컨디션과 신경 쓰이는 부위를 먼저 여쭙니다.' },
  { ko: '온열돔 웜업', en: 'Heat Dome', pic: PICS.ritual2, text: '전신 온열돔에 편히 누워 몸을 데웁니다.' },
  { ko: '아웃케어', en: 'Out Care', pic: PICS.ritual3, text: '고른 부위를 손길과 디바이스로 한 번 더 관리합니다.' },
  { ko: '마무리', en: 'Finish', pic: PICS.ritual4, text: '피부 상태와 편안함을 확인하고 일상 관리법을 알려 드립니다.' },
]

export default function Ritual() {
  return (
    <section id="ritual" className="yw-section yw-ritual2" data-theme="light" aria-labelledby="ritual-title">
      <div className="yw-wrap">
        <Folio ko="관리 과정" />
        <h2 id="ritual-title" className="yw-h2">
          한 번의 방문, 네 단계
        </h2>
        <ol className="yw-ritual2__list">
          {STEPS.map((s, i) => (
            <li key={s.en} className="yw-ritual2__step">
              <figure className="yw-ritual2__photo">
                <Pic pic={s.pic} sizes="(min-width: 64rem) 22vw, 46vw" />
              </figure>
              <p className="yw-ritual2__no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="yw-ritual2__name">
                {s.ko}
                <small lang="en">{s.en}</small>
              </h3>
              <p className="yw-ritual2__text">{s.text}</p>
            </li>
          ))}
        </ol>
        <Footnote>
          온열돔 단독 이용도 가능합니다. 온열돔 포함 여부와 사용하는 디바이스는 프로그램에 따라 다르며, 예약 전에 안내해 드립니다.
        </Footnote>
      </div>
    </section>
  )
}
