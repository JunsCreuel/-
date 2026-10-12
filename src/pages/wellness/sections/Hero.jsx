import { PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

export default function Hero() {
  return (
    <section id="top" className="w-hero">
      {/* 분위기용 이미지: 글 뒤에 깔리므로 대체 텍스트는 비워 둔다 */}
      <div className="w-hero__bg" aria-hidden="true">
        <img src={PHOTOS.moodHero} alt="" width="800" height="668" decoding="async" fetchpriority="high" />
      </div>

      <div className="w-container w-hero__inner">
        <div className="w-hero__text">
          <Reveal as="p" className="w-chip">
            확장 이전 오픈 기념 · 첫 방문 고객 50%
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            온몸을 따뜻하게,
            <br />
            고민 부위는 더 세심하게.
          </Reveal>
          <Reveal as="p" delay={160} className="w-hero__sub">
            명신메디칼 전신 온열돔으로 시작해, 고민 부위에 맞춘 디바이스 아웃케어로 이어집니다. 두피와 얼굴, 복부부터 전신까지. 예뻐졌다 자이점의 토탈 웰니스 케어를 만나보세요.
          </Reveal>
          <Reveal as="p" delay={200} className="w-hero__place">
            부산 용호 · GS하이츠자이 상가 내
          </Reveal>
          {/* 목적이 다른 두 CTA: 고객 상담(채움)과 창업·운영 상담(테두리) */}
          <Reveal delay={260} className="w-hero__actions">
            <button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>
              내게 맞는 관리 상담
            </button>
            <button type="button" className="w-btn" onClick={() => scrollToId('startup')}>
              창업·운영 상담
            </button>
          </Reveal>
          <Reveal delay={290} className="w-hero__sublink">
            <button type="button" className="w-link" onClick={() => scrollToId('warm-ritual')}>
              온열돔 단독 이용 ↓
            </button>
          </Reveal>
          <Reveal as="p" delay={320} className="w-hero__trust">
            4년 운영 · 100% 예약제 · 남녀 고객 모두 이용
          </Reveal>
        </div>
      </div>
    </section>
  )
}
