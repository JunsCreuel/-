import { useEffect, useRef, useState } from 'react'
import { BRANCHES, PICS } from '../data'
import { ParenLink, Pic } from '../editorial'
import { onScrollFrame, prefersReducedMotion } from '../motion'
import { scrollToId } from '../scroll'
import './yw-closing.css'

// 마지막 장면 — 매장 사진을 화면 가득(가장자리를 늘려 붙이지 않고 원본 사진만) 채우고, 아래쪽에 예약 버튼.
// 섹션이 화면에 들어오면 위가 둥근 아치 모양으로 말려 있던 사진이 화면 가득 넓게 펼쳐지고, 완전히 나갔다가 다시 들어오면 또 펼쳐진다.
// 사진은 세로(4:5)라 가로 화면에서는 위아래가 잘린다. 처음에는 위쪽(간판·화분)이 보이고, 스크롤해 지나가는 동안
// 사진이 조금 느리게 따라 올라가며 아래쪽(세면대·침대)이 드러난다. 휴대폰은 화면 너비에 사진 전체가 그대로 들어간다.
// 모션 줄이기에서는 열린 사진과 버튼을 바로 보여 주고 사진을 움직이지 않는다.
export default function CtaBand() {
  const ref = useRef(null)
  const panRef = useRef(null)
  const reduced = prefersReducedMotion()
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined')
  const open = reduced || inView

  // 섹션이 35% 넘게 보이면 열고, 화면 밖으로 완전히 나가면 닫아 둔다(다시 들어오면 또 열린다)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35) setInView(true)
        else if (!entry.isIntersecting) setInView(false)
      },
      { threshold: [0, 0.35] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  // 사진이 틀보다 길면(가로 화면) 스크롤에 따라 사진을 위로 옮겨 아래쪽을 드러낸다
  useEffect(() => {
    const el = ref.current
    const pan = panRef.current
    if (!el || !pan || reduced) return undefined
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const range = pan.offsetHeight - el.clientHeight
      if (range <= 0) {
        pan.style.transform = ''
        return
      }
      // 섹션이 화면을 다 채운 뒤 빠져나가는 정도. 처음 10%는 그대로 둬서 간판(사진 맨 위)이 상단 바 아래에 보이게 한다
      const f = Math.min(1, Math.max(0, (-r.top / r.height - 0.1) / 0.9))
      pan.style.transform = `translate3d(0, ${(-range * f).toFixed(1)}px, 0)`
    })
  }, [reduced])

  return (
    <section
      id="closing"
      ref={ref}
      className={`yw-close${open ? ' is-open' : ''}${reduced ? ' is-still' : ''}`}
      data-theme="dark"
      aria-labelledby="closing-title"
    >
      <h2 id="closing-title" className="sr-only">
        예뻐졌다 웰니스 스튜디오 예약
      </h2>
      <figure className="yw-close__photo">
        <div ref={panRef} className="yw-close__pan">
          <Pic pic={PICS.closing} sizes="100vw" alt="예뻐졌다 WELLNESS STUDIO 관리실" />
        </div>
      </figure>
      <div className="yw-close__shade" aria-hidden="true" />
      <div className="yw-close__actions">
        <button type="button" className="yw-close__round" data-magnet data-cursor="" onClick={() => scrollToId('booking')}>
          <span>예약하기</span>
        </button>
        <div className="yw-close__links">
          <ParenLink href={BRANCHES.zai.booking} external tone="light">
            네이버 예약
          </ParenLink>
          <button type="button" className="yw-close__small" onClick={() => scrollToId('startup')}>
            창업·운영 상담 →
          </button>
        </div>
      </div>
    </section>
  )
}
