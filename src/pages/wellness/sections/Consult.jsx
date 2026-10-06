import ConsultForm from '../ConsultForm'
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
            상담 신청을 남겨 주시면 확인 후 연락드려 일정을 안내해 드립니다. 첫 방문 고객께는 모든 관리 50% 혜택이 적용됩니다.
          </Reveal>

          <ConsultForm defaultBranch={branch.id} />

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
