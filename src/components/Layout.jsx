import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../store/useApp'

export default function Layout() {
  const { getCurrentUser, logout } = useApp()
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand">
          새벽의 댓글창
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/room-request/new" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            모임 열기 신청
          </NavLink>
          <NavLink to="/mbti" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            MBTI로 나를 알아보기
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            소개
          </NavLink>
          {user ? (
            <>
              <span className="nav-user">{user.nickname}님</span>
              <button type="button" className="nav-logout" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              로그인
            </NavLink>
          )}
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
