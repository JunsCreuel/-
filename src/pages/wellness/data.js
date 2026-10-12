const BASE = import.meta.env.BASE_URL

export const PHOTOS = {
  neck: `${BASE}wellness/neck.jpg`,
  scalp: `${BASE}wellness/scalp.jpg`,
  candleLeg: `${BASE}wellness/candle-leg.jpg`,
  back: `${BASE}wellness/back.jpg`,
  leg: `${BASE}wellness/leg.jpg`,
  qrBooking: `${BASE}wellness/qr-naver-booking.png`,
}

// 관리 프로그램. 이름·시간·가격은 네이버 예약에 올라간 메뉴와 똑같이 맞춘다.
// sale이 있으면 첫 방문 50% 할인가로 보여 주고, 없으면 정가만 보여 준다.
export const PROGRAM_GROUPS = [
  {
    no: '01',
    title: '두피 · 얼굴',
    items: [
      {
        name: '두피 디톡스 케어 & 헤드스파',
        time: '1시간',
        price: 130000,
        sale: 65000,
        text: '전류 딥 클렌징으로 모공 속 노폐물과 피지를 정리하고, 두피 타입에 맞는 제품으로 관리합니다. 목·승모 라인까지 함께 풀어 주는 시그니처 관리입니다.',
      },
      {
        name: '두피 · 페이스 시그니처 케어',
        time: '1시간 30분',
        price: 160000,
        sale: 80000,
        badge: '인기',
        text: '두피 관리에 얼굴 근막 케어를 더해 얼굴 라인과 탄력을 함께 가꾸는 대표 관리입니다. 피부 컨디션에 맞춰 맞춤으로 진행합니다.',
      },
    ],
  },
  {
    no: '02',
    title: '바디',
    items: [
      {
        name: '등 림프순환 케어',
        time: '1시간 20분',
        price: 120000,
        sale: 60000,
        text: '온열로 몸을 먼저 풀고, 기립근을 중심으로 목·어깨·데콜테까지 미세전류 디바이스와 손길로 이어서 풀어 주는 집중 케어입니다. 오래 앉아 있어 상체가 뭉치는 분께 추천합니다.',
      },
      {
        name: '복부 슬리밍 케어',
        time: '1시간',
        price: 120000,
        sale: 60000,
        text: '온열로 붓기와 순환을 먼저 돕고, 뱃살과 옆구리, 뒷라인까지 복부 라인을 집중 관리하는 바디 슬리밍 시그니처입니다. 출산이나 갱년기 이후 복부 변화가 고민인 분께도 추천합니다.',
      },
      {
        name: '하체 관리',
        time: '1시간 10분',
        price: 130000,
        sale: 65000,
        text: '풀 바디 웜업으로 몸을 데운 뒤, 종아리와 발부터 하체 근막까지 상태에 맞춰 풀어 줍니다. 다리가 무겁고 답답하게 느껴지는 분께 추천합니다.',
      },
      {
        name: '전신 후면 관리',
        time: '1시간 30분',
        price: 110000,
        text: '풀 바디 웜업으로 몸을 따뜻하게 이완한 뒤, 등과 하체의 뭉친 부위를 집중적으로 풀어 줍니다.',
      },
      {
        name: '림프절 관리',
        time: '1시간',
        price: 140000,
        sale: 70000,
        text: '목과 겨드랑이, 서혜부 등 주요 림프절 부위를 부드럽게 관리해 순환과 이완을 돕습니다.',
      },
    ],
  },
  {
    no: '03',
    title: '온열 웜업',
    photo: `${BASE}wellness/devices/dome.webp`,
    items: [
      {
        name: '풀 바디 웜업케어 + 아로마테라피',
        time: '50분',
        price: 50000,
        text: '컨디션에 맞는 아로마를 바른 뒤 온열돔에서 전신을 편안하게 데우며, 근막 이완과 순환을 돕는 관리입니다. 단독으로 가볍게 이용하기 좋습니다.',
      },
    ],
  },
]

