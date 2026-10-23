import { useEffect, useRef, useState } from 'react'
import { EVENT_POPUPS, PICS, SHOW_POPUPS } from './data'
import { Pic } from './editorial'
import { scrollToId } from './scroll'
import './wellness-popups.css'

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
    <div className="yw-pop" role="presentation" onClick={(e) => e.target === e.currentTarget && closeAll()}>
      <div ref={boxRef} className="yw-pop__box" role="dialog" aria-modal="true" aria-label="이벤트 안내" tabIndex={-1}>
        <div className="yw-pop__list">
          {list.map((p, i) => (
            <article key={p.id} className="yw-pop__card" data-current={i === cur ? '' : undefined}>
              <button
                type="button"
                className="yw-pop__body"
                onClick={() => {
                  closeAll()
                  scrollToId(p.to)
                }}
              >
                <span className="yw-pop__photo">
                  <Pic pic={PICS[p.pic]} sizes="(min-width: 48rem) 20rem, 88vw" loading="eager" />
                </span>
                <span className="sr-only">
                  {p.eyebrow}, {p.title}. {p.text}. {p.cta}
                </span>
                {p.note && <span className="yw-pop__note">{p.note}</span>}
              </button>
              <div className="yw-pop__foot">
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
          <div className="yw-pop__nav">
            {list.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="yw-pop__dot"
                aria-label={`${i + 1}번째 이벤트: ${p.title}`}
                aria-current={i === cur ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <i aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="yw-pop__next" onClick={() => setIndex((cur + 1) % list.length)}>
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
