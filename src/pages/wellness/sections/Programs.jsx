import { useRef, useState } from 'react'
import { PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

// 사진이 주인공인 프로그램 카드. 카드에는 제목과 태그만 보이고, 설명은 + 버튼을 누르면 펼쳐진다.
const CARDS = [
  {
    en: 'SCALP REFRESH',
    title: '두피 리프레시',
    short: '답답하게 느껴지는 두피를 세심하게 돌보는, 나를 위한 휴식 시간.',
    more: '두피 상태와 고민을 상담해 관리 방향을 정합니다.',
    tags: ['두피 집중', '편안한 휴식'],
    photo: { src: PHOTOS.scalp, alt: '두피 관리를 받는 모습', width: 236, height: 354, position: 'center 30%' },
  },
  {
    en: 'FACE CONDITIONING',
    title: '페이스 컨디셔닝',
    short: '피부 상태에 맞춘 제품과 페이스 갈바닉으로 진행하는 섬세한 얼굴 관리.',
    more: '건조함과 피부 컨디션 등 오늘의 고민을 함께 살핍니다.',
    tags: ['얼굴 집중', '페이스 갈바닉'],
    photo: { src: PHOTOS.moodFace, alt: '얼굴 관리를 받는 모습', width: 754, height: 668, position: '40% 40%' },
  },
  {
    en: 'ABDOMEN CARE',
    title: '복부 슬리밍 케어',
    short: '복부 라인이 고민인 분을 위한 온열돔과 복부 집중 아웃케어.',
    more: '바디 디바이스와 전용 제품을 활용해 신경 쓰이는 부위를 세심하게 관리합니다.',
    tags: ['온열돔 + 복부', '바디 디바이스'],
    photo: { src: PHOTOS.candleLeg, alt: '바디 케어 관리 장면', width: 736, height: 1308, position: 'center 45%' },
  },
  {
    en: 'INTENSIVE FULL BODY',
    title: '전신 밸런스 케어',
    short: '등·복부·하체 등 여러 부위의 고민을 함께 살피는 전신 맞춤 관리.',
    more: '온열돔 후 필요한 부위에 집중하는 아웃케어로 이어집니다.',
    tags: ['등 · 어깨', '복부', '하체', '전신'],
    photo: { src: PHOTOS.back, alt: '등 부위 집중관리 모습', width: 736, height: 986, position: 'center 40%' },
  },
]

export default function Programs() {
  const trackRef = useRef(null)
  const [openIdx, setOpenIdx] = useState(null)

  function slide(dir) {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.w-pc')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="programs" className="w-section w-programs-sec">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Signature &amp; Total Care
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          두피부터 얼굴, 복부까지.
          <br />
          나의 고민에서 시작하는 관리.
        </Reveal>
        <p className="w-lead">세 가지 시그니처부터 여러 부위를 함께 돌보는 전신 집중관리까지, 필요한 케어를 선택하세요.</p>

        <div className="w-pc-wrap">
          <button type="button" className="w-pc-arrow w-pc-arrow--prev" aria-label="이전 프로그램" onClick={() => slide(-1)}>
            ‹
          </button>
          <div className="w-pc-track" ref={trackRef} role="list">
            {CARDS.map((c, i) => {
              const open = openIdx === i
              return (
                <article key={c.title} className={`w-pc${open ? ' is-open' : ''}`} role="listitem">
                  <img src={c.photo.src} alt={c.photo.alt} width={c.photo.width} height={c.photo.height} loading="eager" decoding="async" style={{ objectPosition: c.photo.position }} />
                  <div className="w-pc__body">
                    <p className="w-pc__en">{c.en}</p>
                    <h3>{c.title}</h3>
                    <ul className="w-tags">
                      {c.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="w-pc__toggle"
                    aria-expanded={open}
                    aria-controls={`w-pc-detail-${i}`}
                    aria-label={`${c.title} ${open ? '설명 닫기' : '자세히 보기'}`}
                    onClick={() => setOpenIdx(open ? null : i)}
                  >
                    +
                  </button>
                  <div className="w-pc__detail" id={`w-pc-detail-${i}`}>
                    <p className="w-pc__en">{c.en}</p>
                    <h3>{c.title}</h3>
                    <p>
                      {c.short} {c.more}
                    </p>
                    <button type="button" className="w-btn w-btn--light w-btn--sm" onClick={() => scrollToId('booking')}>
                      {c.title} 상담
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <button type="button" className="w-pc-arrow w-pc-arrow--next" aria-label="다음 프로그램" onClick={() => slide(1)}>
            ›
          </button>
        </div>

        <p className="w-method__note">관리 부위와 구성에 따라 소요시간과 비용이 달라집니다. 온열돔 포함 여부와 함께 예약 전에 안내드립니다.</p>
      </div>
    </section>
  )
}
