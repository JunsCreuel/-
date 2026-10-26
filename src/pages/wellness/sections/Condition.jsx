import { useRef, useState } from 'react'
import { BRANCHES, PICS, PROGRAMS } from '../data'
import { Folio, ParenLink, Pic, PriceLine, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView } from '../motion'
import { pickForBooking } from '../scroll'
import './yw-condition.css'

// No. 03 Today's Condition — 부위 사진 타일을 고르면 어울리는 관리가 추천 카드로 바뀌고,
// 그 관리로 상담 예약(w:pick → 예약 장 1단계 미리 선택)까지 이어진다.
// 타일 묶음은 radiogroup + roving tabindex(방향키·Home/End로 이동과 동시에 선택)다.
// 데스크톱(64rem 이상)에서는 카드가 sticky로 따라오고, 모바일에서는 타일을 탭하면 카드가 보이도록 내려 준다.

// area는 상담 폼 '신경 쓰이는 곳'(data.js AREAS) 값과 정확히 같아야 한다. picks는 추천 순서(PROGRAMS id)다.
const CONDITIONS = [
  { id: 'scalp', label: '두피', sub: '두피가 답답한 날', pic: PICS.condScalp, area: '두피 · 얼굴', picks: ['scalp-detox', 'scalp-face'] },
  { id: 'face', label: '얼굴', sub: '얼굴빛이 흐린 날', pic: PICS.condFace, area: '두피 · 얼굴', picks: ['scalp-face', 'scalp-detox'] },
  { id: 'neck', label: '목·어깨', sub: '목선이 신경 쓰이는 날', pic: PICS.condNeck, area: '등 · 어깨', picks: ['lymph-node', 'back-lymph'] },
  { id: 'back', label: '등', sub: '오래 앉아 있던 날', pic: PICS.condBack, area: '등 · 어깨', picks: ['back-lymph', 'full-back'] },
  { id: 'abdomen', label: '복부', sub: '복부 라인이 신경 쓰이는 날', pic: PICS.condAbdomen, area: '복부', picks: ['abdomen', 'warmup'] },
  { id: 'leg', label: '다리', sub: '다리가 무겁게 느껴지는 날', pic: PICS.condLeg, area: '하체 · 림프', picks: ['lower', 'full-back'] },
  { id: 'rest', label: '온열돔 관리', sub: '그냥 따뜻하게 쉬고 싶은 날', pic: PICS.condRest, area: '온열 웜업', wide: true, picks: ['warmup', 'scalp-detox'] },
]

// 부위에 어울리는 관리(picks 순서대로 추천 → 함께 보면 좋은 관리).
function recommend(cond) {
  return cond.picks.map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean)
}

// 방향키 → 이전(-1)/다음(+1)
const KEY_STEP = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }

function Check() {
  return (
    <i className="yw-cond__check" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <polyline points="5.5 12.5 10 17 18.5 7.5" />
      </svg>
    </i>
  )
}

