const BASE = import.meta.env.BASE_URL

export const PHOTOS = {
  neck: `${BASE}wellness/neck.jpg`,
  candleLeg: `${BASE}wellness/candle-leg.jpg`,
  back: `${BASE}wellness/back.jpg`,
  leg: `${BASE}wellness/leg.jpg`,
}

export const BRAND = {
  ko: '예뻐졌다 웰니스스튜디오',
  en: '예뻐졌다 WELLNESS STUDIO',
  tagline: 'HEALTHY TODAY, BRIGHTER TOMORROW',
}

// 값이 정해지지 않은 항목은 비워 두고 화면에서 <Todo>로 표시한다.
export const BRANCHES = {
  zai: {
    id: 'zai',
    path: '/wellness',
    name: '자이점',
    label: '용호 자이점',
    address: '부산 남구 용호동 자이아파트 상가',
    addressTodo: '상세 주소',
    phone: '010-9419-2121',
    booking: 'https://m.site.naver.com/2fZsm',
  },
  marine: {
    id: 'marine',
    path: '/wellness/marine',
    name: '마린시티점',
    label: '마린시티점',
    address: '부산 해운대구 마린시티3로 23 오렌지상가 3층 329호',
    phone: '010-2360-1470',
    booking: null,
  },
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
