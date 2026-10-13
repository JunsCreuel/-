import { useEffect, useRef, useState } from 'react'

// 아직 확정되지 않은 값의 자리표시. 값이 정해지면 이 컴포넌트를 실제 값으로 교체한다.
// 개발 화면(npm run dev)에서만 보이고, 배포 빌드에서는 그리지 않는다.
export function Todo({ children }) {
  if (import.meta.env.PROD) return null
  return <span className="w-todo">[확인 필요: {children}]</span>
}

// 화면에 들어올 때 서서히 나타나는 래퍼.
// mode="toggle"이면 화면을 벗어날 때 다시 사라져 스크롤마다 fade in/out 된다.
// variant('line' | 'wipe' | 'rise' | 'fade')를 주면 새 섹션용 등장 효과(wellness-x.css의 .yw-rv--*)를 쓴다.
// variant가 없으면 기존 22px 페이드업 그대로다(기존 섹션·마린 페이지용).
const CAN_OBSERVE = typeof IntersectionObserver !== 'undefined'

export function Reveal({ as: Tag = 'div', mode = 'once', delay = 0, variant, className = '', children, ...rest }) {
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
      className={`w-reveal${variant ? ` yw-rv yw-rv--${variant}` : ''}${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { '--w-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
