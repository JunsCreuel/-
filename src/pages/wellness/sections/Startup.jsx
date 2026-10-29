import { useRef } from 'react'
import { PARENT_STORE_COUNT, PICS, STARTUP_CONTACTS, STARTUP_COSTS, telHref } from '../data'
import { Folio, Pic, SplitLines } from '../editorial'
import { useScrollProgress } from '../motion'
import StartupForm from '../StartupForm'

// Appendix — For Partners. 고객 동선이 끝난 뒤 B2B 구역을 에스프레소 커튼 한 장으로 분리한다.
// 배경(정물 사진)은 장식이다. 진행 단계 선은 스크롤에 따라 그어진다(--p).
// 40+는 본 브랜드 예뻐졌다의 매장 수다. 웰니스 스튜디오는 그 자매 브랜드라 창업은 신규 창업으로 진행된다는 것을 바로 옆에 밝힌다.
// 비용은 확정된 금액(STARTUP_COSTS)만 보여 주고(비어 있으면 카드를 그리지 않는다), 예상 매출·수익 계산은 두지 않는다.

// 일반적인 창업 진행 단계 예시. 실제 절차와 다를 수 있어 확정된 사실처럼 쓰지 않는다.
const STEPS = ['창업·운영 상담 신청', '상담 및 브랜드 안내', '운영 조건 협의', '준비 과정 및 교육', '오픈 준비']

// 모바일은 DOM 순서(머리 → 창업 비용 → 진행 단계 → 전화 → 폼), 64rem 이상은 위 2열(왼쪽 머리·창업 비용·전화 / 오른쪽 폼) + 아래 전폭 진행 단계
const GRID =
  "yw-wrap relative z-1 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_auto_1fr_auto] lg:items-start lg:gap-x-[clamp(2rem,5vw,4.5rem)] lg:[grid-template-areas:'head_form'_'cost_form'_'actions_form'_'tl_tl']"

// 진행 단계 선: 옅은 1px 선 위로 2px 브론즈 선이 스크롤에 따라(--p) 그어진다. 첫 점 가운데에서 마지막 점 가운데까지(점 i는 선의 i/4 지점).
// 64rem 미만은 세로 진행 단계(왼쪽 세로선이 위에서 아래로)
const TRACK =
  "relative mt-5 grid grid-cols-[repeat(5,minmax(0,1fr))] gap-4 pt-6 before:absolute before:top-[calc(0.375rem_-_0.5px)] before:right-[calc((100%_-_4rem)_/_5_-_0.375rem)] before:left-[0.375rem] before:h-px before:bg-[rgb(241_243_228/0.25)] before:content-[''] after:absolute after:top-[calc(0.375rem_-_1px)] after:right-[calc((100%_-_4rem)_/_5_-_0.375rem)] after:left-[0.375rem] after:h-[2px] after:origin-left after:bg-bronze after:[transform:scaleX(clamp(0,(var(--p,1)_-_0.2)_*_2.2,1))] after:content-[''] max-lg:grid-cols-[minmax(0,1fr)] max-lg:gap-[0.9rem] max-lg:pt-0 max-lg:pl-7 max-lg:before:top-[0.675rem] max-lg:before:right-auto max-lg:before:bottom-[0.675rem] max-lg:before:left-[calc(0.375rem_-_0.5px)] max-lg:before:h-auto max-lg:before:w-px max-lg:after:top-[0.675rem] max-lg:after:right-auto max-lg:after:bottom-[0.675rem] max-lg:after:left-[calc(0.375rem_-_1px)] max-lg:after:h-auto max-lg:after:w-[2px] max-lg:after:origin-top max-lg:after:[transform:scaleY(clamp(0,(var(--p,1)_-_0.2)_*_2.2,1))] motion-reduce:after:[transform:none]"
// 선이 닿은 점이 켜진다
const STEP_DOT =
  "absolute -top-6 left-0 z-1 size-3 rounded-[50%] border border-cream bg-espresso after:absolute after:inset-px after:rounded-[50%] after:bg-champagne after:opacity-[clamp(0.3,calc(((var(--p,1)_-_0.2)_*_2.2_*_4_-_var(--i))_*_4_+_1),1)] after:content-[''] max-lg:top-[0.3rem] max-lg:-left-7 motion-reduce:after:opacity-100"

