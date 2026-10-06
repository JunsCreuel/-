import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRANCHES, reserveAction } from './data'
import { scrollToId, scrollToTop } from './scroll'
import './wellness-nav.css'

export default function WellnessNav({ branch, items }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)
  const branchRef = useRef(null)
  const reserve = reserveAction(branch)

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

  const branchLinks = Object.values(BRANCHES).map((b) => (
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
          aria-label="예뻐졌다 WELLNESS STUDIO 처음으로"
          onClick={() => {
            closeAll()
            scrollToTop()
          }}
        >
          <span className="w-nav__brand-ko">예뻐졌다</span>
          <span className="w-nav__brand-en">WELLNESS STUDIO</span>
        </Link>

        <nav className="w-nav__menu" aria-label="주요 메뉴">
          {items.map((item) => (
            <button key={item.id} type="button" onClick={() => goTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="w-nav__right">
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

          <a
            className="w-btn w-btn--primary w-btn--sm"
            href={reserve.href}
            {...(reserve.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {reserve.label}
          </a>

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
          <p className="w-nav__panel-label">지점 선택</p>
          <div className="w-nav__panel-branches">{branchLinks}</div>
          <p className="w-nav__panel-label">메뉴</p>
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
