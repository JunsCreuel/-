import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { OPEN_BRANCHES, telHref } from './data'
import { scrollToId, scrollToTop } from './scroll'
import './wellness-nav.css'

// 상단 바: 왼쪽 로고, 가운데 주요 메뉴(넓은 화면), 오른쪽 상담 예약 버튼.
// 좁은 화면에서는 햄버거로 전체 메뉴 패널을 연다. bar: true인 항목만 상단 메뉴 줄에 나온다.
export default function WellnessNav({ branch, items }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  function goTo(id) {
    setMenuOpen(false)
    scrollToId(id)
  }

  // 오픈한 지점이 하나뿐이면 지점 선택은 보이지 않는다.
  const hasChoice = OPEN_BRANCHES.length > 1
  const barItems = items.some((i) => i.bar) ? items.filter((i) => i.bar) : items

  return (
    <>
      <header className={`w-nav${scrolled ? ' is-scrolled' : ''}`}>
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
              <button key={item.id} type="button" onClick={() => goTo(item.id)}>
                {item.label}
              </button>
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
                  <button key={item.id} type="button" onClick={() => goTo(item.id)}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </button>
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
