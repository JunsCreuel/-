import { useEffect, useId, useRef, useState } from 'react'
import { BRANCHES, REVIEWS, REVIEW_STATS, SHOW_CLAIM_REVIEWS } from '../data'
import { Folio, ParenLink } from '../editorial'
import { useInView, useMediaQuery } from '../motion'
import './yw-reviews.css'

// No. 06 Voices — 네이버 방문자 리뷰를 베이지 바탕 위 흰 카드로 모아 보여 준다.
// 카드: 별점 → 관리 꼬리표 → 크게 인용한 한 구절(원문에서 그대로 자른 것) → 원문 전체(인용 구절은 형광펜) → 닉네임·방문일.
// 휴대폰은 1열, 태블릿 2열, 데스크톱 3열. 열마다 카드를 차례로 나눠 담아(1→2→3→1…) 긴 글을 펼쳐도 다른 열은 움직이지 않는다.
// 처음에는 몇 장만 보이고 '후기 더 보기'로 나머지를 연다. 후기 원문(text)은 고치거나 줄이지 않는다.

const LIST = SHOW_CLAIM_REVIEWS ? REVIEWS : REVIEWS.filter((r) => !r.claim)
const LONG = 110 // 이보다 긴 글은 다섯 줄까지만 보이고, 실제로 잘렸으면 '더 읽기'로 펼친다
const reviewsHref = (branch) => `https://m.place.naver.com/place/${branch.place}/review/visitor`

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

function ReviewCard({ review, index, col, seen, branchLabel }) {
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
    <article className={`yw-vc${seen ? ' is-in' : ''}`} data-i={index} tabIndex={-1} style={{ '--d': col }}>
      <p className="yw-vc__stars">
        <span aria-hidden="true">{'★'.repeat(rating)}</span>
        <span className="sr-only">별점 {rating}점</span>
      </p>
      {review.topic && <p className="yw-vc__topic">{review.topic}</p>}
      <h3 className="yw-vc__quote">
        <span aria-hidden="true">“</span>
        {review.quote}
        <span aria-hidden="true">”</span>
      </h3>
      <blockquote className="yw-vc__body">
        <p ref={textRef} id={textId} className={`yw-vc__text${long && !open ? ' is-clamped' : ''}`}>
          <Marked text={review.text} quote={review.quote} />
        </p>
      </blockquote>
      {long && (open || clipped) && (
        <button
          type="button"
          className="yw-vc__more"
          aria-expanded={open}
          aria-controls={textId}
          data-cursor=""
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '접기' : '더 읽기'}
        </button>
      )}
      <footer className="yw-vc__by">
        <p>
          <b>{review.nick} 고객님</b> ({branchLabel})
        </p>
        <p className="yw-vc__meta">
          <time dateTime={review.date.replace(/\./g, '-')}>{review.date}</time> 방문 · 네이버 방문자 리뷰
        </p>
      </footer>
    </article>
  )
}

// 머리 오른쪽(휴대폰은 제목 아래) 네이버 리뷰 요약: 별점·리뷰 수와 '이런 점이 좋았어요' 막대.
function Stats({ branch }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.4 })
  const { rating, total, voters, keywords } = REVIEW_STATS

  return (
    <div ref={ref} className={`yw-voices__stats${inView ? ' is-in' : ''}`}>
      <p className="yw-voices__badge">
        <i aria-hidden="true">N</i>
        네이버 방문자 리뷰
      </p>
      <p className="yw-voices__score">
        <b>{rating}</b>
        <span aria-hidden="true">★★★★★</span>
        <span className="sr-only">별점 {rating}점,</span>
        <span className="yw-voices__total">
          리뷰 <b>{total}</b>개
        </span>
      </p>
      <p className="yw-voices__kw-title">
        이런 점이 좋았어요 <span>({voters}명 참여)</span>
      </p>
      <ul className="yw-voices__kw">
        {keywords.map((k, i) => (
          <li key={k.label} style={{ '--v': k.count / voters, '--i': i }}>
            <span>{k.label}</span>
            <b>{k.count}</b>
          </li>
        ))}
      </ul>
      <ParenLink href={reviewsHref(branch)} external className="yw-voices__all">
        네이버에서 리뷰 모두 보기
      </ParenLink>
    </div>
  )
}

export default function Proof() {
  const branch = BRANCHES.zai
  const mid = useMediaQuery('(min-width: 48rem)')
  const wide = useMediaQuery('(min-width: 64rem)')
  const cols = wide ? 3 : mid ? 2 : 1
  const first = wide ? 6 : 4
  const [all, setAll] = useState(false)
  const wallRef = useRef(null)
  // IntersectionObserver가 없는 브라우저에서는 처음부터 모두 보인다.
  const [seen, setSeen] = useState(() => new Set(typeof IntersectionObserver === 'undefined' ? LIST.map((_, i) => i) : []))
  const focusAt = useRef(null)

  const shown = all ? LIST : LIST.slice(0, first)
  const rest = LIST.length - shown.length
  const columns = Array.from({ length: cols }, (_, c) => shown.filter((_, i) => i % cols === c))

  // 카드마다 화면에 들어오면 떠오른다(벽 전체가 길어 한꺼번에 보지 않는다). 같은 줄의 카드는 열 순서대로 조금씩 늦게.
  // '더 보기'로 붙은 카드와 열 수가 바뀌어 새로 그려진 카드도 다시 지켜본다.
  useEffect(() => {
    const wall = wallRef.current
    if (!wall || typeof IntersectionObserver === 'undefined') return undefined
    const cards = [...wall.querySelectorAll('.yw-vc')]
    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries.filter((e) => e.isIntersecting)
        if (!hits.length) return
        hits.forEach((e) => io.unobserve(e.target))
        setSeen((prev) => {
          const next = new Set(prev)
          hits.forEach((e) => next.add(Number(e.target.dataset.i)))
          return next
        })
      },
      { threshold: 0.12 },
    )
    cards.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [shown.length, cols])

  // '더 보기'로 열린 첫 카드로 포커스를 옮겨 키보드·화면 읽기 사용자가 이어서 읽게 한다.
  useEffect(() => {
    if (focusAt.current === null) return
    wallRef.current?.querySelector(`[data-i="${focusAt.current}"]`)?.focus({ preventScroll: true })
    focusAt.current = null
  }, [all])

  function showAll() {
    focusAt.current = shown.length
    setAll(true)
  }

  return (
    <section id="reviews" className="yw-section yw-voices" data-theme="light" aria-labelledby="reviews-title">
      <div className="yw-wrap yw-voices__head">
        <div>
          <Folio ko="후기" />
          <h2 id="reviews-title" className="yw-h2 yw-voices__title">
            다녀가신 분들의 이야기
          </h2>
        </div>
        <Stats branch={branch} />
      </div>

      <div ref={wallRef} className="yw-wrap yw-voices__wall" style={{ '--cols': cols }}>
        {columns.map((col, c) => (
          <div key={c} className="yw-voices__col">
            {col.map((r) => {
              const i = LIST.indexOf(r)
              return (
                <ReviewCard
                  key={`${r.nick}-${r.date}-${i}`}
                  review={r}
                  index={i}
                  col={c}
                  seen={seen.has(i)}
                  branchLabel={branch.label}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="yw-wrap yw-voices__foot">
        {rest > 0 && (
          <button type="button" className="yw-btn yw-voices__show" data-magnet data-cursor="" onClick={showAll}>
            <span>
              후기 {rest}개 더 보기 <i aria-hidden="true">+</i>
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
