import { About, Branches, CtaBand, Hero, HomePrograms, Proof } from './sections'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 메인 — 짧게 보고 넘어가는 소개만 두고, 자세한 내용은 위쪽 메뉴의 페이지(WellnessPages.jsx)로.
// 흐름: 바다 영상 첫 화면 → 브랜드 소개 → 관리 프로그램 사진 카드 → 후기 한 줄 → 지점 → 마지막 장면(매장 사진)
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <About />
      <HomePrograms />
      <Proof summary />
      <Branches />
      <CtaBand />
    </>
  )
}
