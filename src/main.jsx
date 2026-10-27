import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 새로고침하면 브라우저가 보던 자리로 되돌아가지 않고 항상 맨 위(첫 화면)에서 시작한다.
// 페이지 사이 이동 뒤 자리는 웰니스 레이아웃(arrivePage)이 맞춘다.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
