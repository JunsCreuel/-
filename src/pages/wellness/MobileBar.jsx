import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { reserveAction, telHref } from './data'
import { scrollToId } from './scroll'

// 모바일(48rem 미만) 하단 3버튼 독: 전화 · 네이버 예약 · 상담 예약(채움).
// 상담 예약 장(#booking)이나 푸터가 보이면 아래로 숨고, 숨은 동안에는 키보드 포커스도 받지 않는다(inert).
// 아주 좁은 폰(22rem 이하)에서는 아이콘을 빼고 글자를 줄인다.
const ITEM =
  'inline-flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-[0.35rem] rounded-full border-0 px-2 py-0 [font-family:inherit] text-[0.86rem] leading-[1.2] font-semibold whitespace-nowrap no-underline active:scale-97 [&_svg]:size-4 [&_svg]:flex-none [@media(max-width:22rem)]:gap-1 [@media(max-width:22rem)]:text-[0.8rem] [@media(max-width:22rem)]:[&_svg]:hidden'
export default function MobileBar({ branch }) {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const naver = reserveAction(branch)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const targets = [document.getElementById('booking'), document.querySelector('footer[data-site-footer]')].filter(Boolean)
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
      className={`fixed right-4 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-4 z-40 grid gap-1 rounded-full border-2 border-espresso bg-[rgb(255_255_255/0.85)] p-[0.3rem] shadow-[0_10px_30px_rgb(29_26_23/0.16)] backdrop-blur-[12px] transition-[translate] duration-350 ease-yw motion-reduce:transition-none md:hidden ${
        naver.external ? 'grid-cols-[0.8fr_1fr_1.2fr]' : 'grid-cols-[0.8fr_1.2fr]'
      } ${hidden ? 'translate-y-[140%]' : ''}`}
      data-dock
      aria-label="빠른 예약"
      inert={hidden}
    >
      <a className={`${ITEM} bg-transparent text-espresso`} href={telHref(branch.phone)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        전화
      </a>
      {naver.external && (
        <a className={`${ITEM} bg-transparent text-espresso`} href={naver.href} target="_blank" rel="noopener noreferrer">
          네이버 예약
          <span aria-hidden="true">↗</span>
          <span className="sr-only">(새 창)</span>
        </a>
      )}
      <button type="button" className={`${ITEM} bg-espresso text-white`} onClick={() => scrollToId('booking')}>
        상담 예약
      </button>
    </nav>
  )
}
