import { PHOTOS, reserveAction, telHref } from '../data'
import { Reveal } from '../ui'
import '../wellness-consult.css'

// 상담 예약 섹션. 모든 "예약하기" 버튼이 이 섹션(id="booking")으로 이동한다.
export default function Consult({ branch }) {
  const naver = reserveAction(branch)

  return (
    <section id="booking" className="w-consult">
      <div className="w-container w-consult__grid">
        <Reveal mode="toggle" className="w-consult__media">
          <figure>
            <img src={PHOTOS.neck} alt="" width="735" height="1105" loading="lazy" decoding="async" />
            <figcaption>첫 방문 고객 50% · 전 관리 · 1인 1회</figcaption>
          </figure>
        </Reveal>

        <div className="w-consult__body">
          <Reveal as="p" className="w-eyebrow">
            Reservation
          </Reveal>
          <Reveal as="h2" delay={80} className="w-title">
            상담 예약
          </Reveal>
          <Reveal as="p" delay={120} className="w-lead">
            네이버 예약 또는 전화로 원하는 관리와 일정을 문의해 주세요. 첫 방문 고객께는 모든 관리 50% 혜택이 적용됩니다.
          </Reveal>

          <div className="w-hero__actions">
            {naver.external && <a className="w-btn w-btn--primary" href={naver.href} target="_blank" rel="noopener noreferrer">네이버에서 예약하기 ↗</a>}
            <a className="w-btn" href={telHref(branch.phone)}>전화로 관리 상담</a>
          </div>
          <p className="w-method__note">두피 · 얼굴 · 복부 · 전신 집중관리 · 온열돔 단독 이용 중 관심 있는 관리를 말씀해 주세요. 소요시간과 비용, 온열돔 포함 여부를 예약 전에 안내드립니다.</p>

          <p className="w-consult__alt">
            전화 예약 <a href={telHref(branch.phone)}>{branch.phone}</a> · {branch.hours ?? '영업시간 별도 안내'}
            {naver.external && (
              <>
                {' · '}
                <a className="is-ext" href={naver.href} target="_blank" rel="noopener noreferrer">
                  네이버 예약
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
