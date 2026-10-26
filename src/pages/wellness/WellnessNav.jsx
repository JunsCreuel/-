import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { OPEN_BRANCHES, telHref } from './data'
import { onScrollFrame } from './motion'
import { goToMenu, lockPageScroll, scrollToId, scrollToTop } from './scroll'
import './wellness-nav.css'

// 상단 바: 왼쪽 로고, 가운데 주요 메뉴(넓은 화면), 오른쪽 상담 예약 버튼.
// 좁은 화면에서는 햄버거로 전체 메뉴 패널을 연다. bar: true인 항목만 상단 메뉴 줄에 나온다.
// 바로 아래에 있는 섹션의 data-theme('dark' | 'light')을 따라 header[data-theme]가 바뀐다(어두운 장 위에서는 크림 글자).
export default function WellnessNav({ branch, items }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef(null)
  const headerRef = useRef(null)
  const menuOpenRef = useRef(false)
  const themeRef = useRef(null)

  // 상단 바 바로 아래(가운데, 바 높이 + 2px) 요소가 속한 섹션의 테마를 읽어, 바뀔 때만 header에 쓴다. 메뉴가 열려 있으면 판정하지 않는다.
  const syncTheme = useCallback(() => {
    const header = headerRef.current
    if (!header || menuOpenRef.current) return
    const navH = header.querySelector('.w-nav__inner')?.offsetHeight || header.offsetHeight
    const hit = document.elementFromPoint(window.innerWidth / 2, navH + 2)
    const theme = hit?.closest('[data-theme]')?.dataset.theme || 'light'
    if (theme !== themeRef.current) {
      themeRef.current = theme
      header.dataset.theme = theme
    }
  }, [])

  useEffect(() => {
    let last = null
    return onScrollFrame(({ y }) => {
      const next = y > 8
      if (next !== last) {
        last = next
        setScrolled(next)
      }
      syncTheme()
    })
  }, [syncTheme])

  // 페이지를 옮기면(메인 ↔ 개인정보처리방침) 스크롤이 없어도 새 페이지 맨 위 섹션의 테마로 다시 맞춘다.
  const { pathname } = useLocation() // 페이지 이동 감지(테마 다시 판정, 지금 페이지 메뉴 표시)
  useEffect(() => {
    const raf = requestAnimationFrame(syncTheme)
    return () => cancelAnimationFrame(raf)
  }, [pathname, syncTheme])

  useEffect(() => {
    menuOpenRef.current = menuOpen
    if (!menuOpen) syncTheme()
  }, [menuOpen, syncTheme])

  useEffect(() => {
    if (!menuOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // 패널이 열린 동안 뒤 페이지 스크롤을 잠근다. 패널 안을 밀거나 패널 끝까지 내린 뒤 이어 밀어도 뒤 페이지가 움직이지 않고,
  // 닫으면 연 자리 그대로다(메뉴 항목의 scrollToId 이동은 잠금과 상관없이 된다).
  useEffect(() => {
    if (!menuOpen) return undefined
    return lockPageScroll()
  }, [menuOpen])

  // 열린 채 넓은 화면(900px 이상, wellness-nav.css에서 햄버거·패널·배경이 사라지는 기준)이 되면 메뉴를 닫는다.
  // 닫지 않으면 보이지 않는 메뉴가 열린 상태로 남아 헤더 테마 판정이 멈추고(어두운 장 위 흰 헤더) 닫을 수단도 없다.
  useEffect(() => {
    if (!menuOpen) return undefined
    const wide = window.matchMedia('(min-width: 900px)')
    const closeIfWide = () => {
      if (wide.matches) setMenuOpen(false)
    }
    closeIfWide()
    wide.addEventListener('change', closeIfWide)
    return () => wide.removeEventListener('change', closeIfWide)
  }, [menuOpen])

  function goTo(id) {
    setMenuOpen(false)
    scrollToId(id)
  }

  function goToItem(item) {
    setMenuOpen(false)
    // 하위 메뉴를 고르면 데스크톱 드롭다운이 바로 닫히게 포커스를 뺀다
    document.activeElement?.blur?.()
    goToMenu(item)
  }

  // 지금 보고 있는 하위 페이지의 메뉴
  const current = (item) => (item.page && item.page === pathname ? 'page' : undefined)

  // 오픈한 지점이 하나뿐이면 지점 선택은 보이지 않는다.
  const hasChoice = OPEN_BRANCHES.length > 1
  const barItems = items.some((i) => i.bar) ? items.filter((i) => i.bar) : items

  return (
    <>
      <header ref={headerRef} className={`w-nav${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
        <div className="w-nav__inner">
          <Link
            to={branch.path}
            className="w-nav__brand"
            aria-label="WELLNESS STUDIO 예뻐졌다 처음으로"
            onClick={() => {
              setMenuOpen(false)
              scrollToTop()
            }}
          >
            <BrandLogo variant="nav" decorative />
          </Link>

          <nav className="w-nav__menu" aria-label="주요 메뉴">
            {barItems.map((item) => (
              <div key={item.id} className={`w-nav__item${item.children ? ' has-sub' : ''}`}>
                <button type="button" aria-current={current(item)} onClick={() => goToItem(item)}>
                  {item.label}
                </button>
                {item.children && (
                  <ul className="w-nav__sub">
                    {item.children.map((c) => (
                      <li key={c.id}>
                        <button type="button" onClick={() => goToItem(c)}>
                          {c.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          <div className="w-nav__right">
            <button type="button" className="w-btn w-btn--primary w-btn--sm" onClick={() => goTo('booking')}>
              상담 예약
            </button>
            <button
              ref={burgerRef}
              type="button"
              className={`w-nav__burger${menuOpen ? ' is-open' : ''}`}
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? 'w-nav-panel' : undefined}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="w-nav-panel" className="w-nav__panel" aria-label="전체 메뉴">
            <div className="w-nav__panel-inner">
              {hasChoice && (
                <div className="w-nav__panel-branches">
                  {OPEN_BRANCHES.map((b) => (
                    <Link
                      key={b.id}
                      to={b.path}
                      aria-current={b.id === branch.id ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
              )}
              <div className="w-nav__panel-items">
                {items.map((item, i) => (
                  <div key={item.id} className="w-nav__panel-group">
                    <button type="button" aria-current={current(item)} onClick={() => goToItem(item)}>
                      <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </button>
                    {item.children && (
                      <div className="w-nav__panel-sub">
                        {item.children.map((c) => (
                          <button key={c.id} type="button" onClick={() => goToItem(c)}>
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="w-nav__panel-info">
                전화 예약 <a href={telHref(branch.phone)}>{branch.phone}</a>
                {branch.hours && ` · ${branch.hours}`}
              </p>
            </div>
          </nav>
        )}
      </header>
      {menuOpen && <div className="w-nav__backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
    </>
  )
}
