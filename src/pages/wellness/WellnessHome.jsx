import { BRANCHES } from './data'
import About from './sections/About'
import FaqCta from './sections/FaqCta'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Problem from './sections/Problem'
import Programs from './sections/Programs'
import Proof from './sections/Proof'
import Visit from './sections/Visit'
import './wellness-sections.css'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 랜딩
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <Problem />
      <About />
      <Programs />
      <Proof />
      <Offer />
      <FaqCta />
      <Visit branch={BRANCHES.zai} />
    </>
  )
}
