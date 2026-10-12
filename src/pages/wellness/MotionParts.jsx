import { useEffect, useRef, useState } from 'react'
import { easeOutCubic, prefersReducedMotion, useInView } from './motion'

// 0에서 목표값까지 세어 올라가는 숫자. 화면에 들어올 때 한 번 실행하고, 모션 줄이기면 바로 최종값을 보여 준다.
export function CountUp({ to, duration = 1400, className, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const reduced = prefersReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return undefined
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(to * easeOutCubic(t)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, to, duration])

  const shown = reduced ? to : value
  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true">
        {shown.toLocaleString('ko-KR')}
        {suffix}
      </span>
    </span>
  )
}

// 페이지 맨 위의 얇은 스크롤 진행 막대
export function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    const el = barRef.current
    if (!el) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      el.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={barRef} className="w-progress" aria-hidden="true" />
}

// 흘러가는 문구 띠. 기본 속도로 흐르다가 스크롤하면 그 방향으로 빨라지고, 마우스를 올리면 천천히 멈춘다.
export function Marquee({ items, className = '' }) {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const visible = useInView(wrapRef, { once: false, threshold: 0 })

  useEffect(() => {
    const track = trackRef.current
    const wrap = wrapRef.current
    if (!track || !wrap || !visible || prefersReducedMotion()) return undefined
    let x = 0
    let boost = 0
    let hover = false
    let lastY = window.scrollY
    let last = performance.now()
    let raf
    const loop = (now) => {
      const dt = Math.min(50, now - last)
      last = now
      const half = track.scrollWidth / 2
      const base = hover ? 0.2 : 1
      x -= ((base + boost) * dt) / 16
      boost *= 0.92
      if (half > 0) {
        if (x <= -half) x += half
        if (x > 0) x -= half
      }
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`
      raf = requestAnimationFrame(loop)
    }
    const onScroll = () => {
      const dy = window.scrollY - lastY
      lastY = window.scrollY
      boost = Math.max(-14, Math.min(14, boost + dy * 0.12))
    }
    const onEnter = () => {
      hover = true
    }
    const onLeave = () => {
      hover = false
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('scroll', onScroll, { passive: true })
    wrap.addEventListener('pointerenter', onEnter)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      wrap.removeEventListener('pointerenter', onEnter)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [visible])

  const row = items.map((text, i) => (
    <span key={text} className={`w-marquee__item${i % 2 ? ' is-alt' : ''}`}>
      {text}
      <i aria-hidden="true" />
    </span>
  ))

  return (
    <div ref={wrapRef} className={`w-marquee ${className}`} role="group" aria-label={items.join(', ')}>
      <div ref={trackRef} className="w-marquee__track" aria-hidden="true">
        {row}
        {row}
      </div>
    </div>
  )
}

