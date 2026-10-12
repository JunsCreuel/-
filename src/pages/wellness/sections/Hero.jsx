import { BRANCHES, PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

const zai = BRANCHES.zai

export default function Hero() {
  return (
    <section id="top" className="ws-hero">
      <div className="ws-container">
        <Reveal as="h1" className="ws-hero__title">
          <span>온기로 한 번,</span>
          <span className="ws-hero__title-end">
            손길로 <em className="ws-accent">한 번 더.</em>
          </span>
        </Reveal>

        <div className="ws-hero__grid">
          <Reveal delay={120} className="ws-hero__text">
            <p className="ws-pill">확장 이전 오픈 · 첫 방문 고객 50%</p>
            <h2 className="ws-hero__sub">
              관리 후 가장 먼저 듣는 말,
              <br />
              <span className="ws-hero__quote">“예뻐졌다”</span>
            </h2>
            <p className="ws-hero__lead">
              온열돔으로 몸을 먼저 풀고, 고민 부위는 아웃케어로 한 번 더 관리합니다. 두피부터 얼굴, 바디까지 내 고민에 맞춰 한
              곳에서.
            </p>
            <div className="ws-actions">
              <button type="button" className="ws-btn" onClick={() => scrollToId('booking')}>
                나에게 맞는 관리 찾기
                <Arrow />
              </button>
              <button type="button" className="ws-textlink" onClick={() => scrollToId('about')}>
                관리 방식 보기
              </button>
            </div>
          </Reveal>

          <Reveal mode="toggle" delay={200} className="ws-hero__media">
            <figure>
              <img src={PHOTOS.neck} alt="따뜻한 빛이 닿은 목선과 쇄골" width="735" height="1105" decoding="async" />
              <figcaption>온열 · 회복 · 에스테틱</figcaption>
            </figure>
          </Reveal>

          <Reveal delay={280} className="ws-hero__side">
            <div className="ws-qr">
              <img src={PHOTOS.qrBooking} alt="네이버 예약 QR 코드" width="104" height="104" />
              <div>
                <p className="ws-qr__title">
                  휴대폰으로 스캔하고
                  <br />
                  바로 예약하세요
                </p>
                <p className="ws-qr__text">카메라로 비추면 네이버 예약으로 연결됩니다.</p>
              </div>
            </div>
            <dl className="ws-facts">
              <div>
                <dt>위치</dt>
                <dd>부산 용호 · GS하이츠자이 상가</dd>
              </div>
              <div>
                <dt>영업시간</dt>
                <dd>{zai.hours}</dd>
              </div>
              <div>
                <dt>이용 안내</dt>
                <dd>100% 예약제 · 남녀 모두 이용 가능</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M0 6h16M11 1l5 5-5 5" />
    </svg>
  )
}
