import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../store/useApp'

export default function ProtectedRoute({ children }) {
  const { getCurrentUser } = useApp()
  const location = useLocation()
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
