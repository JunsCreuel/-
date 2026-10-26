import { useEffect, useRef, useState } from 'react'
import BrandLogo from '../BrandLogo'
import { prefersReducedMotion, useMediaQuery } from '../motion'
import './yw-hero.css'

// 메인 비주얼 — 바닷물이 일렁이는 영상 위에 로고와 그 아래 한 줄 문구.
// 영상은 물이 빠지기 시작하는 자리(START초)부터 재생한다. 영상이 재생되면 어둠 속에서 서서히 밝아지며
// 로고('예뻐졌다 WELLNESS STUDIO')가 자막처럼 부드럽게 나타나고, 1초쯤 뒤 그 아래 문구가 이어진다(yw-hero.css, .is-go일 때).
// 가로 화면은 물가를 가로로 자른 영상, 세로 화면(휴대폰)은 세로 원본 영상을 쓴다. 영상이 늦거나 재생되지 않으면 첫 장면 사진 위로 로고만 드러난다.
// '멈춤'으로 영상을 세울 수 있고, 화면 밖으로 지나가면 멈춰 두었다가 다시 들어오면 처음부터 다시 연출한다. 모션 줄이기에서는 첫 장면 사진과 로고가 바로 보인다.
const VIDEO = `${import.meta.env.BASE_URL}wellness/video/`
const START = 3.5 // 물이 빠지기 시작하는 자리(초)
// poster는 START 지점 장면이라 영상이 늦게 시작해도 화면이 튀지 않는다
const SEA = {
  wide: { src: `${VIDEO}hero-sea-pc-hq.mp4#t=${START}`, poster: `${VIDEO}hero-sea-pc-start.webp` },
  tall: { src: `${VIDEO}hero-sea-m-hq.mp4#t=${START}`, poster: `${VIDEO}hero-sea-m-start.webp` },
}

export default function Hero() {
  const [reduced] = useState(prefersReducedMotion)
  const [stopped, setStopped] = useState(reduced)
  const [go, setGo] = useState(reduced)
  const [playing, setPlaying] = useState(false)
  const tall = useMediaQuery('(max-aspect-ratio: 4/5)')
  const sea = tall ? SEA.tall : SEA.wide
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  // 히어로가 화면 밖으로 완전히 나가면 처음 상태로 되돌려 두고, 다시 들어오면 처음부터 같은 연출을 한 번 더 한다
  // (어둠 속에서 밝아지며 로고가 나타나고 → 1초쯤 뒤 문구가 나타난다)
  const [live, setLive] = useState(true)
  useEffect(() => {
    const section = sectionRef.current
    if (!section || reduced || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => {
      setLive(entry.isIntersecting)
      if (!entry.isIntersecting) setGo(false)
    })
    io.observe(section)
    return () => io.disconnect()
  }, [reduced])

  // 영상이 재생되지 않거나(느린 연결·자동 재생 막힘) 멈춰 둔 상태면 2초 뒤 로고만 드러낸다
  useEffect(() => {
    if (go || !live || (playing && !stopped)) return undefined
    const t = setTimeout(() => setGo(true), 2000)
    return () => clearTimeout(t)
  }, [go, live, playing, stopped])

  // 화면 밖이면 영상을 세우고 물이 빠지기 시작하는 자리로 되감아 둔다. 화면 안에서는 멈춤 버튼을 따른다
  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    if (!live) {
      video.pause()
      video.currentTime = START
    } else if (stopped) video.pause()
    else video.play().catch(() => {})
  }, [live, stopped, reduced, sea.src])

  return (
    <section
      ref={sectionRef}
      id="top"
      className={`yw-section yw-hero yw-hero--water yw-hero--logo${live ? ' is-live' : ''}${go ? ' is-go' : ''}`}
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
            onPlaying={() => {
              setPlaying(true)
              if (live) setGo(true)
            }}
          />
        )}
      </div>
      <div className="yw-hero__shade" aria-hidden="true" />

      <div className="yw-hero__brand">
        <h1>
          <BrandLogo variant="stack" />
        </h1>
        <p className="yw-hero__tagline" lang="en">
          Healthy inside, Beautiful outside.
        </p>
      </div>

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
