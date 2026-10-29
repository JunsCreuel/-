import { useEffect, useId, useRef, useState } from 'react'
import { PHOTOS, PICS } from '../data'
import { Pic } from '../editorial'
import { clamp, prefersReducedMotion, useDragScroll, useInView } from '../motion'
import { lockPageScroll, pickForBooking } from '../scroll'

// No. 05 Equipment & Gel — 전신 온열돔 카드와 디바이스 3종을 한 줄 트랙으로 묶는다.
// 데스크톱은 마우스로 끌어 넘기고(관성 후 카드에 맞춤), 트랙패드·화살표·←→ 키로도 넘긴다. 모바일은 네이티브 스와이프와 scroll-snap.
// 디바이스 카드에 마우스를 올리면(또는 '젤 보기') 기기 사진 위로 전용 젤 사진이 왼쪽에서 오른쪽으로 덮이고,
// '성분 보기'를 누르면 그 기기에 쓰는 젤의 성분 시트가 열린다.
// 화장품·기기 광고 기준에 맞춰 사용 장면과 성분 출처만 적고 효능은 쓰지 않는다.

// 온열돔 정보: 명신메디칼(1998년 설립, 광주 원적외선 온열기 제조사) 국내산 돔형 온열기. 출처는 제조사 인터뷰 기사.
// 효능 표현(통증·비만·면역 등)은 쓰지 않고 방식·제조·이용 정보만 적는다.
const DOME_FACTS = [
  ['제조', '(주)명신메디칼 · 국내 제조'],
  ['방식', '탄소 면상발열체로 몸 전체를 감싸는 원적외선 온열'],
  ['설계', '특허 면상발열체 기술 · 전원부 발열을 줄인 안전 설계'],
  ['이용', '편하게 누운 채 40분'],
  ['이런 분께', '몸이 쉽게 차가워지거나, 따뜻하게 쉬어 가고 싶은 분'],
]

// 온열돔 이용 방식. 버튼을 누르면 상담 폼 1단계가 '온열 웜업'으로 미리 선택된 채 예약 장으로 내려간다.
const DOME_USES = [
  { id: 'solo', label: '단독 이용', text: '온열돔만 편안하게 이용합니다.', cta: '온열돔 단독 이용 상담' },
  { id: 'regular', label: '정기 이용', text: '방문 주기와 이용권 구성을 상담합니다.', cta: '정기 이용 상담' },
  { id: 'combo', label: '온열돔 + 집중관리', text: '온열돔 후 원하는 부위 하나를 더 관리합니다.', cta: '온열돔 + 집중관리 상담' },
]

// 기기별 전용 젤·세럼. 카드의 '젤 보기' 면과 '성분 보기' 시트가 같은 데이터를 쓴다.
// 사진은 모두 배경이 투명한 webp다. hand가 아니면 제품 누끼(밝은 바탕에 contain), hand면 손이 사진 가장자리에서 잘린
// 손바닥 컷이라 시트에서는 사진 비율 그대로의 둥근 프레임에 꽉 채운다. w·h는 원본 크기.
// 성분 설명은 원료를 무엇에서 얻었는지(출처)만 적고, 무엇에 좋은지(효능)는 쓰지 않는다.
const SHAPING_GEL = {
  name: '에이지락 바디 쉐이핑 젤',
  volume: '300 mL',
  src: PHOTOS.gelShaping,
  alt: '파란색 튜브의 에이지락 바디 쉐이핑 젤',
  w: 347,
  h: 900,
  usage: '갈바닉 관리에 함께 쓰는 전용 젤입니다. 갈바닉 전류가 피부에 고르게 닿도록 도와, 오일 없이 부드럽게 관리할 수 있습니다.',
  ingredients: [
    {
      icon: PHOTOS.ingKelp,
      iconAlt: '초록빛 해조류',
      name: '호스테일켈프 추출물',
      en: 'Laminaria Digitata Extract',
      desc: '북대서양 연안에서 자라는 갈조류(다시마류)에서 얻은 추출물',
    },
    {
      icon: PHOTOS.ingTheobromine,
      iconAlt: '맑은 물방울 구조',
      name: '테오브로민',
      en: 'Theobromine',
      desc: '카카오 열매에 들어 있는 성분',
    },
  ],
}

const BODY_SERUM = {
  name: '에이지락 바디 세럼',
  volume: '100 mL',
  src: PHOTOS.gelSerum,
  alt: '손바닥에 덜어 낸 에이지락 바디 세럼',
  w: 900,
  h: 649,
  hand: true,
  usage: '웰스파 관리 때 바디 피부를 촉촉하고 매끄럽게 가꾸기 위해 함께 사용하는 세럼입니다.',
  ingredients: [
    { name: '바디 실루엣 블렌드', desc: '여러 식물 유래 성분을 배합한 복합체' },
    { name: 'AI 펩타이드', desc: '아미노산이 사슬처럼 이어진 펩타이드 성분' },
    { name: '타라열매 & 코토니 추출물', desc: '타라 나무 열매 등 식물에서 얻은 추출물' },
    { name: '스킨 컨디셔닝 블렌드', desc: '마카다미아넛오일, 해바라기씨오일 추출물, 알란토인, 판테놀을 배합한 블렌드' },
    { name: '에이지락 블렌드', desc: '뉴스킨 에이지락 제품군에 공통으로 들어가는 성분 복합체' },
  ],
}

