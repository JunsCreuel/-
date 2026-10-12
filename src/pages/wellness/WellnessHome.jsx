import { BRANCHES } from './data'
import About from './sections/About'
import Condition from './sections/Condition'
import CtaBand from './sections/CtaBand'
import CustomerCenter from './sections/CustomerCenter'
import Equipment from './sections/Equipment'
import Startup from './sections/Startup'
import Faq from './sections/Faq'
import Hero from './sections/Hero'
import MarqueeStrip from './sections/MarqueeStrip'
import Offer from './sections/Offer'
import Programs from './sections/Programs'
import Proof from './sections/Proof'
import './wellness-sections.css'
import './wellness-compose.css'
import './wellness-merge.css'
import './wellness-palette.css'
import './wellness-motion.css'
// 새 랜딩 공통 스타일(yw-)은 기존 CSS를 덮을 수 있도록 가장 마지막에 불러온다.
import './wellness-x.css'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 랜딩
// 흐름: 표지 → 리본 → 이야기·관리 순서 → 고민 부위 → 메뉴 → 장비·젤 → 후기 → 첫 방문 → Q&A → 예약·오시는 길 → 창업 → 마지막 장면
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <About />
      <Condition />
      <Programs />
      <Equipment />
      <Proof />
      <Offer />
      <Faq />
      <CustomerCenter branch={BRANCHES.zai} />
      <Startup />
      <CtaBand />
    </>
  )
}
