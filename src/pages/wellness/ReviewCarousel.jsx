import { useEffect, useRef, useState } from 'react'
import './wellness-reviews.css'

const INTERVAL = 5000

// 가운데 카드를 기준으로 한 상대 위치(-1: 왼쪽, 0: 가운데, 1: 오른쪽). 목록 끝에서 처음으로 이어진다.
function offsetOf(i, active, n) {
  const half = Math.floor(n / 2)
  return ((i - active + n + half) % n) - half
}

// 후기를 한 장씩 옆으로 넘겨 보여 주는 카드 스택. 가운데 카드만 또렷하고 양옆 카드는 흐리게 보인다.
export default function ReviewCarousel({ reviews }) {
  const n = reviews.length
  // prev는 이전 위치로, 목록 끝에서 처음으로 건너뛰는 카드만 애니메이션 없이 옮기기 위해 함께 저장한다.
  const [pos, setPos] = useState({ active: 0, prev: 0 })
  const [paused, setPaused] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  const [hover, setHover] = useState(false)
  const [inView, setInView] = useState(false)
  const stageRef = useRef(null)
  const dragX = useRef(null)

  const running = n > 1 && !paused && !hover && inView

  function go(next) {
    setPos((p) => ({ active: ((next % n) + n) % n, prev: p.active }))
  }

  // 화면에 보일 때만 자동으로 넘긴다.
  useEffect(() => {
    const el = stageRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return undefined
    const t = setTimeout(() => go(pos.active + 1), INTERVAL)
    return () => clearTimeout(t)
    // go는 pos.active와 n에만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pos.active])

  function onPointerDown(e) {
    dragX.current = e.clientX
  }

  function onPointerUp(e) {
    if (dragX.current === null) return
    const dx = e.clientX - dragX.current
    dragX.current = null
    if (Math.abs(dx) > 40) go(pos.active + (dx < 0 ? 1 : -1))
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowLeft') go(pos.active - 1)
    if (e.key === 'ArrowRight') go(pos.active + 1)
  }

  return (
    <div className="w-rv">
      <div
        ref={stageRef}
        className="w-rv__stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="고객 후기"
        aria-live={running ? 'off' : 'polite'}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragX.current = null
        }}
      >
        {reviews.map((r, i) => {
          const off = offsetOf(i, pos.active, n)
          const jump = Math.abs(off - offsetOf(i, pos.prev, n)) > 1
          const state = off === 0 ? 'active' : Math.abs(off) === 1 ? 'side' : 'far'
          return (
            <article
              key={r.photo.src}
              className={`w-rv__card${jump ? ' is-jump' : ''}`}
              data-state={state}
              style={{ '--off': off }}
              aria-hidden={off !== 0}
              onClick={off !== 0 ? () => go(i) : undefined}
            >
              <div className="w-rv__photo">
                <img
                  src={r.photo.src}
                  alt={r.photo.alt}
                  width={r.photo.width}
                  height={r.photo.height}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  style={r.photo.position ? { objectPosition: r.photo.position } : undefined}
                />
              </div>
              <blockquote className="w-rv__text">{r.text}</blockquote>
              <p className="w-rv__who">NAVER 리뷰 · 방문 고객</p>
            </article>
          )
        })}
      </div>

      {n > 1 && (
        <div className="w-rv__bar">
          <p className="w-rv__count" aria-hidden="true">
            {String(pos.active + 1).padStart(2, '0')} <span>/ {String(n).padStart(2, '0')}</span>
          </p>
          <div className="w-rv__btns">
            <button type="button" aria-label="이전 후기" onClick={() => go(pos.active - 1)}>
              ‹
            </button>
            <button
              type="button"
              aria-label={paused ? '자동 넘김 재생' : '자동 넘김 일시정지'}
              aria-pressed={paused}
              onClick={() => setPaused((v) => !v)}
            >
              {paused ? '▶' : '❚❚'}
            </button>
            <button type="button" aria-label="다음 후기" onClick={() => go(pos.active + 1)}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
