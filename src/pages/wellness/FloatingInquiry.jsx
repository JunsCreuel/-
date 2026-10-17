import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { onScrollFrame } from './motion'
import { scrollToId } from './scroll'

// 데스크톱(64rem 이상) 오른쪽 아래 회전 씰 배지. 누르면 상담 예약 장으로 내려가고, 그 장이 보이면 숨는다.
// 테두리 글자는 장식(aria-hidden)이며 24초에 한 바퀴 돈다(모션 줄이기면 멈춤). 모바일은 하단 독이 같은 역할을 한다.
const RING_TEXT = 'NAVER BOOKING · 예뻐졌다 · WELLNESS STUDIO · '

export default function FloatingInquiry() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // 첫 화면(#top, 간편 상담 카드가 주 버튼)과 예약 장(#booking)이 보이는 동안에는 숨긴다.
    const targets = ['top', 'booking'].map((id) => document.getElementById(id)).filter(Boolean)
    if (!targets.length || typeof IntersectionObserver === 'undefined') return undefined
    const seen = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting))
        setHidden([...seen.values()].some(Boolean))
      },
      { threshold: 0.12 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [pathname])

  // 씰 가운데 바로 아래에 있는 장의 data-theme을 씰에 쓴다(바뀔 때만). 어두운 장 위에서는 크림 채움으로 뒤집혀(wellness-x.css)
  // 에스프레소 바탕에 묻히지 않는다. 헤더 테마는 화면 맨 위를 보므로, 장 경계가 화면을 지나는 동안에는 씰 자리와 다를 수 있다.
  useEffect(() => {
    const seal = ref.current
    if (!seal) return undefined
    let last = null
    return onScrollFrame(() => {
      if (!seal.offsetWidth) return // 64rem 미만에서는 씰이 없다(display: none)
      const r = seal.getBoundingClientRect()
      const under = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).find((el) => !seal.contains(el))
      const theme = under?.closest('[data-theme]')?.dataset.theme || 'light'
      if (theme !== last) {
        last = theme
        seal.dataset.theme = theme
      }
    })
  }, [pathname])

  return (
    <button
      ref={ref}
      type="button"
      className={`yw-seal${hidden ? ' is-hidden' : ''}`}
      onClick={() => scrollToId('booking')}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      aria-label="상담 예약"
      data-magnet
    >
      <svg className="yw-seal__ring" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="yw-seal-path" d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" />
        </defs>
        <text>
          <textPath href="#yw-seal-path" textLength="243" lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
      <span>예약</span>
    </button>
  )
}
