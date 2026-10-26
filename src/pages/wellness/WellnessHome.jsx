import { About, Branches, Condition, CtaBand, Hero, Offer, Programs, Proof } from './sections'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 메인. 휴대폰으로 보는 손님이 많아 관리 프로그램(부위별 추천·메뉴·첫 방문 이벤트)은 메인에서 바로 보이게 둔다.
// 장비·온열돔·창업 등 나머지 자세한 내용은 위쪽 메뉴의 페이지(WellnessPages.jsx)로.
// 흐름: 바다 영상 첫 화면 → 브랜드 소개 → 부위별 추천 → 관리 메뉴·가격 → 첫 방문 이벤트 → 후기 한 줄 → 지점 → 마지막 장면(매장 사진)
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <About />
      <Condition />
      <Programs />
      <Offer />
      <Proof summary />
      <Branches />
      <CtaBand />
    </>
  )
}