const ACTIVATING_GEL = {
  name: '에이지락 바디 액티베이팅 젤',
  volume: '150 mL',
  src: PHOTOS.gelActivating,
  alt: '손바닥에 짜내는 에이지락 바디 액티베이팅 젤',
  w: 801,
  h: 900,
  hand: true,
  usage: '웰스파 관리 때 기기 헤드가 피부 위를 부드럽게 지나가도록 함께 사용하는 젤입니다.',
  ingredients: [
    { name: '서양벌노랑이꽃 추출물', desc: '유럽·아시아의 풀밭에서 자라는 콩과 식물(벌노랑이)의 꽃에서 얻은 추출물' },
    { name: '록샘파이어 추출물', desc: '바닷가 바위 틈에서 자라는 식물(록샘파이어)에서 얻은 추출물' },
    { name: '윈터체리뿌리 추출물', desc: '윈터체리(아슈와간다)의 뿌리에서 얻은 추출물' },
    { name: '에이지락 블렌드', desc: '뉴스킨 에이지락 제품군에 공통으로 들어가는 성분 복합체' },
  ],
}

// 디바이스와 기기별 전용 제품. 페이스 갈바닉과 바디 갈바닉은 같은 쉐이핑 젤을 쓴다.
// sheetEn·sheetKo는 성분 시트 머리 라벨('GEL · 페이스 갈바닉 전용')과 보조기기용 시트 이름('페이스 갈바닉 전용 젤 성분')이다.
const DEVICES = [
  {
    no: '02',
    en: '얼굴',
    name: '페이스 갈바닉',
    sub: '얼굴 · 교체형 헤드',
    photo: PHOTOS.faceGalvanic,
    alt: '갈바닉 기기 본체와 교체형 헤드 3종',
    gels: [SHAPING_GEL],
    sheetEn: 'GEL',
    sheetKo: '젤',
  },
  {
    no: '03',
    en: '바디',
    name: '바디 갈바닉',
    sub: '바디 · 넓은 면적 컨덕터',
    photo: PHOTOS.bodyGalvanic,
    alt: '바디 갈바닉 기기 앞면',
    gels: [SHAPING_GEL],
    sheetEn: 'GEL',
    sheetKo: '젤',
  },
  {
    no: '04',
    en: '바디',
    name: '웰스파',
    sub: '하체 · 팔뚝 · 복부',
    photo: PHOTOS.wellspa,
    alt: '웰스파 바디 디바이스 앞면과 헤드',
    gels: [BODY_SERUM, ACTIVATING_GEL],
    sheetEn: 'SERUM & GEL',
    sheetKo: '세럼과 젤',
  },
]

const CARD_COUNT = DEVICES.length + 1

// 앞뒤 화살표(데스크톱): 흰 원, 마우스를 올리면 채워진다. 끝에 닿으면 옅어진다
const ARROW =
  'grid size-[3.25rem] cursor-pointer place-items-center rounded-[50%] border-2 border-espresso bg-white p-0 font-en text-[1.9rem] leading-none font-light text-espresso normal-nums [transition:transform_0.55s_cubic-bezier(0.2,0.8,0.2,1),background-color_0.25s_ease,color_0.25s_ease,opacity_0.25s_ease] focus-visible:rounded-[999px] enabled:active:scale-95 disabled:cursor-default disabled:opacity-35 motion-reduce:transition-none max-lg:hidden [&>span]:-mt-[0.12em] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:bg-espresso [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:text-white'
const pad2 = (n) => String(n).padStart(2, '0')

// 카드마다 트랙이 멈출 수 있는 scrollLeft(scroll-padding 반영, 0~max). offsetLeft라 기울기(transform)의 영향을 받지 않는다.
function snapPoints(track) {
  const max = Math.max(0, track.scrollWidth - track.clientWidth)
  const cards = Array.from(track.querySelectorAll('[data-eq-card]'))
  let padL = parseFloat(getComputedStyle(track).scrollPaddingLeft)
  if (Number.isNaN(padL)) padL = cards[0]?.offsetLeft ?? 0 // 계산값을 px로 못 읽으면 첫 카드 자리를 기준으로
  return cards.map((card) => clamp(card.offsetLeft - padL, 0, max))
}

// 카드 번호 줄(01 · 온열), 이름, 한 줄 설명
function CardNo({ no, en }) {
  return (
    <p className="flex items-baseline gap-[0.15rem] leading-none text-accent-deep">
      <span className="font-en text-[1.5rem] leading-none font-light text-ink lining-nums">{no}</span>
      <span className="text-[0.8rem] whitespace-pre"> · </span>
      <span className="font-label text-[0.75rem] leading-none font-normal tracking-[0.16em] normal-nums">{en}</span>
    </p>
  )
}
const CARD_NAME = 'mx-0 mt-[0.6rem] mb-0 font-serif leading-[1.35] font-normal tracking-[-0.02em] text-ink normal-nums'
const CARD_SUB = 'mt-1 text-[0.85rem] leading-[1.6] text-muted'

// 알약 버튼(이용 방식 칩·젤 보기·성분 보기). 공통 :focus-visible(둥근 6px)이 알약 모양을 덮지 않게 둥근 모서리를 그대로 둔다
const PILL =
  'cursor-pointer rounded-full border border-line-strong bg-transparent [font-family:inherit] leading-[1.3] font-medium text-ink transition-[background-color,border-color,color] duration-250 ease-[ease] focus-visible:rounded-[999px] active:scale-97 motion-reduce:transition-none'

