import { useEffect, useRef, useState } from 'react'
import { BRANCHES, OFFER_TERM, OFFER_TERM_FULL, PROGRAMS, SALE_COUNT, SHOW_OFFER, SHOW_PRICES, won } from '../data'
import { Folio, ParenLink } from '../editorial'
import { clamp, hasFinePointer, prefersReducedMotion, useInView } from '../motion'
import { scrollToId } from '../scroll'
import './yw-offer.css'

// No. 07 First Visit — 절취선 티켓 한 장(에스프레소 커튼 위).
// 첫 방문 50%는 상시 할인이 아니다. 할인가(sale)가 있는 관리에만(전신 후면 관리, 풀 바디 웜업케어는 제외),
// 첫 방문 고객 1인 1회 한정, 티켓팅 시 첫 방문가 적용, 1회 관리 시 별도 재료 비용(data.js OFFER_TERM·OFFER_TERM_FULL).
// 50%는 늘 'N개 관리'(SALE_COUNT)와 조건 알약(OFFER_TERM)과 한 덩어리로 보인다. 이벤트가 끝나면 data.js SHOW_OFFER를 false로 바꾸면 이 섹션이 사라진다.
const SALE = PROGRAMS.filter((p) => p.sale)

// 티켓 아래 작은 줄: 전체 조건(OFFER_TERM_FULL) 뒤에 이용 안내를 잇는다. ' · ' 덩어리 사이에서만 줄이 바뀌고,
// 가운뎃점은 덩어리 앞 틈에 놓여 줄 머리로 넘어간 덩어리의 점은 잘려 보이지 않는다(줄 끝·줄 머리에 '·'가 홀로 남지 않게, 글자는 DOM에 그대로).
const TICKET_NOTES = [...OFFER_TERM_FULL.split(' · '), '전단지 없이 적용', '100% 예약제']

// 티켓 기울기(±4°)와 빛 반사 위치. 마우스 기기에서만 rAF lerp로 따라가고, 다 따라가면 멈춘다.
const TILT_KEYS = ['rx', 'ry', 'gx', 'gy']
const REST = { rx: 0, ry: 0, gx: 50, gy: 50 }

export default function Offer() {
  if (!SHOW_OFFER) return null
  return <OfferTicket />
}

