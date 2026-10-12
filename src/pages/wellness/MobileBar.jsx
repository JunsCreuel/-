import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { reserveAction, telHref } from './data'
import { scrollToId } from './scroll'

// 모바일(48rem 미만) 하단 3버튼 독: 전화 · 네이버 예약 · 상담 예약(채움).
// 상담 예약 장(#booking)이나 푸터가 보이면 아래로 숨고, 숨은 동안에는 키보드 포커스도 받지 않는다(inert).
export default function MobileBar({ branch }) {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const naver = reserveAction(branch)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const targets = [document.getElementById('booking'), document.querySelector('.w-footer')].filter(Boolean)
    if (!targets.length) return undefined
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

  return (
    <nav
      className={`yw-dock${naver.external ? '' : ' yw-dock--two'}${hidden ? ' is-hidden' : ''}`}
      aria-label="빠른 예약"
      inert={hidden}
    >
      <a className="yw-dock__item" href={telHref(branch.phone)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        전화
      </a>
      {naver.external && (
        <a className="yw-dock__item" href={naver.href} target="_blank" rel="noopener noreferrer">
          네이버 예약
          <span aria-hidden="true">↗</span>
          <span className="sr-only">(새 창)</span>
        </a>
      )}
      <button type="button" className="yw-dock__item yw-dock__item--fill" onClick={() => scrollToId('booking')}>
        상담 예약
      </button>
    </nav>
  )
}
