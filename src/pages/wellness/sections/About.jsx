import { useState } from 'react'
import { PHOTOS } from '../data'
import { Reveal } from '../ui'

// 소개 펼침 영역: 예뻐졌다 이야기, 세 가지 조합, 관리 순서
const PAIRS = [
  { no: '01', tag: '온열돔 · 전신웜업케어', a: '온기', b: '휴식', text: '온열돔에 편히 누워 있는 동안 몸 전체가 깊고 고르게 데워집니다. 땀과 함께 긴장이 풀리면서 다음 관리를 받을 준비가 됩니다.' },
  { no: '02', tag: '아웃케어', a: '손길', b: '디바이스', text: '따뜻해진 몸에 손길과 갈바닉·웰스파 디바이스로 고민 부위를 집중 관리합니다. 어깨와 등, 복부, 하체처럼 무거운 곳을 하나씩 풀어 드립니다.' },
  { no: '03', tag: '두피-얼굴 관리', a: '두피', b: '얼굴', text: '두피 클렌징부터 얼굴 근막 케어까지 한 흐름으로 이어집니다. 머리는 가볍게, 얼굴은 생기 있게 마무리합니다.' },
]

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

          <div className="w-about__text">
            <Reveal as="h2" className="w-display">
              <span className="w-display__ko">예뻐졌다</span>
              Wellness
              <br />
              Studio
            </Reveal>
            <Reveal as="p" delay={80} className="w-about__line">
              온기로 풀고,
              <br />
              손끝으로 <em>완성</em>합니다.
            </Reveal>
            <Reveal as="p" delay={120} className="w-about__lead">
              예뻐졌다 WELLNESS STUDIO는 온열돔으로 몸을 먼저 따뜻하게 준비한 뒤 손길과 디바이스로 고민 부위를 하나씩 살핍니다. 두피부터 얼굴과 바디까지, 한 번의 방문으로 이어지는 토탈 케어입니다.
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
            <div className="w-story">
              <p className="w-label">예뻐졌다의 4년</p>
              <h3 className="w-story__title">
                4년, 40개 이상의 매장.
                <br />
                그리고 다시, <em>용호점</em>.
              </h3>
              <p className="w-story__text">
                예뻐졌다는 문을 연 지 4년 만에 40개가 넘는 매장과 함께하는 브랜드가 되었습니다. 그 시간 동안 쌓은 관리 노하우에 한층 업그레이드된 장비와 프로그램을 더해 용호점이 예뻐졌다 WELLNESS STUDIO로 새롭게 문을 열었습니다.
              </p>
            </div>

            <div className="w-pairs">
              {PAIRS.map((p) => (
                <article key={p.no} className="w-pair">
                  <p className="w-pair__tag">
                    <span>{p.no}</span>
                    {p.tag}
                  </p>
                  <h3 className="w-pair__title">
                    {p.a} <em>+</em>
                    <br />
                    {p.b}
                  </h3>
                  <p className="w-pair__text">{p.text}</p>
                </article>
              ))}
            </div>

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