function OfferTicket() {
  const ticketRef = useRef(null)
  const stubRef = useRef(null)
  const listRef = useRef(null)
  const inView = useInView(ticketRef, { threshold: 0.3 })
  // 좁은 화면에서는 목록이 티켓 아래쪽에 있으므로 목록이 보일 때 금액을 내린다.
  const listInView = useInView(listRef, { threshold: 0.3 })
  const reduced = prefersReducedMotion()
  const [settled, setSettled] = useState(false)
  const settledRef = useRef(false)

  // 등장(1s)이 끝난 뒤에야 기울기를 받는다. 등장 전환이 매 프레임 기울기를 늦게 따라가지 않도록 전환을 끈다.
  useEffect(() => {
    if (!inView) return undefined
    const t = setTimeout(() => {
      settledRef.current = true
      setSettled(true)
    }, 1050)
    return () => clearTimeout(t)
  }, [inView])

  // 좁은 화면의 좌우 반원 홈: 스텁이 시작하는 높이(가로 절취선)를 --cut으로 넘긴다.
  useEffect(() => {
    const el = ticketRef.current
    const stub = stubRef.current
    if (!el || !stub) return undefined
    const set = () => el.style.setProperty('--cut', `${stub.offsetTop + 1}px`)
    set()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 마우스를 티켓 위에서 움직이면 기울고 빛이 따라오며, 벗어나면 제자리로 돌아온다.
  useEffect(() => {
    const el = ticketRef.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined
    const cur = { ...REST }
    const tgt = { ...REST }
    let raf = 0

    const write = () => {
      el.style.setProperty('--rx', cur.rx.toFixed(3))
      el.style.setProperty('--ry', cur.ry.toFixed(3))
      el.style.setProperty('--gx', `${cur.gx.toFixed(2)}%`)
      el.style.setProperty('--gy', `${cur.gy.toFixed(2)}%`)
    }
    const tick = () => {
      let moving = false
      TILT_KEYS.forEach((k) => {
        const d = tgt[k] - cur[k]
        if (Math.abs(d) > 0.01) {
          cur[k] += d * 0.1
          moving = true
        } else {
          cur[k] = tgt[k]
        }
      })
      write()
      raf = moving ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !settledRef.current) return
      const r = el.getBoundingClientRect()
      const nx = clamp((e.clientX - r.left) / Math.max(1, r.width), 0, 1)
      const ny = clamp((e.clientY - r.top) / Math.max(1, r.height), 0, 1)
      tgt.rx = (ny - 0.5) * -8
      tgt.ry = (nx - 0.5) * 8
      tgt.gx = nx * 100
      tgt.gy = ny * 100
      kick()
    }
    const onLeave = () => {
      Object.assign(tgt, REST)
      kick()
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const run = reduced || listInView

  return (
    <section id="offer" className="yw-section yw-dark yw-curtain yw-offer" data-theme="dark" aria-labelledby="offer-title">
      <div className="yw-wrap">
        <article
          ref={ticketRef}
          className={`yw-ticket${inView || reduced ? ' is-in' : ''}${settled ? ' is-settled' : ''}`}
        >
          <div className="yw-ticket__main">
            <Folio no="07" en="First Visit" />
            <h2 id="offer-title" className="yw-ticket__big" aria-label={`${OFFER_TERM}, ${SALE_COUNT}개 관리 50%`}>
              <span className="yw-ticket__label" aria-hidden="true">
                FIRST VISIT
              </span>
              <span className="yw-ticket__row" aria-hidden="true">
                <strong className="yw-ticket__pct">
                  {/* 할인율·가격은 세어 올리지 않고 처음부터 실제 숫자로 보인다(중간 숫자가 잘못된 할인으로 보이지 않게) */}
                  50
                  <small>%</small>
                </strong>
                <span className="yw-ticket__scope">{SALE_COUNT}개 관리</span>
              </span>
              <span className="yw-ticket__term" aria-hidden="true">
                {OFFER_TERM}
              </span>
            </h2>
            <p className="yw-ticket__lead">
              티켓팅 시 아래 {SALE_COUNT}개 관리에 첫 방문가(50%)가 적용됩니다.
            </p>
            <p className="yw-ticket__small">
              {TICKET_NOTES.map((note, i) => (
                <span key={note}>
                  {i > 0 && <span className="yw-ticket__sep"> · </span>}
                  {note}
                </span>
              ))}
            </p>
          </div>

          <div className="yw-ticket__list">
            <p id="offer-list-label" className="yw-ticket__listlabel">
              첫 방문가 적용 관리
            </p>
            <ul ref={listRef} className={run ? 'is-run' : undefined} aria-labelledby="offer-list-label">
              {SALE.map((p, i) => (
                <PriceRow key={p.id} program={p} i={i} />
              ))}
            </ul>
          </div>

          <div ref={stubRef} className="yw-ticket__stub">
            <button
              type="button"
              className="yw-ticket__round"
              data-magnet
              data-cursor=""
              onClick={() => scrollToId('booking')}
            >
              <span>예약하기</span>
            </button>
            <ParenLink href={BRANCHES.zai.booking} external>
              네이버 예약
            </ParenLink>
            <span className="yw-ticket__vert" aria-hidden="true">
              YEPPEO · FIRST VISIT
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}

// 첫 방문가 적용 관리 한 줄: 정가(취소선) → 첫 방문가. 금액은 세어 내리지 않고 처음부터 실제 첫 방문가로 보인다.
// 티켓(조건이 함께 보이는 곳) 안에서만 취소선을 쓴다. 보조기기에는 '정가 130,000원, 첫 방문가 65,000원'으로 읽힌다.
function PriceRow({ program: p, i }) {

  return (
    <li style={{ '--i': i }}>
      <span className="yw-ticket__name">{p.label}</span>
      {SHOW_PRICES && (
        <>
          <span className="yw-ticket__price" aria-hidden="true">
            <s>{won(p.price)}</s>
            <i>→</i>
            <b>{won(p.sale)}</b>
          </span>
          <span className="sr-only">
            정가 {won(p.price)}, 첫 방문가 {won(p.sale)}
          </span>
        </>
      )}
    </li>
  )
}
