import { OFFER_TERM, SHOW_OFFER, SHOW_PRICES, won } from './data'

// 새 섹션이 함께 쓰는 잡지식 부품.

// 섹션 머리의 작은 이름표. 차분한 화면을 위해 평소에는 숨기고, show일 때만(지점 안내: 이름표가 곧 제목) 보인다.
// tone='light'는 어두운 장 위의 샴페인 색이다.
export function Folio({ ko, tone = 'ink', show = false, className = '' }) {
  return (
    <p
      className={`mx-0 mt-0 mb-[0.9rem] text-[0.85rem] leading-[1.4] font-semibold tracking-[0.02em] ${tone === 'light' ? 'text-champagne' : 'text-accent-deep'} ${
        show ? '' : 'hidden'
      } ${className}`}
    >
      {ko}
    </p>
  )
}

// 줄 단위로 끊어 쓰는 제목. lines에는 문자열이나 노드를 줄마다 넣는다(차분한 화면을 위해 처음부터 보인다).
export function SplitLines({ as: Tag = 'h2', lines, className = '', ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-clip pb-[0.12em]">
          <span className="inline-block">{line}</span>
        </span>
      ))}
    </Tag>
  )
}

// '네이버 예약 ↗' 밑줄 링크. href가 있으면 a, 없으면 button이다. 외부 링크는 새 창으로 열고 보조기기에 '(새 창)'을 알린다.
// 옅은 밑줄이 늘 있고, 올리면 진해지며 화살표가 조금 나아간다.
// tone: 기본은 둘레 글자색, 'light'는 어두운 면 위의 크림색, 'ink'는 밝은 카드 위의 잉크색(화살표는 짙은 브론즈).
const PAREN_TONE = { light: 'text-cream', ink: 'text-ink' }
export function ParenLink({ href, external = false, onClick, tone, className = '', children, ...rest }) {
  const cls = `group/paren inline-flex min-h-11 cursor-pointer items-center gap-[0.4rem] border-0 bg-transparent p-0 [font-family:inherit] text-[0.95rem] font-medium no-underline ${
    PAREN_TONE[tone] || 'text-inherit'
  } ${className}`
  const inner = (
    <>
      <span className="underline decoration-[color-mix(in_srgb,currentColor_35%,transparent)] decoration-1 underline-offset-[0.35em] transition-[text-decoration-color] duration-250 ease-[ease] group-focus-visible/paren:decoration-current motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/paren:decoration-current">
        {children}
      </span>
      <i
        className={`text-[0.9em] not-italic transition-[translate] duration-250 ease-yw motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/paren:translate-x-[0.2rem] ${
          tone === 'ink' ? 'text-accent-deep' : ''
        }`}
        aria-hidden="true"
      >
        {external ? '↗' : '→'}
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

// 가격 줄: 정가가 기본 가격이고(취소선 없음), 할인 관리면 아래 줄에 '첫 방문가 65,000원 · 조건(OFFER_TERM)'이 붙는다.
// 첫 방문가는 상시 할인이 아니라 조건부라, 조건 없이 할인가만 보이는 일이 없게 한 덩어리로 그린다.
// 조건이 다음 줄로 넘어가면 앞의 가운뎃점은 잘려 보이지 않는다(overflow: clip).
// 버튼 안에도 들어가도록 span으로 그린다. SHOW_PRICES가 false면 그리지 않고, SHOW_OFFER가 false면 정가만 보인다.
// 화면 표시는 aria-hidden이고, 보조기기에는 '정가 130,000원, 첫 방문가 65,000원, 첫 방문 1인 1회 한정'처럼 읽힌다.
export function PriceLine({ program, inline = true, className = '' }) {
  if (!SHOW_PRICES) return null
  const onSale = SHOW_OFFER && !!program.sale
  return (
    <span className={`${inline ? 'inline-flex' : 'flex'} flex-wrap items-baseline gap-x-3 gap-y-[0.3rem] lining-nums tabular-nums ${className}`}>
      <span className="contents" aria-hidden="true">
        <strong className="font-label text-[1.08em] font-medium tracking-[0.01em] whitespace-nowrap">{won(program.price)}</strong>
        {onSale && (
          <>
            {' '}
            <span className="flex min-w-0 basis-full flex-wrap items-baseline gap-x-[1.1em] gap-y-[0.15rem] overflow-clip text-[0.88em] leading-[1.45] text-accent-deep">
              <span className="font-label font-medium tracking-[0.01em] whitespace-nowrap [&_b]:font-sans [&_b]:font-semibold [&_b]:tracking-[0]">
                <b>첫 방문가</b> {won(program.sale)}
              </span>{' '}
              <small className="relative text-[0.86em] tracking-[0] whitespace-nowrap text-muted before:absolute before:right-full before:mr-[0.45em] before:content-['·']">
                {OFFER_TERM}
              </small>
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
