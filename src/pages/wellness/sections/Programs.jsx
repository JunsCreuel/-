import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import {
  BRANCHES,
  OFFER_TERM,
  OFFER_TERM_FULL,
  PICS,
  PROGRAMS,
  SALE_COUNT,
  SHOW_OFFER,
  SHOW_PRICES,
  won,
} from '../data'
import { Folio, Footnote, ParenLink, Pic, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView, useMediaQuery } from '../motion'
import { pickForBooking } from '../scroll'
import './yw-menu.css'

// 펼친 줄 사진(모바일·태블릿)의 대체 텍스트. 분위기 사진이라 장면만 적고 '마사지' 같은 말은 쓰지 않는다.
const ALT = {
  'scalp-detox': '두 손으로 뒷머리를 받친 두피 케어 장면',
  'scalp-face': '클렌징 거품을 바른 옆얼굴',
  'back-lymph': '어깨와 등을 감싸는 손길',
  abdomen: '수건을 덮은 허리와 옆구리를 관리하는 손',
  lower: '수건 위에서 발과 발목을 관리하는 손',
  'full-back': '수건을 덮고 엎드린 등에 얹은 두 손',
  'lymph-node': '목선과 쇄골에 닿은 손끝',
  warmup: '간접 조명이 비치는 원목 선반 위 수건',
}

const TOTAL = String(PROGRAMS.length).padStart(2, '0')
const numberOf = (i) => String(i + 1).padStart(2, '0')

// 이름 옆 작은 표시는 영문 대문자로 쓰고(인기 → BEST), 보조기기에는 원래 말로 읽힌다.
const BADGE_EN = { 인기: 'BEST' }

// 필터 탭: 전체 + PROGRAMS.group 순서대로. 탭 글자는 가운뎃점 앞뒤 공백을 뺀다(두피 · 얼굴 → 두피·얼굴).
// 개수는 화면에 쓰지 않고 보조기기에만 알린다.
const FILTERS = [
  { id: 'all', label: '전체', count: PROGRAMS.length },
  ...[...new Set(PROGRAMS.map((p) => p.group))].map((g) => ({
    id: g,
    label: g.replace(/\s*·\s*/g, '·'),
    count: PROGRAMS.filter((p) => p.group === g).length,
  })),
]

const matches = (filter, p) => filter === 'all' || p.group === filter

// 화면에 쓰는 이름: ' + '로 이어진 이름은 '앞 이름'과 '+ 뒤 이름'을 각각 한 덩어리(inline-block)로 묶는다(데이터는 그대로).
// 줄이 바뀔 때는 덩어리 사이에서만 바뀌어 '풀 바디 웜업케어 / + 아로마테라피'가 된다(+가 줄 끝에 홀로 남지 않고,
// 줄 바꿈 없는 공백으로 붙이면 크롬의 text-wrap: balance가 '풀 바디 / 웜업케어 + …'로 치우치게 나누는 문제도 없다).
// 덩어리 하나가 칸보다 넓으면 그 안에서 다시 줄이 바뀌어 넘치지 않는다.
function DisplayName({ label }) {
  const parts = label.split(' + ')
  if (parts.length === 1) return label
  return parts.map((part, i) => (
    <Fragment key={part}>
      {i > 0 && ' '}
      <span className="yw-menu__nb">{i > 0 ? `+ ${part}` : part}</span>
    </Fragment>
  ))
}

// 첫 방문가는 가격·이벤트가 모두 켜져 있고 할인(sale)이 있는 관리에만 보인다. 조건 안내도 그때만 보인다.
const onSale = (p) => SHOW_PRICES && SHOW_OFFER && !!p.sale
const SHOW_TERMS = SHOW_PRICES && SHOW_OFFER && SALE_COUNT > 0

