import { BRANCHES } from './data'
import About from './sections/About'
import CustomerCenter from './sections/CustomerCenter'
import Equipment from './sections/Equipment'
import Startup from './sections/Startup'
import Faq from './sections/Faq'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Problem from './sections/Problem'
import Programs from './sections/Programs'
import Proof from './sections/Proof'
import './wellness-sections.css'
import './wellness-compose.css'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 랜딩
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <About />
      <Programs />
      <Equipment />
      <Problem />
      <Proof />
      <Offer />
      <Faq />
      <CustomerCenter branch={BRANCHES.zai} />
      <Startup />
    </>
  )
}
