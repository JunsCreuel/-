import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand">
          새벽의 댓글창
        </NavLink>
        <nav className="site-nav">
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            소개
          </NavLink>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>새벽의 댓글창 · 감성 매개체로 이어지는 익명의 방</p>
      </footer>
    </div>
  )
}
