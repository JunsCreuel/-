import { useRef, useState } from 'react'
import { BRANCHES, PICS, PROGRAMS } from '../data'
import { Folio, ParenLink, Pic, PriceLine, SplitLines } from '../editorial'
import { prefersReducedMotion, useInView } from '../motion'
import { pickForBooking } from '../scroll'
import { BTN_INK, CURTAIN, DARK, H2, SECTION } from '../tw'

// No. 03 Today's Condition — 부위 사진 타일을 고르면 어울리는 관리가 추천 카드로 바뀌고,
// 그 관리로 상담 예약(w:pick → 예약 장 1단계 미리 선택)까지 이어진다.
// 타일 묶음은 radiogroup + roving tabindex(방향키·Home/End로 이동과 동시에 선택)다.
// 데스크톱(64rem 이상)에서는 카드가 sticky로 따라오고, 모바일에서는 타일을 탭하면 카드가 보이도록 내려 준다.

// area는 상담 폼 '신경 쓰이는 곳'(data.js AREAS) 값과 정확히 같아야 한다. picks는 추천 순서(PROGRAMS id)다.
const CONDITIONS = [
  { id: 'scalp', label: '두피', sub: '두피가 답답한 날', pic: PICS.condScalp, area: '두피 · 얼굴', picks: ['scalp-detox', 'scalp-face'] },
  { id: 'face', label: '얼굴', sub: '얼굴빛이 흐린 날', pic: PICS.condFace, area: '두피 · 얼굴', picks: ['scalp-face', 'scalp-detox'] },
  { id: 'neck', label: '목·어깨', sub: '목선이 신경 쓰이는 날', pic: PICS.condNeck, area: '등 · 어깨', picks: ['lymph-node', 'back-lymph'] },
  { id: 'back', label: '등', sub: '오래 앉아 있던 날', pic: PICS.condBack, area: '등 · 어깨', picks: ['back-lymph', 'full-back'] },
  { id: 'abdomen', label: '복부', sub: '복부 라인이 신경 쓰이는 날', pic: PICS.condAbdomen, area: '복부', picks: ['abdomen', 'warmup'] },
  { id: 'leg', label: '다리', sub: '다리가 무겁게 느껴지는 날', pic: PICS.condLeg, area: '하체 · 림프', picks: ['lower', 'full-back'] },
  { id: 'rest', label: '온열돔 관리', sub: '그냥 따뜻하게 쉬고 싶은 날', pic: PICS.condRest, area: '온열 웜업', wide: true, picks: ['warmup', 'scalp-detox'] },
]

// 부위에 어울리는 관리(picks 순서대로 추천 → 함께 보면 좋은 관리).
function recommend(cond) {
  return cond.picks.map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean)
}

// 방향키 → 이전(-1)/다음(+1)
const KEY_STEP = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }

// 부위 타일: 흑백에 가까운 사진, 아래쪽만 어둡게 해 이름이 읽힌다. 고르면 색이 돌아오고 커지며 샴페인 고리와 체크 원이 붙는다.
// 화면에 들어오면 타일이 아래에서부터 차례로 열린다(끝나면 clip-path를 남기지 않아 고리·포커스가 잘리지 않는다)
const TILE =
  "group/tile relative isolate m-0 flex aspect-[4/5] min-w-0 cursor-pointer flex-col justify-end overflow-clip rounded-[1.25rem] border-0 bg-[#1d1a17] p-3 text-left [font:inherit] text-cream outline-2 outline-offset-3 outline-transparent [-webkit-tap-highlight-color:transparent] [transition:opacity_0.4s_ease,outline-color_0.3s_ease] before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:bg-[linear-gradient(to_top,rgb(29_26_23/0.78),transparent_60%)] before:content-[''] focus-visible:outline-cream aria-checked:outline-champagne aria-checked:focus-visible:outline-cream motion-reduce:transition-none sm:p-[0.9rem] lg:p-4"
const TILE_IMG =
  'absolute inset-0 -z-2 size-full max-w-none object-cover [filter:grayscale(0.55)_brightness(0.78)] [transition:filter_0.3s_ease,transform_0.3s_var(--yw-ease)] group-aria-checked/tile:[filter:none] motion-safe:group-aria-checked/tile:[transform:scale(1.04)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/tile:[filter:none] [@media(hover:hover)_and_(pointer:fine)]:motion-safe:group-hover/tile:[transform:scale(1.04)]'

// 체크 원: 고르면 오른쪽 위에서 커진다
function Check() {
  return (
    <i
      className="absolute top-[0.6rem] right-[0.6rem] grid size-7 scale-0 place-items-center rounded-[50%] bg-champagne text-espresso transition-[scale] duration-200 ease-yw group-aria-checked/tile:scale-100 motion-reduce:transition-none lg:top-[0.8rem] lg:right-[0.8rem] lg:size-8"
      aria-hidden="true"
    >
      <svg className="size-[62%] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.6]" viewBox="0 0 24 24" focusable="false">
        <polyline points="5.5 12.5 10 17 18.5 7.5" />
      </svg>
    </i>
  )
}

