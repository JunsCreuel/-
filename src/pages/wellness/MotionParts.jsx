import { useEffect, useRef, useState } from 'react'
import { easeOutCubic, onScrollFrame, prefersReducedMotion, useInView } from './motion'

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
    <span ref={ref} className={className}>
      <span className="sr-only">
        {to.toLocaleString('ko-KR')}
        {suffix}
      </span>
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
    return onScrollFrame(({ y }) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
      el.style.setProperty('--p', p.toFixed(4))
    })
  }, [])
  return <div ref={barRef} className="w-progress" aria-hidden="true" />
}

// 흘러가는 문구 띠. 화면에 보이는 동안만 일정한 속도로 천천히 흐르고, 마우스를 올리면 더 느려진다.
// 같은 줄을 COPIES번 이어 붙여 아주 넓은 화면에서도 빈칸이 생기지 않게 하고, 한 줄 길이만큼 흐르면 처음 자리로 돌린다.
const COPIES = 4
const SPEED = 0.45 // 16ms(한 프레임)당 이동 px

export function Marquee({ items, className = '' }) {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const xRef = useRef(0) // 화면 밖으로 나갔다 돌아와도 이어서 흐르도록 위치를 기억한다
  const visible = useInView(wrapRef, { once: false, threshold: 0 })

  useEffect(() => {
    const track = trackRef.current
    const wrap = wrapRef.current
    if (!track || !wrap || !visible || prefersReducedMotion()) return undefined
    let hover = false
    let last = performance.now()
    let raf
    const loop = (now) => {
      const dt = Math.min(50, now - last)
      last = now
      const one = track.scrollWidth / COPIES
      let x = xRef.current - ((hover ? 0.12 : SPEED) * dt) / 16
      if (one > 0 && x <= -one) x += one
      xRef.current = x
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`
      raf = requestAnimationFrame(loop)
    }
    const onEnter = () => {
      hover = true
    }
    const onLeave = () => {
      hover = false
    }
    raf = requestAnimationFrame(loop)
    wrap.addEventListener('pointerenter', onEnter)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
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
        {Array.from({ length: COPIES }, (_, i) => (
          <span key={i} className="w-marquee__copy">
            {row}
          </span>
        ))}
      </div>
    </div>
  )
}

