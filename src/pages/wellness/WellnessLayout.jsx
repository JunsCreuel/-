import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CursorLayer from './CursorLayer'
import EventPopups from './EventPopups'
import { BRANCHES, SHOW_OFFER } from './data'
import FloatingInquiry from './FloatingInquiry'
import { ScrollProgress } from './MotionParts'
import MobileBar from './MobileBar'
import WellnessFooter from './WellnessFooter'
import WellnessNav from './WellnessNav'
import { PAGES } from './pages'
import { arrivePage, setNavigator } from './scroll'
import './wellness.css'

// 메뉴 항목. page는 옮겨 갈 하위 페이지(맨 위에서 시작), section은 옮겨 간 뒤 내려갈 섹션 id다(pages.js).
// page·section이 없는 항목(마린시티점)은 같은 페이지 안의 섹션 id로 내려간다.
// bar: true인 항목만 상단 바 메뉴 줄에 나오고, 전체 목록은 햄버거 패널과 푸터에 쓴다.
const NAV_ITEMS = {
  zai: [
    { id: 'about', label: '브랜드', bar: true, page: PAGES.brand },
    { id: 'programs', label: '관리 프로그램', bar: true, page: PAGES.program },
    { id: 'equipment', label: '장비', bar: true, page: PAGES.equipment },
    ...(SHOW_OFFER ? [{ id: 'offer', label: '이벤트', bar: true, page: PAGES.event }] : []),
    { id: 'reviews', label: '후기', bar: true, page: PAGES.review },
    { id: 'branches', label: '지점 안내', bar: true, page: PAGES.location },
    { id: 'startup', label: '창업', bar: true, page: PAGES.startup },
    { id: 'faq', label: '자주 묻는 질문', page: PAGES.location, section: 'faq' },
    { id: 'booking', label: '상담 예약', page: PAGES.location, section: 'booking' },
  ],
  marine: [
    { id: 'intro', label: '소개' },
    { id: 'programs', label: '프로그램' },
    { id: 'booking', label: '상담 예약' },
    { id: 'visit', label: '오시는 길' },
  ],
}

const DESCRIPTION = '부산 남구 용호동 예뻐졌다 WELLNESS STUDIO. 온열돔 전신 웜업부터 두피·얼굴·바디 관리까지 100% 예약제 1:1로 진행합니다.'

export default function WellnessLayout() {
  const { pathname } = useLocation()
  const branch = pathname.startsWith(BRANCHES.marine.path) ? BRANCHES.marine : BRANCHES.zai

  // 제목용 명조(Noto Serif KR), 본문 Noto Sans KR, 숫자·라벨용 Jost, 영문 큰 제목·숫자용 Cormorant Garamond(300·이탤릭 포함)를 이 페이지에 있는 동안만 불러온다.
  // 내려받는 양을 줄이려고 화면에서 실제로 쓰는 굵기만 불러온다(한글 글꼴은 굵기마다 따로 내려받는다).
  useEffect(() => {
    const pre = document.createElement('link')
    pre.rel = 'preconnect'
    pre.href = 'https://fonts.gstatic.com'
    pre.crossOrigin = ''
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500&family=Noto+Sans+KR:wght@400;500;600&family=Jost:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&display=swap'
    document.head.append(pre, link)
    return () => {
      pre.remove()
      link.remove()
    }
  }, [])

  // 기존 앱과 구분되는 배경색·제목·탭 아이콘·설명을 이 페이지에 있는 동안만 적용한다.
  // (카카오톡 등 공유 미리보기는 public/wellness/index.html이 맡는다)
  useEffect(() => {
    const prevTitle = document.title
    const icon = document.querySelector('link[rel="icon"]')
    const desc = document.querySelector('meta[name="description"]')
    const prevIcon = icon?.getAttribute('href')
    const prevDesc = desc?.getAttribute('content')
    icon?.setAttribute('href', `${import.meta.env.BASE_URL}wellness/favicon.svg`)
    desc?.setAttribute('content', DESCRIPTION)
    document.body.classList.add('is-wellness')
    return () => {
      document.title = prevTitle
      if (prevIcon) icon.setAttribute('href', prevIcon)
      if (prevDesc) desc.setAttribute('content', prevDesc)
      document.body.classList.remove('is-wellness')
    }
  }, [])

  useEffect(() => {
    document.title = `예뻐졌다 WELLNESS STUDIO ${branch.label} | 온열돔·두피·바디 관리`
  }, [branch.label])

  // 메뉴·버튼이 다른 페이지의 섹션을 부르면 scroll.js가 이 navigate로 옮겨 간다.
  const navigate = useNavigate()
  useEffect(() => setNavigator(navigate), [navigate])

  // 페이지를 옮기면 맨 위에서 시작한다. 다른 페이지의 섹션을 불러 옮겨 왔으면 그 섹션으로 간다.
  // 자식(페이지)의 effect가 먼저 돌아, 이때는 간편 상담 카드의 'w:pick' 수신도 이미 붙어 있다.
  useEffect(() => {
    arrivePage()
  }, [pathname])

  return (
    <div className="wellness">
      <ScrollProgress />
      <WellnessNav branch={branch} items={NAV_ITEMS[branch.id]} pathname={pathname} />
      <main>
        <Outlet />
      </main>
      <WellnessFooter items={NAV_ITEMS[branch.id]} />
      <MobileBar branch={branch} />
      <FloatingInquiry />
      {branch.id === 'zai' && <EventPopups />}
      <CursorLayer />
    </div>
  )
}
