const BASE = import.meta.env.BASE_URL

export const PHOTOS = {
  neck: `${BASE}wellness/neck.jpg`,
  scalp: `${BASE}wellness/scalp.jpg`,
  candleLeg: `${BASE}wellness/candle-leg.jpg`,
  back: `${BASE}wellness/back.jpg`,
  leg: `${BASE}wellness/leg.jpg`,
  // 시안용 AI 생성 분위기 이미지(저해상도 크롭). 실제 매장·제품·시술 사진이 아니므로,
  // 공개 전에 실제 촬영 사진으로 교체하거나 AI 생성 이미지임을 확인·표기해야 한다.
  heatDome: `${BASE}wellness/equipment/heat-dome.webp`,
  faceGalvanic: `${BASE}wellness/equipment/face-galvanic.webp`,
  bodyGalvanic: `${BASE}wellness/equipment/body-galvanic.webp`,
  wellspa: `${BASE}wellness/equipment/wellspa.webp`,
  qr: `${BASE}wellness/qr-naver.png`,
  gelShaping: `${BASE}wellness/gel/shaping-gel.webp`,
  gelSerum: `${BASE}wellness/gel/body-serum.webp`,
  gelActivating: `${BASE}wellness/gel/activating-gel.webp`,
  ingKelp: `${BASE}wellness/gel/kelp.webp`,
  ingTheobromine: `${BASE}wellness/gel/theobromine.webp`,
  moodFace: `${BASE}wellness/mood/face.webp`,
}

// 창업 비용 계산기를 보일지 여부. 정보공개서·실제 운영 수치가 준비되기 전에 내려야 하면 false로 바꾼다.
export const SHOW_SIMULATOR = true

// 프로그램 가격을 화면에 보일지 여부. false로 바꾸면 프로그램 카드와 이벤트 안내에서 금액이 모두 사라진다.
export const SHOW_PRICES = true

// 프로그램 메뉴(가격은 네이버 예약 기준). sale이 있으면 첫 방문 50% 할인가이고, 없으면 할인 대상이 아니다.
// photo는 PHOTOS의 키, fit: 'contain'은 누끼 제품 사진용이다.
export const PROGRAMS = [
  { id: 'scalp-detox', group: '두피 · 얼굴', title: '두피 디톡스 케어 & 헤드스파', time: '1시간', price: 130000, sale: 65000, photo: 'scalp', pos: 'center 30%', desc: '전류 딥 클렌징으로 모공 속 노폐물과 피지를 정리하고, 두피 타입에 맞는 제품으로 관리합니다. 목·승모 라인까지 함께 풀어 주는 시그니처 관리입니다.' },
  { id: 'scalp-face', group: '두피 · 얼굴', title: '두피 · 페이스 시그니처 케어', time: '1시간 30분', badge: '인기', price: 160000, sale: 80000, photo: 'moodFace', pos: '40% 40%', desc: '두피 관리에 얼굴 근막 케어를 더해 얼굴 라인과 탄력을 함께 가꾸는 대표 관리입니다. 피부 컨디션에 맞춰 맞춤으로 진행합니다.' },
  { id: 'back-lymph', group: '바디', title: '등 림프순환 케어', time: '1시간 20분', price: 120000, sale: 60000, photo: 'back', pos: 'center 25%', desc: '온열로 몸을 먼저 풀고, 기립근을 중심으로 목·어깨·데콜테까지 미세전류 디바이스와 손길로 이어서 풀어 주는 집중 케어입니다. 오래 앉아 있어 상체가 뭉치는 분께 추천합니다.' },
  { id: 'abdomen', group: '바디', title: '복부 슬리밍 케어', time: '1시간', price: 120000, sale: 60000, photo: 'candleLeg', pos: 'center 45%', desc: '온열로 붓기와 순환을 먼저 돕고, 뱃살과 옆구리, 뒷라인까지 복부 라인을 집중 관리하는 바디 슬리밍 시그니처입니다. 출산이나 갱년기 이후 복부 변화가 고민인 분께도 추천합니다.' },
  { id: 'lower', group: '바디', title: '하체 관리', time: '1시간 10분', price: 130000, sale: 65000, photo: 'leg', pos: 'center 40%', desc: '풀 바디 웜업으로 몸을 데운 뒤, 종아리와 발부터 하체 근막까지 상태에 맞춰 풀어 줍니다. 다리가 무겁고 답답하게 느껴지는 분께 추천합니다.' },
  { id: 'full-back', group: '바디', title: '전신 후면 관리', time: '1시간 30분', price: 110000, photo: 'back', pos: 'center 75%', desc: '풀 바디 웜업으로 몸을 따뜻하게 이완한 뒤, 등과 하체의 뭉친 부위를 집중적으로 풀어 줍니다.' },
  { id: 'lymph-node', group: '바디', title: '림프절 관리', time: '1시간', price: 140000, sale: 70000, photo: 'neck', pos: 'center 40%', desc: '목과 겨드랑이, 서혜부 등 주요 림프절 부위를 부드럽게 관리해 순환과 이완을 돕습니다.' },
  { id: 'warmup', group: '온열 웜업', title: '풀 바디 웜업케어 + 아로마테라피', time: '50분', price: 50000, photo: 'heatDome', fit: 'contain', desc: '컨디션에 맞는 아로마를 바른 뒤 온열돔에서 전신을 편안하게 데우며, 근막 이완과 순환을 돕는 관리입니다. 단독으로 가볍게 이용하기 좋습니다.' },
]

// 숫자로 보는 스튜디오
export const NUMBERS = [
  { n: '4', unit: '년', label: '예뻐졌다의 관리 노하우' },
  { n: '40', unit: '+', label: '함께하는 예뻐졌다 매장' },
  { n: '100', unit: '%', label: '100% 예약제 · 1:1 프라이빗 관리' },
  { n: '8', unit: '가지 관리', label: '두피부터 림프까지 8가지 관리' },
  { n: '50', unit: '%', label: '첫 방문 이벤트 할인', accent: true },
]

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
    // 네이버 플레이스 고유 번호(예약 단축 링크가 넘어가는 장소 페이지에서 확인)
    place: '1565549120',
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

// 지도 링크: 네이버 플레이스 번호가 있으면 매장 페이지로 바로, 없으면 주소 검색으로 연결한다.
export function mapHref(branch) {
  if (branch.place) return `https://map.naver.com/p/entry/place/${branch.place}`
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

// 화면에 보여 줄 주소: "141-2호"처럼 동·호수의 하이픈에서 줄이 갈리지 않도록 줄바꿈 없는 하이픈(U+2011)으로 바꾼다.
// 지도 링크(mapHref)는 원래 주소를 그대로 쓴다.
export const displayAddress = (address) => address.replace(/(\d)-(\d)/g, '$1\u2011$2')
