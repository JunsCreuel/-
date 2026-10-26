// 자이점 하위 페이지 주소. 메인은 짧게 두고, 자세한 내용은 위쪽 메뉴의 페이지로 나눠 싣는다.
export const PAGES = {
  home: '/wellness',
  brand: '/wellness/brand',
  program: '/wellness/program',
  equipment: '/wellness/equipment',
  dome: '/wellness/dome',
  review: '/wellness/review',
  location: '/wellness/location',
  startup: '/wellness/startup',
  privacy: '/wellness/privacy',
}

// 섹션 id가 실려 있는 페이지. 지금 페이지에 그 섹션이 없으면 scrollToId가 이 페이지로 옮겨 간 뒤 내려간다.
export const SECTION_PAGE = {
  about: PAGES.brand,
  concern: PAGES.program,
  programs: PAGES.program,
  offer: PAGES.program,
  equipment: PAGES.equipment,
  'warm-dome': PAGES.dome,
  reviews: PAGES.review,
  branches: PAGES.location,
  'branch-zai': PAGES.location,
  'branch-marine': PAGES.location,
  booking: PAGES.location,
  'booking-form': PAGES.location,
  visit: PAGES.location,
  faq: PAGES.location,
  startup: PAGES.startup,
  'startup-form-title': PAGES.startup,
}

// HashRouter라 주소는 #/wellness/brand 꼴이다. a 태그 href에 그대로 쓴다.
export const pageHref = (path) => `#${path}`
