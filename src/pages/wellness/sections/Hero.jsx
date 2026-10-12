import { useEffect, useRef } from 'react'
import { PHOTOS } from '../data'
import { hasFinePointer, prefersReducedMotion } from '../motion'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

// 히어로 모션: 마우스를 따라 사진이 3D로 살짝 기울고 글이 반대로 움직이며(--hx, --hy), 스크롤하면 사진이 천천히 따라온다(--hs).
// 마우스가 없는 터치 기기에서는 스크롤 패럴랙스만, 모션 줄이기 설정이면 모두 끈다.
function useHeroMotion(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    let sraf = 0
    const step = () => {
      cx += (tx - cx) * 0.09
      cy += (ty - cy) * 0.09
      el.style.setProperty('--hx', cx.toFixed(3))
      el.style.setProperty('--hy', cy.toFixed(3))
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(step) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      kick()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      kick()
    }
    const onScroll = () => {
      if (sraf) return
      sraf = requestAnimationFrame(() => {
        sraf = 0
        const r = el.getBoundingClientRect()
        el.style.setProperty('--hs', Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))).toFixed(3))
      })
    }
    const fine = hasFinePointer()
    if (fine) {
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      if (fine) {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(sraf)
    }
  }, [ref])
}

export default function Hero() {
  const heroRef = useRef(null)
  useHeroMotion(heroRef)

  return (
    <section id="top" className="w-hero" ref={heroRef}>
      {/* 분위기용 이미지: 글 뒤에 깔리므로 대체 텍스트는 비워 둔다 */}
      <div className="w-hero__bg" aria-hidden="true">
        <img src={PHOTOS.neck} alt="" width="735" height="1105" decoding="async" fetchpriority="high" />
      </div>

      <div className="w-container w-hero__inner">
        <div className="w-hero__text">
          <Reveal as="p" className="w-chip">
            첫 방문 이벤트 · 50% 할인
          </Reveal>
          <h1 className="w-hero__title w-split">
            <span className="w-split__line">
              <span style={{ '--i': 0 }}>오늘보다 더 예쁜,</span>
            </span>
            <span className="w-split__line">
              <span style={{ '--i': 1 }}>
                <em>내일의 나.</em>
              </span>
            </span>
          </h1>
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
