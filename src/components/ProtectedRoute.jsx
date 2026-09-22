import { Navigate } from 'react-router-dom'
import { useApp } from '../store/useApp'

export default function ProtectedRoute({ children }) {
  const { getCurrentUser } = useApp()
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
