import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { OPEN_BRANCHES } from './data'
import { scrollToId, scrollToTop } from './scroll'
import './wellness-nav.css'

export default function WellnessNav({ branch, items }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)
  const branchRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!branchOpen && !menuOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        setBranchOpen(false)
        setMenuOpen(false)
      }
    }
    function onDown(e) {
      if (branchRef.current && !branchRef.current.contains(e.target)) setBranchOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [branchOpen, menuOpen])

  function goTo(id) {
    setMenuOpen(false)
    scrollToId(id)
  }

  function closeAll() {
    setMenuOpen(false)
    setBranchOpen(false)
  }

  // 지점이 하나뿐이면 지점 전환 메뉴를 보이지 않는다.
  const hasChoice = OPEN_BRANCHES.length > 1
  const branchLinks = OPEN_BRANCHES.map((b) => (
    <Link
      key={b.id}
      to={b.path}
      aria-current={b.id === branch.id ? 'page' : undefined}
      onClick={closeAll}
    >
      {b.label}
    </Link>
  ))

  return (
    <header className={`w-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="w-nav__inner">
        <Link
          to={branch.path}
          className="w-nav__brand"
          aria-label="WELLNESS STUDIO 예뻐졌다 처음으로"
          onClick={() => {
            closeAll()
            scrollToTop()
          }}
        >
          <BrandLogo variant="nav" decorative />
        </Link>

        <nav className="w-nav__menu" aria-label="주요 메뉴">
          {items.map((item) => (
            <button key={item.id} type="button" onClick={() => goTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="w-nav__right">
          {hasChoice && (
            <div className="w-branch" ref={branchRef}>
              <button
                type="button"
                className="w-branch__btn"
                aria-haspopup="true"
                aria-expanded={branchOpen}
                onClick={() => setBranchOpen((v) => !v)}
              >
                {branch.name}
                <span aria-hidden="true"> ▾</span>
              </button>
              {branchOpen && <div className="w-branch__list">{branchLinks}</div>}
            </div>
          )}

          <button type="button" className="w-btn w-btn--primary w-btn--sm" onClick={() => scrollToId('booking')}>
            상담 예약
          </button>

          <button
            type="button"
            className="w-nav__burger"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            aria-controls="w-nav-panel"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="w-nav-panel" className="w-nav__panel">
          {hasChoice && (
            <>
              <p className="w-nav__panel-label">지점 선택</p>
              <div className="w-nav__panel-branches">{branchLinks}</div>
              <p className="w-nav__panel-label">메뉴</p>
            </>
          )}
          <div className="w-nav__panel-items">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => goTo(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
