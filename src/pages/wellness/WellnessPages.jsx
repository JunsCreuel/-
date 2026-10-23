import { BRANCHES, PICS } from './data'
import { About, Branches, CustomerCenter, Equipment, Faq, Offer, PageHero, Programs, Proof, Startup } from './sections'

// 자이점 하위 페이지. 주소는 pages.js PAGES, 라우트는 App.jsx에 있다. 페이지마다 작은 머리(PageHero) 아래 섹션을 싣는다.

export function BrandPage() {
  return (
    <>
      <PageHero title="브랜드" en="Brand Story" pic={PICS.closing} />
      <About />
    </>
  )
}

export function ProgramPage() {
  return (
    <>
      <PageHero title="관리 프로그램" en="Care Program" pic={PICS.condRest} />
      <Programs />
    </>
  )
}

export function EquipmentPage() {
  return (
    <>
      <PageHero title="장비" en="Equipment" pic={PICS.heroWarm} />
      <Equipment />
    </>
  )
}

export function EventPage() {
  return (
    <>
      <PageHero title="이벤트" en="Event" pic={PICS.closing} pos="center 60%" />
      <Offer />
    </>
  )
}

export function ReviewPage() {
  return (
    <>
      <PageHero title="후기" en="Reviews" pic={PICS.condRest} pos="center 70%" />
      <Proof />
    </>
  )
}

// 지점 안내 + 예약(간편 상담) + 자주 묻는 질문
export function LocationPage() {
  return (
    <>
      <PageHero title="지점 안내 · 예약" en="Location & Booking" pic={PICS.heroWarm} pos="center 70%" />
      <Branches />
      <CustomerCenter branch={BRANCHES.zai} />
      <Faq />
    </>
  )
}

export function StartupPage() {
  return (
    <>
      <PageHero title="창업" en="Franchise" pic={PICS.bizStill} pos="center 40%" />
      <Startup />
    </>
  )
}
