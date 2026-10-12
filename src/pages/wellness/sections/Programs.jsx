import { useCallback, useEffect, useRef, useState } from 'react'
import { BRANCHES, PICS, PROGRAMS, SALE_COUNT } from '../data'
import { Folio, Footnote, ParenLink, Pic, PriceLine, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView, useMediaQuery } from '../motion'
import { pickForBooking } from '../scroll'
import './yw-menu.css'

// 펼친 줄 사진(모바일·태블릿)의 대체 텍스트. 분위기 사진이라 장면만 적고 '마사지' 같은 말은 쓰지 않는다.
const ALT = {
  'scalp-detox': '두 손으로 뒷머리를 받친 두피 케어 장면',
  'scalp-face': '클렌징 거품을 바른 옆얼굴',
  'back-lymph': '어깨와 등을 감싸는 손길',
  abdomen: '부드럽게 구겨진 생성 리넨',
  lower: '흰 수건 위 다리에 얹은 손',
  'full-back': '수건을 덮고 엎드린 등에 얹은 두 손',
  'lymph-node': '목선과 쇄골에 닿은 손끝',
  warmup: '간접 조명이 비치는 원목 선반 위 수건',
}

const TOTAL = String(PROGRAMS.length).padStart(2, '0')
const numberOf = (i) => String(i + 1).padStart(2, '0')

// 필터: 전체 + PROGRAMS.group 순서대로(두피 · 얼굴, 바디, 온열 웜업). 개수는 데이터에서 센다.
const FILTERS = [
  { id: 'all', label: '전체', count: PROGRAMS.length },
  ...[...new Set(PROGRAMS.map((p) => p.group))].map((g) => ({
    id: g,
    label: g,
    count: PROGRAMS.filter((p) => p.group === g).length,
  })),
]

const matches = (filter, p) => filter === 'all' || p.group === filter

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

// 05 Menu: 잡지 목차처럼 8개 관리를 한 줄씩 훑는다. 할인가는 줄마다 늘 보인다.
// 데스크톱(64rem 이상)은 왼쪽 sticky 프레임 사진이 활성 줄(마우스·포커스·화면 가운데 줄)을 따라 와이프로 바뀐다.
// 모바일·태블릿은 프레임 대신 줄마다 둥근 썸네일이 있고, 펼치면 사진이 위에서 아래로 열린다.
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
              <SplitLines as="h2" className="yw-h2" lines={['관리 메뉴']} />
            </div>
            <div className="yw-menu__filter" role="group" aria-label="관리 종류">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="yw-menu__chip"
                  aria-pressed={filter === f.id}
                  onClick={() => choose(f.id)}
                >
                  {f.label}
                  <sup className="yw-menu__count" aria-hidden="true">
                    {f.count}
                  </sup>
                  <span className="sr-only"> {f.count}개</span>
                </button>
              ))}
            </div>
          </div>

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
                      <span className="yw-menu__no" aria-hidden="true">
                        {numberOf(i)}
                      </span>
                      {!wide && (
                        <span className="yw-menu__thumb" aria-hidden="true">
                          <Pic pic={PICS[p.pic]} sizes="3.5rem" alt="" />
                        </span>
                      )}
                      <span className="yw-menu__name">
                        {p.label}
                        {p.badge && <b className="yw-menu__badge">인기</b>}
                      </span>
                      <span className="yw-menu__meta">
                        <span className="yw-menu__group">{p.group}</span>
                        <span className="yw-menu__time">{p.time}</span>
                      </span>
                      <PriceLine program={p} compact className="yw-menu__price" />
                      <span className="yw-menu__plus" aria-hidden="true" />
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
                          <p className="yw-menu__note">{p.note}</p>
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
              가격은 네이버 예약 기준이며, 50%는 할인 표시가 있는 {SALE_COUNT}개 관리에 첫 방문 1회 적용됩니다. 관리 구성과
              소요시간은 컨디션에 따라 달라질 수 있고, 사진은 분위기 연출용 이미지로 실제 관리 장면과 다를 수 있습니다.
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
