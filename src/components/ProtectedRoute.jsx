import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../store/useApp'

export default function ProtectedRoute({ children }) {
  const { getCurrentUser, authLoading } = useApp()
  const location = useLocation()

  if (authLoading) {
    return <p className="auth-loading">로그인 상태를 확인하는 중이에요...</p>
  }

  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
