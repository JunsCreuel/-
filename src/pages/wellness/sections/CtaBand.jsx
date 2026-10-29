import { useEffect, useRef, useState } from 'react'
import { BRANCHES, PICS } from '../data'
import { ParenLink, Pic } from '../editorial'
import { onScrollFrame, prefersReducedMotion } from '../motion'
import { scrollToId } from '../scroll'

// 마지막 장면 — 매장 사진을 화면 가득(가장자리를 늘려 붙이지 않고 원본 사진만) 채우고, 아래쪽에 예약 버튼.
// 섹션이 화면에 들어오면 위가 둥근 아치 모양으로 말려 있던 사진이 화면 가득 넓게 펼쳐지고, 완전히 나갔다가 다시 들어오면 또 펼쳐진다.
// 사진은 세로(4:5)라 가로 화면에서는 위아래가 잘린다. 처음에는 위쪽(간판·화분)이 보이고, 스크롤해 지나가는 동안
// 사진이 조금 느리게 따라 올라가며 아래쪽(세면대·침대)이 드러난다. 휴대폰은 화면 너비에 사진 전체가 그대로 들어간다.
// 모션 줄이기에서는 열린 사진과 버튼을 바로 보여 주고 사진을 움직이지 않는다.
// 크림 원 '예약하기'. 자석 이동은 공통 transform이 맡으므로 등장·눌림은 opacity·scale로만 한다.
const ROUND =
  'grid aspect-square w-28 cursor-pointer place-items-center rounded-full border-2 border-cream bg-cream p-0 font-serif text-[1.05rem] leading-[1.3] font-medium text-espresso shadow-[0_14px_34px_rgb(29_26_23/0.28)] [transition:transform_0.55s_cubic-bezier(0.2,0.8,0.2,1),background-color_0.3s_ease,color_0.3s_ease] focus-visible:bg-espresso focus-visible:text-cream active:scale-97 md:w-36 md:text-[1.15rem] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-espresso [@media(hover:hover)_and_(pointer:fine)]:hover:text-cream'
// 창업·운영 상담: 옅은 밑줄 위로 진한 밑줄이 그어지는 작은 링크
const SMALL =
  'min-h-11 cursor-pointer border-0 bg-transparent bg-[linear-gradient(var(--yw-cream)_0_0),linear-gradient(rgb(241_243_228/0.35)_0_0)] bg-size-[0%_1px,100%_1px] bg-position-[0_100%,0_100%] bg-no-repeat bg-origin-content px-1 py-2 [font-family:inherit] text-[0.9rem] leading-[1.4] [font-weight:inherit] text-cream transition-[background-size] duration-200 ease-yw focus-visible:bg-size-[100%_1px,100%_1px] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-size-[100%_1px,100%_1px]'

export default function CtaBand() {
  const ref = useRef(null)
  const panRef = useRef(null)
  const reduced = prefersReducedMotion()
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined')
  const open = reduced || inView

  // 섹션이 35% 넘게 보이면 열고, 화면 밖으로 완전히 나가면 닫아 둔다(다시 들어오면 또 열린다)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35) setInView(true)
        else if (!entry.isIntersecting) setInView(false)
      },
      { threshold: [0, 0.35] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  // 사진이 틀보다 길면(가로 화면) 스크롤에 따라 사진을 위로 옮겨 아래쪽을 드러낸다
  useEffect(() => {
    const el = ref.current
    const pan = panRef.current
    if (!el || !pan || reduced) return undefined
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const range = pan.offsetHeight - el.clientHeight
      if (range <= 0) {
        pan.style.transform = ''
        return
      }
      // 섹션이 화면을 다 채운 뒤 빠져나가는 정도. 처음 10%는 그대로 둬서 간판(사진 맨 위)이 상단 바 아래에 보이게 한다
      const f = Math.min(1, Math.max(0, (-r.top / r.height - 0.1) / 0.9))
      pan.style.transform = `translate3d(0, ${(-range * f).toFixed(1)}px, 0)`
    })
  }, [reduced])

  return (
    <section
      id="closing"
      ref={ref}
      className="relative h-[min(100svh,125vw)] overflow-clip bg-espresso text-cream [&_:focus-visible]:outline-cream"
      data-theme="dark"
      aria-labelledby="closing-title"
    >
      <h2 id="closing-title" className="sr-only">
        예뻐졌다 웰니스 스튜디오 예약
      </h2>
      {/* 닫힌 상태: 위가 둥근 아치 모양으로 말려 있다가, 열리면 화면 가득 넓게 펼쳐진다 */}
      <figure
        className={`absolute inset-0 m-0 overflow-clip ${
          reduced
            ? '[clip-path:none] transition-none'
            : `transition-[clip-path] duration-[1.4s] ease-yw ${open ? '[clip-path:inset(0_round_0)]' : '[clip-path:inset(28%_14%_0_round_50vw_50vw_0_0)]'}`
        }`}
      >
        {/* 사진(너비 100%, 원본 비율). 틀보다 길면 스크롤에 맞춰 위로 옮긴다 */}
        <div
          ref={panRef}
          className={`absolute top-0 left-0 w-full will-change-transform [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:max-w-none ${
            reduced ? '[&_img]:scale-none [&_img]:transition-none' : `[&_img]:transition-[scale] [&_img]:duration-[1.6s] [&_img]:ease-yw ${open ? '[&_img]:scale-100' : '[&_img]:scale-108'}`
          }`}
        >
          <Pic pic={PICS.closing} sizes="100vw" alt="예뻐졌다 WELLNESS STUDIO 관리실" />
        </div>
      </figure>
      {/* 버튼 자리(아래쪽)만 어둡게 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(29_26_23/0.62),rgb(29_26_23/0.2)_38%,transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className={`absolute inset-x-0 bottom-[clamp(1.75rem,6vh,4rem)] z-1 flex flex-col items-center gap-[0.6rem] px-(--w-gutter) md:gap-[0.9rem] ${
          reduced
            ? 'pointer-events-auto translate-none opacity-100 transition-none'
            : open
              ? 'pointer-events-auto translate-y-0 opacity-100 [transition:opacity_0.6s_ease_0.9s,translate_0.8s_var(--yw-ease)_0.9s]'
              : 'pointer-events-none translate-y-4 opacity-0 [transition:opacity_0.6s_ease_0.1s,translate_0.8s_var(--yw-ease)_0.1s]'
        }`}
      >
        <button type="button" className={ROUND} data-magnet data-cursor="" onClick={() => scrollToId('booking')}>
          <span>예약하기</span>
        </button>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-0">
          <ParenLink href={BRANCHES.zai.booking} external tone="light">
            네이버 예약
          </ParenLink>
          <button type="button" className={SMALL} onClick={() => scrollToId('startup')}>
            창업·운영 상담 →
          </button>
        </div>
      </div>
    </section>
  )
}
