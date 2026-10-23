import { useEffect, useRef, useState } from 'react'
import { BRANCHES, OFFER_TERM, PICS, SALE_COUNT, SHOW_OFFER } from '../data'
import { ParenLink } from '../editorial'
import { prefersReducedMotion } from '../motion'
import { scrollToId } from '../scroll'
import './yw-hero.css'

// 메인 비주얼 — 사진·문구 슬라이드 3장(브랜드 / 국산 온열돔 / 첫 방문 이벤트)이 SLIDE_MS마다 자동으로 넘어간다.
// 아래 점 버튼으로 바로 고를 수 있고, 마우스를 올리거나 키보드 포커스가 들어오면, 또는 '멈춤'을 누르면 멈춘다.
// 모션 줄이기에서는 자동으로 넘어가지 않는다. 첫 화면은 큰 문구와 버튼 하나만 두고, 간편 상담은 예약 장(#booking-form)에서 받는다.

const SLIDE_MS = 5000

const SLIDES = [
  {
    id: 'brand',
    pic: PICS.heroWarm,
    picM: PICS.heroWarmM,
    eyebrow: '예뻐졌다가 쉼을 더해 만든 자매 브랜드',
    lines: ['오늘을 돌보는,', '웰니스 스튜디오.'],
  },
  {
    id: 'dome',
    pic: PICS.menuWarmup,
    eyebrow: '국산 명신메디칼 온열돔',
    lines: ['누워서 40분,', '따뜻하게 쉬어 가세요.'],
    to: 'equipment',
  },
  ...(SHOW_OFFER
    ? [
        {
          id: 'offer',
          pic: PICS.bizStill,
          eyebrow: OFFER_TERM,
          lines: ['첫 방문 고객', `${SALE_COUNT}개 관리 50%`],
          to: 'offer',
        },
      ]
    : []),
]

function SlidePicture({ slide, priority }) {
  const { pic, picM } = slide
  return (
    <picture>
      {picM && <source media="(max-width: 47.99rem), (max-aspect-ratio: 4/5)" srcSet={picM.srcSet} sizes="100vw" />}
      <img
        src={pic.src}
        srcSet={pic.srcSet}
        sizes="100vw"
        width={pic.width}
        height={pic.height}
        alt=""
        decoding="async"
        {...(priority ? { loading: 'eager', fetchPriority: 'high' } : { loading: 'lazy' })}
      />
    </picture>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [stopped, setStopped] = useState(false)
  const [held, setHeld] = useState(false)
  const [reduced] = useState(prefersReducedMotion)
  const running = !reduced && !stopped && !held && SLIDES.length > 1
  const slide = SLIDES[index]

  useEffect(() => {
    if (!running) return undefined
    const t = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS)
    return () => clearTimeout(t)
  }, [running, index])

  const holdOff = (e) => {
    if (e.type === 'blur' && heroRef.current?.contains(e.relatedTarget)) return
    setHeld(false)
  }

  return (
    <section
      id="top"
      ref={heroRef}
      className={`yw-section yw-hero${running ? '' : ' is-paused'}`}
      data-theme="dark"
      data-cursor-off
      style={{ '--slide-ms': `${SLIDE_MS}ms` }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && holdOff(e)}
      onFocus={(e) => e.target.matches?.(':focus-visible') && setHeld(true)}
      onBlur={holdOff}
    >
      <div className="yw-hero__media" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.id} className="yw-hero__layer yw-hero__full" data-active={i === index ? '' : undefined}>
            <SlidePicture slide={s} priority={i === 0} />
          </div>
        ))}
      </div>
      <div className="yw-hero__shade" aria-hidden="true" />

      <p className="yw-hero__mast">
        <span>WELLNESS STUDIO</span>
        <span className="yw-hero__mast-r">부산 · 용호 자이</span>
      </p>

      <div className="yw-wrap yw-hero__text">
        <div key={slide.id} className="yw-hero__slide" aria-live={running ? 'off' : 'polite'}>
          <p className="yw-hero__kicker">{slide.eyebrow}</p>
          <h1 className="yw-hero__title">
            {slide.lines[0]}
            <br />
            <em>{slide.lines[1]}</em>
          </h1>
        </div>

        {SLIDES.length > 1 && (
          <div className="yw-hero__dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="yw-hero__dot"
                aria-label={`${i + 1}번째 화면: ${s.eyebrow}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <i key={i === index ? `on-${index}` : 'off'} aria-hidden="true" />
              </button>
            ))}
            {!reduced && (
              <button
                type="button"
                className="yw-hero__pause"
                aria-pressed={stopped}
                aria-label={stopped ? '슬라이드 재생' : '슬라이드 멈춤'}
                onClick={() => setStopped((v) => !v)}
              >
                <span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span>
              </button>
            )}
          </div>
        )}

        <div className="yw-hero__actions">
          <button type="button" className="yw-btn yw-btn--cream yw-hero__cta" onClick={() => scrollToId('booking-form')}>
            <span>간편 상담 신청</span>
          </button>
          <ParenLink onClick={() => scrollToId(slide.to || 'programs')} tone="light">
            {slide.id === 'offer' ? '첫 방문 혜택 보기' : slide.id === 'dome' ? '온열돔 자세히 보기' : '관리 프로그램 보기'}
          </ParenLink>
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
