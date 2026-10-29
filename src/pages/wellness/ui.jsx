import { useEffect, useRef, useState } from 'react'

// 아직 확정되지 않은 값의 자리표시. 값이 정해지면 이 컴포넌트를 실제 값으로 교체한다.
// 개발 화면(npm run dev)에서만 보이고, 배포 빌드에서는 그리지 않는다.
export function Todo({ children }) {
  if (import.meta.env.PROD) return null
  return (
    <span className="mx-[0.15em] my-0 inline-block rounded-[2px] bg-(--w-hair) px-[0.5em] py-0 text-[0.82em] leading-[1.7] font-medium text-ink">
      [확인 필요: {children}]
    </span>
  )
}

// 화면에 들어올 때 22px 아래에서 서서히 떠오르는 래퍼(마린시티점 페이지용). delay(ms)만큼 늦게 시작한다.
// mode="toggle"이면 화면을 벗어날 때 다시 사라져 스크롤마다 fade in/out 된다. 모션 줄이기에서는 처음부터 보인다.
const CAN_OBSERVE = typeof IntersectionObserver !== 'undefined'

export function Reveal({ as: Tag = 'div', mode = 'once', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(!CAN_OBSERVE)

  useEffect(() => {
    const el = ref.current
    if (!el || !CAN_OBSERVE) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (mode === 'once') io.disconnect()
        } else if (mode === 'toggle') {
          setShown(false)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mode])

  return (
    <Tag
      ref={ref}
      className={`[transition:opacity_0.4s_ease_var(--w-delay,0ms),transform_0.4s_ease_var(--w-delay,0ms)] motion-reduce:opacity-100 motion-reduce:[transform:none] motion-reduce:transition-none ${
        shown ? 'opacity-100 [transform:none]' : 'opacity-0 [transform:translateY(22px)]'
      } ${className}`}
      style={delay ? { '--w-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
