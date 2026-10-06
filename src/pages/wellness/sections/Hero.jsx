import { BRAND, BRANCHES, PHOTOS, reserveAction } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

export default function Hero() {
  const reserve = reserveAction(BRANCHES.zai)

  return (
    <section id="top" className="w-hero">
      <div className="w-container w-hero__inner">
        <div className="w-hero__text">
          <Reveal as="p" className="w-chip">
            확장 이전 오픈 · 첫 방문 50%
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            예뻐졌다는 말,
            <br />
            몸이 먼저 압니다.
          </Reveal>
          <Reveal as="p" delay={160} className="w-hero__sub">
            4년간 이어 온 손끝 관리에
            <br />
            온열돔의 깊은 온기를 더했습니다.
          </Reveal>
          <Reveal as="p" delay={200} className="w-hero__place">
            부산 용호 자이점 · 100% 예약제
          </Reveal>
          <Reveal delay={260} className="w-hero__actions">
            <a className="w-btn w-btn--primary" href={reserve.href} target="_blank" rel="noopener noreferrer">
              첫 방문 50% 예약하기
            </a>
            <button type="button" className="w-link" onClick={() => scrollToId('programs')}>
              프로그램 보기 ↓
            </button>
          </Reveal>
          <Reveal as="p" delay={320} className="w-hero__trust">
            4년 운영 · 100% 예약제 · 남녀 누구나
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