// 조건 문구(data.js OFFER_TERM_FULL 그대로)를 ' · ' 앞뒤 덩어리로 감싸, 좁은 화면에서는 덩어리 사이에서만 줄이 바뀌게 한다.
// 휴대폰에서는 두 덩어리를 두 줄로 쌓고 가운뎃점을 숨긴다(줄 끝에 '·'가 홀로 남지 않게). 글자는 DOM에 그대로 남는다.
function Terms() {
  return OFFER_TERM_FULL.split(' · ').map((part, i) => (
    <Fragment key={part}>
      {i > 0 && <span className="yw-menu__sep"> · </span>}
      <span className="yw-menu__nb">{part}</span>
    </Fragment>
  ))
}

// 왼쪽 sticky 프레임(데스크톱 전용, 장식). 8장을 겹쳐 두고 켜진 사진(data-on)만 왼쪽→오른쪽으로 와이프해 연다.
// 직전 사진(data-prev)은 와이프가 끝날 때까지 바로 아래에 남겨 빈틈이 보이지 않게 한다.
// 겹친 사진은 clip-path로 가려져 있어 브라우저 지연 로딩이 시작되지 않는다. 프레임이 가까워지면(화면 한 장 앞) 8장을 한꺼번에 받는다.
// 등장 판정도 clip-path가 없는 figure로 한다(프레임 자체는 처음에 완전히 가려져 있다).
function MenuFrame({ frame, imgRefs, onWiped }) {
  const figRef = useRef(null)
  const inView = useInView(figRef, { threshold: 0.2 })
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined')
  const current = PROGRAMS[frame.on]

  useEffect(() => {
    const el = figRef.current
    if (!el || near) return undefined
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  return (
    <aside className="yw-menu__aside" aria-hidden="true">
      <span className="yw-menu__ghost">Menu</span>
      <figure ref={figRef} className="yw-menu__figure">
        <div
          className={`yw-menu__frame${inView ? ' is-in' : ''}`}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'clip-path' && e.target.hasAttribute('data-on')) onWiped()
          }}
        >
          {PROGRAMS.map((p, i) => (
            <Pic
              key={p.id}
              pic={PICS[p.pic]}
              sizes="(min-width: 90rem) 33rem, 36vw"
              alt=""
              loading={near ? 'eager' : 'lazy'}
              imgRef={(el) => {
                imgRefs.current[i] = el
              }}
              data-on={i === frame.on ? '' : undefined}
              data-prev={i === frame.prev ? '' : undefined}
            />
          ))}
        </div>
        <figcaption className="yw-menu__cap">
          {current.group} · <b>{numberOf(frame.on)}</b> / {TOTAL}
        </figcaption>
      </figure>
    </aside>
  )
}