// 브랜드 관계: 줄마다 선 위의 점(본 브랜드는 빈 점, 자매 브랜드는 채운 점). 세로선은 그 줄의 점 가운데에서 다음 줄의 점 가운데까지
const TREE_ROW =
  "relative flex flex-wrap items-baseline gap-x-[0.7rem] gap-y-[0.15rem] before:absolute before:top-[0.4rem] before:-left-[1.4rem] before:z-1 before:size-[0.6rem] before:rounded-[50%] before:border before:border-champagne before:content-['']"
const TREE_LINE =
  "after:absolute after:top-[0.7rem] after:bottom-[calc(-0.85rem_-_0.7rem)] after:-left-[1.1rem] after:w-px after:bg-[color-mix(in_srgb,var(--w-champagne)_45%,transparent)] after:content-['']"
const TREE_DT = 'text-[1rem] font-semibold tracking-[0.01em] text-cream'
const TREE_DD =
  'm-0 rounded-full border border-[color-mix(in_srgb,var(--w-champagne)_50%,transparent)] px-[0.6rem] py-[0.05rem] text-[0.78rem] leading-[1.5] text-champagne'

const LABEL = 'text-[0.85rem] font-semibold tracking-[0.06em] text-champagne'
const CREAM_82 = 'text-[color-mix(in_srgb,var(--yw-cream)_82%,transparent)]'

