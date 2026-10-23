import { useEffect, useRef, useState } from 'react'
import { OFFER_TERM, SHOW_OFFER, SHOW_PRICES, won } from './data'
import { useInView } from './motion'

// 새 섹션이 함께 쓰는 잡지식 부품. 스타일은 wellness-x.css의 yw- 클래스다.

// 섹션 머리의 'No. 0X — English' 폴리오. tone='light'는 어두운 장 위의 샴페인 색이다(.yw-dark 안이면 자동).
export function Folio({ ko, tone = 'ink', className = '' }) {
  return <p className={`yw-folio${tone === 'light' ? ' yw-folio--light' : ''}${className ? ` ${className}` : ''}`}>{ko}</p>
}

// 줄 단위로 마스크를 뚫고 올라오는 제목. lines에는 문자열이나 노드를 줄마다 넣는다.
// trigger 'view'면 화면에 40% 들어올 때, 'mount'면 마운트 다음 프레임에 열린다. open을 주면 그 값을 따른다.
export function SplitLines({ as: Tag = 'h2', lines, className = '', trigger = 'view', open, ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.4 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (trigger !== 'mount') return undefined
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [trigger])

  const on = open !== undefined ? !!open : trigger === 'mount' ? mounted : inView

  return (
    <Tag ref={ref} className={`yw-split${on ? ' is-in' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {lines.map((line, i) => (
        <span key={i} className="yw-line">
          <span style={{ '--i': i }}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

// 문장 사이에 박히는 작은 사진 칩(장식). 화면에 들어오면 가운데서부터 열리고, 마우스 기기에서는 올리면 커진다.
export function InlineChip({ pic, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.6 })
  return (
    <span ref={ref} className={`yw-ichip${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`} aria-hidden="true">
      <img
        src={pic.src}
        srcSet={pic.srcSet}
        sizes="12rem"
        alt=""
        width={pic.width}
        height={pic.height}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}

// '( 네이버 예약 ↗ )' 괄호 링크. href가 있으면 a, 없으면 button이다. 외부 링크는 새 창으로 열고 보조기기에 '(새 창)'을 알린다.
// tone='light'는 어두운 면 위의 크림색이다.
export function ParenLink({ href, external = false, onClick, tone, className = '', children, ...rest }) {
  const cls = `yw-paren${tone === 'light' ? ' yw-paren--light' : ''}${className ? ` ${className}` : ''}`
  const inner = (
    <>
      <span>{children}</span>
      <i className="yw-paren__dot" aria-hidden="true">
        {external ? '↗' : '●'}
      </i>
      {external && <span className="sr-only">(새 창)</span>}
    </>
  )
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  )
}

// 섹션 끝 ※ 각주 한 줄(법적 고지·안내를 모은다). tone='light'는 어두운 면 위.
export function Footnote({ tone, className = '', children }) {
  return (
    <p className={`yw-note${tone === 'light' ? ' yw-note--light' : ''}${className ? ` ${className}` : ''}`}>※ {children}</p>
  )
}

// data.js PICS 항목({ src, srcSet, width, height })을 그리는 img. 분위기 사진은 alt=''가 기본이다.
// priority면 바로 받고(fetchpriority high), 아니면 지연 로딩한다. imgRef로 img.decode()를 미리 부를 수 있다.
export function Pic({ pic, sizes = '100vw', alt = '', className, loading = 'lazy', priority = false, style, imgRef, ...rest }) {
  return (
    <img
      ref={imgRef}
      src={pic.src}
      srcSet={pic.srcSet}
      sizes={pic.srcSet ? sizes : undefined}
      width={pic.width}
      height={pic.height}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : loading}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      {...rest}
    />
  )
}

// 가격 줄: 정가가 기본 가격이고(취소선 없음), 할인 관리면 '첫 방문가 65,000원'과 조건(OFFER_TERM)이 함께 붙는다.
// 첫 방문가는 상시 할인이 아니라 조건부라, 조건 없이 할인가만 보이는 일이 없게 한 덩어리(.yw-price__first)로 그린다.
// 버튼 안에도 들어가도록 span으로 그린다. SHOW_PRICES가 false면 그리지 않고, SHOW_OFFER가 false면 정가만 보인다.
// 화면 표시는 aria-hidden이고, 보조기기에는 '정가 130,000원, 첫 방문가 65,000원, 첫 방문 1인 1회 한정'처럼 읽힌다.
export function PriceLine({ program, compact = false, className = '' }) {
  if (!SHOW_PRICES) return null
  const onSale = SHOW_OFFER && !!program.sale
  return (
    <span className={`yw-price${compact ? ' yw-price--compact' : ''}${onSale ? ' has-sale' : ''}${className ? ` ${className}` : ''}`}>
      <span className="yw-price__vis" aria-hidden="true">
        <strong className="yw-price__now">{won(program.price)}</strong>
        {onSale && (
          <>
            {' '}
            <span className="yw-price__first">
              <span className="yw-price__fare">
                <b>첫 방문가</b> {won(program.sale)}
              </span>{' '}
              <small>{OFFER_TERM}</small>
            </span>
          </>
        )}
      </span>
      <span className="sr-only">
        {onSale ? `정가 ${won(program.price)}, 첫 방문가 ${won(program.sale)}, ${OFFER_TERM}` : `가격 ${won(program.price)}`}
      </span>
    </span>
  )
}
