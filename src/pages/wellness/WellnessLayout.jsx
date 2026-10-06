import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BRANCHES } from './data'
import FloatingInquiry from './FloatingInquiry'
import MobileBar from './MobileBar'
import WellnessFooter from './WellnessFooter'
import WellnessNav from './WellnessNav'
import './wellness.css'

// nav에서 이동할 섹션 id는 각 페이지의 section id와 맞춘다.
const NAV_ITEMS = {
  zai: [
    { id: 'about', label: '차별점' },
    { id: 'programs', label: '프로그램' },
    { id: 'reviews', label: '후기' },
    { id: 'offer', label: '이벤트' },
    { id: 'booking', label: '상담 예약' },
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
