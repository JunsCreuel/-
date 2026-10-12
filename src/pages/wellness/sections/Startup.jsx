import { BRANCHES, telHref } from '../data'
import StartupForm from '../StartupForm'
import { Reveal } from '../ui'

// 일반적인 창업 진행 단계 예시. 실제 절차와 다를 수 있어 확정된 사실처럼 쓰지 않는다.
const STEPS = ['창업·운영 상담 신청', '상담 및 브랜드 안내', '운영 조건 협의', '준비 과정 및 교육', '오픈 준비']

export default function Startup() {
  return (
    <section id="startup" className="w-section">
      <div className="w-container w-startup">
        <div className="w-startup__intro">
          <Reveal as="p" className="w-label">Business Inquiry</Reveal>
          <Reveal as="h2" className="w-title">웰니스 공간을<br />시작하고 싶으신가요?</Reveal>
          <Reveal as="p" className="w-lead">온열돔과 부위별 디바이스 케어를 결합한 웰니스 운영 방식이 궁금하다면, 창업·운영 상담으로 만나보세요.</Reveal>
          <ul className="w-tags"><li>신규 창업 상담</li><li>기존 샵 도입 상담</li></ul>
          <p className="w-program__text">희망 지역, 준비 단계, 궁금한 내용을 알려주시면 상담 가능한 범위를 안내해 드립니다.</p>

          <details className="w-more">
            <summary>상담 후 진행 단계 보기</summary>
            <ul className="w-startup__points">
              <li>온열돔과 디바이스 아웃케어를 결합한 운영 방식</li>
              <li>100% 예약제 운영</li>
              <li>4년간의 운영 경험</li>
            </ul>
            <div className="w-startup__steps">
              <p className="w-startup__label">상담 후 진행 단계(예시)</p>
              <ol>
                {STEPS.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="w-startup__note">일반적인 진행 예시이며, 실제 절차와 일정은 상담에서 안내해 드립니다.</p>
            </div>
          </details>

          <div className="w-hero__actions"><a className="w-btn w-btn--primary" href={telHref(BRANCHES.zai.phone)}>창업·운영 전화 상담</a><a className="w-link" href={telHref(BRANCHES.zai.phone)}>{BRANCHES.zai.phone}</a></div>
        </div>

        <div className="w-startup__form">
          <h3 id="startup-form-title" tabIndex={-1}>
            창업·운영 상담 신청
          </h3>
          <StartupForm />
        </div>
      </div>
    </section>
  )
}
