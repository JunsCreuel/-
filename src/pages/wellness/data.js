const BASE = import.meta.env.BASE_URL

// 랜딩 분위기 사진(Unsplash 무료 사진을 webp로 변환, public/wellness/photos/<이름>-<폭>.webp).
// 실제 매장·고객 사진이 아니므로 alt는 비우거나 장면만 적고, 후기·오시는 길 옆에는 두지 않는다.
const photoUrl = (name, w) => `${BASE}wellness/photos/${name}-${w}.webp`

// { src, srcSet, width, height }. src는 두 번째로 작은 폭(없으면 가장 작은 폭), width/height는 가장 큰 폭 기준이다.
function pic(name, widths, ratio) {
  const max = widths[widths.length - 1]
  return {
    src: photoUrl(name, widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${photoUrl(name, w)} ${w}w`).join(', '),
    width: max,
    height: Math.round(max / ratio),
  }
}

export const PICS = {
  // 히어로: 목 뒤에 손을 얹은 어깨(제공 사진). 데스크톱은 사진을 오른쪽에 두고 왼쪽을 벽 색으로 이어 글 자리를 만들었다.
  heroWarm: pic('hero-shoulder', [960, 1600], 3 / 2),
  heroWarmM: pic('hero-shoulder-m', [480, 734], 2 / 3),
  ritual1: pic('ritual-1', [600, 1200], 4 / 5),
  ritual2: pic('ritual-2', [600, 1200], 4 / 5),
  ritual3: pic('ritual-3', [600, 1200], 4 / 5),
  ritual4: pic('ritual-4', [600, 1200], 4 / 5),
  condScalp: pic('cond-scalp', [480, 960], 4 / 5),
  condFace: pic('cond-face', [480, 960], 4 / 5),
  condNeck: pic('cond-neck', [480, 960], 4 / 5),
  condBack: pic('cond-back', [480, 960], 4 / 5),
  condAbdomen: pic('cond-abdomen', [480, 960], 4 / 5),
  condLeg: pic('cond-leg', [480, 720], 4 / 5),
  condRest: pic('cond-rest', [960, 1600], 3 / 2),
  menuScalpDetox: pic('menu-scalp-detox', [240, 600, 1200], 4 / 5),
  menuScalpFace: pic('menu-scalp-face', [240, 600, 1200], 4 / 5),
  menuBackLymph: pic('menu-shoulder-v2', [240, 600, 736], 4 / 5),
  menuAbdomen: pic('menu-belly-v2', [240, 600, 675], 4 / 5),
  menuLower: pic('menu-legcare', [240, 600, 1200], 4 / 5),
  menuFullBack: pic('menu-back-v2', [240, 600, 736], 4 / 5),
  menuLymphNode: pic('menu-neck-v2', [240, 600, 736], 4 / 5),
  menuWarmup: pic('menu-warmup', [240, 600, 1200], 4 / 5),
  bizStill: pic('biz-still', [960, 1600], 2 / 3),
  closing: pic('closing', [960, 1600, 2400], 3 / 2),
  // 이벤트 팝업 사진(Unsplash 무료: photo-1540555700478 튤립·수건, photo-1706795033849 수건·초)
  // 이벤트 팝업 이미지(제공 이미지, 문구가 이미지 안에 들어 있다)
  popupEvent: pic('popup-offer-art', [480, 960], 1),
  popupDome: pic('popup-dome-art', [480, 960], 1),
  // 매장 온열돔 누끼(배경 투명 webp, 사장님 제공). 흰·회색 바탕 위에 contain으로 올린다.
  domeCut: pic('dome-cut', [700, 1376], 1376 / 747),
}

export const PHOTOS = {
  neck: `${BASE}wellness/neck.jpg`,
  scalp: `${BASE}wellness/scalp.jpg`,
  candleLeg: `${BASE}wellness/candle-leg.jpg`,
  back: `${BASE}wellness/back.jpg`,
  leg: `${BASE}wellness/leg.jpg`,
  // 시안용 분위기 이미지(저해상도 크롭). 실제 매장·제품·시술 사진이 아니므로 실제 촬영 사진으로 교체한다.
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

// 창업 안내. 예뻐졌다(본 브랜드)는 매장이 40개 이상이고, 예뻐졌다 웰니스 스튜디오는 그 자매 브랜드다(화면 표기는 '자매 브랜드'로 확정).
// 그래서 웰니스 스튜디오 창업은 처음 창업하는 것과 똑같은 신규 창업이다. 40+를 웰니스 스튜디오 매장 수처럼 쓰지 않는다.
export const PARENT_STORE_COUNT = 40

// 창업 비용: 확정되어 공개하는 금액만, 사장님이 확인해 준 그대로 적는다(계산기·예상 수익은 두지 않는다).
// 지금은 공개하는 금액이 없어 비어 있고, 비어 있으면 창업 장 '창업 비용 안내' 카드와 창업 FAQ의 로열티 문답이 함께 사라진다.
// 금액이 확정되면 { id, label, amount, note } 줄을 더한다. id 'royalty' 줄이 있으면 FAQ '로열티는 얼마인가요?'가 그 값을 읽는다.
export const STARTUP_COSTS = []
export const STARTUP_COSTS_NOTE = '그 밖의 창업 비용은 확정된 금액으로 공개할 예정이며, 지금은 상담에서 안내해 드립니다.'

// 프로그램 가격을 화면에 보일지 여부. false로 바꾸면 프로그램 카드와 이벤트 안내에서 금액이 모두 사라진다.
export const SHOW_PRICES = true

// 금액 표시: 130000 → '130,000원'
export const won = (n) => `${n.toLocaleString('ko-KR')}원`

// 첫 방문 이벤트 노출 여부. 이벤트가 끝나면 false로 바꿔 히어로 칩, 가격 줄의 첫 방문가, 첫 방문 티켓을 한 번에 내린다.
export const SHOW_OFFER = true

// 첫 방문 50%의 적용 조건(사장님 문구). 상시 할인이 아니라 첫 방문 고객 1인 1회 한정이고, 티켓팅 시 첫 방문가가 적용되며
// 1회 관리 시에는 별도 재료 비용이 발생한다.
// 50%·첫 방문가가 보이는 곳에는 짧은 조건(OFFER_TERM)을 늘 함께 쓰고, 각주·티켓에는 전체 조건(OFFER_TERM_FULL)을 쓴다.
// OFFER_TERM_NOTE는 FAQ처럼 문장으로 풀어 쓰는 곳에서 OFFER_TERM 뒤에 잇는다.
export const OFFER_TERM = '첫 방문 1인 1회 한정'
export const OFFER_TERM_FULL = '첫 방문 고객 1인 1회 한정 · 티켓팅 시 첫 방문가 적용 · 1회 관리 시 별도 재료 비용 발생'

// 첫 화면 이벤트 팝업(EventPopups.jsx). 끄려면 SHOW_POPUPS를 false로, 기간이 있으면 until('YYYY-MM-DD', 그날까지 표시)을 넣는다.
// to는 누르면 내려갈 섹션 id다. 이미지 안에 문구가 들어 있어 화면에는 이미지만 보이고, eyebrow·title·text는 보조기기에 읽힌다.
// note가 있으면 이미지 아래 작은 글로 보인다(할인 조건처럼 이미지에 없는 내용).
export const SHOW_POPUPS = true
export const EVENT_POPUPS = [
  {
    id: 'first-visit',
    pic: 'popupEvent',
    eyebrow: '첫 방문 이벤트',
    title: '6개 관리 50%',
    text: OFFER_TERM_FULL,
    note: OFFER_TERM_FULL,
    cta: '이벤트 보기',
    to: 'offer',
    until: '2026-10-31',
  },
  {
    id: 'dome-solo',
    pic: 'popupDome',
    eyebrow: '국산 명신메디칼 온열돔',
    title: '온열돔 단독 이용',
    text: '편하게 누운 채 40분, 온열돔만 따로 이용하실 수 있어요.',
    cta: '온열돔 보기',
    to: 'equipment',
    until: '2026-10-31',
  },
]
export const OFFER_TERM_NOTE = '티켓팅 시 첫 방문가가 적용되고, 1회 관리 시에는 별도 재료 비용이 발생합니다.'

// 프로그램 메뉴(가격은 네이버 예약 기준). sale이 있으면 첫 방문 50% 할인가이고, 없으면 할인 대상이 아니다.
// title은 네이버 메뉴명이라 바꾸지 않는다. 화면 표시는 label을 쓰고, 표시명을 바꿀 때는 label만 고친다.
// area는 상담 폼 '신경 쓰이는 곳'(AREAS) 값과 정확히 같아야 한다. min은 소요 분, note는 한 줄 과정, pic은 PICS의 키다.
// photo는 PHOTOS의 키, fit: 'contain'은 누끼 제품 사진용이다(기존 섹션용).
export const PROGRAMS = [
  { id: 'scalp-detox', group: '두피 · 얼굴', title: '두피 디톡스 케어 & 헤드스파', time: '1시간', price: 130000, sale: 65000, photo: 'scalp', pos: 'center 30%', desc: '딥 클렌징으로 모공 속 각질과 피지를 깨끗하게 정리하고, 두피 타입에 맞는 제품으로 관리합니다. 목·어깨 라인까지 편안하게 케어하는 시그니처 관리입니다.', label: '두피 디톡스 케어 & 헤드스파', area: '두피 · 얼굴', min: 60, pic: 'menuScalpDetox', note: '두피 클렌징과 헤드스파에 목·어깨 라인까지 이어지는 1시간입니다.' },
  { id: 'scalp-face', group: '두피 · 얼굴', title: '두피 · 페이스 시그니처 케어', time: '1시간 30분', badge: '인기', price: 160000, sale: 80000, photo: 'moodFace', pos: '40% 40%', desc: '두피 관리에 얼굴 피부 관리를 더해, 두피부터 얼굴 피부결까지 함께 가꾸는 대표 관리입니다. 피부 컨디션에 맞춰 맞춤으로 진행합니다.', label: '두피 · 페이스 시그니처 케어', area: '두피 · 얼굴', min: 90, pic: 'menuScalpFace', note: '두피 관리에 얼굴 피부 관리를 더한 대표 관리입니다.' },
  { id: 'back-lymph', group: '바디', title: '등 림프순환 케어', time: '1시간 20분', price: 120000, sale: 60000, photo: 'back', pos: 'center 25%', desc: '온열로 몸을 먼저 따뜻하게 데우고, 등부터 목·어깨·데콜테까지 바디 피부를 갈바닉 디바이스와 손길로 이어서 케어하는 집중 관리입니다. 오래 앉아 있어 상체가 무겁게 느껴지는 분께 추천합니다.', label: '등 림프순환 케어', area: '등 · 어깨', min: 80, pic: 'menuBackLymph', note: '온열로 몸을 데운 뒤, 등부터 데콜테까지 갈바닉과 손길로 관리합니다.' },
  { id: 'abdomen', group: '바디', title: '복부 슬리밍 케어', time: '1시간', price: 120000, sale: 60000, photo: 'candleLeg', pos: 'center 45%', desc: '온열돔으로 몸을 따뜻하게 데운 뒤, 복부와 옆구리, 허리 뒷라인까지 바디 피부를 집중 관리하는 바디 시그니처입니다. 복부 피부 컨디션이 신경 쓰이는 분께 추천합니다.', label: '복부 슬리밍 케어', area: '복부', min: 60, pic: 'menuAbdomen', note: '온열돔 웜업 후 복부와 옆구리, 허리 뒷라인을 관리합니다.' },
  { id: 'lower', group: '바디', title: '하체 관리', time: '1시간 10분', price: 130000, sale: 65000, photo: 'leg', pos: 'center 40%', desc: '풀 바디 웜업으로 몸을 데운 뒤, 발과 종아리부터 허벅지까지 하체 라인을 상태에 맞춰 케어합니다. 다리가 무겁게 느껴지는 분께 추천합니다.', label: '하체 관리', area: '하체 · 림프', min: 70, pic: 'menuLower', note: '풀 바디 웜업 후 발끝에서 허벅지까지 하체 라인을 관리합니다.' },
  { id: 'full-back', group: '바디', title: '전신 후면 관리', time: '1시간 30분', price: 110000, photo: 'back', pos: 'center 75%', desc: '풀 바디 웜업으로 몸을 따뜻하게 데운 뒤, 등과 하체를 집중적으로 케어합니다.', label: '전신 후면 관리', area: '등 · 어깨', min: 90, pic: 'menuFullBack', note: '풀 바디 웜업 후 등과 하체에 집중하는 1시간 30분입니다.' },
  { id: 'lymph-node', group: '바디', title: '림프절 관리', time: '1시간', price: 140000, sale: 70000, photo: 'neck', pos: 'center 40%', desc: '목과 겨드랑이, 다리 안쪽 라인을 따라 부드러운 손길로 편안하게 관리합니다.', label: '림프절 관리', area: '하체 · 림프', min: 60, pic: 'menuLymphNode', note: '목과 겨드랑이, 다리 안쪽 라인을 부드러운 손길로 관리합니다.' },
  { id: 'warmup', group: '온열 웜업', title: '풀 바디 웜업케어 + 아로마테라피', time: '40분', price: 50000, photo: 'heatDome', fit: 'contain', desc: '컨디션에 맞는 아로마를 바른 뒤 온열돔에서 전신을 편안하게 데우며 쉬어 가는 관리입니다. 단독으로 가볍게 이용하기 좋습니다.', label: '풀 바디 웜업케어 + 아로마테라피', area: '온열 웜업', min: 40, pic: 'menuWarmup', note: '아로마를 바르고 온열돔에서 쉬어 가는 40분입니다.' },
]

// 할인(50%) 대상 관리 수. 50%는 항상 이 범위('6개 관리')와 함께 쓴다.
export const SALE_COUNT = PROGRAMS.filter((p) => p.sale).length

// 상담 폼 1단계 '신경 쓰이는 곳' 선택지. PROGRAMS.area와 pickForBooking({ area })가 이 문자열과 정확히 같아야 한다.
export const AREAS = ['두피 · 얼굴', '등 · 어깨', '복부', '하체 · 림프', '온열 웜업', '상담 후 결정']

// 네이버 플레이스 방문자 리뷰(글이 있는 리뷰). 글(text)은 작성자가 쓴 그대로 싣는다(고치거나 줄이지 않는다).
// quote는 카드 머리에 크게 보일 한 구절로, 반드시 text 안의 문장을 그대로 잘라 쓴다(효능을 말하는 구절은 고르지 않는다).
// nick은 네이버에 보이는 닉네임의 앞 두 글자만 남기고 가린다(네이버가 이미 가린 아이디는 그대로). date는 방문일.
// topic은 글에 나온 관리를 매장이 붙인 짧은 꼬리표(없으면 생략).
// claim: 붓기·체중·면역·노폐물·라인처럼 관리 효과를 말하는 문장이 들어 있는 후기. SHOW_CLAIM_REVIEWS가 false면 화면에서 뺀다.
// 새 후기는 이 목록에 항목만 더하면 된다(앞에 둘수록 먼저 보인다).
export const SHOW_CLAIM_REVIEWS = true

export const REVIEWS = [
  {
    nick: 'cob****', date: '2026.10.23',
    quote: '관리에 대한 설명도 정말 자세히 잘해주시네요!',
    text: '집근처에 이런 관리샵이 보물같이 숨겨져있었네용😃\n원장님 너무 꼼꼼하시고  관리에 대한 설명도 정말 자세히 잘해주시네요! 셀프관리에 대해서도 많이 알려주세요👍🏻\n꾸준하게 원장님힌테 관리받을래용😘',
  },
  {
    nick: '쪼르***', date: '2026.10.22', topic: '온열돔', claim: true,
    quote: '온열돔 다른 곳에서도 해봤는데 여기가 진리입니다',
    text: '온열돔 다른 곳에서도 해봤는데 여기가 진리입니다\n40분 정도 했는데 20분째는 따뜻하네 했는데 이후로 땀이 엄청나게 나면서 온몸에서 땀나네요 엄청 개운하고 붓기도 왕창 빠진 거 같아요 ㅎㅎ',
  },
  {
    nick: 'lll****', date: '2026.10.23', topic: '복부 · 팔뚝 · 온열돔', claim: true,
    quote: '관리해주시는 원장님 악력이 대박입니당',
    text: '복부랑 팔뚝이 늘 고민이어서 집근처를 찾다가 발견한 예뻐졌다 에스테틱 ! 너무 좋아요~ 온열돔에 땀한번 빼고 나면 체지방 쭉쭉 빠지는 기분 듭니다 ㅎㅎ 관리해주시는 원장님 악력이 대박입니당 ㅎㅎ 담번엔 두피관리도 받아봐야겠어요~',
  },
  {
    nick: '쩡이***', date: '2026.09.12',
    quote: '긴장하지 않고 푹 쉬다 온 기분이에요',
    text: '새롭게 리뉴얼된 예뻐졌다 웰니스 스튜디오에 다녀왔어요 :) 평소 몸의 순환이 잘 안 되는 느낌과 묵직함이 있어 관리를 받았는데, 시작하기 전부터 현재 불편한 부분과 몸 상태를 꼼꼼하게 상담해 주셔서 믿음이 갔어요. 관리하는 동안에도 계속 불편한 곳은 없는지 세심하게 확인해 주셨고, 친절하고 편안한 분위기라 긴장하지 않고 푹 쉬다 온 기분이에요. 관리 후에는 몸이 한결 가볍고 개운해진 느낌이 들어 만족스러웠습니다ㅎㅎ 공간도 깔끔하고 아늑해서 다음에도 편하게 다시 방문하고 싶은 곳이에요! 또뵐께요😍😍',
  },
  {
    nick: 'qh***', date: '2026.10.06', topic: '온열 관리',
    quote: '프라이빗하고 안락해서 꿀잠까지 들었어요!',
    text: '편하게 누워 온열 관리 순환과 고민 부위 케어도 가능했어요 \n프라이빗하고 안락해서 꿀잠까지 들었어요!',
  },
  {
    nick: '타코***', date: '2026.10.05', topic: '두피 · 얼굴 · 온열돔', claim: true,
    quote: '평소 고민에 맞춰서 상담해주셔서 넘 좋았서요',
    text: '두피하면 승모근도 같이 풀어주시는데 진짜 너무 만족...ㅠ 머리에 열이 많은 편인데 쿨링 완전 되구요... 얼굴까지 관리하고 나니까 진짜 새신부 됐습니당ㅎㅎ 평소 고민에 맞춰서 상담해주셔서 넘 좋았서요 !!!! 열돔도 체험 강추드립니당,, 땀도 쫙 빼고 나니까 건강해진 느낌에다가 살도 잘빠지는 거 같아요,, 친절하신 원장님 또 봬요 🫶🏻',
  },
  {
    nick: 'new****', date: '2026.10.07', topic: '어깨 · 온열돔', claim: true,
    quote: '편안하게 관리해주셔서 부담 없이 받을 수 있었습니다',
    text: '요즘 피로가 쌓이고 컨디션도 떨어진 것 같아서 예뻐졌다 웰니스 스튜디오에서 승모관리랑 온열돔관리 받고 왔어요💙  평소 어깨랑 목이 많이 뭉쳐 있었는데 승모관리를 받고 나니 뻐근했던 부분이 한결 편안해진 느낌이라 좋더라고요! 온열돔관리까지 같이 받으니 몸 전체가 따뜻하게 데워지면서 땀도 충분히 나고, 관리 후에는 몸이 개운하고 노곤하게 풀리는 느낌이었어요 :) 특히 요즘처럼 면역력이 떨어진 것 같고 몸이 무겁게 느껴질 때 받기 좋은 관리인 것 같아요 👍🏻 처음부터 끝까지 친절하게 설명해주시고 편안하게 관리해주셔서 부담 없이 받을 수 있었습니다 ~ 피로 풀고 몸 컨디션 관리하고 싶을 때 재방문하고 싶은 곳이에요 :D',
  },
  {
    nick: 'jsp****', date: '2026.09.11', topic: '온열돔 · 전신 관리',
    quote: '너무 힐링이 됐던 시간이였습니다',
    text: '원장님 추천으로 온열돔 하고 땀을 빼고 순환을 시킨 뒤에 전신관리 받으니까 더 효과도 좋았던거같고 하고 나니 훨씬 더 개운한거같습니다 날씨가 쌀쌀해지고 있어서 온열돔만 하러도 자주 올거같습니다 상태에 맞는 아로마를 바르고 들어가니 너무 힐링이 됐던 시간이였습니다 감사합니다 원장님',
  },
  {
    nick: 'mm***', date: '2026.10.06', topic: '온열돔', claim: true,
    quote: '누워서 따뜻하게있으니까 잠이솔솔',
    text: '깔끔하고 릴렉스하기 편한 분위기로 조성되어있어서\n관리받는동안 너무 편했어요,, 특히나 온열돔 관리는\n누워서 따뜻하게있으니까 잠이솔솔,, 하고나니까 땀이 엄청 나왔는데 너무 개운했어요!!! 면역관리,다이어트,몸이 냉한사람들에게 추천드려요~',
  },
  {
    nick: '뮤디***', date: '2026.09.11', topic: '웜업 · 복부 관리', claim: true,
    quote: '고민인 부위를 따로 한번 더 관리 해셔서',
    text: '다이어트로 고민이 있어서 왔는데 웜업 관리 후 복부관리 하니까 정말 효과가 좋았습니다 다른곳들은 온열돔만 하고 따로 후속 관리를 안해서 조금 아쉬웠는데 여긴 땀을 빼고 난 후 고민인 부위를 따로 한번 더 관리 해셔서 다이어트 할때 한번만 해도 라인이 정리된거 같아서 너무 만족합니당 운동만으로 빼기 힘든 부위는 한번쯤 받아보시는거 추천합니당🌿',
  },
  {
    nick: '엽5***', date: '2026.10.06',
    quote: '너무 꼼꼼하게 해주셔서',
    text: '여러번 받았는데 너무 꼼꼼하게 해주셔서 하고나면 훨씬 몸이 가벼워요👍',
  },
  {
    nick: '친밍***', date: '2026.10.06', topic: '어깨 · 온열돔', claim: true,
    quote: '몸이 한결 가볍게 나가요',
    text: '직업이 사무직이라 컴퓨터를 계속 하니까 어깨랑 목이 많이 결려있었는데 마침 회사 근처에 승모+ 온열돔 관리를 같이 할수있다고해서 바로 예약하고 관리 받았어요!ㅎㅎ\n확실히 관리받고나서 어깨랑 목도 바로 풀려서 묵직한느낌도 사라졌고 온열돔으로 붓기랑 순환까지 되서 몸이 한결 가볍게 나가요👍👍',
  },
  {
    nick: 'luy****', date: '2026.10.02', topic: '디바이스 · 온열돔', claim: true,
    quote: '몸이 찌뿌둥할 때 종종 들리고 싶어요',
    text: '디바이스 관리로 뭉친 근육 승모도 풀고 온열돔에서 땀도 빼니 개운해서 몸속에 노폐물이 다 배출된 느낌이더라구요 몸이 찌뿌둥할 때 종종 들리고 싶어요☺️',
  },
  {
    nick: 'pbc****', date: '2026.09.17',
    quote: '맞춤관리를 잘 해주셔서',
    text: '너무 맞춤관리를 잘 해주셔서 관리받는동안 몸 전체가 다 풀린 기분이었습니다~감사합니다',
  },
  {
    nick: 'zla****', date: '2026.10.13', topic: '온열돔', claim: true,
    quote: '컨디션이 좋아진것같아요!',
    text: '출산후 열돔관리왔어요!!ㅎㅎ땀 빼니깐 붓기도 빠지고 컨디션이 좋아진것같아요!추천드립니다!',
  },
  {
    nick: '뽀송***', date: '2026.10.06', topic: '복부 관리', claim: true,
    quote: '복부 관리 제대로 했네요!',
    text: '복부 관리 제대로 했네요! 노폐물 쫙 잘 뺐습니다 ㅎㅎ',
  },
]

// 네이버 플레이스 방문자 리뷰 통계(asOf 기준, 숫자가 바뀌면 함께 고친다).
// keywords는 '이런 점이 좋았어요' 투표 가운데 효능·시술 표현이 없는 항목만 골랐다. voters는 키워드 투표에 참여한 사람 수.
export const REVIEW_STATS = {
  asOf: '2026.10.23',
  total: 59,
  rating: '5.0',
  voters: 52,
  keywords: [
    { label: '친절해요', count: 46 },
    { label: '맞춤 케어를 잘해줘요', count: 44 },
    { label: '분위기가 편안해요', count: 28 },
    { label: '상담이 자세해요', count: 16 },
  ],
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
    hours: '월~일 10:00 – 22:00',
    phone: '010-3885-1989',
    booking: null,
  },
}

// 마린시티점은 아직 오픈 전이라 화면에서 숨긴다(지점 전환·푸터·폼·오시는 길·페이지 주소).
// 오픈하면 true로 바꾸면 한 번에 다시 노출된다.
export const MARINE_OPEN = false

// 마린시티점은 별도 페이지 없이 '지점 안내'(예약 장 오시는 길 아래 한 줄, 푸터 주소·전화)로만 알린다.
export const SHOW_MARINE_INFO = true

// 창업 상담은 용호 자이점에서 진행하고, 전화는 아래 두 번호로만 받는다.
export const STARTUP_PHONES = [BRANCHES.zai.phone, BRANCHES.marine.phone]

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