export default function Condition() {
  const [condId, setCondId] = useState('scalp')
  const [showAlt, setShowAlt] = useState(false)
  const tileRefs = useRef([])
  const tilesRef = useRef(null)
  const cardRef = useRef(null)
  const tilesIn = useInView(tilesRef, { threshold: 0.2 })

  const cond = CONDITIONS.find((c) => c.id === condId) || null
  const [top, alt] = cond ? recommend(cond) : []
  const shown = showAlt && alt ? alt : top
  const other = shown === top ? alt : top
  const eyebrow = shown && shown !== top ? '함께 보면 좋은 관리' : '추천 관리'
  const focusIndex = cond ? CONDITIONS.indexOf(cond) : 0

  const select = (id) => {
    setCondId(id)
    setShowAlt(false)
  }

  // 모바일(1열)에서 카드가 화면 아래쪽에 있으면 카드 윗부분이 보이도록 내려 준다.
  const revealCard = () => {
    requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card || window.matchMedia('(min-width: 64rem)').matches) return
      if (card.getBoundingClientRect().top > window.innerHeight * 0.72) {
        card.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
    })
  }

  const onTileClick = (id) => {
    select(id)
    revealCard()
  }

  const onTilesKeyDown = (e) => {
    const n = CONDITIONS.length
    const cur = tileRefs.current.indexOf(e.target.closest('[role="radio"]'))
    if (cur < 0) return
    let next
    if (e.key in KEY_STEP) next = (cur + KEY_STEP[e.key] + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    else return
    e.preventDefault()
    select(CONDITIONS[next].id)
    tileRefs.current[next]?.focus()
  }

  return (
    <section id="concern" className={`${SECTION} ${DARK} ${CURTAIN} overflow-clip`} data-theme="dark" data-curtain>
      <div className="mx-auto w-full max-w-(--yw-max)">
        <Folio ko="부위별 추천" tone="light" />
        {/* 좁은 화면에서 제목 줄이 한 글자만 남지 않게 고르게 나눈다 */}
        <SplitLines
          as="h2"
          id="cond-title"
          className={`${H2} [&>span>span]:text-balance`}
          lines={['오늘, 가장 신경 쓰이는 곳은 ', '어디인가요?']}
        />

        <div className="mt-[clamp(2rem,5vw,3.5rem)] grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-[minmax(0,7fr)_minmax(20rem,5fr)] lg:items-start">
          <div className="min-w-0">
            {/* 태블릿부터는 3열(2열이면 타일이 화면보다 커진다). 마우스 기기에서는 올린 사진만 색이 돌아오고 나머지는 45%로 물러난다 */}
            <div
              ref={tilesRef}
              className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 [@media(hover:hover)_and_(pointer:fine)]:[&:has(>button:hover)>button:not(:hover):not([aria-checked=true])]:opacity-45`}
              role="radiogroup"
              aria-labelledby="cond-title"
              onKeyDown={onTilesKeyDown}
            >
              {CONDITIONS.map((c, i) => {
                const on = c.id === condId
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tileRefs.current[i] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={i === focusIndex ? 0 : -1}
                    className={`${TILE} ${c.wide ? 'col-span-full aspect-[16/7] sm:aspect-[21/6]' : ''} ${
                      tilesIn ? 'motion-safe:animate-cond-tile-in' : 'motion-safe:[clip-path:inset(100%_0_0_0_round_1.25rem)]'
                    }`}
                    style={{ '--i': i }}
                    data-cursor=""
                    onClick={() => onTileClick(c.id)}
                  >
                    <Pic
                      pic={c.pic}
                      sizes={c.wide ? '(min-width: 64rem) 45vw, 92vw' : '(min-width: 64rem) 20vw, 45vw'}
                      className={`${TILE_IMG} ${c.wide ? 'object-[50%_55%]' : ''} ${tilesIn ? 'motion-safe:animate-cond-tile-zoom' : ''}`}
                    />
                    <span className="block font-serif text-[1.05rem] leading-[1.3] tracking-[-0.01em] sm:text-[1.2rem] lg:text-[1.35rem]">{c.label}</span>
                    <span className="mt-[0.2rem] block text-[0.75rem] leading-[1.45] opacity-85 sm:text-[0.78rem] lg:text-[0.82rem]">{c.sub}</span>
                    <Check />
                  </button>
                )
              })}
            </div>

          </div>

          {/* 추천 카드: 데스크톱에서는 sticky로 따라오고, 태블릿(1열 배치)에서는 가로로 눕혀 사진 왼쪽, 글 오른쪽에 둔다.
              휴대폰에서는 아래 고정 바에 가리지 않게 스크롤 여백을 둔다 */}
          <aside
            ref={cardRef}
            className={`relative min-w-0 scroll-mt-[calc(var(--w-nav-h)_+_1rem)] scroll-mb-4 rounded-3xl max-md:scroll-mb-[5.5rem] lg:sticky lg:top-[calc(var(--w-nav-h)_+_2rem)] [&_:focus-visible]:outline-espresso ${
              shown
                ? 'bg-ivory p-[clamp(1.1rem,4vw,1.5rem)] text-ink sm:max-lg:grid sm:max-lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:max-lg:grid-rows-[auto_auto_auto_1fr] sm:max-lg:items-start sm:max-lg:gap-x-[clamp(1.25rem,3vw,2rem)] sm:max-lg:[&>:not(figure)]:col-start-2'
                : 'border border-dashed border-[rgb(241_243_228/0.38)] bg-transparent px-5 py-4 text-cream'
            }`}
            aria-label="추천 관리"
          >
            {shown ? (
              <>
                {/* 사진: 바뀔 때마다 오른쪽에서 왼쪽으로 와이프되며 살짝 줄어든다. 낮은 데스크톱 화면에서는 카드가 화면 안에 들어오도록 사진을 낮춘다 */}
                <figure
                  key={`photo-${shown.id}`}
                  className="m-0 aspect-[16/10] animate-cond-wipe overflow-clip rounded-2xl bg-[color-mix(in_srgb,var(--w-champagne)_35%,var(--yw-ivory))] motion-reduce:animate-none sm:max-lg:col-start-1 sm:max-lg:row-[1/-1] sm:max-lg:aspect-[4/5] [@media(min-width:64rem)_and_(max-height:48rem)]:aspect-[2/1] [@media(min-width:64rem)_and_(min-height:58.01rem)]:aspect-[4/3]"
                >
                  <Pic
                    pic={PICS[shown.pic]}
                    sizes="(min-width: 64rem) 28vw, 90vw"
                    className="size-full max-w-none animate-cond-settle object-cover motion-reduce:animate-none"
                  />
                </figure>
                <p className="mt-[1.1rem] text-[0.75rem] font-semibold tracking-[0.14em] text-accent-deep sm:max-lg:mt-1">{eyebrow}</p>
                {/* 이름·과정·가격: 바뀔 때마다 짧게 올라온다 */}
                <div key={`info-${shown.id}`} className="animate-cond-rise motion-reduce:animate-none">
                  <p className="mt-[0.35rem] font-label text-[0.78rem] tracking-[0.04em] text-muted">
                    {shown.group} · {shown.time}
                  </p>
                  <h3 className="mx-0 mt-[0.2rem] mb-0 font-serif text-[clamp(1.35rem,1.1rem_+_1vw,1.6rem)] leading-[1.35] font-normal tracking-[-0.02em] break-keep">
                    {shown.label}
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-[1.65] text-muted">{shown.note}</p>
                  {/* 아이보리 카드 위라 짙은 장의 샴페인·크림 대신 밝은 면의 색으로 되돌린다 */}
                  <PriceLine program={shown} inline={false} className="mt-[0.85rem] text-[1.05rem]" />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 max-lg:flex-col max-lg:items-stretch">
                  <button
                    type="button"
                    className={`${BTN_INK} max-lg:w-full`}
                    data-magnet
                    onClick={() => pickForBooking({ area: cond.area, programId: shown.id, label: shown.label })}
                  >
                    <span>이 관리로 상담 예약</span>
                  </button>
                  <ParenLink href={BRANCHES.zai.booking} external tone="ink" className="max-lg:justify-center">
                    네이버 예약
                  </ParenLink>
                </div>
                {/* 함께 보면 좋은 관리 ↔ 추천 관리 */}
                {other && (
                  <button
                    type="button"
                    className="group/alt mt-4 flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 border-x-0 border-t border-b-0 border-line bg-transparent px-0 pt-[0.85rem] pb-0 text-left [font-family:inherit] text-[0.88rem] leading-[1.5] text-ink focus-visible:rounded-lg"
                    onClick={() => setShowAlt((v) => !v)}
                  >
                    <span className={`underline decoration-transparent underline-offset-[0.3em] transition-[text-decoration-color] duration-300 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/alt:decoration-current`}>
                      {shown === top ? '함께 보면 좋은 관리' : '추천 관리'} · {other.label}
                    </span>
                    <i className={`flex-none text-accent-deep not-italic transition-[translate] duration-400 ease-yw motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/alt:translate-x-[0.3rem]`} aria-hidden="true">
                      →
                    </i>
                  </button>
                )}
              </>
            ) : (
              // 고르기 전: 카드가 들어올 자리만 점선으로 비워 둔다
              <div className="flex min-h-24 items-center justify-center gap-4 text-[0.92rem] leading-[1.6] lg:min-h-56 lg:flex-col lg:text-center">
                <span className="size-5 flex-none rounded-[50%] bg-cream" aria-hidden="true" />
                <p className="max-w-[22em] text-balance text-[color-mix(in_srgb,var(--yw-cream)_82%,transparent)]">부위를 고르면 어울리는 관리를 보여 드립니다.</p>
              </div>
            )}
            <p className="sr-only" aria-live="polite">
              {shown ? `${cond.label} ${eyebrow} · ${shown.label}` : ''}
            </p>
          </aside>
        </div>

      </div>
    </section>
  )
}
