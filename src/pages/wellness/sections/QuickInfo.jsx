import { BRANCHES, PHOTOS, reserveAction } from '../data'
import { Reveal } from '../ui'

const ROWS = [
  ['위치', '부산 용호 · GS하이츠자이 상가'],
  ['영업시간', BRANCHES.zai.hours],
  ['이용 안내', '100% 예약제 · 남녀 모두 이용 가능'],
]

// 히어로 바로 아래: 네이버 예약 QR(데스크톱)·예약 버튼(모바일)과 한눈에 보는 이용 정보
export default function QuickInfo() {
  const naver = reserveAction(BRANCHES.zai)
  return (
    <section className="w-quick" aria-label="이용 정보">
      <div className="w-container w-quick__grid">
        <Reveal className="w-quick__qr">
          <img src={PHOTOS.qr} alt="네이버 예약 QR 코드" width="104" height="104" loading="lazy" />
          <div>
            <p className="w-quick__qr-title">
              휴대폰으로 스캔하고
              <br />
              바로 예약하세요
            </p>
            <p className="w-quick__qr-sub">카메라로 비추면 네이버 예약으로 연결됩니다.</p>
          </div>
        </Reveal>
        {naver.external && (
          <Reveal className="w-quick__book">
            <a className="w-btn w-btn--primary w-btn--arrow" href={naver.href} target="_blank" rel="noopener noreferrer">
              네이버 예약 바로가기
            </a>
          </Reveal>
        )}
        <Reveal as="ul" delay={80} className="w-quick__rows">
          {ROWS.map(([k, v]) => (
            <li key={k}>
              <span>{k}</span>
              <span>{v}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
