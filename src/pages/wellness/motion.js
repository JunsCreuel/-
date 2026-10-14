import { useEffect, useRef, useState } from 'react'

// 인터랙티브 효과 공통 도구. 새 라이브러리 없이 IntersectionObserver · requestAnimationFrame · CSS 변수로 만든다.
// 모든 효과는 "모션 줄이기" 설정이면 끄고, 마우스가 없는 터치 기기에서는 포인터 효과를 쓰지 않는다.

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
}

export const easeOutCubic = (t) => 1 - (1 - t) ** 3
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// ── rAF 스크롤 허브 ─────────────────────────────────────────────
// 페이지의 스크롤 연동 효과(헤더 반전, 진행률, 마키 속도, 패럴랙스 등)가 scroll·resize 리스너 하나와 rAF 하나를 함께 쓴다.
// 구독자는 프레임마다 { y: scrollY, vy: 16ms당 이동 px, dt: 지난 프레임과의 ms }를 받는다. 스크롤이 멈추면 vy 0으로 한 번 더 부르고 rAF를 멈춘다.
const scrollSubs = new Set()
let hubRaf = 0
let hubLastY = 0
let hubLastT = 0

function hubTick(now) {
  hubRaf = 0
  const y = window.scrollY
  const dt = hubLastT ? clamp(now - hubLastT, 1, 100) : 16
  const vy = ((y - hubLastY) / dt) * 16
  const moved = y !== hubLastY
  hubLastY = y
  hubLastT = moved ? now : 0
  const state = { y, vy, dt }
  scrollSubs.forEach((fn) => fn(state))
  if (moved) hubRaf = requestAnimationFrame(hubTick)
}

function hubKick() {
  if (!hubRaf) hubRaf = requestAnimationFrame(hubTick)
}

export function onScrollFrame(fn) {
  if (typeof window === 'undefined') return () => {}
  if (scrollSubs.size === 0) {
    hubLastY = window.scrollY
    hubLastT = 0
    window.addEventListener('scroll', hubKick, { passive: true })
    window.addEventListener('resize', hubKick)
  }
  scrollSubs.add(fn)
  fn({ y: window.scrollY, vy: 0, dt: 16 })
  return () => {
    scrollSubs.delete(fn)
    if (scrollSubs.size === 0) {
      window.removeEventListener('scroll', hubKick)
      window.removeEventListener('resize', hubKick)
      if (hubRaf) cancelAnimationFrame(hubRaf)
      hubRaf = 0
    }
  }
}

// 요소의 스크롤 진행률(0~1)을 --p로 쓴다.
// mode 'pin': 요소 높이에서 화면 높이를 뺀 구간(고정 무대) 동안 0→1. 'through': 요소 윗변이 화면 아래에 닿을 때 0, 아랫변이 화면 위를 지날 때 1.
// 화면 근처(위아래 25%)일 때만 허브를 구독한다. enabled가 false거나 모션 줄이기면 --p를 fallback으로 고정하고 onProgress는 부르지 않는다.
export function useScrollProgress(ref, { mode = 'through', enabled = true, fallback = 1, onProgress } = {}) {
  const cbRef = useRef(onProgress)
  useEffect(() => {
    cbRef.current = onProgress
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!enabled || prefersReducedMotion()) {
      el.style.setProperty('--p', String(fallback))
      return undefined
    }
    let last = -1
    const measure = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p =
        mode === 'pin'
          ? clamp(-r.top / Math.max(1, r.height - vh), 0, 1)
          : clamp((vh - r.top) / (vh + r.height), 0, 1)
      if (Math.abs(p - last) > 0.0005 || (p !== last && (p === 0 || p === 1))) {
        last = p
        el.style.setProperty('--p', p.toFixed(4))
        cbRef.current?.(p)
      }
    }
    let unsub = null
    if (typeof IntersectionObserver === 'undefined') {
      unsub = onScrollFrame(measure)
      return () => unsub()
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!unsub) unsub = onScrollFrame(measure)
        } else if (unsub) {
          measure() // 빠르게 지나가도 0이나 1로 맞춰 둔다
          unsub()
          unsub = null
        }
      },
      { rootMargin: '25% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      unsub?.()
    }
  }, [ref, mode, enabled, fallback])
}

// 미디어 쿼리 일치 여부. 처음 렌더에서 바로 matches를 읽고, 바뀌면 다시 그린다.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return undefined
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}

// 가로 스크롤 트랙을 마우스로 끌어 넘기기. 터치·펜은 네이티브 스크롤을 그대로 쓴다.
// 끄는 동안 .is-dragging(스냅 끔), 놓으면 관성으로 미끄러진 뒤 가장 가까운 항목에 맞춘다.
// 끌기 시작(포인터 캡처·.is-dragging)과 이어지는 click 막기는 같은 문턱(DRAG_SLOP, 6px)을 쓴다. 그 이하로 움직인 누르기는
// 안쪽 버튼의 클릭으로 그대로 간다(캡처를 먼저 걸면 click이 버튼이 아니라 트랙에서 일어나 사라진다).
// 관성으로 미끄러지는 동안 눌러 멈추고 끌지 않고 놓으면(트랙 밖에서 놓아도) 그 자리에서 가까운 항목에 맞추고 .is-dragging을 푼다.
const DRAG_SLOP = 6

