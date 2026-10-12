import { useState } from 'react'
import { BRAND, telHref } from '../data'
import { Eyebrow, Reveal } from '../ui'

const AREAS = ['두피 · 얼굴', '등 · 어깨', '복부', '하체 · 림프', '온열 웜업', '상담 후 결정']
const TIMES = ['평일 오전', '평일 오후', '상담 시 조율']

// 대화형 상담 예약. 사이트에 접수 서버가 없어 개인정보는 받지 않고,
// 고른 내용을 네이버 예약·문자·전화로 이어 준다(문자는 고른 내용이 미리 채워진 채로 열린다).
function smsHref(phone, body) {
  return `sms:${phone.replace(/-/g, '')}?&body=${encodeURIComponent(body)}`
}

function Bubble({ children }) {
  return (
    <div className="ws-chat__row">
      <span className="ws-chat__avatar" aria-hidden="true">
        <svg viewBox="0 0 108 103" width="16" height="15">
          <path d="M0 103V40A40 40 0 0 1 40 0H65V25H42A17 17 0 0 0 25 42V103Z" fill="currentColor" />
          <rect x="83" y="10" width="25" height="93" fill="currentColor" />
        </svg>
      </span>
      <p className="ws-chat__bubble">{children}</p>
    </div>
  )
}

function Choices({ label, options, value, onPick }) {
  return (
    <div className="ws-chat__choices" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={value === o} onClick={() => onPick(value === o ? '' : o)}>
          {o}
        </button>
      ))}
    </div>
  )
}

export default function Booking({ branch }) {
  const [area, setArea] = useState('')
  const [time, setTime] = useState('')
  const step = area && time ? 3 : area ? 2 : 1

  const picked = [area, time].filter(Boolean).join(' · ')
  const message = `[${BRAND.company} 상담 신청]\n관심 관리: ${area || '상담 후 결정'}\n희망 시간: ${time || '상담 시 조율'}`

  return (
    <section id="booking" className="ws-booking">
      <div className="ws-container ws-booking__grid">
        <Reveal className="ws-booking__intro">
          <Eyebrow>상담 예약</Eyebrow>
          <h2 className="ws-title">
            나를 위한 시간,
            <br />
            지금 <em className="ws-accent">예약</em>해 보세요.
          </h2>
          <p className="ws-booking__lead">
            원하는 관리와 시간을 남겨 주시면 확인 후 연락드려 일정을 잡아 드립니다. 네이버 예약이나 전화로도 바로 예약하실 수 있어요.
          </p>
          <dl className="ws-facts ws-facts--wide">
            <div>
              <dt>전화 예약</dt>
              <dd>
                <a className="ws-num" href={telHref(branch.phone)}>
                  {branch.phone}
                </a>
              </dd>
            </div>
            {branch.booking && (
              <div>
                <dt>네이버 예약</dt>
                <dd>
                  <a href={branch.booking} target="_blank" rel="noopener noreferrer">
                    바로가기 ↗
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt>영업시간</dt>
              <dd>{branch.hours ?? '영업시간 별도 안내'}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120} className="ws-chat">
          <div className="ws-chat__top">
            <p className="ws-chat__title">상담 신청</p>
            <p className="ws-chat__step" aria-live="polite">
              {step} / 3단계
            </p>
          </div>

          <Bubble>
            안녕하세요, {BRAND.company}입니다.
            <br />
            요즘 가장 신경 쓰이는 곳은 어디인가요?
          </Bubble>
          <Choices label="관심 관리" options={AREAS} value={area} onPick={setArea} />

          <Bubble>편하신 방문 시간대를 알려 주세요.</Bubble>
          <Choices label="희망 시간대" options={TIMES} value={time} onPick={setTime} />

          <Bubble>편한 방법으로 예약을 이어 갈게요.</Bubble>
          <div className="ws-chat__finish">
            {picked && <p className="ws-chat__picked">선택한 내용 · {picked}</p>}
            {branch.booking && (
              <a className="ws-btn ws-btn--block" href={branch.booking} target="_blank" rel="noopener noreferrer">
                네이버로 예약하기 ↗
              </a>
            )}
            <div className="ws-chat__alt">
              <a className="ws-btn ws-btn--ghost" href={smsHref(branch.phone, message)}>
                문자로 상담 남기기
              </a>
              <a className="ws-btn ws-btn--ghost" href={telHref(branch.phone)}>
                전화하기
              </a>
            </div>
            <p className="ws-chat__note">이 화면에서는 개인정보를 받지 않습니다. 문자는 고른 내용이 담긴 채로 휴대폰 문자 앱에서 열립니다.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
