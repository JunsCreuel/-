import { useState } from 'react'
import { PHOTOS } from '../data'
import { Reveal } from '../ui'

const METHODS = [
  { no: '01', en: 'CONSULTATION', ko: '오늘의 고민을 듣습니다', text: '두피와 피부 상태, 신경 쓰이는 복부 라인, 무겁게 느껴지는 등과 하체. 오늘 집중하고 싶은 부위와 컨디션을 먼저 살핍니다.' },
  { no: '02', en: 'HEAT DOME', ko: '온열돔으로 따뜻하게', text: '명신메디칼 전신 온열돔에서 편안히 쉬어갑니다. 이용 중 상태와 불편함을 확인하며, 선택한 관리에 맞춰 온열 케어를 진행합니다.' },
  { no: '03', en: 'OUT CARE', ko: '고민 부위를 한 번 더', text: '온열돔 이용 후, 상담에서 확인한 고민 부위를 더욱 세심하게 관리합니다. 페이스 갈바닉·바디 갈바닉·웰스파를 부위와 프로그램에 맞춰 활용합니다.' },
  { no: '04', en: 'FINISH', ko: '마무리까지 세심하게', text: '관리 후 피부 상태와 편안함을 확인하고, 일상에서 이어갈 수 있는 관리 방법을 안내합니다.' },
]

// 브랜드 소개: 아치 프레임 인물 사진과 작은 사진, 큰 영문 제목. 4단계 설명은 "자세히 보기"로 펼친다.
export default function About() {
  const [open, setOpen] = useState(false)

  return (
    <section id="about" className="w-section w-about">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          About us
        </Reveal>

        <div className="w-about__stage">
          <Reveal mode="toggle" className="w-about__arch">
            <img src={PHOTOS.neck} alt="따뜻한 빛이 닿은 목선과 쇄골" width="735" height="1105" loading="lazy" decoding="async" />
          </Reveal>
          <Reveal mode="toggle" className="w-about__small">
            <img src={PHOTOS.leg} alt="다리를 부드럽게 쓸어 주는 손" width="720" height="1280" loading="lazy" decoding="async" />
          </Reveal>

          <div className="w-about__text">
            <Reveal as="h2" className="w-display">
              <span className="w-display__ko">예뻐졌다</span>
              Wellness
              <br />
              Studio
            </Reveal>
            <Reveal as="p" delay={80} className="w-about__line">
              온열이 몸을 준비시키고,
              <br />
              아웃케어가 완성합니다.
            </Reveal>
            <Reveal as="p" delay={120} className="w-about__lead">
              아웃케어는 온열돔 후 고민 부위를 한 번 더 돌보는 집중관리입니다. 따뜻한 휴식부터 섬세한 디바이스 케어까지, 나에게 맞는 하나의 흐름으로 이어집니다.
            </Reveal>
            <Reveal delay={160}>
              <button type="button" className="w-btn w-btn--arrow" aria-expanded={open} aria-controls="w-about-steps" onClick={() => setOpen((v) => !v)}>
                {open ? '닫기' : '자세히 보기'}
              </button>
            </Reveal>
          </div>
        </div>

        {open && (
          <div id="w-about-steps" className="w-about__steps">
            <div className="w-method__rows">
              {METHODS.map((m) => (
                <div key={m.no} className="w-method__row">
                  <p className="w-method__no">{m.no}</p>
                  <div>
                    <p className="w-method__en">{m.en}</p>
                    <h3 className="w-method__ko">{m.ko}</h3>
                  </div>
                  <p className="w-method__text">{m.text}</p>
                </div>
              ))}
            </div>
            <p className="w-method__note">온열돔 단독 이용도 가능합니다. 온열돔 포함 여부와 사용하는 디바이스는 프로그램에 따라 달라지며, 예약 전에 안내드립니다.</p>
          </div>
        )}
      </div>
    </section>
  )
}
