import { useRef } from 'react'
import { BRANCHES, PICS } from '../data'
import { ParenLink, Pic } from '../editorial'
import { prefersReducedMotion, useInView } from '../motion'
import { scrollToId } from '../scroll'
import './yw-closing.css'

// 마지막 장면 — 매장 사진 한 장(원본 4:5 그대로, 액자처럼)과 예약 버튼.
// 화면에 들어오면 사진이 가운데에서 바깥으로 쫙 열리고, 화면 밖으로 나갔다가 다시 들어오면 또 열린다.
// 모션 줄이기에서는 열린 사진과 버튼을 바로 보여 준다.
export default function CtaBand() {
  const ref = useRef(null)
  const reduced = prefersReducedMotion()
  const inView = useInView(ref, { once: false, threshold: 0.3 })
  const open = reduced || inView

  return (
    <section
      id="closing"
      ref={ref}
      className={`yw-close${open ? ' is-open' : ''}${reduced ? ' is-still' : ''}`}
      data-theme="dark"
      aria-labelledby="closing-title"
    >
      <h2 id="closing-title" className="sr-only">
        예뻐졌다 웰니스 스튜디오 예약
      </h2>
      <div className="yw-close__stage">
        <figure className="yw-close__photo">
          <Pic pic={PICS.closing} sizes="(min-width: 48rem) 36rem, 88vw" alt="예뻐졌다 WELLNESS STUDIO 관리실" />
        </figure>
        <button type="button" className="yw-close__round" data-magnet data-cursor="" onClick={() => scrollToId('booking')}>
          <span>예약하기</span>
        </button>
      </div>
      <div className="yw-close__actions">
        <ParenLink href={BRANCHES.zai.booking} external tone="light">
          네이버 예약
        </ParenLink>
        <button type="button" className="yw-close__small" onClick={() => scrollToId('startup')}>
          창업·운영 상담 →
        </button>
      </div>
    </section>
  )
}
