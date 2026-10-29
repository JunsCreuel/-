import { useEffect, useRef, useState } from 'react'
import { EVENT_POPUPS, PICS, SHOW_POPUPS } from './data'
import { Pic } from './editorial'
import { scrollToId } from './scroll'

// 첫 화면 이벤트 팝업. 데스크톱(48rem 이상)은 나란히, 휴대폰은 한 장씩(점 버튼·다음으로 넘김) 보인다.
// '24시간 동안 다시 보지 않기'는 그 팝업만 이 브라우저에서 24시간 숨긴다(localStorage). '닫기'는 이번 방문 동안만 닫는다.
// 모두 닫히면 사라지고, Esc나 바깥(어두운 바탕)을 누르면 한꺼번에 닫힌다.

const DAY = 24 * 60 * 60 * 1000
const keyOf = (id) => `yw-popup-hide:${id}`

function hiddenUntil(id) {
  try {
    return Number(localStorage.getItem(keyOf(id))) || 0
  } catch {
    return 0
  }
}

function hideForDay(id) {
  try {
    localStorage.setItem(keyOf(id), String(Date.now() + DAY))
  } catch {
    // 저장소를 쓸 수 없으면 이번 방문 동안만 닫힌다
  }
}

function activePopups() {
  const now = Date.now()
  const d = new Date() // 방문자 기기 시간 기준 날짜(한국은 KST)
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return EVENT_POPUPS.filter((p) => (!p.until || today <= p.until) && hiddenUntil(p.id) < now)
}

export default function EventPopups() {
  const [list, setList] = useState(() => (SHOW_POPUPS ? activePopups() : []))
  const [index, setIndex] = useState(0) // 휴대폰에서 보이는 팝업
  const boxRef = useRef(null)

  const closeAll = () => setList([])
  const close = (id) => {
    setList((l) => l.filter((p) => p.id !== id))
    setIndex(0)
  }

  useEffect(() => {
    if (!list.length) return undefined
    const onKey = (e) => e.key === 'Escape' && closeAll()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [list.length])

  // 열릴 때 팝업 상자로 포커스를 옮긴다(화면 읽기·키보드 사용자가 팝업을 바로 알 수 있게, 첫 버튼에 링이 생기지 않게).
  useEffect(() => {
    if (list.length) boxRef.current?.focus({ preventScroll: true })
  }, [list.length])

  if (!list.length) return null
  const cur = Math.min(index, list.length - 1)

  return (
    <div
      data-event-popups
      className="fixed inset-0 z-200 grid animate-pop-fade place-items-center overflow-y-auto bg-[rgb(29_26_23/0.55)] p-4 motion-reduce:animate-none [&_:focus-visible:not([role=dialog])]:outline-2 [&_:focus-visible:not([role=dialog])]:-outline-offset-2 [&_:focus-visible:not([role=dialog])]:outline-champagne"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && closeAll()}
    >
      <div
        ref={boxRef}
        className="w-[min(100%,22rem)] outline-none md:w-auto"
        role="dialog"
        aria-modal="true"
        aria-label="이벤트 안내"
        tabIndex={-1}
      >
        <div className="grid md:auto-cols-[20rem] md:grid-flow-col md:items-start md:gap-4">
          {list.map((p, i) => (
            <article
              key={p.id}
              className="hidden animate-pop-rise overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-20px_rgb(29_26_23/0.6)] [grid-area:1/1] data-current:block motion-reduce:animate-none md:block md:[grid-area:auto]"
              data-current={i === cur ? '' : undefined}
            >
              <button
                type="button"
                className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left [font-family:inherit] [font-size:inherit] [font-weight:inherit] [line-height:inherit] text-ink"
                onClick={() => {
                  closeAll()
                  scrollToId(p.to)
                }}
              >
                <span
                  className={`block overflow-hidden [&_img]:h-full [&_img]:w-full [&_img]:max-w-none ${
                    p.cut
                      ? 'aspect-[4/3] bg-ivory px-5 py-6 [&_img]:object-contain [&_img]:drop-shadow-[0_14px_18px_rgb(29_26_23/0.18)]'
                      : 'aspect-square [&_img]:object-cover'
                  }`}
                >
                  <Pic pic={PICS[p.pic]} sizes="(min-width: 48rem) 20rem, 88vw" loading="eager" />
                </span>
                {p.art ? (
                  <span className="sr-only">
                    {p.eyebrow}, {p.title}. {p.text}. {p.cta}
                  </span>
                ) : (
                  <span className="grid gap-[0.35rem] px-[1.2rem] pt-[1.1rem] pb-5">
                    <span className="text-[0.85rem] font-semibold text-accent-deep">{p.eyebrow}</span>
                    <strong className="font-serif text-[1.6rem] leading-[1.25] font-medium tracking-[-0.02em]">{p.title}</strong>
                    <span className="text-[0.85rem] leading-[1.6] break-keep text-muted">{p.text}</span>
                    <span className="mt-[0.4rem] text-[0.9rem] font-semibold underline underline-offset-[0.25em]">{p.cta} →</span>
                  </span>
                )}
                {p.note && <span className="block px-[0.9rem] py-[0.6rem] text-[0.72rem] leading-[1.5] break-keep text-muted">{p.note}</span>}
              </button>
              <div className="flex border-t border-line bg-espresso [&_button]:min-h-[2.9rem] [&_button]:flex-1 [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3 [&_button]:py-0 [&_button]:[font-family:inherit] [&_button]:text-[0.82rem] [&_button]:[font-weight:inherit] [&_button]:[line-height:inherit] [&_button]:text-cream [&_button+button]:flex-none [&_button+button]:border-l [&_button+button]:border-l-[rgb(241_243_228/0.2)]">
                <button
                  type="button"
                  onClick={() => {
                    hideForDay(p.id)
                    close(p.id)
                  }}
                >
                  24시간 동안 다시 보지 않기
                </button>
                <button type="button" onClick={() => close(p.id)}>
                  닫기
                </button>
              </div>
            </article>
          ))}
        </div>

        {list.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1 md:hidden">
            {list.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="grid size-11 cursor-pointer place-items-center border-0 bg-transparent p-0"
                aria-label={`${i + 1}번째 이벤트: ${p.title}`}
                aria-current={i === cur ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <i className={`size-2 rounded-full ${i === cur ? 'bg-cream' : 'bg-[rgb(241_243_228/0.5)]'}`} aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="min-h-11 cursor-pointer border-0 bg-transparent px-3 py-0 [font-family:inherit] [font-size:inherit] [font-weight:inherit] [line-height:inherit] text-[0.88rem] text-cream underline underline-offset-[0.25em]" onClick={() => setIndex((cur + 1) % list.length)}>
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