export function useDragScroll(ref, { itemSelector = ':scope > *' } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let pid = null
    let startX = 0
    let startLeft = 0
    let lastX = 0
    let lastT = 0
    let vel = 0
    let dragging = false
    let suppress = false
    let raf = 0

    const snap = () => {
      el.classList.remove('is-dragging')
      const items = el.querySelectorAll(itemSelector)
      if (!items.length) return
      const box = el.getBoundingClientRect()
      // scroll-padding이 %·max() 같은 식이면 계산값이 문자열로 남아 NaN이 된다. 그때는 첫 항목의 시작 위치를 여백으로 본다.
      let pad = parseFloat(getComputedStyle(el).scrollPaddingLeft)
      if (Number.isNaN(pad)) pad = items[0].getBoundingClientRect().left - box.left + el.scrollLeft
      const max = el.scrollWidth - el.clientWidth
      let best = el.scrollLeft
      let bestD = Infinity
      items.forEach((item) => {
        const x = clamp(item.getBoundingClientRect().left - box.left + el.scrollLeft - pad, 0, max)
        const d = Math.abs(x - el.scrollLeft)
        if (d < bestD) {
          bestD = d
          best = x
        }
      })
      el.scrollTo({ left: best, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }

    const glide = () => {
      el.scrollLeft += vel
      vel *= 0.92
      if (Math.abs(vel) < 0.4) {
        raf = 0
        snap()
      } else {
        raf = requestAnimationFrame(glide)
      }
    }

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      pid = e.pointerId
      startX = lastX = e.clientX
      startLeft = el.scrollLeft
      lastT = performance.now()
      vel = 0
      dragging = false
    }

    const onMove = (e) => {
      if (e.pointerId !== pid) return
      const dx = e.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) <= DRAG_SLOP) return
        dragging = true
        el.classList.add('is-dragging')
        try {
          el.setPointerCapture(pid)
        } catch {
          /* 이미 놓인 포인터 */
        }
      }
      el.scrollLeft = startLeft - dx
      const now = performance.now()
      const dt = Math.max(1, now - lastT)
      const inst = (-(e.clientX - lastX) / dt) * 16
      vel = vel * 0.2 + inst * 0.8
      lastX = e.clientX
      lastT = now
    }

    // 트랙 밖에서 놓은 경우도 받도록 window에서 듣는다(끄는 동안은 캡처라 트랙에서 올라온다).
    const onUp = (e) => {
      if (e.pointerId !== pid) return
      pid = null
      if (!dragging) {
        // 미끄러지던 트랙을 눌러 멈췄으면 지난 끌기의 .is-dragging이 남아 있다(스냅·호버 꺼짐). 가까운 항목에 맞추며 푼다.
        if (el.classList.contains('is-dragging')) snap()
        return
      }
      dragging = false
      if (Math.abs(e.clientX - startX) > DRAG_SLOP) {
        suppress = true
        setTimeout(() => {
          suppress = false
        }, 0)
      }
      if (performance.now() - lastT > 80) vel = 0 // 멈춘 뒤 놓으면 관성 없음
      if (prefersReducedMotion() || Math.abs(vel) < 0.4) snap()
      else raf = requestAnimationFrame(glide)
    }

    const onClick = (e) => {
      if (!suppress) return
      suppress = false
      e.preventDefault()
      e.stopPropagation()
    }
    const onDragStart = (e) => e.preventDefault()

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.addEventListener('click', onClick, true)
    el.addEventListener('dragstart', onDragStart)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.classList.remove('is-dragging')
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('dragstart', onDragStart)
    }
  }, [ref, itemSelector])
}

// 요소가 화면에 들어오면 true. once면 한 번 켜지면 유지한다.
export function useInView(ref, { once = true, threshold = 0.35 } = {}) {
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold])
  return inView
}

// 값이 바뀔 때 부드럽게 따라가는 숫자(첫 방문 티켓의 가격 숫자 등).
export function useTween(target, duration = 420) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced) return undefined
    const from = fromRef.current
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const v = from + (target - from) * easeOutCubic(t)
      fromRef.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduced])
  return reduced ? target : value
}

// 스크롤에 따라 요소 안의 사진이 살짝 다른 속도로 움직이는 패럴랙스. 요소에 --py(px)를 쓴다.
export function useScrollParallax(ref, strength = 28) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -100 || r.top > vh + 100) return
      const p = (r.top + r.height / 2 - vh / 2) / vh // 화면 가운데 기준 -1~1 정도
      el.style.setProperty('--py', `${(-p * strength).toFixed(1)}px`)
    })
  }, [ref, strength])
}

// 성공 순간의 폭죽. 화면 전체를 덮는 캔버스를 잠깐 만들었다가 지운다(모션 줄이기면 아무것도 하지 않는다).
const CONFETTI_COLORS = ['#a3835f', '#d8c19d', '#eee2cc', '#7a5a3d', '#2a2320', '#ffffff']

export function fireConfetti(origin) {
  if (typeof document === 'undefined' || prefersReducedMotion()) return
  const canvas = document.createElement('canvas')
  canvas.className = 'w-confetti'
  canvas.setAttribute('aria-hidden', 'true')
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const W = window.innerWidth
  const H = window.innerHeight
  canvas.width = W * dpr
  canvas.height = H * dpr
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  const ox = origin?.x ?? W / 2
  const oy = origin?.y ?? H * 0.6
  const parts = Array.from({ length: 120 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
    const speed = 6 + Math.random() * 9
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }
  })
  const start = performance.now()
  const LIFE = 1900
  const frame = (now) => {
    const t = now - start
    ctx.clearRect(0, 0, W, H)
    for (const p of parts) {
      p.vy += 0.28
      p.vx *= 0.992
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.globalAlpha = Math.max(0, 1 - t / LIFE)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }
    if (t < LIFE) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}
