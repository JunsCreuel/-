import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToId } from './scroll'

// 데스크톱(64rem 이상) 오른쪽 아래 회전 씰 배지. 누르면 상담 예약 장으로 내려가고, 그 장이 보이면 숨는다.
// 테두리 글자는 장식(aria-hidden)이며 24초에 한 바퀴 돈다(모션 줄이기면 멈춤). 모바일은 하단 독이 같은 역할을 한다.
const RING_TEXT = 'NAVER BOOKING · 예뻐졌다 · WELLNESS STUDIO · '

export default function FloatingInquiry() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById('booking')
    if (!target || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.12 })
    io.observe(target)
    return () => io.disconnect()
  }, [pathname])

  return (
    <button
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
