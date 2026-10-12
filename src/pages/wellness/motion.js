import { useEffect, useRef, useState } from 'react'

// 인터랙티브 효과 공통 도구. 새 라이브러리 없이 IntersectionObserver · requestAnimationFrame · CSS 변수로 만든다.
// 모든 효과는 "모션 줄이기" 설정이면 끄고, 마우스가 없는 터치 기기에서는 포인터 효과를 쓰지 않는다.

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
}

export const easeOutCubic = (t) => 1 - (1 - t) ** 3

// 요소가 화면에 들어오면 true. once면 한 번 켜지면 유지한다.
export function useInView(ref, { once = true, threshold = 0.35 } = {}) {
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold])
  return inView
}

// 값이 바뀔 때 부드럽게 따라가는 숫자(계산기 결과용).
export function useTween(target, duration = 420) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced) return undefined
    const from = fromRef.current
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const v = from + (target - from) * easeOutCubic(t)
      fromRef.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduced])
  return reduced ? target : value
}

// 스크롤에 따라 요소 안의 사진이 살짝 다른 속도로 움직이는 패럴랙스. 요소에 --py(px)를 쓴다.
export function useScrollParallax(ref, strength = 28) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -100 || r.top > vh + 100) return
      const p = (r.top + r.height / 2 - vh / 2) / vh // 화면 가운데 기준 -1~1 정도
      el.style.setProperty('--py', `${(-p * strength).toFixed(1)}px`)
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
  }, [ref, strength])
}

// 성공 순간의 폭죽. 화면 전체를 덮는 캔버스를 잠깐 만들었다가 지운다(모션 줄이기면 아무것도 하지 않는다).
const CONFETTI_COLORS = ['#ff7900', '#ff9a3c', '#ffb074', '#b85200', '#221f1b', '#ffffff']

export function fireConfetti(origin) {
  if (typeof document === 'undefined' || prefersReducedMotion()) return
  const canvas = document.createElement('canvas')
  canvas.className = 'w-confetti'
  canvas.setAttribute('aria-hidden', 'true')
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const W = window.innerWidth
  const H = window.innerHeight
  canvas.width = W * dpr
  canvas.height = H * dpr
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  const ox = origin?.x ?? W / 2
  const oy = origin?.y ?? H * 0.6
  const parts = Array.from({ length: 120 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
    const speed = 6 + Math.random() * 9
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }
  })
  const start = performance.now()
  const LIFE = 1900
  const frame = (now) => {
    const t = now - start
    ctx.clearRect(0, 0, W, H)
    for (const p of parts) {
      p.vy += 0.28
      p.vx *= 0.992
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.globalAlpha = Math.max(0, 1 - t / LIFE)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }
    if (t < LIFE) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}
