import { useRef } from 'react'
import { BRANCHES, PARENT_STORE_COUNT, PICS, STARTUP_COSTS, STARTUP_PHONES, telHref } from '../data'
import { Folio, Pic, SplitLines } from '../editorial'
import { useScrollProgress } from '../motion'
import StartupForm from '../StartupForm'
import './yw-business.css'

// Appendix — For Partners. 고객 동선이 끝난 뒤 B2B 구역을 에스프레소 커튼 한 장으로 분리한다.
// 배경(정물 사진·고스트 단어·궤도 원)은 모두 장식이다. 진행 단계 선은 스크롤에 따라 그어진다(--p).
// 40+는 본 브랜드 예뻐졌다의 매장 수다. 웰니스 스튜디오는 그 자매 브랜드라 창업은 신규 창업으로 진행된다는 것을 바로 옆에 밝힌다.
// 비용은 확정된 금액(STARTUP_COSTS)만 보여 주고, 예상 매출·수익 계산은 두지 않는다.

// 일반적인 창업 진행 단계 예시. 실제 절차와 다를 수 있어 확정된 사실처럼 쓰지 않는다.
const STEPS = ['창업·운영 상담 신청', '상담 및 브랜드 안내', '운영 조건 협의', '준비 과정 및 교육', '오픈 준비']

export default function Startup() {
  const phone = BRANCHES.zai.phone
  const tlRef = useRef(null)

  useScrollProgress(tlRef, { mode: 'through' })

  return (
    <section id="startup" className="yw-section yw-dark yw-curtain yw-biz" data-theme="dark">
      <div className="yw-biz__bg" aria-hidden="true">
        <Pic pic={PICS.bizStill} sizes="100vw" />
      </div>

      {/* 모바일은 DOM 순서(머리 → 창업 비용 → 진행 단계 → 전화 → 폼), 64rem 이상은 grid 영역으로 위 2열 + 아래 전폭 */}
      <div className="yw-wrap yw-biz__grid">
        <div className="yw-biz__head">
          <Folio ko="창업 상담" />
          <SplitLines as="h2" className="yw-biz__title" lines={['웰니스 공간을', '시작하고 싶으신가요?']} />
          <p className="yw-biz__stat">
            <span className="yw-biz__num">{PARENT_STORE_COUNT}+</span>
            <span className="yw-biz__stat-label">본 브랜드 예뻐졌다 매장</span>
          </p>
          <dl className="yw-biz__tree" aria-label="브랜드 관계">
            <div>
              <dt>예뻐졌다</dt>
              <dd>본 브랜드</dd>
            </div>
            <div>
              <dt>예뻐졌다 WELLNESS STUDIO</dt>
              <dd>자매 브랜드</dd>
            </div>
          </dl>
          <p className="yw-biz__relation">
            웰니스 스튜디오 창업은 기존 매장 운영 여부와 관계없이 <strong>신규 창업</strong>으로 진행됩니다.
          </p>
        </div>

        <div className="yw-biz__cost">
          <p className="yw-biz__cost-label">창업 비용 안내</p>
          <ul>
            {STARTUP_COSTS.map((c) => (
              <li key={c.id}>
                <span className="yw-biz__cost-name">{c.label}</span>
                <span className="yw-biz__cost-amount">
                  <b>{c.amount}</b>
                  {c.note && <em>{c.note}</em>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="yw-biz__timeline" ref={tlRef}>
          <p className="yw-biz__tl-label">상담 후 진행 단계</p>
          <ol style={{ '--n': STEPS.length }}>
            {STEPS.map((step, i) => (
              <li key={step} style={{ '--i': i }}>
                <span className="yw-biz__dot" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="yw-biz__actions">
          <a className="yw-btn yw-btn--cream" data-magnet="" href={telHref(phone)}>
            <span>창업·운영 전화 상담</span>
          </a>
          <p className="yw-biz__where">창업 상담은 용호 자이점에서 진행합니다.</p>
          <p className="yw-biz__tels">
            {STARTUP_PHONES.map((p) => (
              <a key={p} className="yw-biz__tel" href={telHref(p)}>
                {p}
              </a>
            ))}
          </p>
        </div>

        <div className="yw-biz__form">
          <h3 id="startup-form-title">창업·운영 상담 신청</h3>
          <StartupForm />
        </div>
      </div>
    </section>
  )
}
