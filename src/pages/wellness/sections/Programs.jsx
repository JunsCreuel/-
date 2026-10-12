import { useRef, useState } from 'react'
import { PHOTOS, PROGRAMS, SHOW_PRICES, reserveAction, BRANCHES } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

const won = (n) => `${n.toLocaleString('ko-KR')}원`

// 가격 줄: 할인 대상이면 정가 → 50% → 할인가, 아니면 정가만
function Price({ item }) {
  if (!SHOW_PRICES) return null
  if (!item.sale) {
    return (
      <p className="w-pc__price">
        <strong>{won(item.price)}</strong>
      </p>
    )
  }
  return (
    <p className="w-pc__price">
      <s>{won(item.price)}</s>
      <b>50%</b>
      <strong>{won(item.sale)}</strong>
    </p>
  )
}

// 프로그램 메뉴: 세로 사진 카드가 옆으로 넘어간다. 카드에는 이름·시간만, 설명과 가격은 + 버튼으로 펼친다.
export default function Programs() {
  const trackRef = useRef(null)
  const [openId, setOpenId] = useState(null)
  const naver = reserveAction(BRANCHES.zai)

  function slide(dir) {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.w-pc')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="programs" className="w-section w-programs-sec">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Program
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          나에게 맞는 관리 고르기
        </Reveal>
        <p className="w-lead">오늘 가장 신경 쓰이는 곳부터 골라 보세요. 처음이라면 상담에서 컨디션에 맞는 관리를 함께 정해 드립니다.</p>

        <div className="w-pc-wrap">
          <button type="button" className="w-pc-arrow w-pc-arrow--prev" aria-label="이전 프로그램" onClick={() => slide(-1)}>
            ‹
          </button>
          <div className="w-pc-track" ref={trackRef} role="list">
            {PROGRAMS.map((p) => {
              const open = openId === p.id
              return (
                <article key={p.id} className={`w-pc${open ? ' is-open' : ''}${p.fit === 'contain' ? ' w-pc--contain' : ''}`} role="listitem">
                  <img src={PHOTOS[p.photo]} alt="" loading="eager" decoding="async" style={{ objectPosition: p.pos }} />
                  <div className="w-pc__body">
                    <p className="w-pc__en">{p.group}</p>
                    <h3>{p.title}</h3>
                    <ul className="w-tags">
                      <li>{p.time}</li>
                      {p.badge && <li className="is-badge">{p.badge}</li>}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="w-pc__toggle"
                    aria-expanded={open}
                    aria-controls={`w-pc-detail-${p.id}`}
                    aria-label={`${p.title} ${open ? '설명 닫기' : '자세히 보기'}`}
                    onClick={() => setOpenId(open ? null : p.id)}
                  >
                    +
                  </button>
                  <div className="w-pc__detail" id={`w-pc-detail-${p.id}`}>
                    <p className="w-pc__en">
                      {p.group} · {p.time}
                    </p>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <Price item={p} />
                    <button type="button" className="w-btn w-btn--light w-btn--sm" onClick={() => scrollToId('booking')}>
                      {p.title} 상담
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <button type="button" className="w-pc-arrow w-pc-arrow--next" aria-label="다음 프로그램" onClick={() => slide(1)}>
            ›
          </button>
        </div>

        <div className="w-pc-note">
          <p className="w-method__note">
            {SHOW_PRICES ? '가격은 네이버 예약 기준입니다. ' : ''}관리 구성과 소요시간은 컨디션에 따라 달라질 수 있으며 예약 전에 안내해 드립니다.
          </p>
          {naver.external && (
            <a className="w-btn w-btn--primary w-btn--sm" href={naver.href} target="_blank" rel="noopener noreferrer">
              네이버에서 예약하기 ↗
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
