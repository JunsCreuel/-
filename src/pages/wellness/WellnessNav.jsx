import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { OPEN_BRANCHES, telHref } from './data'
import { onScrollFrame } from './motion'
import { goToMenu, lockPageScroll, scrollToId, scrollToTop } from './scroll'

// 상단 바: 왼쪽 로고, 가운데 주요 메뉴(넓은 화면), 오른쪽 상담 예약 버튼.
// 좁은 화면에서는 햄버거로 전체 메뉴 패널을 연다. bar: true인 항목만 상단 메뉴 줄에 나온다.
// 바로 아래에 있는 섹션의 data-theme('dark' | 'light')을 따라 header[data-theme]가 바뀐다(어두운 장 위에서는 크림 글자).
// 900px 이상에서 가운데 메뉴가 나오고 햄버거·패널·배경이 사라진다(열린 메뉴를 닫는 기준과 같다).

// 사진·짙은 장 위(data-theme='dark')에서는 크림 글자에 반투명 짙은 올리브 블러, 맨 위(스크롤 전)에서는 배경 없이 사진 위에 바로 놓인다
const HEADER =
  'group/nav fixed inset-x-0 top-0 z-50 border-b border-line bg-[color-mix(in_srgb,var(--w-bg)_94%,transparent)] backdrop-blur-[12px] transition-[box-shadow,color,background-color,border-color] duration-[0.3s,0.4s,0.4s,0.4s] ease-[ease] data-[theme=dark]:text-cream data-[theme=dark]:[--w-logo-mark:#fff] data-[theme=dark]:[--w-logo-text:#fff] data-[theme=dark]:[&>div_:focus-visible]:outline-cream motion-reduce:transition-none [&_[data-logo=nav]_svg]:transition-[color,background-color] [&_[data-logo=nav]_svg]:duration-400 [&_[data-logo=nav]_svg]:ease-[ease] motion-reduce:[&_[data-logo=nav]_svg]:transition-none [&_[data-logo=nav]_span]:transition-[color,background-color] [&_[data-logo=nav]_span]:duration-400 [&_[data-logo=nav]_span]:ease-[ease] motion-reduce:[&_[data-logo=nav]_span]:transition-none'
const HEADER_SCROLLED =
  'shadow-[0_2px_20px_color-mix(in_srgb,var(--w-ink)_10%,transparent)] data-[theme=dark]:border-[rgb(255_255_255/0.12)]'
const HEADER_TOP = 'data-[theme=dark]:border-transparent data-[theme=dark]:backdrop-filter-none'
// 메뉴 패널이 열리면 바 아래 패널과 이어지도록 조금 더 짙게
const DARK_BG = { open: 'data-[theme=dark]:bg-[rgb(46_50_38/0.92)]', scrolled: 'data-[theme=dark]:bg-[rgb(46_50_38/0.72)]', top: 'data-[theme=dark]:bg-transparent' }

// 가운데 메뉴 글자(마우스를 올리거나 지금 페이지면 밑줄)
const UNDERLINE = 'underline decoration-1 underline-offset-[0.45em]'
const BAR_BTN =
  'relative min-h-11 cursor-pointer border-0 bg-transparent px-0 py-[0.4rem] text-[0.93rem] font-medium text-inherit hover:text-accent-deep hover:underline hover:decoration-1 hover:underline-offset-[0.45em] group-data-[theme=dark]/nav:hover:text-champagne'
// 데스크톱 드롭다운: 메뉴에 올리거나 포커스가 들어오면 살짝 내려앉으며 나타난다
const DROP =
  'invisible absolute top-full left-1/2 z-5 m-0 grid min-w-[12.5rem] -translate-x-1/2 translate-y-[0.4rem] list-none rounded-2xl bg-white p-[0.65rem] text-ink opacity-0 shadow-[0_14px_34px_-14px_color-mix(in_srgb,var(--w-ink)_35%,transparent)] transition-[opacity,translate,visibility] duration-180 ease-[ease] group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100 motion-reduce:transition-none'
