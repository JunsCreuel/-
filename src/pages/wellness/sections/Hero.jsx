import { useEffect, useRef, useState } from 'react'
import BrandLogo from '../BrandLogo'
import { prefersReducedMotion, useMediaQuery } from '../motion'
import './yw-hero.css'

// 메인 비주얼 — 바닷물이 일렁이는 영상 위에 로고 하나만.
// 들어오면 영상이 어둠 속에서 서서히 밝아지고, 이어서 로고가 천천히 떠오른다(yw-hero.css, .is-go일 때).
// 가로 화면은 물가를 가로로 자른 영상, 세로 화면(휴대폰)은 세로 원본 영상을 쓴다. 영상이 늦거나 재생되지 않으면 첫 장면 사진 위로 로고만 드러난다.
// '멈춤'으로 영상을 세울 수 있고, 화면 밖으로 지나가면 멈춰 둔다. 모션 줄이기에서는 첫 장면 사진과 로고가 바로 보인다.
const VIDEO = `${import.meta.env.BASE_URL}wellness/video/`
const SEA = {
  wide: { src: `${VIDEO}hero-sea-pc.mp4`, poster: `${VIDEO}hero-sea-pc-poster.webp` },
  tall: { src: `${VIDEO}hero-sea-m.mp4`, poster: `${VIDEO}hero-sea-m-poster.webp` },
}

export default function Hero() {
  const [reduced] = useState(prefersReducedMotion)
  const [stopped, setStopped] = useState(reduced)
  const [go, setGo] = useState(reduced)
  const tall = useMediaQuery('(max-aspect-ratio: 4/5)')
  const sea = tall ? SEA.tall : SEA.wide
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  // 영상이 재생되지 않으면 1.5초 뒤 로고만 드러낸다
  useEffect(() => {
    if (go) return undefined
    const t = setTimeout(() => setGo(true), 1500)
    return () => clearTimeout(t)
  }, [go])

  // 멈춤을 눌렀거나 히어로가 화면 밖이면 영상을 세운다
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || reduced) return undefined
    let visible = true
    const sync = () => {
      if (stopped || !visible) video.pause()
      else video.play().catch(() => {})
    }
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            sync()
          })
    io?.observe(section)
    sync()
    return () => io?.disconnect()
  }, [stopped, reduced, sea.src])

  return (
    <section
      ref={sectionRef}
      id="top"
      className={`yw-section yw-hero yw-hero--water yw-hero--logo${go ? ' is-go' : ''}`}
      data-theme="dark"
      data-cursor-off
    >
      <div className="yw-hero__media" aria-hidden="true">
        {reduced ? (
          <img src={sea.poster} alt="" fetchPriority="high" />
        ) : (
          <video
            key={sea.src}
            ref={videoRef}
            src={sea.src}
            poster={sea.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onPlaying={() => setGo(true)}
          />
        )}
      </div>
      <div className="yw-hero__shade" aria-hidden="true" />

      <h1 className="yw-hero__brand">
        <BrandLogo variant="stack" />
      </h1>

      {!reduced && (
        <button
          type="button"
          className="yw-hero__pause yw-hero__pause--corner"
          aria-pressed={stopped}
          aria-label={stopped ? '바다 영상 재생' : '바다 영상 멈춤'}
          onClick={() => setStopped((v) => !v)}
        >
          <span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span>
        </button>
      )}
    </section>
  )
}
