import { useRef, useState } from 'react'
import { BRANCHES, PICS } from '../data'
import { ParenLink, Pic, SplitLines } from '../editorial'
import { easeInOutCubic, prefersReducedMotion, useInView, useMediaQuery, useScrollProgress } from '../motion'
import { scrollToId } from '../scroll'
import './yw-closing.css'

// No. 12 Closing — 점이 원으로 커지며 촛불과 수건 사진이 열리고, 히어로의 첫 문장이 다시 올라온다(수미상관).
// 64rem 이상(모션 줄이기 아님): 170svh 섹션 안의 100svh sticky 무대에서 스크롤 진행률로 원형 마스크를 연다(--e).
// 그보다 좁으면 고정 없이, 화면에 40% 들어올 때 아치 모양에서 전면으로 1.4초 동안 열린다.
// 모션 줄이기: 마스크 없이 열린 사진에 제목과 버튼을 바로 보여 준다. sticky 무대의 조상에는 transform을 쓰지 않는다.
const OPEN_AT = 0.55 // 이 진행률을 넘으면 제목과 버튼이 올라온다
const FULL_AT = 0.75 // 이 진행률에서 원이 화면을 다 채운다

export default function CtaBand() {
  const ref = useRef(null)
  const reduced = prefersReducedMotion()
  const wide = useMediaQuery('(min-width: 64rem)')
  const pinned = wide && !reduced
  const inView = useInView(ref, { threshold: 0.4 })
  const [pinOpen, setPinOpen] = useState(false)
  const pinOpenRef = useRef(false)

  useScrollProgress(ref, {
    mode: 'pin',
    enabled: pinned,
    onProgress: (p) => {
      const el = ref.current
      if (!el) return
      el.style.setProperty('--e', easeInOutCubic(Math.min(1, p / FULL_AT)).toFixed(4))
      const next = p > OPEN_AT
      if (next !== pinOpenRef.current) {
        pinOpenRef.current = next
        setPinOpen(next)
      }
    },
  })

  const open = reduced || (pinned ? pinOpen : inView)

  // 고정 무대에서 원이 열리기 전에 키보드로 버튼에 들어오면, 다 열린 지점으로 옮겨 버튼이 보이게 한다.
  const onFocus = () => {
    const el = ref.current
    if (!pinned || pinOpenRef.current || !el) return
    const r = el.getBoundingClientRect()
    const run = Math.max(0, r.height - window.innerHeight)
    window.scrollTo({ top: window.scrollY + r.top + run * 0.85, behavior: 'auto' })
  }

  const cls = `yw-close${pinned ? ' is-pinned' : ''}${open ? ' is-open' : ''}${reduced ? ' is-still' : ''}`

  return (
    <section id="closing" ref={ref} className={cls} data-theme="dark" aria-labelledby="closing-title" onFocus={onFocus}>
      <div className="yw-close__stage">
        <figure className="yw-close__photo">
          <Pic pic={PICS.closing} sizes="(max-aspect-ratio: 3/2) 150vh, 100vw" />
          <div className="yw-close__shade" />
        </figure>

        <div className="yw-close__dot" aria-hidden="true">
          <span />
          <span>SEE YOU AT YONGHO</span>
        </div>

        <div className="yw-close__text">
          <SplitLines
            as="h2"
            id="closing-title"
            className="yw-close__title"
            open={open}
            lines={['오늘보다 더 예쁜,', <em key="e">내일의 나.</em>]}
          />
          <div className="yw-close__actions">
            <button
              type="button"
              className="yw-close__round"
              data-magnet
              data-cursor="예약"
              onClick={() => scrollToId('booking')}
            >
              <span>예약하기</span>
            </button>
            <ParenLink href={BRANCHES.zai.booking} external tone="light">
              네이버 예약
            </ParenLink>
            <button type="button" className="yw-close__small" onClick={() => scrollToId('startup')}>
              창업·운영 상담 →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
