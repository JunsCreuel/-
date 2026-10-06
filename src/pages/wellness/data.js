const BASE = import.meta.env.BASE_URL

export const PHOTOS = {
  neck: `${BASE}wellness/neck.jpg`,
  scalp: `${BASE}wellness/scalp.jpg`,
  candleLeg: `${BASE}wellness/candle-leg.jpg`,
  back: `${BASE}wellness/back.jpg`,
  leg: `${BASE}wellness/leg.jpg`,
}

export const BRAND = {
  company: '예뻐졌다 웰니스 스튜디오',
  representative: '남연지',
  bizNo: '206-44-51061',
  name: 'WELLNESS STUDIO',
  ko: '예뻐졌다',
  tagline: 'HEALTHY TODAY, BRIGHTER TOMORROW',
}

// 값이 정해지지 않은 항목은 비워 두고 화면에서 <Todo>로 표시한다.
export const BRANCHES = {
  zai: {
    id: 'zai',
    path: '/wellness',
    name: '자이점',
    label: '용호 자이점',
    address: '부산 남구 신선로 566 GS하이츠자이 401동 141-2호',
    mapQuery: '부산 남구 신선로 566 GS하이츠자이',
    hours: '월~금 10:00 – 19:00',
    phone: '010-9419-2121',
    booking: 'https://m.site.naver.com/2fZsm',
  },
  marine: {
    id: 'marine',
    path: '/wellness/marine',
    name: '마린시티점',
    label: '마린시티점',
    address: '부산 해운대구 마린시티3로 23 오렌지상가 3층 329호',
    mapQuery: '부산 해운대구 마린시티3로 23 오렌지상가',
    hours: null,
    phone: '010-2360-1470',
    booking: null,
  },
}

// 마린시티점은 아직 오픈 전이라 화면에서 숨긴다(지점 전환·푸터·폼·오시는 길·페이지 주소).
// 오픈하면 true로 바꾸면 한 번에 다시 노출된다.
export const MARINE_OPEN = false

// 화면에 노출하는 지점 목록
export const OPEN_BRANCHES = Object.values(BRANCHES).filter((b) => b.id !== 'marine' || MARINE_OPEN)

// 지도 링크는 주소로 만든 네이버 지도 검색 주소를 쓴다. 장소 고유 링크가 생기면 이 함수만 바꾸면 된다.
export function mapHref(branch) {
  return `https://map.naver.com/p/search/${encodeURIComponent(branch.mapQuery)}`
}

export function telHref(phone) {
  return `tel:${phone.replace(/-/g, '')}`
}

// 네이버 예약 링크가 있으면 그쪽으로, 없으면 전화 연결로 대체한다.
export function reserveAction(branch) {
  if (branch.booking) {
    return { href: branch.booking, label: '예약하기', external: true }
  }
  return { href: telHref(branch.phone), label: '전화 예약', external: false }
}