// 장비 소개. 고객에게는 장비 브랜드명 없이 "온열돔·갈바닉·웰스파"로만 안내한다.
export const DEVICES = [
  {
    no: '01',
    name: '온열돔',
    sub: '전신웜업케어',
    photo: { src: `${BASE}wellness/devices/dome.webp`, alt: '흰색 전신 온열돔 장비', width: 900, height: 474 },
    point: '몸 전체를 따뜻하게 데워 긴장을 풀어 주는 관리의 첫 단계',
    text: '원적외선 온열 방식의 전신 온열돔에 편안히 누워 쉬는 동안, 몸이 깊고 균일하게 데워지며 땀과 함께 개운한 컨디션으로 이어집니다. 단독으로 이용하거나 아웃케어 전 준비 단계로 진행합니다.',
    tags: ['원적외선 전신 온열', '누워서 쉬는 방식', '단독 이용 가능'],
  },
  {
    no: '02',
    name: '페이스 갈바닉',
    sub: '얼굴',
    photo: { src: `${BASE}wellness/devices/galvanic.webp`, alt: '갈바닉 기기 본체와 교체형 헤드 3종', width: 900, height: 772 },
    point: '미세전류와 전용 젤로 피부 컨디션을 섬세하게 가꾸는 디바이스',
    text: '갈바닉 미세전류를 전용 젤과 함께 사용해 제품이 피부에 고르게 닿도록 돕습니다. 부위에 맞는 헤드로 바꿔 가며 피부결과 촉촉함, 얼굴 라인까지 섬세하게 관리합니다.',
    tags: ['얼굴 전용', '교체형 헤드', '오일 대신 전용 젤'],
  },
  {
    no: '03',
    name: '바디 갈바닉',
    sub: '바디',
    photo: { src: `${BASE}wellness/devices/body-galvanic.webp`, alt: '바디 갈바닉 기기 앞면', width: 494, height: 900 },
    point: '바디 피부에 맞춘 갈바닉 전류로 넓은 부위를 고르게 관리하는 디바이스',
    text: '진동 주기를 가진 갈바닉 전류와 넓은 면적의 컨덕터로 복부처럼 넓은 부위를 효율적으로 관리합니다. 피부 상태에 맞춘 자동 프로그램으로 진행하고, 화면과 알림음으로 진행 상태를 확인합니다.',
    tags: ['바디 전용 갈바닉', '넓은 면적 컨덕터', '자동 프로그램'],
  },
  {
    no: '04',
    name: '웰스파',
    sub: '바디',
    photo: { src: `${BASE}wellness/devices/wellspa.webp`, alt: '웰스파 바디 디바이스 앞면과 마사지 헤드', width: 900, height: 715 },
    point: '무겁게 느껴지는 바디 라인을 부드럽게 쓸어 주듯 관리하는 디바이스',
    text: '웰스파 전용 제품과 함께 하체, 팔뚝, 복부처럼 붓고 무겁게 느껴지는 부위를 마사지하듯 관리합니다. 온열돔으로 몸이 따뜻해진 뒤 아웃케어로 이어서 진행합니다.',
    tags: ['바디 라인 관리', '하체 · 팔뚝 · 복부', '웰스파 전용 제품'],
  },
]

// 디바이스 관리에 쓰는 전용 젤. 효능을 단정하는 표현(통증·치료 등)은 쓰지 않는다.
const DEV = `${BASE}wellness/devices/`
export const GELS = [
  {
    no: '01',
    label: '바디 갈바닉 전용 젤',
    name: '에이지락 바디 쉐이핑 젤',
    en: 'Body Shaping Gel · 300 mL',
    text: '바디 갈바닉 관리에 함께 쓰는 전용 젤입니다. 갈바닉 전류가 피부에 고르게 닿도록 돕고, 복부처럼 넓은 부위를 부드럽게 관리할 수 있게 해 줍니다.',
    photo: { src: `${DEV}gel-body-shaping.webp`, alt: '파란색 튜브의 에이지락 바디 쉐이핑 젤', width: 347, height: 900 },
    ingredients: [
      { name: '호스테일켈프 추출물', en: 'Laminaria Digitata Extract', text: '바다에서 자라는 갈조류에서 얻은 성분', img: `${DEV}ing-kelp.webp` },
      { name: '테오브로민', en: 'Theobromine', text: '카카오에 들어 있는 성분', img: `${DEV}ing-theobromine.webp` },
    ],
  },
  {
    no: '02',
    label: '웰스파 전용 세럼',
    name: '에이지락 바디 세럼',
    en: 'Body Serum · 100 mL',
    text: '웰스파 관리 때 함께 쓰는 전용 세럼입니다. 셀룰라이트가 신경 쓰이는 부위와 탄력, 바디 라인을 관리할 때 사용합니다.',
    photo: { src: `${DEV}gel-body-serum.webp`, alt: '손바닥에 덜어 낸 에이지락 바디 세럼', width: 900, height: 649, bleed: true },
    reverse: true,
    ingredients: [
      { name: '바디 실루엣 블렌드', text: '보태니컬 성분 복합체로 바디 피부를 탄탄하게 가꿔 줍니다.' },
      { name: 'AI 펩타이드', text: 'AI로 찾아낸 펩타이드로 탄력 있는 바디 피부를 돕습니다.' },
      { name: '타라열매 & 코토니 추출물', text: '외부 환경으로부터 피부를 보호해 매끄럽고 촉촉하게 지켜 줍니다.' },
      { name: '스킨 컨디셔닝 블렌드', text: '마카다미아넛오일, 해바라기씨오일 추출물, 알란토인, 판테놀' },
      { name: '에이지락 블렌드', text: '세월의 흐름에 따른 피부 고민을 케어하는 프리미엄 블렌드' },
    ],
  },
  {
    no: '03',
    label: '웰스파 전용 젤',
    name: '에이지락 바디 액티베이팅 젤',
    en: 'Body Activating Gel · 150 mL',
    text: '웰스파 관리 때 함께 쓰는 전용 젤입니다. 순환이 답답하게 느껴질 때, 뻐근하게 뭉친 부위와 붓기가 신경 쓰일 때 사용합니다.',
    photo: { src: `${DEV}gel-body-activating.webp`, alt: '손바닥에 짜내는 에이지락 바디 액티베이팅 젤', width: 801, height: 900, bleed: true },
    ingredients: [
      { name: '서양벌노랑이꽃 추출물', text: '정체된 바디 사이클을 깨우고 전반적인 밸런스를 챙겨 줍니다.' },
      { name: '록샘파이어 추출물', text: '가벼운 아침을 위한 상쾌한 리프레시 케어' },
      { name: '윈터체리뿌리 추출물', text: '바디 피부에 쌓인 스트레스를 덜어 편안하게 가꿔 줍니다.' },
      { name: '에이지락 블렌드', text: '세월의 흐름에 따른 피부 고민을 케어하는 프리미엄 블렌드' },
    ],
  },
]

export function won(n) {
  return `${n.toLocaleString('ko-KR')}원`
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
