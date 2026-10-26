import { Branches, CtaBand, Hero, HomeIntro, HomeMarquee, HomePrograms, Proof } from './sections'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 메인 — 짧게 보고 넘어가는 소개만 두고, 자세한 내용은 위쪽 메뉴의 페이지(WellnessPages.jsx)로.
// 흐름: 잎 영상 → 브랜드 한 단락·숫자 → 관리 프로그램 사진 카드 → 영문 띠 → 후기 한 줄 → 지점 → 마지막 장면(매장 사진)
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <HomeIntro />
      <HomePrograms />
      <HomeMarquee />
      <Proof summary />
      <Branches />
      <CtaBand />
    </>
  )
}
