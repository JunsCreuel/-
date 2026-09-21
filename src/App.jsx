import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AppProvider } from './store/useApp'
import Landing from './pages/Landing'
import RoomDetail from './pages/RoomDetail'
import About from './pages/About'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="room/:roomId" element={<RoomDetail />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
