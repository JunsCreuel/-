import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import EventPopups from './EventPopups'
import { BRANCHES, LISTED_BRANCHES } from './data'
import MobileBar from './MobileBar'
import WellnessFooter from './WellnessFooter'
import WellnessNav from './WellnessNav'
import { PAGES } from './pages'
import { arrivePage, setNavigator } from './scroll'
import './wellness.css'
import './tailwind.css'

// nav에서 이동할 섹션 id는 각 페이지의 section id와 맞춘다. bar: true인 항목만 상단 바 메뉴 줄에 나오고, 전체 목록은 햄버거 패널과 푸터에 쓴다.
// 위쪽 메뉴. page는 옮겨 갈 하위 페이지(맨 위에서 시작), section은 옮겨 간 뒤 내려갈 섹션 id(pages.js)다.
// children은 데스크톱에서 메뉴에 마우스를 올리면 펼쳐지는 하위 메뉴(휴대폰 패널에서는 들여 쓴 줄)다.
// page·section이 없는 항목(마린시티점)은 같은 페이지 안의 섹션 id로 내려간다. bar: true인 항목만 상단 바에 나온다.
// 하위 메뉴의 en은 한글 이름 아래 작은 영문이다. event가 있으면 그 섹션에 도착한 뒤 window 이벤트(detail)로 탭·카드를 고른다.

// 관리 메뉴의 분류 탭. id는 data.js PROGRAMS의 group과 같아야 그 탭이 켜진다(Programs.jsx 'w:program-filter').
const PROGRAM_GROUPS = [
  { id: '두피 · 얼굴', key: 'scalp-face', label: '두피 · 얼굴', en: 'SCALP & FACE' },
  { id: '바디', key: 'body', label: '바디', en: 'BODY' },
  { id: '온열 웜업', key: 'warmup', label: '온열 웜업', en: 'WARM-UP' },
]

// 장비 카드 순서(Equipment.jsx: 온열돔 카드, DEVICES)와 같다. 고르면 그 카드까지 옆으로 넘긴다('w:equipment-card').
const EQUIPMENT_MENU = [
  { label: '전신 온열돔', en: 'HEAT DOME' },
  { label: '페이스 갈바닉', en: 'FACE GALVANIC' },
  { label: '바디 갈바닉', en: 'BODY GALVANIC' },
  { label: '웰스파', en: 'WELLSPA' },
]

const BRANCH_EN = { zai: 'YONGHO ZAI', marine: 'MARINE CITY' }

const NAV_ITEMS = {
  zai: [
    {
      id: 'about',
      label: '브랜드',
      bar: true,
      page: PAGES.brand,
      children: [{ id: 'about-story', label: '브랜드 소개', en: 'ABOUT', section: 'about' }],
    },
    {
      id: 'programs',
      label: '관리 프로그램',
      bar: true,
      page: PAGES.program,
      children: [
        { id: 'concern', label: '부위별 추천', en: 'BY CONCERN', section: 'concern' },
        ...PROGRAM_GROUPS.map((g) => ({
          id: `programs-${g.key}`,
          label: g.label,
          en: g.en,
          section: 'programs',
          event: 'w:program-filter',
          detail: { id: g.id },
        })),
        { id: 'offer', label: '첫 방문 이벤트', en: 'FIRST VISIT', section: 'offer' },
      ],
    },
    {
      id: 'equipment',
      label: '장비 소개',
      bar: true,
      page: PAGES.equipment,
      children: EQUIPMENT_MENU.map((e, i) => ({
        id: `equipment-${i}`,
        label: e.label,
        en: e.en,
        section: 'equipment',
        event: 'w:equipment-card',
        detail: { index: i },
      })),
    },
    {
      id: 'reviews',
      label: '후기',
      bar: true,
      page: PAGES.review,
      children: [{ id: 'reviews-visitor', label: '방문자 리뷰', en: 'REVIEWS', section: 'reviews' }],
    },
    {
      id: 'branches',
      label: '지점 안내',
      bar: true,
      page: PAGES.location,
      children: [
        ...LISTED_BRANCHES.map((b) => ({ id: `branch-${b.id}`, label: b.label, en: BRANCH_EN[b.id], section: `branch-${b.id}` })),
        { id: 'booking', label: '상담 예약', en: 'BOOKING', section: 'booking' },
        { id: 'faq', label: '자주 묻는 질문', en: 'FAQ', section: 'faq' },
      ],
    },
    {
      id: 'startup',
      label: '창업 문의',
      bar: true,
      page: PAGES.startup,
      children: [
        { id: 'startup-info', label: '창업 안내', en: 'FRANCHISE', section: 'startup' },
        { id: 'startup-form', label: '창업 상담 신청', en: 'INQUIRY', section: 'startup-form-title' },
      ],
    },
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

  // 제목용 마루 부리(네이버 한글한글 아름답게, OFL), 본문 프리텐다드(OFL, 쓰는 글자만 받는 dynamic subset),
  // 숫자·라벨용 Jost, 영문 큰 제목·숫자용 Cormorant Garamond(300·이탤릭 포함)를 이 페이지에 있는 동안만 불러온다.
  useEffect(() => {
    const pre = document.createElement('link')
    pre.rel = 'preconnect'
    pre.href = 'https://fonts.gstatic.com'
    pre.crossOrigin = ''
    const sheets = [
      'https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css',
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
      'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&display=swap',
    ].map((href) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      return link
    })
    document.head.append(pre, ...sheets)
    return () => {
      pre.remove()
      sheets.forEach((link) => link.remove())
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
      <WellnessNav branch={branch} items={NAV_ITEMS[branch.id]} pathname={pathname} />
      <main>
        <Outlet />
      </main>
      <WellnessFooter items={NAV_ITEMS[branch.id]} />
      <MobileBar branch={branch} />
      {branch.id === 'zai' && pathname === BRANCHES.zai.path && <EventPopups />}
    </div>
  )
}
