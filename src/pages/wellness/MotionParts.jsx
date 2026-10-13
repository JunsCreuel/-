import { useEffect, useRef, useState } from 'react'
import { easeOutCubic, onScrollFrame, prefersReducedMotion, useInView } from './motion'

// 0에서 목표값까지 세어 올라가는 숫자. 화면에 들어올 때 한 번 실행하고, 모션 줄이기면 바로 최종값을 보여 준다.
// start를 주면 숫자 자신 대신 그 값(true가 되는 때)에 맞춰 시작한다. 등장 효과로 늦게 보이는 덩어리(첫 방문 티켓) 안의 숫자가
// 덩어리가 아직 투명할 때 다 세어 버리지 않게, 덩어리의 등장 시점에 묶을 때 쓴다.
export function CountUp({ to, duration = 1400, className, suffix = '', start }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const inView = start ?? seen
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
