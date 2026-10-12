import { Marquee } from '../MotionParts'

// 히어로 바로 아래에서 흘러가는 브랜드 키워드 띠. 모두 사이트 안에서 이미 설명하는 내용만 쓴다.
const KEYWORDS = ['온열돔 전신웜업케어', '두피 · 얼굴 관리', '손길과 디바이스 아웃케어', '100% 예약제 · 1:1 관리', '첫 방문 이벤트 50%', '예뻐졌다 WELLNESS STUDIO']

export default function MarqueeStrip() {
  return (
    <section className="w-marquee-sec" aria-label="브랜드 키워드">
      <Marquee items={KEYWORDS} />
    </section>
  )
}
