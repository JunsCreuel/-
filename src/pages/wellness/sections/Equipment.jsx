import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PHOTOS, PICS } from '../data'
import { Folio, Footnote } from '../editorial'
import './yw-equipment.css'

// 장비 소개 — 장비 이름 알약 탭 + (왼쪽) 배경 없는 장비 사진 무대 · (오른쪽) 브랜드·이름·한 줄 설명·정의 목록.
// 탭을 누르면 사진과 글이 함께 바뀐다(사진은 아래에서 올라오며 커지고, 글은 살짝 올라오며 나타난다).
// 키보드 ←→·Home·End로 탭을 옮긴다(role=tablist/tab/tabpanel). 주소에 ?eq=장비id(예: #/wellness?eq=wellspa)가 있으면 그 장비가 먼저 선택된다.
// 화장품·기기 광고 기준에 맞춰 방식·부위·이용 정보만 적고 효능은 쓰지 않는다.
// 온열돔: 명신메디칼(1998년 설립, 광주 원적외선 온열기 제조사) 국산 돔형 온열기. 출처는 제조사 인터뷰 기사.

const EQUIPMENT = [
  {
    id: 'dome',
    tab: '전신 온열돔',
    img: PICS.domeCut.src,
    srcSet: PICS.domeCut.srcSet,
    w: 1376,
    h: 747,
    alt: '전신 온열돔 장비',
    brand: 'MYUNGSHIN MEDICAL · KOREA',
    name: '전신 온열돔',
    one: '탄소 면상발열체로 몸 전체를 감싸는 국산 원적외선 온열기입니다. 편하게 누운 채 40분 쉬어 갑니다.',
    facts: [
      ['방식', '탄소 면상발열체 원적외선 온열, 전원부 발열을 줄인 설계'],
      ['관리 부위', '전신 · 단독 이용 또는 집중관리 전 웜업'],
      ['이런 분께', '몸이 쉽게 차가워지거나, 따뜻하게 쉬어 가고 싶은 분'],
    ],
  },
  {
    id: 'galvanic',
    tab: '페이스 갈바닉',
    img: PHOTOS.faceGalvanic,
    w: 900,
    h: 780,
    alt: '갈바닉 기기 본체와 교체형 헤드 3종',
    brand: 'NU SKIN ageLOC · USA',
    name: '페이스 갈바닉',
    one: '교체형 헤드와 전용 젤로 얼굴 피부를 관리하는 갈바닉 디바이스입니다.',
    facts: [
      ['방식', '갈바닉 미세 전류 + 기기 전용 젤'],
      ['관리 부위', '얼굴 · 교체형 헤드'],
      ['이런 분께', '얼굴 피부를 꼼꼼하게 관리받고 싶은 분'],
    ],
  },
  {
    id: 'wellspa',
    tab: '웰스파',
    img: PHOTOS.wellspa,
    w: 900,
    h: 726,
    alt: '웰스파 바디 디바이스 앞면과 헤드',
    brand: 'NU SKIN ageLOC · USA',
    name: '웰스파',
    one: '하체·팔뚝·복부처럼 넓은 부위를 전용 세럼과 젤로 관리하는 바디 디바이스입니다.',
    facts: [
      ['방식', '바디 디바이스 + 전용 세럼과 젤'],
      ['관리 부위', '하체 · 팔뚝 · 복부'],
      ['이런 분께', '바디 라인과 피부 컨디션이 신경 쓰이는 분'],
    ],
  },
]

const indexOf = (id) => Math.max(0, EQUIPMENT.findIndex((e) => e.id === id))

export default function Equipment() {
  const { search } = useLocation()
  const [active, setActive] = useState(() => indexOf(new URLSearchParams(search).get('eq')))
  const [seenSearch, setSeenSearch] = useState(search)
  const tabRefs = useRef([])

  // 주소의 ?eq=가 바뀌면(렌더 중에 비교해) 그 장비를 고른다
  if (search !== seenSearch) {
    setSeenSearch(search)
    const id = new URLSearchParams(search).get('eq')
    if (id) setActive(indexOf(id))
  }

  const select = (i, focus) => {
    setActive(i)
    if (focus) tabRefs.current[i]?.focus()
  }

  const onKeyDown = (e, i) => {
    const n = EQUIPMENT.length
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % n
    else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next < 0) return
    e.preventDefault()
    select(next, true)
  }

  const eq = EQUIPMENT[active]

  return (
    <section id="equipment" className="yw-section yw-eq" data-theme="light" aria-labelledby="eq-title">
      <div className="yw-wrap">
        <header className="yw-eq__head">
          <Folio ko="장비" />
          <h2 id="eq-title" className="yw-eq__title">
            국산 온열돔과
            <br />두 가지 디바이스
          </h2>
          <p className="yw-eq__lead">오일 대신 디바이스마다 맞춘 전용 젤을 사용합니다.</p>
        </header>

        <div className="yw-eq__tabs" role="tablist" aria-label="장비 선택">
          {EQUIPMENT.map((e, i) => (
            <button
              key={e.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`eq-tab-${e.id}`}
              className="yw-eq__tab"
              aria-selected={i === active}
              aria-controls="eq-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i, false)}
              onKeyDown={(ev) => onKeyDown(ev, i)}
            >
              {e.tab}
            </button>
          ))}
        </div>

        {/* key로 장비가 바뀔 때마다 새로 그려 등장 애니메이션을 다시 시작한다 */}
        <div key={eq.id} id="eq-panel" className="yw-eq__body" role="tabpanel" aria-labelledby={`eq-tab-${eq.id}`}>
          <div className="yw-eq__stage">
            <img src={eq.img} srcSet={eq.srcSet} sizes={eq.srcSet ? '(min-width: 56rem) 40vw, 80vw' : undefined} alt={eq.alt} width={eq.w} height={eq.h} loading="lazy" decoding="async" />
          </div>
          <div className="yw-eq__text">
            <p className="yw-eq__brand">{eq.brand}</p>
            <h3 className="yw-eq__name">{eq.name}</h3>
            <p className="yw-eq__one">{eq.one}</p>
            <dl className="yw-eq__facts">
              {eq.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <Footnote>
          온열돔은 명신메디칼의 국산 제품이고, 디바이스는 뉴스킨 제품과 기기별 전용 젤을 사용합니다. 구성은 프로그램에 따라 다르고 체감은 개인에
          따라 다를 수 있습니다. 기기 사진에는 이해를 돕기 위한 AI 생성 이미지가 포함되어 있습니다. NU SKIN, ageLOC은 Nu Skin Enterprises, Inc.의
          상표입니다. 100% 예약제 · 이용시간과 비용, 정기 이용 구성은 상담 시 안내합니다.
        </Footnote>
      </div>
    </section>
  )
}
