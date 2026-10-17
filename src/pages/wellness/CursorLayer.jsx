import { useEffect, useRef, useState } from 'react'
import { clamp, hasFinePointer, onScrollFrame, prefersReducedMotion } from './motion'

// 데스크톱 커서 링·라벨·자석(장식). 마우스가 있고 모션 줄이기가 아닐 때만 그린다. 기본 커서는 숨기지 않는다.
// - 링: 2.5rem 브론즈 링이 마우스를 살짝 늦게(lerp .18) 따라온다.
// - 라벨: [data-cursor='글자']가 있으면 5.5rem 원에 글자를 보여 준다(지금은 모두 빈 값이라 글자 라벨은 쓰지 않는다). [data-cursor-off] 위에서는 숨는다.
//   속성 값을 그때그때 다시 읽으므로, 무대가 라벨을 바꾸면(← 이전 / 다음 →) 바로 반영된다.
// - 자석: [data-magnet] 요소는 중심과 커서 거리의 .3배(±12px)만큼 --mgx/--mgy로 끌려온다(wellness-x.css).
const LERP = 0.18
const PULL = 0.3
const MAX_PULL = 12

export default function CursorLayer() {
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion())
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return undefined
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0
    let target = null
    let label = null
    let visible = false
    let magnet = null

    const render = () => {
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`
      const hit = target?.closest?.('[data-cursor-off],[data-cursor]')
      const off = !!hit && hit.hasAttribute('data-cursor-off')
      const next = hit && !off ? hit.getAttribute('data-cursor') || null : null
      el.classList.toggle('is-off', off || !visible)
      if (next !== label) {
        label = next
        if (next) el.dataset.label = next
        else delete el.dataset.label
        el.classList.toggle('is-label', !!next)
      }
    }

    const frame = () => {
      raf = 0
      x += (tx - x) * LERP
      y += (ty - y) * LERP
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        x = tx
        y = ty
      } else {
        raf = requestAnimationFrame(frame)
      }
      render()
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const releaseMagnet = () => {
      if (!magnet) return
      magnet.style.removeProperty('--mgx')
      magnet.style.removeProperty('--mgy')
      magnet = null
    }

    const pullMagnet = () => {
      const m = target?.closest?.('[data-magnet]') || null
      if (m !== magnet) {
        releaseMagnet()
        magnet = m
      }
      if (!m) return
      // 지금 걸려 있는 이동(전환 중인 값 포함)을 빼서 원래 자리의 중심을 구한다.
      const r = m.getBoundingClientRect()
      let ox = 0
      let oy = 0
      try {
        const t = getComputedStyle(m).transform
        if (t && t !== 'none') {
          const mx = new DOMMatrixReadOnly(t)
          ox = mx.m41
          oy = mx.m42
        }
      } catch {
        /* transform을 읽지 못하면 보정 없이 */
      }
      const cx = r.left + r.width / 2 - ox
      const cy = r.top + r.height / 2 - oy
      m.style.setProperty('--mgx', `${clamp((tx - cx) * PULL, -MAX_PULL, MAX_PULL).toFixed(1)}px`)
      m.style.setProperty('--mgy', `${clamp((ty - cy) * PULL, -MAX_PULL, MAX_PULL).toFixed(1)}px`)
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      tx = e.clientX
      ty = e.clientY
      target = e.target
      if (!visible) {
        visible = true
        x = tx
        y = ty
      }
      pullMagnet()
      kick()
    }

    const onOut = (e) => {
      if (e.relatedTarget) return
      visible = false
      target = null
      releaseMagnet()
      kick()
    }

    // 스크롤하면 커서 아래 요소가 바뀌므로 다시 읽는다.
    const offScroll = onScrollFrame(() => {
      if (!visible) return
      target = document.elementFromPoint(tx, ty)
      pullMagnet()
      kick()
    })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)
    return () => {
      offScroll()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseout', onOut)
      if (raf) cancelAnimationFrame(raf)
      releaseMagnet()
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={ref} className="yw-cursor is-off" aria-hidden="true" />
}
