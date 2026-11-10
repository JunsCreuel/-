import { useEffect, useId, useRef, useState } from 'react'
import { BRANCHES, REVIEWS, REVIEW_STATS, SHOW_CLAIM_REVIEWS } from '../data'
import { Folio } from '../editorial'
import { prefersReducedMotion, useInView, useMediaQuery } from '../motion'
import { BTN, H2, SECTION } from '../tw'

// No. 06 Voices — 네이버 방문자 리뷰를 베이지 바탕 위 흰 카드로 모아 보여 준다.
// 카드: 별점 → 관리 꼬리표 → 크게 인용한 한 구절(원문에서 그대로 자른 것) → 원문 전체(인용 구절은 형광펜) → 닉네임·방문일.
// 휴대폰은 1열, 태블릿 2열, 데스크톱 3열. 열마다 카드를 차례로 나눠 담아(1→2→3→1…) 긴 글을 펼쳐도 다른 열은 움직이지 않는다.
// 처음에는 몇 장만 보이고 '후기 더 보기'로 나머지를 연다. 후기 원문(text)은 고치거나 줄이지 않는다.
// 카드는 따로 떠오르는 효과 없이 처음부터 보인다(차분하게 정리한 뒤의 모습).

const LIST = SHOW_CLAIM_REVIEWS ? REVIEWS : REVIEWS.filter((r) => !r.claim)
const LONG = 110 // 이보다 긴 글은 다섯 줄까지만 보이고, 실제로 잘렸으면 '더 읽기'로 펼친다

// 원문 안의 인용 구절을 형광펜으로 표시한다(카드 머리의 큰 문장이 원문 그대로라는 것을 보여 준다).
function Marked({ text, quote }) {
  const at = text.indexOf(quote)
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <mark>{quote}</mark>
      {text.slice(at + quote.length)}
    </>
  )
}

const CARD =
  'flex scroll-mt-[calc(var(--w-nav-h)+1rem)] flex-col  rounded-[1.25rem] bg-white px-[clamp(1.25rem,3.5vw,1.9rem)] pt-[clamp(1.5rem,4vw,2.1rem)] pb-[clamp(1.25rem,3vw,1.6rem)] shadow-[0_1px_2px_color-mix(in_srgb,var(--w-ink)_4%,transparent)] transition-[translate] duration-200 ease-yw motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-deep [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--w-espresso)_30%,transparent)]'
// 메인 한 줄 카드: 옆으로 넘길 때 카드 머리에 맞춰 멈추고, 마우스를 올리면 살짝 떠오른다
const CARD_IN_RAIL = 'snap-start [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1'

function ReviewCard({ review, index, branchLabel, inRail = false }) {
  const [open, setOpen] = useState(false)
  const textId = useId()
  const textRef = useRef(null)
  const long = review.text.length > LONG
  // 접힌 글이 실제로 잘렸는지(넓은 카드에서는 다 들어갈 수 있다). 잘리지 않았으면 '더 읽기'를 숨긴다.
  const [clipped, setClipped] = useState(long)

  useEffect(() => {
    const el = textRef.current
    if (!el || !long || open || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(() => setClipped(el.scrollHeight > el.clientHeight + 1))
    ro.observe(el)
    return () => ro.disconnect()
  }, [long, open])
  const rating = review.rating ?? 5

  return (
    <article className={`${CARD}${inRail ? ` ${CARD_IN_RAIL}` : ''}`} data-i={index} tabIndex={-1}>
      <p className="m-0 text-center text-[0.82rem] tracking-[0.16em] text-accent">
        <span aria-hidden="true">{'★'.repeat(rating)}</span>
        <span className="sr-only">별점 {rating}점</span>
      </p>
      {review.topic && (
        <p className="mx-0 mt-[0.55rem] mb-0 self-center rounded-full border border-line px-[0.7rem] py-[0.18rem] text-[0.75rem] leading-[1.5] text-muted">
          {review.topic}
        </p>
      )}
      <h3 className="mx-0 mt-[0.85rem] mb-0 text-center font-sans text-[clamp(1.08rem,3.6vw,1.22rem)] leading-[1.5] font-bold tracking-[-0.02em] text-balance break-keep text-ink [&_span]:font-en [&_span]:font-medium [&_span]:text-accent">
        <span aria-hidden="true">“</span>
        {review.quote}
        <span aria-hidden="true">”</span>
      </h3>
      <blockquote className="mx-0 mt-4 mb-0 p-0">
        <p
          ref={textRef}
          id={textId}
          data-vc-text
          className={`m-0 text-[0.92rem] leading-[1.8] whitespace-pre-line wrap-anywhere text-[color-mix(in_srgb,var(--w-ink)_72%,#fff)] [&_mark]:rounded-[0.2em] [&_mark]:bg-(--w-highlight) [&_mark]:px-[0.1em] [&_mark]:py-0 [&_mark]:text-ink ${
            long && !open ? 'line-clamp-5' : ''
          }`}
        >
          <Marked text={review.text} quote={review.quote} />
        </p>
      </blockquote>
      {long && (open || clipped) && (
        <button
          type="button"
          data-vc-more
          className="mx-0 mt-[0.2rem] -mb-[0.4rem] min-h-11 min-w-11 cursor-pointer self-start border-0 bg-transparent p-0 [font-family:inherit] text-[0.86rem] leading-[inherit] font-semibold text-accent-deep underline underline-offset-[0.25em] [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink"
          aria-expanded={open}
          aria-controls={textId}
          data-cursor=""
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '접기' : '더 읽기'}
        </button>
      )}
      <footer className="mt-[1.1rem] border-t border-(--w-hair) pt-[0.9rem] text-right text-[0.84rem] leading-[1.55] text-muted [&_b]:font-semibold [&_b]:text-[color-mix(in_srgb,var(--w-ink)_78%,#fff)] [&_p]:m-0">
        <p>
          <b>{review.nick} 고객님</b> ({branchLabel})
        </p>
        <p className="text-[0.76rem]">
          <time dateTime={review.date.replace(/\./g, '-')}>{review.date}</time> 방문 · 네이버 방문자 리뷰
        </p>
      </footer>
    </article>
  )
}

