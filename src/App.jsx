import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AppProvider } from './store/useApp'
import Landing from './pages/Landing'
import RoomDetail from './pages/RoomDetail'
import RoomRequestNew from './pages/RoomRequestNew'
import MbtiTest from './pages/MbtiTest'
import MbtiResult from './pages/MbtiResult'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="room/:roomId" element={<RoomDetail />} />
            <Route
              path="room-request/new"
              element={
                <ProtectedRoute>
                  <RoomRequestNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="mbti"
              element={
                <ProtectedRoute>
                  <MbtiTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="mbti/result"
              element={
                <ProtectedRoute>
                  <MbtiResult />
                </ProtectedRoute>
              }
            />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
