import { useState } from 'react'
import { useTween } from '../motion'
import { scrollToId } from '../scroll'
import { Reveal, Todo } from '../ui'

// 월 손익 시뮬레이터. 입력한 숫자로 "매출 − 비용"을 계산해 보여 주는 계산기일 뿐이며, 기본값은 계산 방식을 보여 주기 위한 예시다.
// 예뻐졌다의 실제 매출·비용·수익 수치가 아니다. 실제 값은 확정되면 FIELDS의 value만 바꾸면 된다(공개 전 확인 필요).
const FIELDS = [
  { id: 'area', label: '매장 규모', unit: '평', min: 10, max: 60, step: 1, value: 20, hint: '임대료 계산에만 쓰입니다' },
  { id: 'rent', label: '평당 월 임대료', unit: '만원', min: 2, max: 20, step: 1, value: 8, hint: '지역에 따라 크게 다릅니다' },
  { id: 'sales', label: '월 예상 매출', unit: '만원', min: 500, max: 15000, step: 100, value: 4000, hint: '방문 수 × 객단가로 가늠해 보세요' },
  { id: 'labor', label: '월 인건비', unit: '만원', min: 0, max: 1500, step: 50, value: 400, hint: '본인 급여를 넣을지는 직접 정하세요' },
  { id: 'material', label: '재료·소모품 비율', unit: '%', min: 3, max: 40, step: 1, value: 12, hint: '월 매출 대비 비율' },
  { id: 'etc', label: '기타 고정비', unit: '만원', min: 0, max: 600, step: 10, value: 100, hint: '관리비·광고비·통신비 등' },
]

const defaults = () => Object.fromEntries(FIELDS.map((f) => [f.id, f.value]))

// 만원 단위 숫자를 "1억 2,340만원" 꼴로
function fmtMan(n) {
  const v = Math.round(n)
  const abs = Math.abs(v)
  const sign = v < 0 ? '−' : ''
  if (abs >= 10000) {
    const eok = Math.floor(abs / 10000)
    const rest = abs % 10000
    return `${sign}${eok}억${rest ? ` ${rest.toLocaleString('ko-KR')}만원` : '원'}`
  }
  return `${sign}${abs.toLocaleString('ko-KR')}만원`
}

function calc(v) {
  const rent = v.area * v.rent
  const material = (v.sales * v.material) / 100
  const fixed = rent + v.labor + v.etc
  const profit = v.sales - fixed - material
  const margin = v.sales > 0 ? (profit / v.sales) * 100 : 0
  const bep = fixed / (1 - v.material / 100)
  return { rent, material, fixed, profit, margin, bep }
}