const DROP_BTN =
  'block w-full cursor-pointer rounded-[0.65rem] border-0 bg-transparent px-[0.9rem] py-[0.6rem] text-left text-[0.9rem] leading-[1.35] font-medium whitespace-nowrap text-ink no-underline hover:bg-ivory'
// 한글 이름 아래 작은 영문
const SUB_EN = 'mt-[0.15rem] block font-num text-[0.66rem] leading-[1.3] font-medium tracking-[0.14em] normal-nums text-muted'

// 휴대폰 패널: 큰 줄(번호 + 이름), 하위 메뉴는 그 아래 들여 쓴 두 칸(한글 + 작은 영문)
const PANEL_BTN =
  'flex w-full cursor-pointer items-baseline gap-[1.3rem] border-x-0 border-t-0 border-line bg-transparent px-0 py-[1.05rem] text-left text-[clamp(1.15rem,3vw,1.5rem)] text-inherit hover:underline hover:decoration-1 hover:underline-offset-[0.35em]'
const PANEL_SUB_BTN =
  'block min-h-11 cursor-pointer border-0 bg-transparent px-0 py-[0.35rem] text-left text-[0.95rem] leading-[1.35] text-[color-mix(in_srgb,var(--w-ink)_78%,#fff)] hover:underline hover:decoration-1 hover:underline-offset-[0.35em]'

const BURGER_LINE = 'h-[1.5px] w-6 bg-current transition-[transform,opacity] duration-[0.25s,0.2s] ease-[ease] motion-reduce:transition-none'

