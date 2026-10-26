import { BRANCHES } from './data'
import { About, Branches, Condition, CustomerCenter, DomeSpot, Equipment, Faq, Offer, PageHead, Programs, Proof, Startup } from './sections'

// 자이점 하위 페이지(위쪽 메뉴). 주소는 pages.js PAGES, 라우트는 App.jsx에 있다. 페이지마다 짧은 머리(PageHead) 아래 섹션을 싣는다.

export function BrandPage() {
  return (
    <>
      <PageHead title="브랜드" en="Brand Story" />
      <About />
    </>
  )
}

// 부위별 추천 → 관리 메뉴(가격) → 첫 방문 이벤트
export function ProgramPage() {
  return (
    <>
      <PageHead title="관리 프로그램" en="Care Program" />
      <Condition />
      <Programs />
      <Offer />
    </>
  )
}

export function EquipmentPage() {
  return (
    <>
      <PageHead title="장비 소개" en="Equipment" />
      <Equipment />
    </>
  )
}

export function DomePage() {
  return (
    <>
      <PageHead title="온열돔" en="Signature Warm-up" />
      <DomeSpot />
    </>
  )
}

export function ReviewPage() {
  return (
    <>
      <PageHead title="후기" en="Reviews" />
      <Proof />
    </>
  )
}

// 지점 안내 + 예약(간편 상담) + 자주 묻는 질문
export function LocationPage() {
  return (
    <>
      <PageHead title="지점 안내 · 예약" en="Location & Booking" />
      <Branches />
      <CustomerCenter branch={BRANCHES.zai} />
      <Faq />
    </>
  )
}

export function StartupPage() {
  return (
    <>
      <PageHead title="창업" en="Franchise" />
      <Startup />
    </>
  )
}