export default function Startup() {
  const phone = STARTUP_CONTACTS[0].phone
  const tlRef = useRef(null)

  useScrollProgress(tlRef, { mode: 'through' })

  return (
    <section id="startup" className="yw-section yw-dark yw-curtain overflow-clip" data-theme="dark">
      {/* 정물 사진: 짙은 바탕 위에 아주 옅게(luminosity로 바탕색에 물든다) 아래로 갈수록 사라진다.
          부모에 z-index·mask를 주면 블렌딩이 갇히므로 마스크는 img에 직접 준다 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Pic
          pic={PICS.bizStill}
          sizes="100vw"
          className="size-full max-w-none object-cover object-[50%_40%] opacity-14 mix-blend-luminosity [filter:grayscale(0.4)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_78%)] [mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_78%)]"
        />
      </div>

      <div className={GRID}>
        <div className="min-w-0 lg:[grid-area:head]">
          <Folio ko="창업 상담" />
          <SplitLines
            as="h2"
            className="font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.35] font-normal tracking-[-0.02em] text-cream normal-nums"
            lines={['웰니스 공간을', '시작하고 싶으신가요?']}
          />
          <p className="mt-[clamp(1.75rem,4vw,2.75rem)] flex items-end gap-4">
            <span className="flex-none font-en text-[clamp(3.5rem,18vw,4.5rem)] leading-[0.8] font-light tracking-[-0.02em] text-champagne lining-nums tabular-nums md:text-[clamp(4rem,8vw,7.5rem)]">
              {PARENT_STORE_COUNT}+
            </span>
            <span className="max-w-[7.5em] pb-[0.15em] text-[0.95rem] leading-[1.5] text-[color-mix(in_srgb,var(--yw-cream)_80%,transparent)]">
              본 브랜드 예뻐졌다 매장
            </span>
          </p>
          <dl className="mx-0 mt-[clamp(1.5rem,4vw,2rem)] mb-0 grid gap-[0.85rem] pl-[1.4rem]" aria-label="브랜드 관계">
            <div className={`${TREE_ROW} ${TREE_LINE} before:bg-espresso`}>
              <dt className={TREE_DT}>예뻐졌다</dt>
              <dd className={TREE_DD}>본 브랜드</dd>
            </div>
            <div className={`${TREE_ROW} before:bg-champagne`}>
              <dt className={TREE_DT}>예뻐졌다 WELLNESS STUDIO</dt>
              <dd className={TREE_DD}>자매 브랜드</dd>
            </div>
          </dl>
          <p className={`mx-0 mt-[1.1rem] mb-0 max-w-[30ch] text-[clamp(0.95rem,2.4vw,1.02rem)] leading-[1.7] break-keep ${CREAM_82} [&_strong]:font-semibold [&_strong]:text-cream`}>
            웰니스 스튜디오 창업은 기존 매장 운영 여부와 관계없이 <strong>신규 창업</strong>으로 진행됩니다.
          </p>
        </div>

        {/* 창업 비용: 확정 금액만 한 줄씩(STARTUP_COSTS가 비어 있으면 카드 없음) */}
        {STARTUP_COSTS.length > 0 && (
          <div className="mt-[clamp(2rem,6vw,2.75rem)] min-w-0 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--w-champagne)_32%,transparent)] bg-[color-mix(in_srgb,var(--yw-cream)_5%,transparent)] px-[clamp(1.15rem,3vw,1.6rem)] py-[clamp(1.15rem,3vw,1.5rem)] lg:[grid-area:cost]">
            <p className={`m-0 ${LABEL}`}>창업 비용 안내</p>
            <ul className="mx-0 mt-[0.8rem] mb-0 list-none p-0">
              {STARTUP_COSTS.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-[0.35rem] border-t border-[color-mix(in_srgb,var(--yw-cream)_14%,transparent)] py-3 first:border-t-0 first:pt-[0.2rem]"
                >
                  <span className="text-[1rem] font-medium text-cream">{c.label}</span>
                  <span className="inline-flex items-baseline gap-[0.55rem]">
                    <b className="font-serif text-[clamp(1.5rem,5vw,1.85rem)] leading-[1.1] font-normal tracking-[-0.01em] text-cream normal-nums">{c.amount}</b>
                    {c.note && (
                      <em className="rounded-full bg-champagne px-[0.55rem] py-[0.05rem] text-[0.75rem] leading-[1.5] font-semibold text-espresso not-italic">
                        {c.note}
                      </em>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-[clamp(2.5rem,8vw,5rem)] min-w-0 lg:[grid-area:tl]" ref={tlRef}>
          <p className={LABEL}>상담 후 진행 단계</p>
          <ol className={TRACK} style={{ '--n': STEPS.length }}>
            {STEPS.map((step, i) => (
              <li key={step} className="relative text-[0.9rem] leading-[1.5] break-keep text-cream" style={{ '--i': i }}>
                <span className={STEP_DOT} aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[clamp(2rem,6vw,3rem)] flex min-w-0 flex-wrap items-center justify-center gap-x-6 gap-y-[0.9rem] md:justify-start lg:mt-10 lg:[grid-area:actions]">
          <a className="yw-btn yw-btn--cream w-full md:w-auto" data-magnet="" href={telHref(phone)}>
            <span>창업·운영 전화 상담</span>
          </a>
          <p className={`m-0 basis-full text-center text-[0.92rem] leading-[1.6] ${CREAM_82} md:text-left`}>창업 상담은 용호 자이점에서 진행합니다.</p>
          <p className="m-0 flex flex-wrap gap-x-6 gap-y-0">
            {STARTUP_CONTACTS.map((c) => (
              <a
                key={c.id}
                className="inline-flex min-h-11 items-center bg-[linear-gradient(currentColor,currentColor)] bg-size-[0_1px] bg-position-[0_100%] bg-no-repeat pb-[0.1em] font-label text-[1rem] tracking-[0.06em] text-cream no-underline transition-[background-size] duration-400 ease-yw motion-reduce:transition-none focus-visible:bg-size-[100%_1px] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-size-[100%_1px]"
                href={telHref(c.phone)}
              >
                {/* 전화 번호 앞 지점 이름(한글이라 본문 글꼴) */}
                <span className="mr-[0.55em] font-sans text-[0.88rem] tracking-[0] text-[color-mix(in_srgb,var(--yw-cream)_72%,transparent)]">{c.label}</span>
                {c.phone}
              </a>
            ))}
          </p>
        </div>

        {/* 아이보리 카드(창업 폼). 짙은 장의 크림 포커스 테두리는 카드 안에서 보이지 않으므로 짙은 브론즈로.
            좁은 폰에서도 연락처 세 칸이 카드 안에 들어오게 한다 */}
        <div className="mt-[clamp(2rem,6vw,3rem)] min-w-0 rounded-3xl bg-ivory p-[clamp(1.25rem,3vw,2.5rem)] text-ink [&_.w-form]:mt-5 [&_.w-phone]:gap-2 [&_.w-phone_input[type=text]]:w-auto [&_.w-phone_input[type=text]]:max-w-[5.2rem] [&_.w-phone_input[type=text]]:min-w-0 [&_.w-phone_input[type=text]]:flex-[1_1_0] [&_:focus-visible]:outline-accent-deep lg:mt-0 lg:[grid-area:form]">
          <h3 id="startup-form-title" className="font-serif text-[clamp(1.2rem,2.2vw,1.45rem)] leading-[1.35] font-medium tracking-[-0.01em] text-espresso normal-nums">
            창업·운영 상담 신청
          </h3>
          <StartupForm />
        </div>
      </div>
    </section>
  )
}
