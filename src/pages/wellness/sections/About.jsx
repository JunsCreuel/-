import { PICS } from '../data'
import { Pic } from '../editorial'

// 브랜드 소개 — 짧은 한 단락과 사진 한 장. 휴대폰은 위아래, 데스크톱은 글(왼쪽)·사진(오른쪽).
export default function About() {
  return (
    <section id="about" className="yw-section bg-white" data-theme="light" aria-labelledby="about-title">
      <div className="yw-wrap grid items-center gap-[clamp(1.75rem,5vw,3rem)] lg:grid-cols-2 lg:gap-[clamp(3rem,6vw,6rem)]">
        <div>
          <h2
            id="about-title"
            className="m-0 mt-2 font-serif text-[clamp(1.7rem,6.4vw,3rem)] leading-[1.3] font-normal tracking-[-0.02em] break-keep"
          >
            온기로 시작해,
            <br />
            손끝으로 완성합니다.
          </h2>
          <p className="m-0 mt-5 max-w-[34em] text-base leading-[1.8] break-keep text-[color-mix(in_srgb,var(--w-ink)_78%,#fff)]">
            예뻐졌다 WELLNESS STUDIO는 예뻐졌다가 쉼을 더해 만든 자매 브랜드입니다. 국내산 원적외선 온열돔으로 몸을
            따뜻하게 데운 뒤, 두피·얼굴·바디를 1:1로 관리합니다.
          </p>
        </div>
        <figure className="m-0 aspect-[4/3] overflow-clip rounded-[1.25rem] lg:aspect-[4/5] [&_img]:h-full [&_img]:w-full [&_img]:max-w-none [&_img]:object-cover">
          <Pic pic={PICS.aboutNeck} sizes="(min-width: 64rem) 40vw, 92vw" />
        </figure>
      </div>
    </section>
  )
}