export default function WellnessNav({ branch, items }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef(null)
  const headerRef = useRef(null)
  const innerRef = useRef(null)
  const menuOpenRef = useRef(false)
  const themeRef = useRef(null)

  // 상단 바 바로 아래(가운데, 바 높이 + 2px) 요소가 속한 섹션의 테마를 읽어, 바뀔 때만 header에 쓴다. 메뉴가 열려 있으면 판정하지 않는다.
  const syncTheme = useCallback(() => {
    const header = headerRef.current
    if (!header || menuOpenRef.current) return
    const navH = innerRef.current?.offsetHeight || header.offsetHeight
    const hit = document.elementFromPoint(window.innerWidth / 2, navH + 2)
    const theme = hit?.closest('[data-theme]')?.dataset.theme || 'light'
    if (theme !== themeRef.current) {
      themeRef.current = theme
      header.dataset.theme = theme
    }
  }, [])

  useEffect(() => {
    let last = null
    return onScrollFrame(({ y }) => {
      const next = y > 8
      if (next !== last) {
        last = next
        setScrolled(next)
      }
      syncTheme()
    })
  }, [syncTheme])

  // 페이지를 옮기면(메인 ↔ 개인정보처리방침) 스크롤이 없어도 새 페이지 맨 위 섹션의 테마로 다시 맞춘다.
  const { pathname } = useLocation() // 페이지 이동 감지(테마 다시 판정, 지금 페이지 메뉴 표시)
  useEffect(() => {
    const raf = requestAnimationFrame(syncTheme)
    return () => cancelAnimationFrame(raf)
  }, [pathname, syncTheme])

  useEffect(() => {
    menuOpenRef.current = menuOpen
    if (!menuOpen) syncTheme()
  }, [menuOpen, syncTheme])

  useEffect(() => {
    if (!menuOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // 패널이 열린 동안 뒤 페이지 스크롤을 잠근다. 패널 안을 밀거나 패널 끝까지 내린 뒤 이어 밀어도 뒤 페이지가 움직이지 않고,
  // 닫으면 연 자리 그대로다(메뉴 항목의 scrollToId 이동은 잠금과 상관없이 된다).
  useEffect(() => {
    if (!menuOpen) return undefined
    return lockPageScroll()
  }, [menuOpen])

  // 열린 채 넓은 화면(900px 이상, 햄버거·패널·배경이 사라지는 기준)이 되면 메뉴를 닫는다.
  // 닫지 않으면 보이지 않는 메뉴가 열린 상태로 남아 헤더 테마 판정이 멈추고(어두운 장 위 흰 헤더) 닫을 수단도 없다.
  useEffect(() => {
    if (!menuOpen) return undefined
    const wide = window.matchMedia('(min-width: 900px)')
    const closeIfWide = () => {
      if (wide.matches) setMenuOpen(false)
    }
    closeIfWide()
    wide.addEventListener('change', closeIfWide)
    return () => wide.removeEventListener('change', closeIfWide)
  }, [menuOpen])

  function goTo(id) {
    setMenuOpen(false)
    scrollToId(id)
  }

  function goToItem(item) {
    setMenuOpen(false)
    // 하위 메뉴를 고르면 데스크톱 드롭다운이 바로 닫히게 포커스를 뺀다
    document.activeElement?.blur?.()
    goToMenu(item)
  }

  // 지금 보고 있는 하위 페이지의 메뉴
  const current = (item) => (item.page && item.page === pathname ? 'page' : undefined)

  // 오픈한 지점이 하나뿐이면 지점 선택은 보이지 않는다.
  const hasChoice = OPEN_BRANCHES.length > 1
  const barItems = items.some((i) => i.bar) ? items.filter((i) => i.bar) : items

  const darkBg = menuOpen ? DARK_BG.open : scrolled ? DARK_BG.scrolled : DARK_BG.top

  return (
    <>
      <header ref={headerRef} data-site-nav className={`${HEADER} ${scrolled ? HEADER_SCROLLED : HEADER_TOP} ${darkBg}`}>
        <div
          ref={innerRef}
          className="mx-auto grid h-(--w-nav-h) max-w-[1280px] grid-cols-[1fr_auto] items-center gap-4 px-(--w-gutter) min-[900px]:grid-cols-[1fr_auto_1fr] [@media(max-width:359px)]:gap-2"
        >
          <Link
            to={branch.path}
            className="flex min-h-11 items-center whitespace-nowrap [@media(max-width:359px)]:[&_[data-logo=nav]]:[--u:0.18px]"
            aria-label="WELLNESS STUDIO 예뻐졌다 처음으로"
            onClick={() => {
              setMenuOpen(false)
              scrollToTop()
            }}
          >
            <BrandLogo variant="nav" decorative />
          </Link>

          <nav
            className="hidden min-[900px]:flex min-[900px]:gap-[1.7rem] [@media(min-width:900px)_and_(max-width:1099px)]:gap-[1.15rem]"
            aria-label="주요 메뉴"
          >
            {barItems.map((item) => (
              <div key={item.id} className="group/item relative">
                <button
                  type="button"
                  className={`${BAR_BTN} ${current(item) ? UNDERLINE : ''}`}
                  aria-current={current(item)}
                  onClick={() => goToItem(item)}
                >
                  {item.label}
                </button>
                {item.children && (
                  <ul className={DROP}>
                    {item.children.map((c) => (
                      <li key={c.id}>
                        <button type="button" className={DROP_BTN} onClick={() => goToItem(c)}>
                          {c.label}
                          {c.en && (
                            <small lang="en" className={SUB_EN}>
                              {c.en}
                            </small>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-[0.4rem] justify-self-end">
            <button
              type="button"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-espresso bg-espresso px-[1.3rem] py-0 text-center [font-family:inherit] text-[0.88rem] leading-[1.3] font-semibold tracking-[0.04em] whitespace-nowrap text-white [transition:background-color_0.2s_ease,color_0.2s_ease,border-color_0.2s_ease,transform_0.2s_ease] focus-visible:rounded-[6px] [&:hover]:border-accent-deep [&:hover]:bg-accent-deep active:[transform:scale(0.98)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:[transform:translateY(-2px)] group-data-[theme=dark]/nav:border-cream group-data-[theme=dark]/nav:bg-cream group-data-[theme=dark]/nav:text-espresso group-data-[theme=dark]/nav:hover:border-white group-data-[theme=dark]/nav:hover:bg-white group-data-[theme=dark]/nav:hover:text-espresso [@media(min-width:360px)_and_(max-width:380px)]:px-[0.9rem] [@media(max-width:359px)]:px-3 [@media(max-width:359px)]:text-[0.82rem]"
              onClick={() => goTo('booking')}
            >
              상담 예약
            </button>
            <button
              ref={burgerRef}
              type="button"
              className="-mr-2 inline-flex size-11 flex-none cursor-pointer flex-col items-center justify-center gap-[6px] border-0 bg-transparent text-inherit min-[900px]:hidden"
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? 'w-nav-panel' : undefined}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden="true" className={`${BURGER_LINE} ${menuOpen ? '[transform:translateY(7.5px)_rotate(45deg)]' : ''}`} />
              <span aria-hidden="true" className={`${BURGER_LINE} ${menuOpen ? 'opacity-0' : ''}`} />
              <span aria-hidden="true" className={`${BURGER_LINE} ${menuOpen ? '[transform:translateY(-7.5px)_rotate(-45deg)]' : ''}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          // 좁은 폰에서 패널 끝까지 내린 뒤 이어지는 스크롤이 뒤 페이지로 넘어가지 않게 한다
          <nav
            id="w-nav-panel"
            className="max-h-[calc(100svh-var(--w-nav-h))] overflow-y-auto overscroll-contain border-t border-line bg-(--w-bg) text-ink min-[900px]:hidden"
            aria-label="전체 메뉴"
          >
            <div className="mx-auto max-w-[1280px] px-(--w-gutter) pt-[0.4rem] pb-[1.6rem]">
              {hasChoice && (
                <div className="flex gap-[1.4rem] pt-[0.9rem] pb-[0.4rem] text-[0.9rem]">
                  {OPEN_BRANCHES.map((b) => (
                    <Link
                      key={b.id}
                      to={b.path}
                      className="pb-[0.2rem] text-muted aria-[current=page]:border-b aria-[current=page]:border-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink"
                      aria-current={b.id === branch.id ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
              )}
              <div className="flex flex-col">
                {items.map((item, i) => (
                  <div key={item.id}>
                    <button
                      type="button"
                      className={`${PANEL_BTN} ${item.children ? 'border-b-0' : 'border-b'}`}
                      aria-current={current(item)}
                      onClick={() => goToItem(item)}
                    >
                      <span aria-hidden="true" className="min-w-[1.8rem] font-en text-[0.8rem] text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </button>
                    {item.children && (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-x-4 gap-y-[0.15rem] border-b border-line pt-0 pr-0 pb-[0.9rem] pl-[3.1rem]">
                        {item.children.map((c) => (
                          <button key={c.id} type="button" className={PANEL_SUB_BTN} onClick={() => goToItem(c)}>
                            {c.label}
                            {c.en && (
                              <small lang="en" className={SUB_EN}>
                                {c.en}
                              </small>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-[1.2rem] text-[0.88rem] text-muted">
                전화 예약{' '}
                <a href={telHref(branch.phone)} className="underline underline-offset-[0.25em]">
                  {branch.phone}
                </a>
                {branch.hours && ` · ${branch.hours}`}
              </p>
            </div>
          </nav>
        )}
      </header>
      {menuOpen && (
        // 열린 동안 뒤 페이지는 잠겨 있다. 배경에서 시작한 손짓도 스크롤로 쓰지 않는다
        <div
          className="fixed inset-0 z-49 touch-none bg-[color-mix(in_srgb,var(--w-ink)_30%,transparent)] min-[900px]:hidden"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
