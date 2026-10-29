import { SECTION_PAGE } from './pages'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 등장 효과(Reveal)의 translateY를 뺀, 원래 자리 기준으로 목표까지 남은 거리
function offsetFromTarget(el) {
  const cs = getComputedStyle(el)
  let ty = 0
  try {
    ty = cs.transform && cs.transform !== 'none' ? new DOMMatrixReadOnly(cs.transform).m42 : 0
  } catch {
    ty = 0
  }
  return el.getBoundingClientRect().top - ty - (parseFloat(cs.scrollMarginTop) || 0)
}

// ── 페이지 사이 이동 ──────────────────────────────────────
// 메뉴·버튼은 섹션 id로 부르고, 그 섹션이 지금 페이지에 없으면 실린 페이지(pages.js SECTION_PAGE)로 옮겨 간 뒤 곧장 그 섹션으로 간다.
// 라우터의 navigate는 WellnessLayout이 등록하고, 새 페이지가 그려지면 WellnessLayout이 arrivePage()로 남은 일을 끝낸다.
let navigator = null
let pending = null

export function setNavigator(fn) {
  navigator = fn
  return () => {
    if (navigator === fn) navigator = null
  }
}

const currentPath = () => window.location.hash.replace(/^#/, '').split(/[?#]/)[0] || '/'

// path로 옮겨 가고, 도착하면 onArrive를 부른다(없으면 맨 위에서 시작). 이미 그 페이지면 바로 부른다.
export function goToPage(path, onArrive) {
  if (currentPath() === path || !navigator) {
    if (onArrive) onArrive()
    else scrollToTop()
    return
  }
  pending = onArrive || null
  navigator(path)
}

// 새 페이지가 그려진 뒤 WellnessLayout이 부른다. 남은 일이 없으면 맨 위에서 시작한다.
export function arrivePage() {
  const run = pending
  pending = null
  if (run) run()
  else window.scrollTo(0, 0)
}

// 도착한 페이지에서 섹션으로 곧장 옮긴다. 웹폰트가 늦게 적용돼 위쪽 높이가 바뀌면 한 번 더 맞춘다.
function jumpToId(id) {
  const el = document.getElementById(id)
  if (!el) {
    window.scrollTo(0, 0)
    return
  }
  el.scrollIntoView({ block: 'start' })
  const align = () => {
    const off = offsetFromTarget(el)
    if (Math.abs(off) > 6) window.scrollTo({ top: window.scrollY + off, behavior: 'auto' })
  }
  document.fonts?.ready.then(align)
  setTimeout(align, 400)
}

// 메뉴 항목: section이 있으면 그 섹션으로(다른 페이지면 옮겨 가서), 없으면 page 맨 위로.
// event가 있으면 섹션에 닿기 전에 window 이벤트를 보내 그 섹션이 탭·카드를 고르게 한다.
export function goToMenu(item) {
  if (item.event) showInSection(item.section, item.event, item.detail)
  else if (item.section) scrollToId(item.section)
  else if (item.page) goToPage(item.page)
  else scrollToId(item.id)
}

// HashRouter에서는 #id 링크가 라우트를 깨뜨리므로 스크롤은 직접 처리한다.
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) {
    if (SECTION_PAGE[id]) goToPage(SECTION_PAGE[id], () => jumpToId(id))
    return
  }
  const smooth = !prefersReducedMotion()
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  if (!smooth) return

  // 부드럽게 내려가는 동안 웹폰트가 늦게 적용되면 위쪽 높이가 바뀌어 도착 위치가 어긋난다.
  // 스크롤이 멈추면 한 번 더 맞춘다. 사용자가 중간에 다른 곳으로 스크롤했으면(차이가 크면) 건드리지 않는다.
  let done = false
  const settle = () => {
    if (done) return
    done = true
    window.removeEventListener('scrollend', settle)
    const off = offsetFromTarget(el)
    if (Math.abs(off) > 6 && Math.abs(off) < 240) window.scrollTo({ top: window.scrollY + off, behavior: 'auto' })
  }
  window.addEventListener('scrollend', settle)
  setTimeout(settle, 1800) // scrollend를 모르는 브라우저용
}

function showInSection(id, name, detail) {
  const run = (move) => {
    window.dispatchEvent(new CustomEvent(name, { detail }))
    move(id)
  }
  if (document.getElementById(id)) run(scrollToId)
  else if (SECTION_PAGE[id]) goToPage(SECTION_PAGE[id], () => run(jumpToId))
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

// 뒤 페이지 스크롤 잠금(햄버거 메뉴 패널·'성분 보기' 시트가 열린 동안). 잠근 쪽이 돌려받은 함수를 불러 푼다.
// html에 overflow: hidden을 걸어 손가락·휠로는 움직이지 않게 하되, 스크롤 위치와 scrollToId 같은 코드 이동은 그대로 둔다.
// 자리를 차지하는 스크롤바(윈도 등)가 사라지며 페이지가 옆으로 밀리지 않게 그 폭만큼 오른쪽을 채운다.
// 둘 이상이 겹쳐 잠가도 마지막 잠금이 풀릴 때 처음 값으로 돌아간다.
let lockCount = 0
let lockSaved = null

export function lockPageScroll() {
  const root = document.documentElement
  if (lockCount === 0) {
    lockSaved = { overflow: root.style.overflow, padding: root.style.paddingRight }
    const bar = window.innerWidth - root.clientWidth
    root.style.overflow = 'hidden'
    if (bar > 0) root.style.paddingRight = `${bar}px`
  }
  lockCount += 1
  let released = false
  return () => {
    if (released) return
    released = true
    lockCount -= 1
    if (lockCount === 0 && lockSaved) {
      root.style.overflow = lockSaved.overflow
      root.style.paddingRight = lockSaved.padding
      lockSaved = null
    }
  }
}

// 고른 부위·관리를 상담 폼으로 넘기고 예약 장으로 내려간다.
// area는 data.js AREAS 문자열과 정확히 같아야 한다. 예약 장 간편 상담 카드(QuickConsult listen)가 window 'w:pick' 이벤트를 받아 '관심 관리'로 붙인다.
// 한 열 화면(64rem 미만)에서는 상담 폼이 원형 연락 버튼·영업시간·주소 아래에 있어, 예약 장 머리로 가면 미리 고른 칩과 맥박이 화면 밖에 남는다.
// 폼이 장 머리보다 화면 절반 넘게 아래에 있으면 폼(#booking-form)으로 바로 내려간다.
// 예약 장이 다른 페이지에 있으면 그 페이지로 옮겨 가 간편 상담 카드가 그려진 뒤에 넘긴다.
export function pickForBooking({ area, programId, label } = {}) {
  const pick = (move) => {
    window.dispatchEvent(new CustomEvent('w:pick', { detail: { area, programId, label } }))
    const section = document.getElementById('booking')
    const form = document.getElementById('booking-form')
    const stacked = section && form && form.getBoundingClientRect().top - section.getBoundingClientRect().top > window.innerHeight * 0.5
    move(stacked ? 'booking-form' : 'booking')
  }
  if (document.getElementById('booking')) pick(scrollToId)
  else goToPage(SECTION_PAGE.booking, () => pick(jumpToId))
}
