const BASE = import.meta.env.BASE_URL

export const PHOTOS = {
  neck: `${BASE}wellness/neck.jpg`,
  scalp: `${BASE}wellness/scalp.jpg`,
  candleLeg: `${BASE}wellness/candle-leg.jpg`,
  back: `${BASE}wellness/back.jpg`,
  leg: `${BASE}wellness/leg.jpg`,
}

// 네이버 리뷰에 남겨 주신 후기. 글은 작성자가 쓴 그대로 싣는다(고치거나 줄이지 않는다).
// 이름은 알 수 없어 "방문 고객"으로 표기한다. 새 후기는 이 목록에 항목만 더하면 된다.
export const REVIEWS = [
  {
    text: '새롭게 리뉴얼된 예뻐졌다 웰니스 스튜디오에 다녀왔어요 :) 평소 몸의 순환이 잘 안 되는 느낌과 묵직함이 있어 관리를 받았는데, 시작하기 전부터 현재 불편한 부분과 몸 상태를 꼼꼼하게 상담해 주셔서 믿음이 갔어요. 관리하는 동안에도 계속 불편한 곳은 없는지 세심하게 확인해 주셨고, 친절하고 편안한 분위기라 긴장하지 않고 푹 쉬다 온 기분이에요. 관리 후에는 몸이 한결 가볍고 개운해진 느낌이 들어 만족스러웠습니다ㅎㅎ 공간도 깔끔하고 아늑해서 다음에도 편하게 다시 방문하고 싶은 곳이에요! 또뵐께요😍😍',
    photo: { src: `${BASE}wellness/reviews/review-1.webp`, alt: '온열돔 장비', width: 1280, height: 853 },
  },
  {
    text: '두피하면 승모근도 같이 풀어주시는데 진짜 너무 만족...ㅠ 머리에 열이 많은 편인데 쿨링 완전 되구요... 얼굴까지 관리하고 나니까 진짜 새신부 됐습니당ㅎㅎ 평소 고민에 맞춰서 상담해주셔서 넘 좋았서요 !!!! 열돔도 체험 강추드립니당,, 땀도 쫙 빼고 나니까 건강해진 느낌에다가 살도 잘빠지는 거 같아요,, 친절하신 원장님 또 봬요 🫶🏻',
    photo: { src: `${BASE}wellness/reviews/review-2.webp`, alt: '두피-얼굴 관리를 받는 중인 고객', width: 1024, height: 1280, position: 'center 30%' },
  },
  {
    text: '원장님 추천으로 온열돔 하고 땀을 빼고 순환을 시킨 뒤에 전신관리 받으니까 더 효과도 좋았던거같고 하고 나니 훨씬 더 개운한거같습니다 날씨가 쌀쌀해지고 있어서 온열돔만 하러도 자주 올거같습니다 상태에 맞는 아로마를 바르고 들어가니 너무 힐링이 됐던 시간이였습니다 감사합니다 원장님',
    photo: { src: `${BASE}wellness/reviews/review-3.webp`, alt: '관리실 내부', width: 1280, height: 853 },
  },
]

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
