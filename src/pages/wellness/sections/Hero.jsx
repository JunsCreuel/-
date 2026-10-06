import { BRAND, BRANCHES, PHOTOS, reserveAction } from '../data'
import { scrollToId } from '../scroll'
import T from '../T'
import { Reveal } from '../ui'

export default function Hero() {
  const reserve = reserveAction(BRANCHES.zai)

  return (
    <section id="top" className="w-hero">
      <div className="w-container w-hero__inner">
        <div className="w-hero__text">
          <Reveal as="p" className="w-chip">
            <T k="hero.chip" single>
              넓혀서 옮겨 왔어요 · 첫 방문 50%
            </T>
          </Reveal>
          <Reveal as="h1" delay={80} className="w-hero__title">
            <T k="hero.title">머리는 띵하고 얼굴은 푸석한 채로 하루를 버티고 계시죠.</T>
          </Reveal>
          <Reveal as="p" delay={160} className="w-hero__sub">
            <T k="hero.sub">
              두피와 얼굴은 손으로, 몸은 온열돔으로 풀어요. 4년째 해 온 일이고, 이번에 자리를 넓혀 옮겼어요. 평일 낮에 한 번 들러
              보세요.
            </T>
          </Reveal>
          <Reveal as="p" delay={200} className="w-hero__place">
            <T k="hero.place" single>
              용호동 GS하이츠자이 상가 안
            </T>
          </Reveal>
          <Reveal delay={260} className="w-hero__actions">
            <a className="w-btn w-btn--primary" href={reserve.href} target="_blank" rel="noopener noreferrer">
              <T k="hero.cta" single>
                첫 방문 50% 예약하기
              </T>
            </a>
            <button type="button" className="w-link" onClick={() => scrollToId('programs')}>
              어떤 관리가 있는지 보기 ↓
            </button>
          </Reveal>
          <Reveal as="p" delay={320} className="w-hero__trust">
            <T k="hero.trust" single>
              100% 예약제 · 남녀 모두 편하게 오세요
            </T>
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
