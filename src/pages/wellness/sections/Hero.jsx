import { PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

export default function Hero() {
  return (
    <section id="top" className="w-hero">
      {/* 분위기용 이미지: 글 뒤에 깔리므로 대체 텍스트는 비워 둔다 */}
      <div className="w-hero__bg" aria-hidden="true">
        <img src={PHOTOS.neck} alt="" width="735" height="1105" decoding="async" fetchpriority="high" />
      </div>

      <div className="w-container w-hero__inner">
        <div className="w-hero__text">
          <Reveal as="p" className="w-chip">
            첫 방문 이벤트 · 50% 할인
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            오늘보다 더 예쁜,
            <br />
            <em>내일의 나.</em>
          </Reveal>
          <Reveal as="p" delay={130} className="w-hero__kicker">
            관리 후 가장 먼저 듣는 말, <span>“예뻐졌다”</span>
          </Reveal>
          <Reveal as="p" delay={170} className="w-hero__sub">
            온열돔으로 몸을 따뜻하게 풀고, 손길과 디바이스로 두피부터 얼굴과 바디까지 섬세하게 관리합니다. 4년 동안 다듬어 온 예뻐졌다의 관리를 용호점에서 만나 보세요.
          </Reveal>
          {/* 목적이 다른 두 CTA: 고객 상담(채움)과 창업·운영 상담(테두리) */}
          <Reveal delay={230} className="w-hero__actions">
            <button type="button" className="w-btn w-btn--primary w-btn--arrow" onClick={() => scrollToId('booking')}>
              나에게 맞는 관리 찾기
            </button>
            <button type="button" className="w-btn" onClick={() => scrollToId('startup')}>
              창업·운영 상담
            </button>
          </Reveal>
          <Reveal delay={260} className="w-hero__sublink">
            <button type="button" className="w-link" onClick={() => scrollToId('about')}>
              관리 방식 보기 ↓
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
