import { BRANCHES } from './data'
import About from './sections/About'
import CtaBand from './sections/CtaBand'
import CustomerCenter from './sections/CustomerCenter'
import Equipment from './sections/Equipment'
import Startup from './sections/Startup'
import Faq from './sections/Faq'
import Gel from './sections/Gel'
import Hero from './sections/Hero'
import MarqueeStrip from './sections/MarqueeStrip'
import Simulator from './sections/Simulator'
import Numbers from './sections/Numbers'
import QuickInfo from './sections/QuickInfo'
import Offer from './sections/Offer'
import Problem from './sections/Problem'
import Programs from './sections/Programs'
import Proof from './sections/Proof'
import './wellness-sections.css'
import './wellness-compose.css'
import './wellness-merge.css'
import './wellness-palette.css'
import './wellness-motion.css'

// 예뻐졌다 WELLNESS STUDIO 자이점(용호) 랜딩
export default function WellnessHome() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <QuickInfo />
      <About />
      <Numbers />
      <Programs />
      <Equipment />
      <Gel />
      <Problem />
      <Proof />
      <Offer />
      <Faq />
      <CustomerCenter branch={BRANCHES.zai} />
      <Simulator />
      <Startup />
      <CtaBand />
    </>
  )
}