// 첫 카드: 전신 온열돔(매장 기기 누끼를 디바이스 카드 사진 면과 같은 흰 바탕에 올린다).
// 이용 방식 칩(radiogroup)을 고르면 한 줄 설명과 버튼 문구가 함께 바뀐다.
function DomeCard() {
  const [use, setUse] = useState(DOME_USES[0].id)
  const radios = useRef([])
  const current = DOME_USES.find((u) => u.id === use)

  const onRadioKey = (e) => {
    const n = DOME_USES.length
    let i = DOME_USES.findIndex((u) => u.id === use)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + n) % n
    else if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = n - 1
    else return
    e.preventDefault()
    e.stopPropagation() // 트랙의 ←→ 넘기기로 번지지 않게
    setUse(DOME_USES[i].id)
    radios.current[i]?.focus()
  }

  return (
    <article id="warm-ritual" className="min-w-0 flex-[0_0_clamp(22rem,38vw,34rem)] snap-start max-lg:flex-[0_0_min(82%,34rem)]" data-eq-card>
      <div>
        {/* 디바이스 카드 사진 면과 같은 흰 바탕 위에 가로로 긴 누끼를 앉히고, 옅은 바닥 그림자로 세운다.
            높이는 디바이스 사진 칸(폭 × 4:5)과 같아 01~04 번호가 같은 줄에 온다. 아래를 조금 더 두어 그림자 자리를 남긴다 */}
        <div className="grid h-[calc(var(--eq-card-w)_*_1.25)] overflow-clip rounded-[1.25rem] bg-white px-[9%] pt-[10%] pb-[13%]">
          <Pic
            pic={PICS.domeCut}
            sizes="(min-width: 64rem) 28rem, 68vw"
            alt="전신 온열돔"
            className="size-full min-h-0 object-contain [filter:drop-shadow(0_18px_22px_rgb(29_26_23/0.14))]"
          />
        </div>
        <div className="px-[0.15rem] pt-[1.1rem] pb-0">
          <CardNo no="01" en="온열" />
          <p className="mx-0 mt-0 mb-[0.35rem] font-label text-[0.75rem] leading-[1.4] font-medium tracking-[0.14em] text-accent-deep normal-nums">
            국내산 · 명신메디칼
          </p>
          <h3 className={`${CARD_NAME} text-[1.6rem]`}>전신 온열돔</h3>
          <p className={CARD_SUB}>국내 원적외선 온열기 전문 제조사 명신메디칼의 돔형 온열기입니다.</p>
          <dl className="mx-0 mt-4 mb-1 border-t border-line">
            {DOME_FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3 border-b border-line py-[0.55rem] text-[0.85rem] leading-[1.55]">
                <dt className="text-muted">{k}</dt>
                <dd className="m-0 break-keep text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-[1.1rem] flex flex-wrap gap-[0.4rem]" role="radiogroup" aria-label="온열돔 이용 방식" onKeyDown={onRadioKey}>
            {DOME_USES.map((u, i) => (
              <button
                key={u.id}
                ref={(el) => {
                  radios.current[i] = el
                }}
                type="button"
                role="radio"
                aria-checked={u.id === use}
                tabIndex={u.id === use ? 0 : -1}
                className={`${PILL} min-h-11 px-4 py-[0.45rem] text-[0.82rem] aria-checked:border-espresso aria-checked:bg-espresso aria-checked:text-white [@media(hover:hover)_and_(pointer:fine)]:aria-[checked=false]:hover:border-espresso`}
                data-cursor=""
                onClick={() => setUse(u.id)}
              >
                {u.label}
              </button>
            ))}
          </div>
          <div className="mt-[0.9rem] min-h-[1.6em]" aria-live="polite">
            <p key={use} className="animate-eq-rise text-[0.95rem] leading-[1.6] text-ink motion-reduce:animate-none">
              {current.text}
            </p>
          </div>
          <button
            type="button"
            className="yw-btn yw-btn--ink mt-[1.1rem] max-w-full px-6 whitespace-normal"
            data-magnet
            data-cursor=""
            onClick={() => pickForBooking({ area: '온열 웜업', label: current.cta })}
          >
            <span>{current.cta}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

// 디바이스 카드: 기기 사진 위에 전용 젤 사진 면이 겹쳐 있다. 마우스 기기는 올리면, 터치·키보드는 '젤 보기'로 덮인다.
// 젤 면은 clip-path로 접혀 있어 지연 로딩이 걷히는 순간에야 시작되므로, 트랙이 화면에 들어오면(near) 미리 받는다.
// '성분 보기'는 onSheet(기기, 누른 버튼)로 성분 시트를 연다. 두 버튼 모두 트랙 끌기와 겹치지 않는다(6px 넘게 움직여야 끌기, motion.js DRAG_SLOP).
function DeviceCard({ d, near, onSheet }) {
  const gelLoading = near ? 'eager' : 'lazy'
  const [gelOn, setGelOn] = useState(false)
  const two = d.gels.length > 1
  return (
    <article className="min-w-0 flex-[0_0_var(--eq-card-w)] snap-start" data-eq-card>
      <div>
        {/* 기기·제품 사진이 저해상도라 22rem보다 키우지 않는다 */}
        <div className="relative aspect-[4/5] max-w-[22rem] overflow-clip rounded-[1.25rem] bg-white">
          <img className="size-full object-contain p-[8%]" src={d.photo} alt={d.alt} loading="lazy" decoding="async" />
          {/* 젤 면: 왼쪽에서 오른쪽으로 걷히며 덮는다(끄는 중에는 올려도 덮지 않는다).
              두 제품(웰스파)이면 두 사진을 같은 바닥선에 나란히 세우고 바로 아래 칸마다 이름표를 둔 한 묶음을 면 가운데에 놓는다 */}
          <div
            className={`absolute inset-0 grid bg-white transition-[clip-path] duration-350 ease-yw motion-reduce:transition-none ${
              two ? 'grid-cols-2 grid-rows-[auto_auto] content-center gap-x-3 px-3' : ''
            } ${
              gelOn
                ? '[clip-path:inset(0)]'
                : '[clip-path:inset(0_100%_0_0)] [@media(hover:hover)_and_(pointer:fine)]:[[data-eq-track]:not(.is-dragging)_[data-eq-card]:hover_&]:[clip-path:inset(0)]'
            }`}
            aria-hidden={!gelOn}
          >
            {d.gels.map((g) => (
              <img
                key={g.name}
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                // 젤 사진은 모두 누끼라 잘리지 않게 담고, 아래 이름표(두 줄)를 비켜 조금 위에 둔다(좁은 카드에서도 아래 여백은 4.5rem 이상)
                className={`w-full min-h-0 object-contain ${two ? 'h-auto self-end p-0' : 'h-full px-[8%] pt-[10%] pb-[max(26%,4.5rem)]'}`}
                loading={gelLoading}
                decoding="async"
              />
            ))}
            {/* 이름표: 제품마다 이름 아래 용량. 젤 면이 덮인 뒤 살짝 떠오른다 */}
            <p
              className={`grid auto-cols-[minmax(0,1fr)] grid-flow-col text-center text-[0.78rem] leading-[1.4] font-medium text-ink motion-reduce:transition-none ${
                two ? 'static col-span-full items-start gap-x-3 px-0 pt-[0.9rem] pb-0' : 'absolute right-0 bottom-0 left-0 items-end pb-[1.1rem]'
              } ${
                gelOn
                  ? 'translate-y-0 opacity-100 [transition:opacity_0.2s_ease_0.2s,translate_0.3s_var(--yw-ease)_0.2s]'
                  : 'translate-y-2 opacity-0 [transition:opacity_0.2s_ease,translate_0.3s_var(--yw-ease)] [@media(hover:hover)_and_(pointer:fine)]:[[data-eq-track]:not(.is-dragging)_[data-eq-card]:hover_&]:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:[[data-eq-track]:not(.is-dragging)_[data-eq-card]:hover_&]:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:[[data-eq-track]:not(.is-dragging)_[data-eq-card]:hover_&]:[transition-delay:0.2s]'
              }`}
            >
              {d.gels.map((g) => (
                <span key={g.name} className={`grid justify-items-center gap-[0.2rem] text-balance ${two ? 'px-[0.15rem]' : 'px-3'}`}>
                  {g.name}{' '}
                  <span className="font-label text-[0.75rem] leading-none font-normal tracking-[0.08em] text-accent-deep normal-nums">{g.volume}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="px-[0.15rem] pt-[1.1rem] pb-0">
          <CardNo no={d.no} en={d.en} />
          <h3 className={`${CARD_NAME} text-[1.35rem]`}>{d.name}</h3>
          <p className={CARD_SUB}>{d.sub}</p>
          <div className="mt-[0.85rem] flex flex-wrap gap-[0.4rem]">
            <button
              type="button"
              className={`${PILL} inline-flex min-h-11 items-center gap-[0.4rem] px-4 py-[0.35rem] text-[0.78rem] whitespace-nowrap before:size-[0.45rem] before:rounded-[50%] before:border before:border-current before:content-[''] aria-pressed:border-espresso aria-pressed:bg-espresso aria-pressed:text-white aria-pressed:before:bg-current [@media(hover:hover)_and_(pointer:fine)]:aria-[pressed=false]:hover:border-espresso`}
              aria-pressed={gelOn}
              data-cursor=""
              onClick={() => setGelOn((v) => !v)}
            >
              <span className="sr-only">{d.name} </span>
              {gelOn ? '기기 보기' : '젤 보기'}
            </button>
            {/* 성분 보기: 뒤에 작은 +(시트가 열린다) */}
            <button
              type="button"
              className={`${PILL} inline-flex min-h-11 items-center gap-[0.4rem] px-4 py-[0.35rem] text-[0.78rem] whitespace-nowrap after:-mr-[0.15rem] after:font-label after:text-[1.05rem] after:leading-none after:font-light after:text-accent-deep after:content-['+'_/_''] [@media(hover:hover)_and_(pointer:fine)]:hover:border-espresso`}
              aria-haspopup="dialog"
              data-cursor=""
              onClick={(e) => onSheet(d, e.currentTarget)}
            >
              <span className="sr-only">
                {d.name} 전용 {d.sheetKo}{' '}
              </span>
              성분 보기
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

// 바텀 시트로 그려지는 폭(48rem 미만)
const SHEET_MQ = '(max-width: 47.99rem)'

// 시트 스크롤 가장자리 표시: 본문이 머리 밑으로 지나가면 data-scrolled(머리 아래 선),
// 아래에 더 읽을 내용이 남아 있으면 data-more(아래 가장자리 흐림 — 웰스파처럼 두 번째 제품이 접혀 있을 때 스크롤 신호).
// 본문 아래 여백(1.75rem)보다 적게 남았으면 가려진 글이 없으므로 흐리지 않는다.
function syncSheetEdges(dlg) {
  const rest = dlg.scrollHeight - dlg.clientHeight - dlg.scrollTop
  dlg.toggleAttribute('data-scrolled', dlg.scrollTop > 2)
  dlg.toggleAttribute('data-more', rest > 24)
}

// '성분 보기' 시트. 네이티브 <dialog>를 showModal()로 열어 포커스 가두기·ESC 닫기·뒤 페이지 비활성은 브라우저에 맡긴다.
// 모바일(48rem 미만)은 아래에서 올라오는 바텀 시트(위 모서리만 둥글게, 최대 86svh), 그 위는 가운데 패널(최대 36rem). 열린 동안 뒤 페이지 스크롤을 잠근다.
// × 버튼·ESC·바깥(배경) 누르기로 닫히고(바텀 시트는 머리를 끌어내려도 닫힌다), 닫히면 onClose가 불린다
// (여는 쪽이 '성분 보기' 버튼으로 포커스를 돌려준다).
// 시트는 열 때 마운트되고 닫히면 내려간다. <dialog> 자체가 스크롤 상자라 머리(손잡이·라벨·닫기)는 sticky로 붙는다.
function GelSheet({ device, onClose }) {
  const ref = useRef(null)
  const titleId = useId()
  const downOutside = useRef(false)
  const pull = useRef(null) // 머리를 끌어내리는 중인 손가락
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return undefined
    const unlock = lockPageScroll() // 열린 동안 뒤 페이지 스크롤 잠금(햄버거 메뉴와 같은 도우미, scroll.js)
    if (!dlg.open) dlg.showModal()
    syncSheetEdges(dlg)
    const onResize = () => syncSheetEdges(dlg)
    window.addEventListener('resize', onResize)
    // close 이벤트는 비동기로 온다. 개발 모드(StrictMode)에서 정리 직후 다시 열린 경우의 늦은 close는 무시한다.
    const onDialogClose = () => {
      if (!dlg.open) onCloseRef.current?.()
    }
    dlg.addEventListener('close', onDialogClose)
    return () => {
      dlg.removeEventListener('close', onDialogClose)
      window.removeEventListener('resize', onResize)
      if (dlg.open) dlg.close()
      unlock()
    }
  }, [])

  // 배경(::backdrop)을 누르면 이벤트 대상이 <dialog> 자신이고 좌표가 상자 밖이다. 시트 안에서 시작한 끌기(글자 선택)는 닫지 않는다.
  const isOutside = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
  }
  const onPointerDown = (e) => {
    downOutside.current = e.target === e.currentTarget && isOutside(e)
  }
  const onClick = (e) => {
    const close = downOutside.current && e.target === e.currentTarget && isOutside(e)
    downOutside.current = false
    if (close) e.currentTarget.close()
  }

  // 바텀 시트의 머리(손잡이·라벨)를 손가락으로 아래로 끌면 시트가 따라 내려오고, 충분히 내리거나 빠르게 쓸어내리면 닫힌다.
  // 덜 끌었으면 제자리로 돌아간다. 마우스와 가운데 패널(48rem 이상)에서는 끌지 않고, 닫기 버튼에서 시작한 누르기도 끌기로 보지 않는다.
  const onHeadDown = (e) => {
    if (e.pointerType === 'mouse' || !e.isPrimary || e.target.closest('button')) return
    if (!window.matchMedia(SHEET_MQ).matches) return
    pull.current = { id: e.pointerId, y0: e.clientY, y: e.clientY, t: e.timeStamp, v: 0, dy: 0 }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* 이미 놓인 포인터 */
    }
  }
  const onHeadMove = (e) => {
    const p = pull.current
    const dlg = ref.current
    if (!p || e.pointerId !== p.id || !dlg) return
    p.v = (e.clientY - p.y) / Math.max(1, e.timeStamp - p.t)
    p.y = e.clientY
    p.t = e.timeStamp
    p.dy = Math.max(0, e.clientY - p.y0)
    dlg.style.transition = 'none'
    dlg.style.transform = p.dy ? `translate3d(0, ${p.dy}px, 0)` : ''
  }
  const onHeadEnd = (e) => {
    const p = pull.current
    const dlg = ref.current
    if (!p || e.pointerId !== p.id || !dlg) return
    pull.current = null
    const reduced = prefersReducedMotion()
    const dismiss = e.type === 'pointerup' && (p.dy > Math.min(120, dlg.offsetHeight * 0.3) || (p.dy > 24 && p.v > 0.45))
    if (dismiss && reduced) {
      dlg.close()
    } else if (dismiss) {
      dlg.style.transition = 'transform 0.22s cubic-bezier(0.4, 0, 1, 1)'
      dlg.style.transform = 'translate3d(0, 100%, 0)'
      window.setTimeout(() => {
        if (dlg.open) dlg.close()
      }, 220)
    } else {
      dlg.style.transition = reduced ? '' : 'transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)'
      dlg.style.transform = ''
    }
  }

  return (
    // 배경 누르기는 마우스·터치용 보조 수단이다. 키보드는 ESC와 닫기 버튼으로 닫는다.
    <dialog
      ref={ref}
      className="group/eqs fixed inset-x-0 top-auto bottom-0 m-0 h-fit max-h-[86svh] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-3xl border-0 bg-white p-0 text-ink shadow-[0_-0.75rem_2.5rem_rgb(29_26_23/0.12)] [scrollbar-width:thin] backdrop:bg-[rgb(29_26_23/0.45)] backdrop:backdrop-blur-[4px] after:pointer-events-none after:sticky after:bottom-0 after:-mt-14 after:block after:h-14 after:bg-[linear-gradient(rgb(255_255_255/0),#fff_85%)] after:opacity-0 after:transition-opacity after:duration-250 after:ease-[ease] after:content-[''] motion-safe:open:animate-eqs-up motion-safe:open:backdrop:animate-eqs-fade data-more:after:opacity-100 motion-reduce:after:transition-none md:inset-0 md:m-auto md:max-h-[min(86svh,50rem)] md:w-[min(36rem,100%_-_3rem)] md:rounded-3xl md:shadow-[0_1.5rem_4rem_rgb(29_26_23/0.2)] motion-safe:md:open:animate-eqs-pop"
      aria-labelledby={titleId}
      data-cursor-off=""
      onPointerDown={onPointerDown}
      onClick={onClick}
      onScroll={(e) => syncSheetEdges(e.currentTarget)}
    >
      {/* 머리: 손잡이(모바일, 끌어내려 닫기) · 'GEL · 페이스 갈바닉 전용' 라벨 · 닫기. 본문이 머리 밑으로 지나가기 시작하면 아래에 가는 선 */}
      <div
        className="sticky top-0 z-1 flex items-center justify-between gap-4 bg-white pt-[1.4rem] pr-4 pb-[0.85rem] pl-6 transition-[box-shadow] duration-200 ease-[ease] group-data-scrolled/eqs:shadow-[0_1px_0_var(--w-line)] motion-reduce:transition-none max-md:touch-none md:pt-5 md:pr-5 md:pl-8"
        onPointerDown={onHeadDown}
        onPointerMove={onHeadMove}
        onPointerUp={onHeadEnd}
        onPointerCancel={onHeadEnd}
      >
        <span className="absolute top-[0.6rem] left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-line md:hidden" aria-hidden="true" />
        <p className="min-w-0 text-[0.8rem] leading-[1.4] font-medium tracking-[0.02em] text-accent-deep" id={titleId}>
          <span className="font-label text-[0.75rem] leading-none font-normal tracking-[0.2em] normal-nums" aria-hidden="true">
            {device.sheetEn}
          </span>
          <span className="whitespace-pre" aria-hidden="true">
            {' · '}
          </span>
          {device.name} 전용<span className="sr-only"> {device.sheetKo} 성분</span>
        </p>
        <button
          type="button"
          className="grid size-10 flex-none cursor-pointer place-items-center rounded-[50%] border border-line bg-white p-0 text-ink transition-[background-color,border-color,color] duration-250 ease-[ease] focus-visible:rounded-[50%] active:scale-95 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:border-espresso [@media(hover:hover)_and_(pointer:fine)]:hover:bg-espresso [@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
          aria-label="닫기"
          onClick={() => ref.current?.close()}
        >
          <svg className="size-[1.1rem] fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
          </svg>
        </button>
      </div>

      {/* 본문: 제품마다 사진 → 이름·용량 → 사용 설명 → 주요 성분 */}
      <div className="px-6 pt-[0.15rem] pb-[max(1.75rem,env(safe-area-inset-bottom))] md:px-8 md:pb-8">
        {device.gels.map((g, i, all) => (
          <div key={g.name} className={i > 0 ? 'mt-8 border-t border-line pt-8' : undefined}>
            {/* 제품 누끼는 스튜디오 바탕 패널에 담는다(높이 11rem, 48rem부터 12rem, 낮은 화면은 8.5rem).
                손바닥 컷은 손이 사진 가장자리에서 잘려 있어 사진 비율 그대로의 프레임에 꽉 채운다 */}
            <div
              className={`grid h-(--fig-h) overflow-clip rounded-[1.25rem] [background:var(--yw-eq-studio)] [--fig-h:11rem] [@media(max-height:32rem)]:[--fig-h:8.5rem] [@media(min-width:48rem)_and_(min-height:32.01rem)]:[--fig-h:12rem] ${
                g.hand ? 'mx-auto w-[min(100%,var(--fig-h)_*_var(--ar,1))] p-0' : 'p-4'
              }`}
              style={g.hand ? { '--ar': (g.w / g.h).toFixed(4) } : undefined}
            >
              <img
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                decoding="async"
                className={`size-full min-h-0 ${g.hand ? 'object-cover' : 'object-contain [filter:drop-shadow(0_14px_18px_rgb(29_26_23/0.16))]'}`}
              />
            </div>
            {/* 제품이 둘 이상이면(웰스파) 트랙 카운터처럼 '01 / 02'를 달아 아래에 다음 제품이 있음을 알린다. 구조는 제목(h2)이 전한다 */}
            {all.length > 1 && (
              <p className="mt-[1.15rem] font-en text-[0.95rem] leading-none font-light tracking-[0.02em] whitespace-nowrap text-muted lining-nums tabular-nums [&_b]:font-medium [&_b]:text-ink" aria-hidden="true">
                <b>{pad2(i + 1)}</b> / {pad2(all.length)}
              </p>
            )}
            <h2 className={`${all.length > 1 ? 'mt-[0.3rem]' : 'mt-[1.15rem]'} font-serif text-[1.3rem] leading-[1.4] font-normal tracking-[-0.02em] text-ink normal-nums`}>
              {g.name}{' '}
              <span className="ml-[0.3rem] font-label text-[0.75rem] leading-none font-normal tracking-[0.08em] whitespace-nowrap text-accent-deep normal-nums">{g.volume}</span>
            </h2>
            <p className="mt-2 text-[0.88rem] leading-[1.7] text-muted">{g.usage}</p>
            <h3 className="mt-6 flex items-center gap-3 font-sans text-[0.78rem] leading-[1.4] font-semibold tracking-[0.02em] text-ink normal-nums after:h-px after:flex-1 after:bg-line after:content-['']">
              주요 성분
            </h3>
            <ul>
              {g.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className={`grid gap-[0.9rem] border-b border-(--w-hair) py-[0.9rem] last:border-b-0 last:pb-0 ${ing.icon ? 'grid-cols-[2.75rem_minmax(0,1fr)] items-start' : ''}`}
                >
                  {ing.icon && <img src={ing.icon} alt={ing.iconAlt} width="72" height="72" decoding="async" className="size-11 rounded-[50%] object-cover" />}
                  <div>
                    <p className="text-[0.9rem] leading-[1.5] font-semibold text-ink">{ing.name}</p>
                    {ing.en && (
                      <p className="mt-[0.1rem] font-label text-[0.75rem] leading-[1.4] font-normal tracking-[0.05em] text-accent-deep normal-nums" lang="en">
                        {ing.en}
                      </p>
                    )}
                    <p className="mt-1 text-[0.84rem] leading-[1.6] text-muted">{ing.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </dialog>
  )
}

export default function Equipment() {
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const sheetTrigger = useRef(null)
  const [nav, setNav] = useState({ idx: 1, atStart: true, atEnd: false })
  const [sheet, setSheet] = useState(null)

  useDragScroll(trackRef, { itemSelector: '[data-eq-card]' })
  const near = useInView(trackRef, { threshold: 0 })

  const openSheet = (device, trigger) => {
    sheetTrigger.current = trigger
    setSheet(device)
  }
  // 시트가 닫히면 연 버튼으로 포커스를 돌려준다. 트랙이 그 버튼 쪽으로 밀리지 않게 preventScroll.
  const closeSheet = () => {
    const trigger = sheetTrigger.current
    sheetTrigger.current = null
    setSheet(null)
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
  }

  // 트랙 스크롤을 rAF로 묶어 진행 막대(--p, --vis), 카운터, 양 끝 화살표, 속도 기울기(--skew)를 갱신한다.
  // 기울기는 카드 안쪽 판에만 걸리게 해 두었다(지금은 차분한 화면을 위해 기울이지 않는다). 스냅 대상인 카드 자체를 기울이면 기울어진 상자로 스냅 위치가 1px씩 바뀌어
  // 스크롤 → 기울기 → 다시 스냅이 끝없이 되풀이된다.
  useEffect(() => {
    const track = trackRef.current
    const bar = barRef.current
    if (!track) return undefined
    const reduced = prefersReducedMotion()
    let raf = 0
    let last = track.scrollLeft
    let skewTimer = 0
    let byScroll = false // 크기 변화로 scrollLeft가 바뀐 것은 기울이지 않는다
    const prev = { idx: 1, atStart: true, atEnd: false }

    const update = () => {
      raf = 0
      const tilt = byScroll
      byScroll = false
      const left = track.scrollLeft
      const max = track.scrollWidth - track.clientWidth
      const p = max > 0 ? clamp(left / max, 0, 1) : 0
      const vis = track.scrollWidth ? clamp(track.clientWidth / track.scrollWidth, 0, 1) : 1
      if (bar) {
        bar.style.setProperty('--p', p.toFixed(4))
        bar.style.setProperty('--vis', vis.toFixed(4))
      }

      const atStart = left < 4
      const atEnd = left > max - 4
      // 가장 왼쪽(멈춤 위치가 가장 가까운) 카드 번호. 끝까지 넘겼으면 마지막 카드로 센다.
      let idx = 1
      if (atEnd && max > 4) {
        idx = CARD_COUNT
      } else {
        let best = Infinity
        snapPoints(track).forEach((x, i) => {
          const dist = Math.abs(x - left)
          if (dist < best - 0.5) {
            best = dist
            idx = i + 1
          }
        })
      }
      if (idx !== prev.idx || atStart !== prev.atStart || atEnd !== prev.atEnd) {
        prev.idx = idx
        prev.atStart = atStart
        prev.atEnd = atEnd
        setNav({ idx, atStart, atEnd })
      }

      if (!reduced && tilt) {
        const dx = left - last
        if (dx !== 0) {
          track.style.setProperty('--skew', `${clamp(dx * -0.15, -4, 4).toFixed(2)}deg`)
          clearTimeout(skewTimer)
          skewTimer = setTimeout(() => track.style.setProperty('--skew', '0deg'), 120)
        }
      }
      last = left
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onScroll = () => {
      byScroll = true
      kick()
    }
    update()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', kick)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(kick) : null
    ro?.observe(track)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', kick)
      ro?.disconnect()
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(skewTimer)
    }
  }, [])

  // 한 카드씩 앞뒤로. 카드 폭이 달라(온열돔이 넓다) 고정 폭 대신 다음·이전 멈춤 위치로 간다.
  const go = (dir) => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    const left = track.scrollLeft
    const points = snapPoints(track)
    let target = dir > 0 ? points.find((x) => x > left + 4) : [...points].reverse().find((x) => x < left - 4)
    if (target === undefined) target = dir > 0 ? max : 0
    track.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // 위쪽 메뉴에서 고른 장비(scroll.js goToMenu → 'w:equipment-card'): 그 카드까지 옆으로 넘긴다.
  useEffect(() => {
    const onCard = (e) => {
      const track = trackRef.current
      const x = track && snapPoints(track)[e.detail?.index]
      if (x == null) return
      requestAnimationFrame(() => track.scrollTo({ left: x, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }))
    }
    window.addEventListener('w:equipment-card', onCard)
    return () => window.removeEventListener('w:equipment-card', onCard)
  }, [])

  const onTrackKey = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      go(e.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    // 앞의 어두운 온열돔 장을 둥근 윗모서리로 덮으며 올라온다(커튼의 흰 바탕 대신 이 장의 아이보리).
    // --yw-eq-studio: 성분 시트의 제품 패널 바탕(가운데가 가장 밝고 가장자리로 갈수록 옅은 웜 그레이)
    <section
      id="equipment"
      className="yw-section yw-curtain--light overflow-x-clip bg-(--yw-warm) [--yw-eq-studio:radial-gradient(ellipse_85%_80%_at_50%_40%,#fff_0%,#fbfaf8_48%,#eeeae4_100%)]"
      data-theme="light"
    >
      {/* 머리: 제목·한 줄 | 카운터·화살표. 모바일·태블릿은 카운터를 제목 오른쪽 위에 작게 두고 화살표는 숨긴다 */}
      <div className="yw-wrap relative grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <h2 className="yw-h2 max-lg:pr-[3.75rem]">
            따뜻하게 데우고,
            <br />
            섬세하게 다듬습니다.
          </h2>
          <p className="yw-lead">
            오일 대신 디바이스마다 맞춘 전용 젤을 사용합니다.
          </p>
        </div>
        <div className="flex items-center gap-3 max-lg:absolute max-lg:top-[calc(0.72rem_+_1.1rem_+_0.55em)] max-lg:right-0 lg:pb-1">
          <span
            className="font-en text-[1.6rem] leading-none font-light tracking-[0.02em] whitespace-nowrap text-ink lining-nums tabular-nums max-lg:text-[1.15rem] [&_b]:font-medium"
            aria-hidden="true"
          >
            <b>{pad2(nav.idx)}</b> / {pad2(CARD_COUNT)}
          </span>
          <button type="button" className={ARROW} aria-label="이전 장비" data-magnet disabled={nav.atStart} onClick={() => go(-1)}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className={ARROW} aria-label="다음 장비" data-magnet disabled={nav.atEnd} onClick={() => go(1)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      {/* 트랙: 오른쪽 화면 끝까지 흘러넘친다. 섹션 좌우 여백을 음수 마진으로 지우고, 안쪽 여백으로 .yw-wrap 왼쪽 선에 첫 카드를 맞춘다.
          scroll-padding은 JS(useDragScroll·화살표)가 계산값을 px로 읽어야 해서 %가 아닌 vw로 쓴다.
          --eq-card-w: 디바이스 카드 폭(폰은 트랙 안쪽 폭의 82%, 태블릿은 22rem까지) */}
      <div
        className="relative mx-[calc(-1_*_var(--w-gutter))] mt-[clamp(2rem,5vw,3rem)] mb-0 flex snap-x snap-mandatory scroll-px-[max(var(--w-gutter),calc((100vw_-_var(--yw-max))_/_2))] items-start gap-5 overflow-x-auto overscroll-x-contain px-[max(var(--w-gutter),calc((100%_-_var(--yw-max))_/_2_+_var(--w-gutter)))] pt-4 pb-6 @container [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [--eq-card-w:clamp(17rem,24vw,22rem)] focus-visible:rounded-none focus-visible:-outline-offset-2 focus-visible:outline-bronze motion-reduce:scroll-auto max-lg:[--eq-card-w:min(82cqi,22rem)] [&_img]:[-webkit-user-drag:none] [&::-webkit-scrollbar]:hidden [&.is-dragging]:cursor-grabbing [&.is-dragging]:snap-none [&.is-dragging]:select-none"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="장비와 전용 젤"
        aria-roledescription="carousel"
        data-eq-track
        onKeyDown={onTrackKey}
      >
        <DomeCard />
        {DEVICES.map((d) => (
          <DeviceCard key={d.no} d={d} near={near} onSheet={openSheet} />
        ))}
      </div>

      {/* 진행 막대: 1px 선 위에 지금 보이는 구간만 진하게(--p, --vis) */}
      <div
        className="relative mx-auto mt-4 mb-0 h-px max-w-(--yw-max) bg-line after:absolute after:top-[-0.5px] after:left-[calc(var(--p,0)_*_(100%_-_var(--vis,0.3)_*_100%))] after:h-[2px] after:w-[calc(var(--vis,0.3)_*_100%)] after:bg-espresso after:content-['']"
        ref={barRef}
        aria-hidden="true"
      />

      {/* 트랙 밖에 둔다(시트 안의 누르기가 트랙 끌기로 번지지 않게). 열렸을 때만 마운트한다. */}
      {sheet && <GelSheet key={sheet.no} device={sheet} onClose={closeSheet} />}
    </section>
  )
}