export default function Condition() {
  const [condId, setCondId] = useState('scalp')
  const [showAlt, setShowAlt] = useState(false)
  const tileRefs = useRef([])
  const tilesRef = useRef(null)
  const cardRef = useRef(null)
  const tilesIn = useInView(tilesRef, { threshold: 0.2 })

  const cond = CONDITIONS.find((c) => c.id === condId) || null
  const [top, alt] = cond ? recommend(cond) : []
  const shown = showAlt && alt ? alt : top
  const other = shown === top ? alt : top
  const eyebrow = shown && shown !== top ? '함께 보면 좋은 관리' : '추천 관리'
  const focusIndex = cond ? CONDITIONS.indexOf(cond) : 0

  const select = (id) => {
    setCondId(id)
    setShowAlt(false)
  }

  // 모바일(1열)에서 카드가 화면 아래쪽에 있으면 카드 윗부분이 보이도록 내려 준다.
  const revealCard = () => {
    requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card || window.matchMedia('(min-width: 64rem)').matches) return
      if (card.getBoundingClientRect().top > window.innerHeight * 0.72) {
        card.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
    })
  }

  const onTileClick = (id) => {
    select(id)
    revealCard()
  }

  const onTilesKeyDown = (e) => {
    const n = CONDITIONS.length
    const cur = tileRefs.current.indexOf(e.target.closest('[role="radio"]'))
    if (cur < 0) return
    let next
    if (e.key in KEY_STEP) next = (cur + KEY_STEP[e.key] + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    else return
    e.preventDefault()
    select(CONDITIONS[next].id)
    tileRefs.current[next]?.focus()
  }

  return (
    <section id="concern" className="yw-section yw-curtain yw-cond yw-cond--light" data-theme="light">
      <div className="yw-wrap">
        <Folio ko="부위별 추천" />
        <SplitLines
          as="h2"
          id="cond-title"
          className="yw-h2 yw-cond__title"
          lines={['오늘, 가장 신경 쓰이는 곳은 ', '어디인가요?']}
        />

        <div className="yw-cond__grid">
          <div className="yw-cond__pick">
            <div
              ref={tilesRef}
              className={`yw-cond__tiles${tilesIn ? ' is-in' : ''}`}
              role="radiogroup"
              aria-labelledby="cond-title"
              onKeyDown={onTilesKeyDown}
            >
              {CONDITIONS.map((c, i) => {
                const on = c.id === condId
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tileRefs.current[i] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={i === focusIndex ? 0 : -1}
                    className={`yw-cond__tile${c.wide ? ' is-wide' : ''}`}
                    style={{ '--i': i }}
                    data-cursor=""
                    onClick={() => onTileClick(c.id)}
                  >
                    <Pic pic={c.pic} sizes={c.wide ? '(min-width: 64rem) 45vw, 92vw' : '(min-width: 64rem) 20vw, 45vw'} />
                    <span className="yw-cond__name">{c.label}</span>
                    <span className="yw-cond__sub">{c.sub}</span>
                    <Check />
                  </button>
                )
              })}
            </div>

          </div>

          <aside
            ref={cardRef}
            className={`yw-cond__card${shown ? '' : ' is-empty'}`}
            aria-label="추천 관리"
          >
            {shown ? (
              <>
                <figure key={`photo-${shown.id}`} className="yw-cond__photo">
                  <Pic pic={PICS[shown.pic]} sizes="(min-width: 64rem) 28vw, 90vw" />
                </figure>
                <p className="yw-cond__eyebrow">{eyebrow}</p>
                <div key={`info-${shown.id}`} className="yw-cond__info">
                  <p className="yw-cond__meta">
                    {shown.group} · {shown.time}
                  </p>
                  <h3 className="yw-cond__prog">{shown.label}</h3>
                  <p className="yw-cond__note">{shown.note}</p>
                  <PriceLine program={shown} className="yw-cond__price" />
                </div>
                <div className="yw-cond__actions">
                  <button
                    type="button"
                    className="yw-btn yw-btn--ink yw-cond__cta"
                    data-magnet
                    onClick={() => pickForBooking({ area: cond.area, programId: shown.id, label: shown.label })}
                  >
                    <span>이 관리로 상담 예약</span>
                  </button>
                  <ParenLink href={BRANCHES.zai.booking} external className="yw-cond__naver">
                    네이버 예약
                  </ParenLink>
                </div>
                {other && (
                  <button type="button" className="yw-cond__alt" onClick={() => setShowAlt((v) => !v)}>
                    <span>
                      {shown === top ? '함께 보면 좋은 관리' : '추천 관리'} · {other.label}
                    </span>
                    <i aria-hidden="true">→</i>
                  </button>
                )}
              </>
            ) : (
              <div className="yw-cond__empty">
                <span className="yw-cond__breath" aria-hidden="true" />
                <p>부위를 고르면 어울리는 관리를 보여 드립니다.</p>
              </div>
            )}
            <p className="sr-only" aria-live="polite">
              {shown ? `${cond.label} ${eyebrow} · ${shown.label}` : ''}
            </p>
          </aside>
        </div>

      </div>
    </section>
  )
}
