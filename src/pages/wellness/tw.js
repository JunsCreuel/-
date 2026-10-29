// 여러 장이 함께 쓰는 Tailwind 클래스 묶음.
// 쓰는 쪽에서 같은 속성을 다른 값으로 덮어야 하면 묶음을 통째로 쓰지 말고 필요한 조각만 골라 쓴다
// (같은 속성의 유틸리티 두 개는 어느 쪽이 이길지 정해져 있지 않다).

// 장: 위아래 여백과 좌우 여백, 상단 바 아래에 제목이 보이도록 스크롤 여백
export const SECTION = 'relative scroll-mt-(--w-nav-h) px-(--w-gutter) py-(--yw-pad)'

// 내용 폭
export const WRAP = 'mx-auto w-full max-w-(--yw-max)'

// 어두운 장: 크림 글자, 포커스 링도 크림(안쪽에서 따로 정한 포커스 색이 이기도록 :where로 낮춘다)
export const DARK = 'bg-espresso text-cream [&_:where(:focus-visible)]:outline-cream'

// 커튼: 어두운 장이 둥근 윗모서리로 앞 장을 덮으며 올라오고(CURTAIN), 뒤따르는 밝은 장이 다시 덮는다(CURTAIN_LIGHT, 바탕은 쓰는 쪽에서).
// data-curtain을 함께 달면 바로 앞의 페이지 머리(PageHead)가 겹침을 풀어 준다.
export const CURTAIN = 'z-1 -mt-(--yw-r) rounded-t-(--yw-r)'
export const CURTAIN_LIGHT = 'relative z-2 -mt-(--yw-r) rounded-t-(--yw-r)'

// 장 제목(크기는 따로: 크기를 바꾸는 장은 H2_TYPE에 자기 크기를 붙인다)
export const H2_TYPE = 'font-serif leading-[1.3] font-normal tracking-[-0.02em] break-keep normal-nums'
export const H2 = `${H2_TYPE} text-[clamp(1.9rem,3.6vw,3.2rem)]`

// 제목 아래 한 줄
export const LEAD = 'mt-4 max-w-[34ch] text-muted'

// 알약 버튼. 데스크톱 커서 쪽으로 끌려오는 자석(--mgx/--mgy, CursorLayer)과 안쪽 글자의 절반 이동을 함께 둔다.
// 공통 포커스 링(둥근 6px)은 원래 모양대로 알약을 덮는다. 높이·줄바꿈을 따로 정하는 곳은 BTN_CORE에 톤을 붙여 쓴다.
export const BTN_CORE =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 p-[0.7rem_1.9rem] text-center [font-family:inherit] text-[0.97rem] leading-[1.3] font-semibold tracking-[0.02em] no-underline [transform:translate3d(var(--mgx,0px),var(--mgy,0px),0)] [transition:transform_0.55s_cubic-bezier(0.2,0.8,0.2,1),background-color_0.25s_ease,color_0.25s_ease,border-color_0.25s_ease] focus-visible:rounded-[6px] active:scale-97 motion-reduce:[transform:none] motion-reduce:transition-none [&>span]:inline-block [&>span]:[transform:translate3d(calc(var(--mgx,0px)_*_0.5),calc(var(--mgy,0px)_*_0.5),0)] [&>span]:transition-transform [&>span]:duration-550 [&>span]:ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:[&>span]:[transform:none] motion-reduce:[&>span]:transition-none'
// 테두리만(올리면 채워진다) · 짙은 채움 · 크림 채움(어두운 장 위)
export const TONE_OUTLINE =
  'border-espresso bg-transparent text-espresso [@media(hover:hover)_and_(pointer:fine)]:hover:bg-espresso [@media(hover:hover)_and_(pointer:fine)]:hover:text-white'
export const TONE_INK =
  'border-espresso bg-espresso text-white [@media(hover:hover)_and_(pointer:fine)]:hover:border-accent-deep [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-deep'
export const TONE_CREAM =
  'border-cream bg-cream text-espresso [@media(hover:hover)_and_(pointer:fine)]:hover:border-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white'
export const BTN = `${BTN_CORE} min-h-[3.25rem] whitespace-nowrap ${TONE_OUTLINE}`
export const BTN_INK = `${BTN_CORE} min-h-[3.25rem] whitespace-nowrap ${TONE_INK}`
export const BTN_CREAM = `${BTN_CORE} min-h-[3.25rem] whitespace-nowrap ${TONE_CREAM}`
