import { PICS } from '../data'
import { Pic } from '../editorial'
import './yw-story.css'

// 브랜드 소개 — 짧은 한 단락과 사진 한 장. 휴대폰은 위아래, 데스크톱은 글(왼쪽)·사진(오른쪽).
export default function About() {
  return (
    <section id="about" className="yw-section yw-story" data-theme="light" aria-labelledby="about-title">
      <div className="yw-wrap yw-story__grid">
        <div className="yw-story__text">
          <p className="yw-eyebrow">브랜드 소개</p>
          <h2 id="about-title" className="yw-story__title">
            온기로 시작해,
            <br />
            손끝으로 완성합니다.
          </h2>
          <p className="yw-story__lead">
            예뻐졌다 WELLNESS STUDIO는 예뻐졌다가 쉼을 더해 만든 자매 브랜드입니다. 국내산 원적외선 온열돔으로 몸을
            따뜻하게 데운 뒤, 두피·얼굴·바디를 1:1로 관리합니다.
          </p>
          <ul className="yw-story__points">
            <li>국내산 명신메디칼 온열돔</li>
            <li>100% 예약제 1:1 관리</li>
            <li>두피 · 얼굴 · 바디 관리</li>
          </ul>
        </div>
        <figure className="yw-story__photo">
          <Pic pic={PICS.ritual2} sizes="(min-width: 64rem) 40vw, 92vw" />
        </figure>
      </div>
    </section>
  )
}
