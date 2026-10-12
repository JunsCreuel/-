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

export default function WellnessLayout() {
  const { pathname } = useLocation()
  const branch = pathname.startsWith(BRANCHES.marine.path) ? BRANCHES.marine : BRANCHES.zai

  // 제목용 명조(Noto Serif KR), 본문 Noto Sans KR, 숫자용 Jost를 이 페이지에 있는 동안만 불러온다.
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Noto+Sans+KR:wght@300;400;500;600&family=Jost:wght@300;400&display=swap'
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  // 기존 앱과 구분되는 배경색/제목을 이 페이지에 있는 동안만 적용한다.
  useEffect(() => {
    const prevTitle = document.title
    document.body.classList.add('is-wellness')
    return () => {
      document.title = prevTitle
      document.body.classList.remove('is-wellness')
    }
  }, [])

  useEffect(() => {
    document.title = `WELLNESS STUDIO 예뻐졌다 · ${branch.name}`
  }, [branch.name])

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
