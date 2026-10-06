import { useEffect, useRef, useState } from 'react'

// 아직 확정되지 않은 값의 자리표시. 값이 정해지면 이 컴포넌트를 실제 값으로 교체한다.
export function Todo({ children }) {
  return <span className="w-todo">[확인 필요: {children}]</span>
}

// 화면에 들어올 때 서서히 나타나는 래퍼.
// mode="toggle"이면 화면을 벗어날 때 다시 사라져 스크롤마다 fade in/out 된다.
export function Reveal({ as: Tag = 'div', mode = 'once', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return undefined
    }
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
      className={`w-reveal${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { '--w-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
