import { useEffect, useRef, useState } from 'react'
import BrandLogo from '../BrandLogo'
import { prefersReducedMotion, useMediaQuery } from '../motion'

// 메인 비주얼 — 위에서 내려다본 모래사장과 청록 바다(파도가 밀려왔다 빠지는 영상) 위에 로고와 그 아래 한 줄 문구.
// 영상이 재생되면 어둠 속에서 서서히 밝아지며 로고('예뻐졌다 WELLNESS STUDIO')가 자막처럼 부드럽게 나타나고,
// 1초쯤 뒤 그 아래 문구가 이어진다(go일 때). 영상은 밀려오는 장면 뒤에 거꾸로 빠지는 장면을 이어 끊김 없이 반복된다.
// 가로 화면은 가로 영상, 세로 화면(휴대폰)은 가운데를 세로로 자른 영상을 쓴다. 영상이 늦거나 재생되지 않으면 첫 장면 사진 위로 로고만 드러난다.
// '멈춤'으로 영상을 세울 수 있고, 화면 밖으로 지나가면 멈춰 두었다가 다시 들어오면 처음부터 다시 연출한다. 모션 줄이기에서는 첫 장면 사진과 로고가 바로 보인다.
const VIDEO = `${import.meta.env.BASE_URL}wellness/video/`

// 화면 높이를 채운다. 64rem 미만은 흐름 배치(위는 헤더 자리만큼, 아래는 고정 바 자리만큼 비운다)
const SECTION =
  'relative -mt-(--w-nav-h) scroll-mt-(--w-nav-h) h-svh min-h-[40rem] touch-pan-y touch-pinch-zoom overflow-clip bg-espresso p-0 text-cream isolate [&_:focus-visible]:outline-cream max-lg:flex max-lg:h-auto max-lg:min-h-svh max-lg:flex-col max-lg:justify-end max-lg:px-0 max-lg:pt-[calc(var(--w-nav-h)_+_3.75rem)] max-lg:pb-[clamp(6rem,14vh,9rem)] max-md:min-h-[max(34rem,100svh)] max-md:pb-[calc(9.5rem_+_env(safe-area-inset-bottom))]'
// 영상(못 쓰면 첫 장면 사진)을 화면에 꽉 채운다
const FILL = 'absolute inset-0 size-full max-w-none object-cover object-center'
// 물빛은 밝게 두고 맨 위(상단 바 자리)만 살짝, 로고 뒤만 청록으로 옅게 가라앉힌다
const SHADE =
  'pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(to_bottom,rgb(14_28_30/0.22),transparent_16%),radial-gradient(ellipse_46%_26%_at_50%_64%,rgb(6_46_52/0.42),rgb(6_46_52/0.12)_65%,transparent_100%)]'
// 로고 묶음은 가운데보다 조금 아래(화면 높이의 64% 언저리)라, 파도가 가장 높이 밀려와도 흰 포말이 아닌 청록 바다 위에 놓인다
const BRAND =
  'pointer-events-none absolute inset-0 z-2 m-0 grid place-content-center justify-items-center gap-[clamp(1.25rem,2.6vw,2.25rem)] px-(--w-gutter) pt-[clamp(8rem,26svh,17rem)] [filter:drop-shadow(0_1px_2px_rgb(4_34_38/0.5))_drop-shadow(0_4px_22px_rgb(4_34_38/0.45))]'
// 로고: 마크(ri)는 빼고 글자 두 줄만. 'WELLNESS STUDIO'에는 빛줄기가 한 번 스친다(시작 위치는 글자 밖)
const LOGO =
  'm-0 leading-[0] [&_.w-logo]:[--u:clamp(0.5px,0.08vw_+_0.2px,1.15px)] [&_.w-logo]:[--w-logo-mark:#fbfaf3] [&_.w-logo]:[--w-logo-text:#fbfaf3] [&_[data-logo=mark]]:hidden [&_[data-logo=text]]:mt-0 [&_[data-logo=en]]:bg-[linear-gradient(110deg,transparent_38%,rgb(255_255_255/0.95)_50%,transparent_62%)] [&_[data-logo=en]]:bg-size-[260%_100%] [&_[data-logo=en]]:bg-no-repeat motion-reduce:[&_.w-logo]:animate-none motion-reduce:[&_.w-logo]:opacity-100 motion-reduce:[&_[data-logo=en]]:animate-none motion-reduce:[&_[data-logo=en]]:bg-position-[160%_0]'
const LOGO_WAIT = '[&_.w-logo]:opacity-0 [&_[data-logo=en]]:bg-position-[160%_0]'
const LOGO_GO = '[&_.w-logo]:animate-logo-rise [&_[data-logo=en]]:animate-logo-gleam'
const TAGLINE =
  'm-0 text-center font-en text-[clamp(1.15rem,1.1vw_+_0.8rem,1.9rem)] leading-[1.3] font-normal tracking-[0.04em] text-[#fbfaf3] normal-nums italic motion-reduce:animate-none motion-reduce:opacity-100'
// poster는 영상 첫 장면이라 영상이 늦게 시작해도 화면이 튀지 않는다
const SEA = {
  wide: { src: `${VIDEO}hero-shore-pc.mp4`, poster: `${VIDEO}hero-shore-pc-start.webp` },
  tall: { src: `${VIDEO}hero-shore-m.mp4`, poster: `${VIDEO}hero-shore-m-start.webp` },
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

  // 화면 밖이면 영상을 세우고 처음으로 되감아 둔다. 화면 안에서는 멈춤 버튼을 따른다
  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    if (!live) {
      video.pause()
      video.currentTime = 0
    } else if (stopped) video.pause()
    else video.play().catch(() => {})
  }, [live, stopped, reduced, sea.src])

  return (
    <section
      ref={sectionRef}
      id="top"
      className={SECTION}
      data-theme="dark"
      data-cursor-off
    >
      {/* 히어로가 화면에 들어올 때마다(live) 물빛이 처음부터 밝아진다 */}
      <div className={`absolute inset-0 z-0 ${live ? 'animate-hero-dawn motion-reduce:animate-none' : ''}`} aria-hidden="true">
        {reduced ? (
          <img src={sea.poster} alt="" fetchPriority="high" className={`${FILL} select-none [-webkit-user-drag:none]`} />
        ) : (
          <video
            key={sea.src}
            ref={videoRef}
            className={FILL}
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
      <div className={SHADE} aria-hidden="true" />

      <div className={BRAND}>
        <h1 className={`${LOGO} ${go ? LOGO_GO : LOGO_WAIT}`}>
          <BrandLogo variant="stack" />
        </h1>
        <p className={`${TAGLINE} ${go ? 'animate-tagline-in' : 'opacity-0'}`} lang="en">
          Healthy inside, Beautiful outside.
        </p>
      </div>

      {!reduced && (
        <button
          type="button"
          className="absolute right-(--w-gutter) bottom-[clamp(1.25rem,4vh,2.5rem)] z-3 grid size-11 cursor-pointer place-items-center border-0 bg-transparent p-0 text-[0.7rem] text-[rgb(241_243_228/0.85)] max-md:bottom-[6.5rem]"
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
