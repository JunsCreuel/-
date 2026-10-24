import { useEffect, useId, useRef, useState } from 'react'
import { PHOTOS, PICS } from '../data'
import { Pic } from '../editorial'
import { clamp, prefersReducedMotion, useDragScroll, useInView } from '../motion'
import { lockPageScroll, pickForBooking } from '../scroll'
import './yw-equipment.css'

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
const pad2 = (n) => String(n).padStart(2, '0')

// 카드마다 트랙이 멈출 수 있는 scrollLeft(scroll-padding 반영, 0~max). offsetLeft라 기울기(transform)의 영향을 받지 않는다.
function snapPoints(track) {
  const max = Math.max(0, track.scrollWidth - track.clientWidth)
  const cards = Array.from(track.querySelectorAll('.yw-eq__card'))
  let padL = parseFloat(getComputedStyle(track).scrollPaddingLeft)
  if (Number.isNaN(padL)) padL = cards[0]?.offsetLeft ?? 0 // 계산값을 px로 못 읽으면 첫 카드 자리를 기준으로
  return cards.map((card) => clamp(card.offsetLeft - padL, 0, max))
}

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
    <article id="warm-ritual" className="yw-eq__card yw-eq__card--dome">
      <div className="yw-eq__tilt">
        <div className="yw-eq__photo">
          <Pic pic={PICS.domeCut} sizes="(min-width: 64rem) 28rem, 68vw" alt="전신 온열돔" />
        </div>
        <div className="yw-eq__body">
          <p className="yw-eq__no">
            <span className="yw-eq__num">01</span>
            <span className="yw-eq__dot"> · </span>
            <span className="yw-eq__en">온열</span>
          </p>
          <p className="yw-eq__maker">국내산 · 명신메디칼</p>
          <h3 className="yw-eq__name">전신 온열돔</h3>
          <p className="yw-eq__sub">국내 원적외선 온열기 전문 제조사 명신메디칼의 돔형 온열기입니다.</p>
          <dl className="yw-eq__facts">
            {DOME_FACTS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="yw-eq__uses" role="radiogroup" aria-label="온열돔 이용 방식" onKeyDown={onRadioKey}>
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
                className="yw-eq__chip"
                data-cursor=""
                onClick={() => setUse(u.id)}
              >
                {u.label}
              </button>
            ))}
          </div>
          <div className="yw-eq__usebox" aria-live="polite">
            <p key={use} className="yw-eq__use">
              {current.text}
            </p>
          </div>
          <button
            type="button"
            className="yw-btn yw-btn--ink yw-eq__cta"
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
  return (
    <article className={`yw-eq__card${gelOn ? ' is-gel' : ''}`}>
      <div className="yw-eq__tilt">
        <div className="yw-eq__media">
          <img className="yw-eq__device" src={d.photo} alt={d.alt} loading="lazy" decoding="async" />
          <div className={`yw-eq__gel${d.gels.length > 1 ? ' yw-eq__gel--two' : ''}`} aria-hidden={!gelOn}>
            {d.gels.map((g) => (
              <img
                key={g.name}
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                className="yw-eq__gelimg"
                loading={gelLoading}
                decoding="async"
              />
            ))}
            {/* 이름표: 제품마다 이름 아래 용량. 두 제품이면 사진 칸마다 하나씩 선다 */}
            <p className="yw-eq__gelcap">
              {d.gels.map((g) => (
                <span key={g.name}>
                  {g.name} <span className="yw-eq__gelvol">{g.volume}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="yw-eq__body">
          <p className="yw-eq__no">
            <span className="yw-eq__num">{d.no}</span>
            <span className="yw-eq__dot"> · </span>
            <span className="yw-eq__en">{d.en}</span>
          </p>
          <h3 className="yw-eq__name">{d.name}</h3>
          <p className="yw-eq__sub">{d.sub}</p>
          <div className="yw-eq__actions">
            <button type="button" className="yw-eq__gelbtn" aria-pressed={gelOn} data-cursor="" onClick={() => setGelOn((v) => !v)}>
              <span className="sr-only">{d.name} </span>
              {gelOn ? '기기 보기' : '젤 보기'}
            </button>
            <button
              type="button"
              className="yw-eq__ingbtn"
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

// 바텀 시트로 그려지는 폭(yw-equipment.css의 48rem 미만)
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
// 모바일(48rem 미만)은 아래에서 올라오는 바텀 시트, 그 위는 가운데 패널(yw-equipment.css). 열린 동안 뒤 페이지 스크롤을 잠근다.
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
      className="yw-eqs"
      aria-labelledby={titleId}
      data-cursor-off=""
      onPointerDown={onPointerDown}
      onClick={onClick}
      onScroll={(e) => syncSheetEdges(e.currentTarget)}
    >
      <div
        className="yw-eqs__head"
        onPointerDown={onHeadDown}
        onPointerMove={onHeadMove}
        onPointerUp={onHeadEnd}
        onPointerCancel={onHeadEnd}
      >
        <span className="yw-eqs__grip" aria-hidden="true" />
        <p className="yw-eqs__folio" id={titleId}>
          <span className="yw-eqs__folio-en" aria-hidden="true">
            {device.sheetEn}
          </span>
          <span className="yw-eqs__folio-dot" aria-hidden="true">
            {' · '}
          </span>
          {device.name} 전용<span className="sr-only"> {device.sheetKo} 성분</span>
        </p>
        <button type="button" className="yw-eqs__close" aria-label="닫기" onClick={() => ref.current?.close()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
          </svg>
        </button>
      </div>

      <div className="yw-eqs__body">
        {device.gels.map((g, i, all) => (
          <div key={g.name} className="yw-eqs__product">
            <div
              className={`yw-eqs__fig${g.hand ? ' yw-eqs__fig--hand' : ''}`}
              style={g.hand ? { '--ar': (g.w / g.h).toFixed(4) } : undefined}
            >
              <img src={g.src} alt={g.alt} width={g.w} height={g.h} decoding="async" />
            </div>
            {/* 제품이 둘 이상이면(웰스파) 트랙 카운터처럼 '01 / 02'를 달아 아래에 다음 제품이 있음을 알린다. 구조는 제목(h2)이 전한다 */}
            {all.length > 1 && (
              <p className="yw-eqs__idx" aria-hidden="true">
                <b>{pad2(i + 1)}</b> / {pad2(all.length)}
              </p>
            )}
            <h2 className="yw-eqs__name">
              {g.name} <span className="yw-eqs__vol">{g.volume}</span>
            </h2>
            <p className="yw-eqs__usage">{g.usage}</p>
            <h3 className="yw-eqs__subhead">주요 성분</h3>
            <ul className="yw-eqs__ings">
              {g.ingredients.map((ing) => (
                <li key={ing.name} className={ing.icon ? 'has-icon' : undefined}>
                  {ing.icon && <img src={ing.icon} alt={ing.iconAlt} width="72" height="72" decoding="async" />}
                  <div>
                    <p className="yw-eqs__ingname">{ing.name}</p>
                    {ing.en && (
                      <p className="yw-eqs__ingen" lang="en">
                        {ing.en}
                      </p>
                    )}
                    <p className="yw-eqs__ingdesc">{ing.desc}</p>
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

  useDragScroll(trackRef, { itemSelector: '.yw-eq__card' })
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
  // 기울기는 카드 안쪽 판(.yw-eq__tilt)에만 걸린다. 스냅 대상인 카드 자체를 기울이면 기울어진 상자로 스냅 위치가 1px씩 바뀌어
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

  const onTrackKey = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      go(e.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    <section id="equipment" className="yw-section yw-curtain--light yw-eq" data-theme="light">
      <div className="yw-wrap yw-eq__head">
        <div className="yw-eq__intro">
          <h2 className="yw-eq__title">장비 소개</h2>
          <p className="yw-lead">
            오일 대신 디바이스마다 맞춘 전용 젤을 사용합니다.
          </p>
        </div>
        <div className="yw-eq__nav">
          <span className="yw-eq__count" aria-hidden="true">
            <b>{pad2(nav.idx)}</b> / {pad2(CARD_COUNT)}
          </span>
          <button type="button" className="yw-eq__arrow" aria-label="이전 장비" data-magnet disabled={nav.atStart} onClick={() => go(-1)}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="yw-eq__arrow" aria-label="다음 장비" data-magnet disabled={nav.atEnd} onClick={() => go(1)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div
        className="yw-eq__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="장비와 전용 젤"
        aria-roledescription="carousel"
        onKeyDown={onTrackKey}
      >
        <DomeCard />
        {DEVICES.map((d) => (
          <DeviceCard key={d.no} d={d} near={near} onSheet={openSheet} />
        ))}
      </div>

      <div className="yw-eq__bar" ref={barRef} aria-hidden="true" />

      {/* 트랙 밖에 둔다(시트 안의 누르기가 트랙 끌기로 번지지 않게). 열렸을 때만 마운트한다. */}
      {sheet && <GelSheet key={sheet.no} device={sheet} onClose={closeSheet} />}
    </section>
  )
}