// 05 Menu: 호텔 스파 메뉴판처럼 8개 관리를 한 줄씩 훑는다. 줄에는 이름 · 소요 시간 / 정가 · 첫 방문가만 둔다.
// 첫 방문가(50%)는 상시 할인이 아니라 조건부라, 목록 위 안내 · 펼친 패널 · 각주에 조건(OFFER_TERM_FULL)을 함께 쓴다.
// 데스크톱(64rem 이상)은 왼쪽 sticky 프레임 사진이 활성 줄(마우스·포커스·화면 가운데 줄)을 따라 와이프로 바뀐다.
// 모바일·태블릿은 줄에 사진을 두지 않고, 펼치면 사진이 위에서 아래로 열린다.
export default function Programs() {
  const wide = useMediaQuery('(min-width: 64rem)')
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const [seen, setSeen] = useState(() => new Set()) // 한 번이라도 펼친 줄(펼침 사진은 그때 받는다)
  const [frame, setFrame] = useState({ on: 0, prev: null }) // 프레임에 켜진 사진과 그 아래 남겨 둔 직전 사진
  const active = frame.on

  const listRef = useRef(null)
  const rowRefs = useRef([])
  const imgRefs = useRef([])
  const pointerInside = useRef(false)

  const activate = useCallback((i) => {
    setFrame((f) => (f.on === i ? f : { on: i, prev: prefersReducedMotion() ? null : f.on }))
  }, [])

  // 와이프가 끝나면(transitionend) 직전 사진을 내린다. 이벤트가 오지 않는 경우를 위해 예비 타이머도 둔다.
  const clearPrev = useCallback(() => setFrame((f) => (f.prev === null ? f : { ...f, prev: null })), [])
  useEffect(() => {
    if (frame.prev === null) return undefined
    const t = setTimeout(clearPrev, 1000)
    return () => clearTimeout(t)
  }, [frame, clearPrev])

  // 다음·이전 사진은 미리 디코드해 둔다(교체 때 깜빡이지 않게).
  useEffect(() => {
    if (!wide) return
    ;[active - 1, active + 1].forEach((j) => {
      const img = imgRefs.current[j]
      if (img?.decode) img.decode().catch(() => {})
    })
  }, [active, wide])

  // 마우스가 목록 밖에 있을 때는 화면 가운데(위아래 48%를 뺀 띠)를 지나는 줄이 활성 줄이 된다. 데스크톱에서만.
  // 키보드로 목록 안을 이동하는 중에는 포커스한 줄을 따른다(Tab 스크롤로 가운데 줄이 바뀌어도 사진이 튀지 않게).
  useEffect(() => {
    if (!wide || typeof IntersectionObserver === 'undefined') return undefined
    const keyboardInside = () => {
      const el = document.activeElement
      return !!el && !!listRef.current?.contains(el) && el.matches(':focus-visible')
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (pointerInside.current || keyboardInside()) return
        entries.forEach((entry) => {
          const el = entry.target
          if (!entry.isIntersecting || el.classList.contains('is-out')) return
          activate(Number(el.dataset.index))
        })
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rowRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [wide, activate])

  function choose(id) {
    if (id === filter) return
    setFilter(id)
    setOpenId(null)
    if (!matches(id, PROGRAMS[active])) {
      const first = PROGRAMS.findIndex((p) => matches(id, p))
      if (first >= 0) activate(first)
    }
  }

  function toggle(id) {
    setOpenId((cur) => (cur === id ? null : id))
    setSeen((s) => (s.has(id) ? s : new Set(s).add(id)))
  }

  return (
    <section id="programs" className="yw-section yw-curtain--light yw-menu" data-theme="light">
      <div className="yw-wrap yw-menu__grid">
        {wide && <MenuFrame frame={frame} imgRefs={imgRefs} onWiped={clearPrev} />}

        <div className="yw-menu__main">
          <div className="yw-menu__head">
            <div>
              <Folio no="04" en="Menu" />
              <SplitLines as="h2" className="yw-h2" lines={['첫 방문 관리 메뉴']} />
            </div>
            <div className="yw-menu__filter" role="group" aria-label="관리 종류">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="yw-menu__tab"
                  aria-pressed={filter === f.id}
                  onClick={() => choose(f.id)}
                >
                  {f.label}
                  <span className="sr-only"> {f.count}개</span>
                </button>
              ))}
            </div>
          </div>

          {SHOW_TERMS && (
            <p className="yw-menu__terms">
              <b className="yw-menu__terms-label">
                첫 방문가<span className="sr-only">:</span>
              </b>
              <span className="yw-menu__terms-text">
                <Terms />
              </span>
            </p>
          )}

          <ul
            ref={listRef}
            className="yw-menu__list"
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') pointerInside.current = true
            }}
            onPointerLeave={() => {
              pointerInside.current = false
            }}
          >
            {PROGRAMS.map((p, i) => {
              const out = !matches(filter, p)
              const open = openId === p.id
              const sale = onSale(p)
              const panelId = `yw-menu-${p.id}`
              return (
                <li
                  key={p.id}
                  ref={(el) => {
                    rowRefs.current[i] = el
                  }}
                  data-index={i}
                  className={`yw-menu__row${out ? ' is-out' : ''}${i === active ? ' is-active' : ''}${open ? ' is-open' : ''}`}
                  inert={out}
                  onPointerEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                >
                  <div className="yw-menu__inner">
                    <button
                      type="button"
                      className="yw-menu__toggle"
                      aria-expanded={open}
                      aria-controls={panelId}
                      data-cursor="보기"
                      onClick={() => toggle(p.id)}
                    >
                      {/* 윗단: (번호) 이름 · 정가 · + / 아랫단: 소요 시간 · 첫 방문가. 보조기기는 이름 → 시간 → 가격 문장 순으로 읽는다 */}
                      <span className="yw-menu__no" aria-hidden="true">
                        {numberOf(i)}
                      </span>
                      <span className="yw-menu__name">
                        <DisplayName label={p.label} />
                        {p.badge && (
                          <>
                            <span className="yw-menu__badge" aria-hidden="true">
                              {BADGE_EN[p.badge] ?? p.badge}
                            </span>
                            <span className="sr-only"> {p.badge}</span>
                          </>
                        )}
                      </span>
                      {SHOW_PRICES && (
                        <span className="yw-menu__regular" aria-hidden="true">
                          {won(p.price)}
                        </span>
                      )}
                      <span className="yw-menu__plus" aria-hidden="true">
                        <svg className="yw-menu__icon" viewBox="0 0 16 16" focusable="false">
                          <path d="M8 0v16M0 8h16" />
                        </svg>
                      </span>
                      <span className="yw-menu__meta">
                        <span className="yw-menu__time">{p.time}</span>
                        {sale && (
                          <span className="yw-menu__sale" aria-hidden="true">
                            첫 방문가 <b>{won(p.sale)}</b>
                          </span>
                        )}
                      </span>
                      {SHOW_PRICES && (
                        <span className="sr-only">
                          {sale
                            ? `정가 ${won(p.price)}, 첫 방문가 ${won(p.sale)}, ${OFFER_TERM}`
                            : `정가 ${won(p.price)}`}
                        </span>
                      )}
                    </button>

                    <div className="yw-menu__panel" id={panelId} inert={!open}>
                      <div className="yw-menu__panel-in">
                        <div className="yw-menu__detail">
                          {!wide && (
                            <figure className="yw-menu__fig">
                              {seen.has(p.id) && (
                                <Pic pic={PICS[p.pic]} sizes="(min-width: 40rem) 20rem, 90vw" alt={ALT[p.id]} loading="eager" />
                              )}
                            </figure>
                          )}
                          <div className="yw-menu__text">
                            <p className="yw-menu__note">{p.note}</p>
                            {SHOW_PRICES && (
                              <p className="yw-menu__fare">
                                <span className="yw-menu__nb">정가 {won(p.price)}</span>
                                {sale && (
                                  <>
                                    {' · '}
                                    <b className="yw-menu__nb">첫 방문가 {won(p.sale)}</b>{' '}
                                    <span className="yw-menu__fare-term">
                                      <Terms />
                                    </span>
                                  </>
                                )}
                              </p>
                            )}
                          </div>
                          <div className="yw-menu__actions">
                            <button
                              type="button"
                              className="yw-btn yw-btn--ink"
                              data-magnet
                              onClick={() => pickForBooking({ area: p.area, programId: p.id, label: p.label })}
                            >
                              <span>이 관리로 상담</span>
                            </button>
                            <ParenLink href={BRANCHES.zai.booking} external>
                              네이버 예약
                            </ParenLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="yw-menu__foot">
            <Footnote>
              {SHOW_PRICES && '정가는 네이버 예약 기준입니다. '}
              {/* '첫 방문가(50%)는'은 한 덩어리로 묶어, 괄호 뒤에서 줄이 바뀌어 '는'이 줄 머리에 오지 않게 한다 */}
              {SHOW_TERMS && (
                <>
                  <span className="yw-menu__nb">첫 방문가(50%)는</span>
                  {` 할인 대상 ${SALE_COUNT}개 관리에만 적용됩니다(${OFFER_TERM_FULL}). `}
                </>
              )}
              관리 구성과 소요시간은 컨디션에 따라 달라질 수 있고, 사진은 분위기 연출용 이미지로 실제 관리 장면과 다를 수
              있습니다.
            </Footnote>
            <ParenLink href={BRANCHES.zai.booking} external>
              네이버에서 예약하기
            </ParenLink>
          </div>
        </div>
      </div>
    </section>
  )
}
