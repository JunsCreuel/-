import { PARENT_STORE_COUNT, STARTUP_CONTACTS, STARTUP_COSTS, STARTUP_COSTS_NOTE, telHref } from '../data'
import { BTN_INK, H2, RULE, SECTION } from '../tw'
import QuickConsult from './QuickConsult'

// 창업 문의 — 고객 동선이 끝난 뒤, 메인 맨 아래에 두는 짧은 안내와 상담 신청.
// 웰니스 스튜디오는 예뻐졌다의 자매 브랜드라 창업은 신규 창업으로 진행된다는 것을 먼저 밝힌다.
// 비용은 확정된 금액(STARTUP_COSTS)만 적고(비어 있으면 그리지 않는다), 예상 매출·수익 계산은 두지 않는다.

// 일반적인 창업 진행 순서 예시. 실제 절차와 다를 수 있어 확정된 사실처럼 쓰지 않는다.
const STEPS = ['창업·운영 상담 신청', '상담 및 브랜드 안내', '운영 조건 협의', '준비 과정 및 교육', '오픈 준비']

export default function Startup() {
  const phone = STARTUP_CONTACTS[0].phone

  return (
    <section id="startup" className={`${SECTION} ${RULE}`} data-theme="light" aria-labelledby="startup-title">
      <div className="mx-auto grid w-full max-w-(--yw-max) gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start">
        <div className="min-w-0">
          <h2 id="startup-title" className={`${H2} m-0`}>
            웰니스 공간을
            <br />
            시작하고 싶으신가요?
          </h2>
          <p className="mt-4 max-w-[38ch] break-keep text-muted">
            예뻐졌다 웰니스 스튜디오는 매장 {PARENT_STORE_COUNT}개 이상인 예뻐졌다의 자매 브랜드입니다. 창업은 기존 매장 운영 여부와 관계없이 신규
            창업으로 진행됩니다.
          </p>

          {STARTUP_COSTS.length > 0 && (
            <dl className="mx-0 mt-7 mb-0 border-b border-line [&_dd]:m-0 [&_dd]:text-ink [&_dt]:text-muted [&>div]:flex [&>div]:flex-wrap [&>div]:items-baseline [&>div]:justify-between [&>div]:gap-x-4 [&>div]:border-t [&>div]:border-line [&>div]:py-3">
              {STARTUP_COSTS.map((c) => (
                <div key={c.id}>
                  <dt>{c.label}</dt>
                  <dd className="tabular-nums">
                    {c.amount}
                    {c.note && <span className="ml-2 text-[0.85rem] text-muted">{c.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {STARTUP_COSTS.length > 0 && <p className="mt-3 text-[0.88rem] text-muted">{STARTUP_COSTS_NOTE}</p>}

          <h3 className="mx-0 mt-[clamp(1.75rem,4vw,2.5rem)] mb-0 font-sans text-[0.9rem] font-semibold tracking-normal text-ink">상담 후 진행 순서</h3>
          <ol className="mx-0 mt-2 mb-0 grid list-decimal gap-1 pl-[1.3em] text-[0.95rem] leading-[1.7] text-ink marker:text-muted">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="mt-[clamp(1.75rem,4vw,2.5rem)] flex flex-wrap items-center gap-x-6 gap-y-3">
            <a className={`${BTN_INK} max-sm:w-full`} href={telHref(phone)}>
              <span>창업·운영 전화 상담</span>
            </a>
            <p className="m-0 flex flex-wrap gap-x-5 text-[0.92rem] text-muted">
              {STARTUP_CONTACTS.map((c) => (
                <a key={c.id} className="inline-flex min-h-11 items-center gap-[0.5em] text-inherit no-underline" href={telHref(c.phone)}>
                  {c.label}
                  <span className="text-ink tabular-nums underline underline-offset-[0.25em]">{c.phone}</span>
                </a>
              ))}
            </p>
          </div>
          <p className="mt-1 text-[0.88rem] text-muted">창업 상담은 용호 자이점에서 진행합니다.</p>
        </div>

        <div className="min-w-0">
          <QuickConsult
            only="franchise"
            region
            title="창업·운영 상담 신청"
            sub="이름, 연락처, 관심 지역을 남겨 주시면 확인 후 연락드립니다."
          />
        </div>
      </div>
    </section>
  )
}
