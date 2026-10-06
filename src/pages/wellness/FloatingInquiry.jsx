import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToId } from './scroll'

// 데스크톱에서 오른쪽 아래에 떠 있는 상담 예약 버튼. 상담 예약 섹션이 보이면 숨긴다.
// (모바일은 하단 예약 바가 같은 역할을 해서 보이지 않는다.)
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
      className={`w-float${hidden ? ' is-hidden' : ''}`}
      onClick={() => scrollToId('booking')}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.7 6.2L4.8 21l4-2.2c.9.2 2.2.4 3.2.4 5.5 0 10-3.6 10-8.2S17.5 3 12 3Z" fill="currentColor" />
      </svg>
      상담 예약
    </button>
  )
}