export default function Simulator() {
  const [v, setV] = useState(defaults)
  const r = calc(v)
  const profitShown = useTween(r.profit)
  const marginShown = useTween(r.margin)

  // 막대: 매출을 100%로 보고 비용 칸과 남는 칸을 나눈다. 비용이 매출을 넘으면 비용 합을 100%로 본다.
  const total = Math.max(v.sales, r.rent + v.labor + r.material + v.etc)
  const pct = (n) => `${Math.max(0, (n / total) * 100).toFixed(2)}%`
  const parts = [
    { id: 'rent', label: '임대료', value: r.rent },
    { id: 'labor', label: '인건비', value: v.labor },
    { id: 'material', label: '재료·소모품', value: r.material },
    { id: 'etc', label: '기타 고정비', value: v.etc },
  ]
  const loss = r.profit < 0

  function set(id, value) {
    setV((prev) => ({ ...prev, [id]: Number(value) }))
  }

  function toInquiry() {
    const summary = `[시뮬레이터 예시 조건] 규모 ${v.area}평, 월 매출 ${fmtMan(v.sales)}, 계산된 월 손익 ${fmtMan(r.profit)} (예시 계산)`
    window.dispatchEvent(new CustomEvent('w-sim-summary', { detail: summary }))
    scrollToId('startup')
  }

  return (
    <section id="simulator" className="w-section w-section--band w-sim">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Profit Simulator
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          내 매장이라면,
          <br />
          한 달에 얼마가 남을까요?
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          슬라이더를 움직이면 월 손익이 바로 계산됩니다. 직접 조건을 바꿔 가며 운영 구조를 가늠해 보세요.
        </Reveal>

        <div className="w-sim__grid">
          <div className="w-sim__inputs">
            <div className="w-sim__mini" aria-hidden="true">
              <span>월 예상 손익</span>
              <b className={loss ? 'is-loss' : undefined}>{fmtMan(profitShown)}</b>
            </div>
            {FIELDS.map((f) => {
              const fill = ((v[f.id] - f.min) / (f.max - f.min)) * 100
              const shown = f.unit === '만원' ? fmtMan(v[f.id]) : `${v[f.id].toLocaleString('ko-KR')}${f.unit}`
              return (
                <div key={f.id} className="w-sim__field">
                  <div className="w-sim__row">
                    <label htmlFor={`sim-${f.id}`}>{f.label}</label>
                    <output htmlFor={`sim-${f.id}`}>{shown}</output>
                  </div>
                  <input
                    id={`sim-${f.id}`}
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={v[f.id]}
                    style={{ '--fill': `${fill}%` }}
                    aria-valuetext={shown}
                    onChange={(e) => set(f.id, e.target.value)}
                  />
                  <p className="w-sim__hint">{f.hint}</p>
                </div>
              )
            })}
            <button type="button" className="w-link w-sim__reset" onClick={() => setV(defaults())}>
              처음 값으로 되돌리기
            </button>
          </div>

          <div className="w-sim__result" aria-live="polite">
            <p className="w-sim__eyebrow">월 예상 손익 (예시 계산)</p>
            <p className={`w-sim__profit${loss ? ' is-loss' : ''}`}>{fmtMan(profitShown)}</p>
            <p className="w-sim__sub">
              {loss ? '이 조건에서는 비용이 매출보다 큽니다.' : `매출 대비 ${Math.round(marginShown)}% · 연 환산 ${fmtMan(r.profit * 12)}`}
            </p>

            <div className="w-sim__bar" role="img" aria-label={`매출 ${fmtMan(v.sales)} 중 비용과 남는 금액의 비율`}>
              {parts.map((p) => (
                <span key={p.id} className={`w-sim__seg is-${p.id}`} style={{ width: pct(p.value) }} />
              ))}
              {!loss && <span className="w-sim__seg is-profit" style={{ width: pct(r.profit) }} />}
            </div>
            <ul className="w-sim__legend">
              {parts.map((p) => (
                <li key={p.id}>
                  <i className={`is-${p.id}`} aria-hidden="true" />
                  <span>{p.label}</span>
                  <b>{fmtMan(p.value)}</b>
                </li>
              ))}
              <li>
                <i className="is-profit" aria-hidden="true" />
                <span>{loss ? '부족 금액' : '남는 금액'}</span>
                <b>{fmtMan(Math.abs(r.profit))}</b>
              </li>
            </ul>
            <p className="w-sim__bep">
              손익분기 매출 <b>{fmtMan(r.bep)}</b>
            </p>

            <button type="button" className="w-btn w-btn--primary w-btn--arrow" onClick={toInquiry}>
              이 조건으로 창업 상담 신청
            </button>
          </div>
        </div>

        <p className="w-method__note">
          입력값과 기본값은 계산 방식을 보여 드리기 위한 예시이며, 예뻐졌다의 실제 매출·비용·수익이 아닙니다. 지역·규모·운영 방식에 따라 크게 달라지고 수익을 보장하지 않습니다. 실제 조건은 상담에서 안내해 드립니다.{' '}
          <Todo>시뮬레이터 기본값 · 항목 (실제 운영 수치 기준)</Todo>
        </p>
      </div>
    </section>
  )
}