// 머리 오른쪽(휴대폰은 제목 아래) 네이버 리뷰 요약: 별점·리뷰 수와 '이런 점이 좋았어요' 막대.
// 막대는 글자 뒤에 깔린 옅은 막대가 화면에 들어오면 왼쪽부터 찬다(모션 줄이기에서는 처음부터 차 있다).
function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.4 })
  const { rating, total, voters, keywords } = REVIEW_STATS

  return (
    <div ref={ref} className="rounded-[1.25rem] bg-[color-mix(in_srgb,#fff_62%,transparent)] p-[clamp(1.25rem,3vw,1.75rem)]">
      <p className="m-0 inline-flex items-center gap-2 text-[0.84rem] leading-[1.4] font-medium text-ink">
        <i
          className="grid size-5 flex-none place-items-center rounded-[0.3rem] bg-[#03c75a] font-label text-[0.75rem] leading-none font-semibold text-white not-italic"
          aria-hidden="true"
        >
          N
        </i>
        네이버 방문자 리뷰
      </p>
      <p className="mx-0 mt-[0.7rem] mb-0 flex flex-wrap items-baseline gap-x-[0.65rem] gap-y-[0.2rem]">
        <b className="font-en text-[clamp(2.4rem,7vw,3rem)] leading-none font-normal tracking-[-0.01em] normal-nums">{rating}</b>
        <span className="text-[1rem] tracking-[0.12em] text-accent" aria-hidden="true">
          ★★★★★
        </span>
        <span className="sr-only">별점 {rating}점,</span>
        <span className="text-[0.88rem] text-muted [&_b]:font-semibold [&_b]:text-ink [&_b]:tabular-nums">
          리뷰 <b>{total}</b>개
        </span>
      </p>
      <p className="mx-0 mt-[1.1rem] mb-[0.6rem] text-[0.84rem] font-semibold [&_span]:font-normal [&_span]:text-muted">
        이런 점이 좋았어요 <span>({voters}명 참여)</span>
      </p>
      <ul className="m-0 grid list-none gap-[0.4rem] p-0">
        {keywords.map((k, i) => (
          <li
            key={k.label}
            className={`relative flex justify-between gap-4 overflow-hidden rounded-[0.55rem] bg-[color-mix(in_srgb,var(--w-champagne)_18%,#fff)] px-[0.8rem] py-2 text-[0.86rem] leading-[1.4] before:absolute before:inset-y-0 before:left-0 before:w-[calc(var(--v)*100%)] before:origin-left before:bg-[color-mix(in_srgb,var(--w-champagne)_55%,#fff)] before:content-[''] before:[transition:scale_0.5s_var(--yw-ease)_calc(var(--i)*0.06s)] motion-reduce:before:scale-none motion-reduce:before:transition-none [&>b]:relative [&>b]:font-semibold [&>b]:text-accent-deep [&>b]:tabular-nums [&>span]:relative ${
              inView ? 'before:scale-none' : 'before:scale-x-0'
            }`}
            style={{ '--v': k.count / voters, '--i': i }}
          >
            <span>{k.label}</span>
            <b>{k.count}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ARROW =
  'grid size-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-ink bg-transparent p-0 font-en text-[1.7rem] leading-none font-light text-ink transition-[background-color,color] duration-250 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink [@media(hover:hover)_and_(pointer:fine)]:hover:text-white [&>span]:-mt-[0.12em]'

// summary(메인)면 모든 후기를 옆으로 이어진 한 줄 카드로 두고, 화살표 버튼으로 한 장씩 넘긴다(휴대폰은 손가락으로도 넘어간다).
// 후기 페이지는 카드 벽에 몇 장만 보이고 '후기 더 보기'로 나머지를 연다.
export default function Proof({ summary = false }) {
  const branch = BRANCHES.zai
  const mid = useMediaQuery('(min-width: 48rem)')
  const wide = useMediaQuery('(min-width: 64rem)')
  const cols = wide ? 3 : mid ? 2 : 1
  const first = wide ? 6 : 4
  const railRef = useRef(null)
  const [all, setAll] = useState(false)
  const wallRef = useRef(null)
  const focusAt = useRef(null)

  const shown = all ? LIST : LIST.slice(0, first)
  const rest = LIST.length - shown.length
  const columns = Array.from({ length: cols }, (_, c) => shown.filter((_, i) => i % cols === c))

  // '더 보기'로 열린 첫 카드로 포커스를 옮겨 키보드·화면 읽기 사용자가 이어서 읽게 한다.
  useEffect(() => {
    if (focusAt.current === null) return
    wallRef.current?.querySelector(`[data-i="${focusAt.current}"]`)?.focus({ preventScroll: true })
    focusAt.current = null
  }, [all])

  // 후기 줄을 카드 한 장(간격 포함)만큼 옆으로 넘긴다
  function slide(dir) {
    const rail = railRef.current
    const card = rail?.querySelector('[data-i]')
    if (!rail || !card) return
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
    rail.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  function showAll() {
    focusAt.current = shown.length
    setAll(true)
  }

  return (
    <section
      id="reviews"
      className={`${SECTION} overflow-clip bg-[color-mix(in_srgb,var(--w-champagne)_30%,var(--yw-ivory))] [--yw-vc-gap:clamp(0.9rem,2vw,1.5rem)]`}
      data-theme="light"
      aria-labelledby="reviews-title"
    >
      <div className="mx-auto w-full max-w-(--yw-max) mb-[clamp(2.25rem,5vw,4rem)] grid gap-[clamp(1.75rem,4vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-end md:gap-[clamp(2rem,4vw,3rem)]">
        <div>
          <Folio ko="후기" />
          <h2 id="reviews-title" className={H2}>
            다녀가신 분들의 이야기
          </h2>
        </div>
        <Stats />
      </div>

      {summary ? (
        <>
          {/* 섹션 여백 밖까지 화면 끝에서 끝으로 펼치고, 첫 카드는 제목과 같은 선에서 시작한다 */}
          <div
            ref={railRef}
            className="-mx-(--w-gutter) grid auto-cols-[min(84%,23rem)] grid-flow-col items-start gap-(--yw-vc-gap) overflow-x-auto overscroll-x-contain px-(--yw-rail-edge) pt-1 pb-4 [--yw-rail-edge:max(var(--w-gutter),calc((100vw_-_var(--yw-max))/2))] [scrollbar-width:none] scroll-px-(--yw-rail-edge) snap-x snap-mandatory focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-deep [&::-webkit-scrollbar]:hidden"
            tabIndex={0}
            role="region"
            aria-label="방문자 후기"
          >
            {LIST.map((r, i) => (
              <ReviewCard key={`${r.nick}-${r.date}-${i}`} review={r} index={i} branchLabel={branch.label} inRail />
            ))}
          </div>
          <div className="mx-auto w-full max-w-(--yw-max) mt-3 flex justify-end gap-[0.6rem]">
            <button type="button" className={ARROW} aria-label="이전 후기" onClick={() => slide(-1)}>
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className={ARROW} aria-label="다음 후기" onClick={() => slide(1)}>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            ref={wallRef}
            className="mx-auto w-full max-w-(--yw-max) grid grid-cols-[repeat(var(--cols,1),minmax(0,1fr))] items-start gap-(--yw-vc-gap)"
            style={{ '--cols': cols }}
          >
            {columns.map((col, c) => (
              <div key={c} className="grid min-w-0 gap-(--yw-vc-gap)">
                {col.map((r) => {
                  const i = LIST.indexOf(r)
                  return <ReviewCard key={`${r.nick}-${r.date}-${i}`} review={r} index={i} branchLabel={branch.label} />
                })}
              </div>
            ))}
          </div>

          <div className="mx-auto w-full max-w-(--yw-max) mt-[clamp(1.75rem,4vw,2.75rem)] grid justify-items-center gap-6">
            {rest > 0 && (
              <button
                type="button"
                className={`${BTN} [&_i]:font-normal [&_i]:not-italic`}
                data-magnet
                data-cursor=""
                onClick={showAll}
              >
                <span>
                  후기 {rest}개 더 보기 <i aria-hidden="true">+</i>
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
