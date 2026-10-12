import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BRANCHES } from './data'
import FloatingInquiry from './FloatingInquiry'
import { ScrollProgress } from './MotionParts'
import MobileBar from './MobileBar'
import WellnessFooter from './WellnessFooter'
import WellnessNav from './WellnessNav'
import './wellness.css'

// nav에서 이동할 섹션 id는 각 페이지의 section id와 맞춘다. bar: true인 항목만 상단 바 메뉴 줄에 나오고, 전체 목록은 햄버거 패널과 푸터에 쓴다.
const NAV_ITEMS = {
  zai: [
    { id: 'about', label: '소개', bar: true },
    { id: 'programs', label: '프로그램', bar: true },
    { id: 'equipment', label: '장비', bar: true },
    { id: 'warm-ritual', label: '온열돔 단독 이용' },
    { id: 'reviews', label: '후기', bar: true },
    { id: 'offer', label: '이벤트' },
    { id: 'booking', label: '상담 예약' },
    { id: 'visit', label: '오시는 길', bar: true },
    { id: 'startup', label: '창업·운영 상담' },
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

  // 제목용 명조(Noto Serif KR), 본문 Noto Sans KR, 숫자·라벨용 Jost, 영문 큰 제목용 Cormorant Garamond를 이 페이지에 있는 동안만 불러온다.
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Noto+Sans+KR:wght@300;400;500;600&family=Jost:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap'
    document.head.appendChild(link)
    return () => link.remove()
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

  // 지점 페이지를 오갈 때 항상 맨 위에서 시작한다.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="wellness">
      <ScrollProgress />
      <WellnessNav branch={branch} items={NAV_ITEMS[branch.id]} />
      <main>
        <Outlet />
      </main>
      <WellnessFooter items={NAV_ITEMS[branch.id]} />
      <MobileBar branch={branch} />
      <FloatingInquiry />
    </div>
  )
}
