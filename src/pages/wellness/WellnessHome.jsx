import { BRANCHES } from './data'
import About from './sections/About'
import Branches from './sections/Branches'
import Condition from './sections/Condition'
import CtaBand from './sections/CtaBand'
import CustomerCenter from './sections/CustomerCenter'
import DomeSpot from './sections/DomeSpot'
import Equipment from './sections/Equipment'
import Startup from './sections/Startup'
import Faq from './sections/Faq'
import Hero from './sections/Hero'
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
import './wellness-calm.css'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 랜딩
// 흐름: 메인 슬라이드 → 브랜드 소개 → 부위별 추천 → 관리 프로그램 → 온열돔 오각형 → 장비 → 이벤트 → 후기 → 지점 안내 → 자주 묻는 질문 → 예약 → 창업 → 마지막 장면
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <About />
      <Condition />
      <Programs />
      <DomeSpot />
      <Equipment />
      <Offer />
      <Proof />
      <Branches />
      <Faq />
      <CustomerCenter branch={BRANCHES.zai} />
      <Startup />
      <CtaBand />
    </>
  )
}
