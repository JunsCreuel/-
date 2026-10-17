import { useEffect, useRef, useState } from 'react'
import { clamp, onScrollFrame, prefersReducedMotion, useInView } from '../motion'
import './yw-hero.css'

// 02 Ribbon — 세리프 단어 마키(단어 사이 사진 칩은 v20에서 뺐다)
// 평소에는 천천히 왼쪽으로 흐르고, 스크롤 속도·방향을 따라 빨라지거나 거꾸로 흐른다. 마우스를 올리면 느려지고,
// 손가락이나 마우스로 가로로 끌면 손을 따라 감긴다(세로 스크롤은 막지 않는다). 모션 줄이기면 한 벌만 정적으로 줄바꿈한다.

const ITEMS = [{ en: 'Warm up' }, { en: 'Out care' }, { en: 'Scalp' }, { en: 'Face' }, { en: 'Body' }, { en: 'Rest' }]

const COPIES = 4
const SPEED = 0.45 // 16ms당 px
const HOVER_SPEED = 0.12
const DRAG_START = 10

function Copy() {
  return (
    <span className="yw-ribbon__copy">
      {ITEMS.map((item, i) => (
        <span className="yw-ribbon__item" key={item.en}>
          <span className={`yw-ribbon__word${i % 2 === 1 ? ' is-outline' : ''}`}>{item.en}</span>
          <i className="yw-ribbon__dot">·</i>
        </span>
      ))}
    </span>
  )
}

export default function MarqueeStrip() {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const [reduced] = useState(prefersReducedMotion)
  const inView = useInView(wrapRef, { once: false, threshold: 0 })
  // 화면을 벗어났다 돌아와도 이어서 흐르도록 위치·방향은 ref에 둔다
  const state = useRef({ x: 0, dir: 1 })

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (reduced || !inView || !wrap || !track) return undefined
    const s = state.current
    let one = 0
    let boost = 0
    let target = 0
    let hover = false
    let raf = 0
    let lastT = 0
    // 끌기
    let pid = null
    let startX = 0
    let startPos = 0
    let dragging = false
    let lastX = 0
    let lastMoveT = 0
    let vx = 0

    const wrapX = (v) => {
      if (!one) return v
      let n = v % one
      if (n > 0) n -= one
      return n
    }

    const measure = () => {
      const first = track.firstElementChild
      one = first ? first.getBoundingClientRect().width : track.scrollWidth / COPIES
      s.x = wrapX(s.x)
    }

    const paint = () => {
      track.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`
    }

    const tick = (now) => {
      const dt = lastT ? clamp(now - lastT, 1, 64) : 16
      lastT = now
      boost += (target - boost) * 0.08
      target *= 0.9
      if (!dragging) {
        s.x = wrapX(s.x - s.dir * ((hover ? HOVER_SPEED : SPEED) + boost) * (dt / 16))
        paint()
      }
      raf = requestAnimationFrame(tick)
    }

    const unsub = onScrollFrame(({ vy }) => {
      target = Math.min(5, Math.abs(vy) * 0.35)
      if (vy < -0.5) s.dir = -1
      else if (vy > 0.5) s.dir = 1
    })

    const onEnter = (e) => {
      if (e.pointerType === 'mouse') hover = true
    }
    const onLeave = (e) => {
      if (e.pointerType === 'mouse') hover = false
    }

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      pid = e.pointerId
      startX = lastX = e.clientX
      startPos = s.x
      lastMoveT = performance.now()
      vx = 0
      dragging = false
    }

    const onMove = (e) => {
      if (e.pointerId !== pid) return
      const dx = e.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) <= DRAG_START) return
        dragging = true
        wrap.classList.add('is-dragging')
        try {
          wrap.setPointerCapture(pid)
        } catch {
          /* 이미 놓인 포인터 */
        }
      }
      const now = performance.now()
      vx = vx * 0.3 + ((e.clientX - lastX) / Math.max(1, now - lastMoveT)) * 16 * 0.7
      lastX = e.clientX
      lastMoveT = now
      s.x = wrapX(startPos + dx)
      paint()
    }

    const onUp = (e) => {
      if (e.pointerId !== pid) return
      pid = null
      if (!dragging) return
      dragging = false
      wrap.classList.remove('is-dragging')
      // 휙 던지고 놓으면 그 방향으로 잠깐 빨라졌다가 원래 속도로 돌아온다
      if (performance.now() - lastMoveT < 80 && Math.abs(vx) > 1) {
        s.dir = vx < 0 ? 1 : -1
        target = Math.min(5, Math.abs(vx) * 0.35)
        boost = target
      }
    }

    const onDragStart = (e) => e.preventDefault()

    measure()
    paint()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(track)
    raf = requestAnimationFrame(tick)

    wrap.addEventListener('pointerenter', onEnter)
    wrap.addEventListener('pointerleave', onLeave)
    wrap.addEventListener('pointerdown', onDown)
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerup', onUp)
    wrap.addEventListener('pointercancel', onUp)
    wrap.addEventListener('dragstart', onDragStart)
    return () => {
      cancelAnimationFrame(raf)
      unsub()
      ro?.disconnect()
      wrap.classList.remove('is-dragging')
      wrap.removeEventListener('pointerenter', onEnter)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointerdown', onDown)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerup', onUp)
      wrap.removeEventListener('pointercancel', onUp)
      wrap.removeEventListener('dragstart', onDragStart)
    }
  }, [reduced, inView])

  return (
    <section className={`yw-ribbon${reduced ? ' yw-ribbon--static' : ''}`} data-theme="light">
      <div className="yw-ribbon__wrap" ref={wrapRef} role="group" aria-label="온열 웜업, 아웃케어, 두피, 얼굴, 바디, 휴식">
        <div className="yw-ribbon__track" ref={trackRef} aria-hidden="true">
          {Array.from({ length: reduced ? 1 : COPIES }, (_, i) => (
            <Copy key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
