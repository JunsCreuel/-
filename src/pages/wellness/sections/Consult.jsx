import { OFFER_TERM, OFFER_TERM_NOTE, PHOTOS, SALE_COUNT, SHOW_OFFER, reserveAction, telHref } from '../data'
import { W_ACTIONS, W_BTN, W_BTN_PRIMARY, W_CONTAINER, W_EYEBROW, W_LEAD, W_TITLE } from '../tw'
import { Reveal } from '../ui'

// 상담 예약 섹션. 모든 "예약하기" 버튼이 이 섹션(id="booking")으로 이동한다.
// 첫 방문 50%는 상시 할인이 아니라 조건부라, 자이점 랜딩(히어로 칩·Q&A)과 같은 범위(SALE_COUNT)·조건(OFFER_TERM, OFFER_TERM_NOTE)으로 쓴다.
// 이벤트를 내리면(SHOW_OFFER=false) 함께 빠진다.
export default function Consult({ branch }) {
  const naver = reserveAction(branch)

  return (
    <section id="booking" className="scroll-mt-(--w-nav-h) border-t border-(--w-hair) bg-(--w-bg) px-(--w-gutter) py-[clamp(4rem,10vw,8rem)]">
      <div className={`${W_CONTAINER} grid gap-[clamp(2.2rem,6vw,5rem)] min-[900px]:grid-cols-[5fr_7fr] min-[900px]:items-start`}>
        <Reveal mode="toggle" className="min-[900px]:sticky min-[900px]:top-[calc(var(--w-nav-h)_+_2rem)]">
          <figure className="m-0">
            <img
              className="block aspect-[16/10] h-auto w-full rounded-(--w-radius) object-cover object-[center_30%] min-[900px]:aspect-[4/5]"
              src={PHOTOS.neck}
              alt=""
              width="735"
              height="1105"
              loading="lazy"
              decoding="async"
            />
            {SHOW_OFFER && (
              <figcaption className="mt-[0.8rem] border-t border-line pt-[0.7rem] text-[0.8rem] tracking-[0.08em] text-muted">
                {OFFER_TERM} · {SALE_COUNT}개 관리 50%
              </figcaption>
            )}
          </figure>
        </Reveal>

        <div>
          <Reveal as="p" className={W_EYEBROW}>
            Reservation
          </Reveal>
          <Reveal as="h2" delay={80} className={W_TITLE}>
            상담 예약
          </Reveal>
          <Reveal as="p" delay={120} className={W_LEAD}>
            네이버 예약 또는 전화로 원하는 관리와 일정을 문의해 주세요.
            {SHOW_OFFER && ` 첫 방문 혜택(${SALE_COUNT}개 관리 50%)은 ${OFFER_TERM}이며, ${OFFER_TERM_NOTE}`}
          </Reveal>

          <div className={W_ACTIONS}>
            {naver.external && <a className={W_BTN_PRIMARY} href={naver.href} target="_blank" rel="noopener noreferrer">네이버에서 예약하기 ↗</a>}
            <a className={W_BTN} href={telHref(branch.phone)}>전화로 관리 상담</a>
          </div>
          <p className="mt-[1.6rem] max-w-[40rem] border-t border-line pt-4 text-[0.92rem] text-pretty text-muted">두피 · 얼굴 · 복부 · 전신 집중관리 · 온열돔 단독 이용 중 관심 있는 관리를 말씀해 주세요. 소요시간과 비용, 온열돔 포함 여부를 예약 전에 안내드립니다.</p>

          <p className="mt-[1.8rem] border-t border-line pt-[1.1rem] text-[0.88rem] text-muted [&_a]:underline [&_a]:underline-offset-[0.25em]">
            전화 예약 <a href={telHref(branch.phone)}>{branch.phone}</a> · {branch.hours ?? '영업시간 별도 안내'}
            {naver.external && (
              <>
                {' · '}
                <a className="after:text-[0.85em] after:content-['_↗']" href={naver.href} target="_blank" rel="noopener noreferrer">
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
