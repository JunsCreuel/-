import { useRef, useState } from 'react'
import { BRANCHES } from '../data'
import { ParenLink } from '../editorial'
import { prefersReducedMotion } from '../motion'
import { scrollToId } from '../scroll'
import './yw-hero.css'

// 메인 비주얼 — 콘크리트 벽 앞에서 잎이 흔들리는 영상(Coverr, 상업적 무료 사용) 위에 큰 문구 하나.
// 소리 없이 반복 재생하고, '멈춤'으로 세울 수 있다. 모션 줄이기에서는 재생하지 않고 첫 장면(포스터)만 보여 준다.
const BASE = import.meta.env.BASE_URL
const VIDEO = `${BASE}wellness/video/hero-leaves.mp4`
const POSTER = `${BASE}wellness/video/hero-leaves-poster.webp`

export default function Hero() {
  const videoRef = useRef(null)
  const [reduced] = useState(prefersReducedMotion)
  const [stopped, setStopped] = useState(reduced)

  function toggle() {
    const v = videoRef.current
    if (!v) return
    if (stopped) v.play().catch(() => {})
    else v.pause()
    setStopped(!stopped)
  }

  return (
    <section id="top" className="yw-section yw-hero yw-hero--video" data-theme="dark" data-cursor-off>
      <div className="yw-hero__media" aria-hidden="true">
        <video
          ref={videoRef}
          src={VIDEO}
          poster={POSTER}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          preload={reduced ? 'none' : 'auto'}
        />
      </div>
      <div className="yw-hero__shade" aria-hidden="true" />

      <div className="yw-wrap yw-hero__text">
        <div className="yw-hero__slide">
          <p className="yw-hero__kicker">예뻐졌다가 쉼을 더해 만든 자매 브랜드</p>
          <h1 className="yw-hero__title">
            근본적인 아름다움을 깨우다
            <br />
            <em>예뻐졌다 웰니스 스튜디오</em>
          </h1>
        </div>

        <div className="yw-hero__actions">
          <ParenLink onClick={() => scrollToId('programs')} tone="light">
            관리 프로그램 보기
          </ParenLink>
          <ParenLink href={BRANCHES.zai.booking} external tone="light">
            네이버 예약
          </ParenLink>
          {!reduced && (
            <button type="button" className="yw-hero__pause" aria-pressed={stopped} aria-label={stopped ? '영상 재생' : '영상 멈춤'} onClick={toggle}>
              <span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span>
            </button>
          )}
        </div>
      </div>

      <dl className="yw-hero__info">
        <div>
          <dt className="sr-only">위치</dt>
          <dd>부산 용호 · GS하이츠자이 상가</dd>
        </div>
        <div>
          <dt className="sr-only">영업시간</dt>
          <dd>{BRANCHES.zai.hours}</dd>
        </div>
        <div>
          <dt className="sr-only">예약</dt>
          <dd>100% 예약제 · 1:1</dd>
        </div>
      </dl>
    </section>
  )
}
