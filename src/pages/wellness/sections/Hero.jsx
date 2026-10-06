import { BRAND, PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

export default function Hero() {
  return (
    <section id="top" className="w-hero">
      <div className="w-container w-hero__inner">
        <div className="w-hero__text">
          <Reveal as="p" className="w-chip">
            확장 이전 오픈 기념 · 첫 방문 고객 50%
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            온열돔과 아웃케어로
            <br />
            완성하는 전신 웰니스
          </Reveal>
          <Reveal as="p" delay={160} className="w-hero__sub">
            전신 온열돔의 깊고 균일한 온열감에 손으로 직접 진행하는 아웃케어를 결합했습니다. 두피와 얼굴부터 전신까지, 하나의
            흐름으로 관리합니다.
          </Reveal>
          <Reveal as="p" delay={200} className="w-hero__place">
            부산 용호 · GS하이츠자이 상가 내
          </Reveal>
          <Reveal delay={260} className="w-hero__actions">
            <button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>
              상담 예약하기
            </button>
            <button type="button" className="w-link" onClick={() => scrollToId('about')}>
              차별점 보기 ↓
            </button>
          </Reveal>
          <Reveal as="p" delay={320} className="w-hero__trust">
            4년 운영 · 100% 예약제 · 남녀 고객 모두 이용
          </Reveal>
        </div>

        <Reveal mode="toggle" className="w-hero__media">
          <figure className="w-photo">
            <img
              src={PHOTOS.neck}
              alt="따뜻한 빛이 닿은 목선과 쇄골"
              width="735"
              height="1105"
              decoding="async"
            />
          </figure>
          <p className="w-hero__tag">{BRAND.tagline}</p>
        </Reveal>
      </div>
    </section>
  )
}
