import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import WellnessPrivacy from './pages/wellness/WellnessPrivacy'
import {
  BrandPage,
  DomePage,
  EquipmentPage,
  LocationPage,
  ProgramPage,
  ReviewPage,
  StartupPage,
} from './pages/wellness/WellnessPages'
import { MARINE_OPEN } from './pages/wellness/data'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* 사이트 첫 주소(…/-/)는 웰니스 스튜디오 랜딩으로 보낸다. 공유 미리보기(index.html)와 첫 화면을 맞추기 위해서다.
              기존 '새벽의 댓글창' 첫 화면은 #/dawn 에 남겨 둔다. */}
          <Route index element={<Navigate to="/wellness" replace />} />
          <Route element={<Layout />}>
            <Route path="dawn" element={<Landing />} />
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
            <Route path="marine" element={MARINE_OPEN ? <WellnessMarine /> : <Navigate to="/wellness" replace />} />
            <Route path="privacy" element={<WellnessPrivacy />} />
            <Route path="brand" element={<BrandPage />} />
            <Route path="program" element={<ProgramPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="dome" element={<DomePage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="location" element={<LocationPage />} />
            <Route path="startup" element={<StartupPage />} />
            {/* 잘못된 하위 주소(#/wellness/xxx)는 빈 화면 대신 랜딩으로 돌려보낸다 */}
            <Route path="*" element={<Navigate to="/wellness" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
