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

// 고른 부위·관리를 상담 폼으로 넘기고 예약 장으로 내려간다.
// area는 data.js AREAS 문자열과 정확히 같아야 한다. 상담 폼(BookingSteps)이 window 'w:pick' 이벤트를 받아 1단계를 미리 선택한다.
export function pickForBooking({ area, programId, label } = {}) {
  window.dispatchEvent(new CustomEvent('w:pick', { detail: { area, programId, label } }))
  scrollToId('booking')
}
