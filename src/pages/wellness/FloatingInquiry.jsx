import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToId } from './scroll'

// 넓은 화면(1480px~, 본문 옆 여백이 충분할 때)에서 오른쪽 아래에 떠 있는 상담 예약 버튼. 상담 예약 섹션이 보이면 숨긴다.
// (그보다 좁은 데스크톱은 상단 바의 '상담 예약', 모바일은 하단 예약 바가 같은 역할을 한다.)
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
      상담 예약
    </button>
  )
}
