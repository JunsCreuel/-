import { BRANCHES } from './data'
import About from './sections/About'
import Booking from './sections/Booking'
import Equipment from './sections/Equipment'
import Faq from './sections/Faq'
import Gels from './sections/Gels'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Programs from './sections/Programs'
import Proof from './sections/Proof'
import './wellness-home.css'

// 예뻐졌다 WELLNESS STUDIO 용호 자이점 랜딩
export default function WellnessHome() {
  return (
    <div className="ws">
      <Hero />
      <About />
      <Programs />
      <Equipment />
      <Gels />
      <Proof />
      <Offer />
      <Booking branch={BRANCHES.zai} />
      <Faq />
    </div>
  )
}
