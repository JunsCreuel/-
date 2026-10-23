function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 등장 효과(.w-reveal)의 translateY를 뺀, 원래 자리 기준으로 목표까지 남은 거리
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

// HashRouter에서는 #id 링크가 라우트를 깨뜨리므로 스크롤은 직접 처리한다.
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
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
export function pickForBooking({ area, programId, label } = {}) {
  window.dispatchEvent(new CustomEvent('w:pick', { detail: { area, programId, label } }))
  const section = document.getElementById('booking')
  const form = document.getElementById('booking-form')
  const stacked = section && form && form.getBoundingClientRect().top - section.getBoundingClientRect().top > window.innerHeight * 0.5
  scrollToId(stacked ? 'booking-form' : 'booking')
}
