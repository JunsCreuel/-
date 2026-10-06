import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AppProvider } from './store/useApp'
import Landing from './pages/Landing'
import RoomList from './pages/RoomList'
import RoomDetail from './pages/RoomDetail'
import RoomRequestNew from './pages/RoomRequestNew'
import MbtiTest from './pages/MbtiTest'
import MbtiResult from './pages/MbtiResult'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import WellnessLayout from './pages/wellness/WellnessLayout'
import WellnessHome from './pages/wellness/WellnessHome'
import WellnessMarine from './pages/wellness/WellnessMarine'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="rooms" element={<RoomList />} />
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
          {/* 예뻐졌다 웰니스스튜디오 랜딩 — 기존 앱의 Layout(nav/footer) 밖에서 자체 레이아웃 사용 */}
          <Route path="wellness" element={<WellnessLayout />}>
            <Route index element={<WellnessHome />} />
            <Route path="marine" element={<WellnessMarine />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
