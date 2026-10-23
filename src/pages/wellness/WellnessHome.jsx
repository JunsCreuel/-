import { Branches, Equipment, Hero, HomeCta, HomeIntro, HomePrograms, Proof } from './sections'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 메인
// 메인은 짧게 두고 자세한 내용은 하위 페이지(WellnessPages.jsx)로 나눈다.
// 흐름: 메인 슬라이드 → 짧은 브랜드 문구 → 관리 프로그램 사진 카드 → 장비 → 후기 요약 → 지점 안내 → 상담 유도 띠
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <HomeIntro />
      <HomePrograms />
      <Equipment />
      <Proof summary />
      <Branches />
      <HomeCta />
    </>
  )
}
