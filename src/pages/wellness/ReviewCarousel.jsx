import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './motion'
import './wellness-reviews.css'

const INTERVAL = 5000
const PREV_LABEL = '← 이전'
const NEXT_LABEL = '다음 →'

// 가운데 카드를 기준으로 한 상대 위치(-1: 왼쪽, 0: 가운데, 1: 오른쪽). 목록 끝에서 처음으로 이어진다.
function offsetOf(i, active, n) {
  const half = Math.floor(n / 2)
  return ((i - active + n + half) % n) - half
}

const pad = (v) => String(v).padStart(2, '0')

// 후기를 한 장씩 옆으로 넘겨 보여 주는 카드 무대. 가운데 카드가 사진 | 글로 크게 보이고, 양옆 카드는 반투명하게 보인다.
// - 데스크톱: 무대 왼쪽 절반 위에서는 커서 링에 '← 이전', 오른쪽 절반에서는 '다음 →'이 뜨고, 누르면 그 방향으로 넘어간다.
// - 터치: 스와이프하거나 옆 카드를 누르면 넘어간다. 버튼과 ←→ 키는 어디서나 그대로 쓴다.
// - 5초마다 자동으로 넘어가고, 카운터 옆 진행선이 그 시간을 보여 준다. 올리거나 포커스하거나 일시정지하면 선도 멈춘다.
export default function ReviewCarousel({ reviews }) {
  const n = reviews.length
  // prev는 이전 위치로, 목록 끝에서 처음으로 건너뛰는 카드만 애니메이션 없이 옮기기 위해 함께 저장한다.
  const [pos, setPos] = useState({ active: 0, prev: 0 })
  const [paused, setPaused] = useState(() => !!prefersReducedMotion())
  const [hover, setHover] = useState(false)
  const [inView, setInView] = useState(false)
  const stageRef = useRef(null)
  const dragX = useRef(null)
  const swiped = useRef(false) // 방금 끌어서 넘겼으면 이어지는 click은 무시한다
  const pointer = useRef('mouse') // 마지막으로 누른 포인터 종류(mouse | touch | pen)
  const remain = useRef(INTERVAL) // 이번 장에서 자동 넘김까지 남은 시간(멈췄다 다시 갈 때 진행선과 맞춘다)

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

  // 장이 바뀌면 남은 시간을 처음부터 센다(진행선도 key로 새로 그려져 0부터 찬다). 아래 타이머 효과보다 먼저 와야 한다.
  useEffect(() => {
    remain.current = INTERVAL
  }, [pos.active])

  // 멈춘 동안에는 진행선도 멈춰 있으므로, 다시 갈 때는 남은 시간만큼만 기다린다.
  useEffect(() => {
    if (!running) return undefined
    const start = performance.now()
    const t = setTimeout(() => go(pos.active + 1), remain.current)
    return () => {
      clearTimeout(t)
      remain.current = Math.max(0, remain.current - (performance.now() - start))
    }
    // go는 pos.active와 n에만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pos.active])

  function onPointerDown(e) {
    pointer.current = e.pointerType || 'mouse'
    dragX.current = e.clientX
    swiped.current = false
  }

  function onPointerUp(e) {
    if (dragX.current === null) return
    const dx = e.clientX - dragX.current
    dragX.current = null
    if (Math.abs(dx) > 40) {
      swiped.current = true
      go(pos.active + (dx < 0 ? 1 : -1))
    }
  }

  // 마우스가 무대 어느 쪽 절반에 있는지 커서 링 라벨로 알린다(바뀔 때만 쓴다).
  function onPointerMove(e) {
    if (e.pointerType !== 'mouse') return
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const label = e.clientX < r.left + r.width / 2 ? PREV_LABEL : NEXT_LABEL
    if (el.dataset.cursor !== label) el.dataset.cursor = label
  }

  function onClick(e) {
    if (swiped.current || e.target.closest('button, a')) return
    // 글을 끌어 선택한 경우에는 넘기지 않는다.
    if (window.getSelection?.()?.toString()) return
    if (pointer.current === 'mouse') {
      const r = stageRef.current.getBoundingClientRect()
      go(pos.active + (e.clientX < r.left + r.width / 2 ? -1 : 1))
      return
    }
    // 터치: 가운데 카드를 읽다 누른 탭은 무시하고, 옆 카드를 누르면 그 카드로 넘긴다.
    const card = e.target.closest('[data-index]')
    if (card && card.dataset.state !== 'active') go(Number(card.dataset.index))
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowLeft') go(pos.active - 1)
    if (e.key === 'ArrowRight') go(pos.active + 1)
  }

  return (
    <div className="yw-voices__carousel">
      <div
        ref={stageRef}
        className="yw-voices__stage"
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
        onPointerMove={onPointerMove}
        onPointerCancel={() => {
          dragX.current = null
        }}
        onClick={onClick}
      >
        {reviews.map((r, i) => {
          const off = offsetOf(i, pos.active, n)
          const jump = Math.abs(off - offsetOf(i, pos.prev, n)) > 1
          const state = off === 0 ? 'active' : Math.abs(off) === 1 ? 'side' : 'far'
          return (
            <article
              key={r.photo.src}
              className={`yw-voices__card${jump ? ' is-jump' : ''}`}
              data-state={state}
              data-index={i}
              style={{ '--off': off }}
              aria-hidden={off !== 0}
            >
              <div className="yw-voices__photo">
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
              <div className="yw-voices__body">
                <blockquote className="yw-voices__text">{r.text}</blockquote>
                <p className="yw-voices__who">NAVER 리뷰 · 방문 고객</p>
              </div>
            </article>
          )
        })}
      </div>

      {n > 1 && (
        <div className="yw-voices__bar">
          <div className="yw-voices__meta">
            <p className="yw-voices__count" aria-hidden="true">
              {pad(pos.active + 1)} <span>/ {pad(n)}</span>
            </p>
            <span className="yw-voices__timer" key={pos.active} data-run={running ? 'true' : 'false'} aria-hidden="true" />
          </div>
          <div className="yw-voices__btns">
            <button type="button" aria-label="이전 후기" onClick={() => go(pos.active - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={paused ? '자동 넘김 재생' : '자동 넘김 일시정지'}
              aria-pressed={paused}
              onClick={() => setPaused((v) => !v)}
            >
              {paused ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path className="is-fill" d="M8 5.5v13l10.5-6.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M9 6v12M15 6v12" />
                </svg>
              )}
            </button>
            <button type="button" aria-label="다음 후기" onClick={() => go(pos.active + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
