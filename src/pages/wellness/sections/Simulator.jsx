import { useEffect, useState } from 'react'
import { useTween } from '../motion'
import { scrollToId } from '../scroll'
import { Reveal, Todo } from '../ui'

// 창업 비용 구조 계산기. 입력한 숫자로 "매출 − 비용"을 계산해 보여 주는 계산기일 뿐이며, 처음 값은 슬라이더 위치를 잡기 위한 예시다.
// 예뻐졌다의 실제 매출·비용·수익 수치가 아니다. 근거 없는 예상 수익처럼 보이지 않도록(가맹사업법 제9조),
// 슬라이더를 직접 움직이기 전에는 결과를 보여 주지 않고, 매출 대비 비율·연 환산도 내지 않는다.
const FIELDS = [
  { id: 'area', label: '매장 규모', unit: '평', min: 10, max: 60, step: 1, value: 20, hint: '임대료 계산에만 쓰입니다' },
  { id: 'rent', label: '평당 월 임대료', unit: '만원', min: 2, max: 20, step: 1, value: 8, hint: '지역에 따라 크게 다릅니다' },
  { id: 'sales', label: '월 매출', unit: '만원', min: 500, max: 15000, step: 100, value: 1500, hint: '방문 수 × 객단가로 직접 가늠해 넣어 보세요' },
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
  const bep = fixed / (1 - v.material / 100)
  return { rent, material, fixed, profit, bep }
}

export default function Simulator() {
  const [v, setV] = useState(defaults)
  const [touched, setTouched] = useState(false) // 슬라이더를 한 번이라도 움직였는지
  const [said, setSaid] = useState('') // 스크린리더 안내(움직임이 멈춘 뒤 한 번만 읽힌다)
  const r = calc(v)
  const profitShown = useTween(r.profit)

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
  const shownResult = touched ? fmtMan(profitShown) : '—'

  // 슬라이더를 끄는 동안 매번 읽지 않도록, 멈추고 0.8초 뒤에 결과를 한 번 알린다
  useEffect(() => {
    if (!touched) return undefined
    const id = setTimeout(() => setSaid(`입력값 기준 계산 결과 ${loss ? '부족 금액' : '매출에서 비용을 뺀 금액'} ${fmtMan(Math.abs(r.profit))}`), 800)
    return () => clearTimeout(id)
  }, [touched, loss, r.profit])

  function set(id, value) {
    setV((prev) => ({ ...prev, [id]: Number(value) }))
    setTouched(true)
  }

  function reset() {
    setV(defaults())
    setTouched(false)
    setSaid('')
  }

  // 상담 문의에는 입력 조건만 넘긴다(계산된 금액은 넘기지 않는다)
  function toInquiry() {
    const summary = `[시뮬레이터 입력 조건] 규모 ${v.area}평, 평당 임대료 ${fmtMan(v.rent)}, 월 매출 ${fmtMan(v.sales)}, 인건비 ${fmtMan(v.labor)}, 재료·소모품 ${v.material}%, 기타 고정비 ${fmtMan(v.etc)}`
    window.dispatchEvent(new CustomEvent('w-sim-summary', { detail: summary }))
    scrollToId('startup')
  }

  return (
    <section id="simulator" className="w-section w-section--band w-sim">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Cost Calculator
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title">
          창업 비용 구조,
          <br />
          직접 넣어 계산해 보세요.
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          매장 규모와 임대료, 매출과 비용을 직접 넣으면 매출에서 비용을 뺀 금액을 바로 계산합니다. 처음 값은 계산 방식을 보여 드리기 위한 예시입니다.
        </Reveal>

        <div className="w-sim__grid">
          <div className="w-sim__inputs">
            <div className="w-sim__mini" aria-hidden="true">
              <span>입력값 기준 계산</span>
              <b className={touched && loss ? 'is-loss' : undefined}>{shownResult}</b>
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
            <button type="button" className="w-link w-sim__reset" onClick={reset}>
              처음 값으로 되돌리기
            </button>
          </div>

          <div className={`w-sim__result${touched ? '' : ' is-idle'}`}>
            <p className="w-sim__eyebrow">입력값 기준 월 계산 결과</p>
            <p className={`w-sim__profit${touched && loss ? ' is-loss' : ''}`}>{shownResult}</p>
            <p className="w-sim__sub">
              {!touched ? '왼쪽 조건을 직접 움직이면 계산 결과가 나타납니다.' : loss ? '이 조건에서는 비용이 매출보다 큽니다.' : '입력한 월 매출에서 입력한 비용을 뺀 금액입니다.'}
            </p>

            {touched && (
              <>
                <div className="w-sim__bar" role="img" aria-label={`월 매출 ${fmtMan(v.sales)} 중 비용과 나머지의 비율`}>
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
                    <span>{loss ? '부족 금액' : '매출 − 비용'}</span>
                    <b>{fmtMan(Math.abs(r.profit))}</b>
                  </li>
                </ul>
                <p className="w-sim__bep">
                  입력한 비용 기준 손익분기 매출 <b>{fmtMan(r.bep)}</b>
                </p>
              </>
            )}

            <button type="button" className="w-btn w-btn--light w-btn--arrow" onClick={toInquiry}>
              이 조건으로 상담 신청
            </button>
            <p className="sr-only" aria-live="polite">
              {said}
            </p>
          </div>
        </div>

        <p className="w-method__note">
          입력값과 처음 값은 계산 방식을 보여 드리기 위한 예시이며, 예뻐졌다 매장의 실제 매출·비용·수익이 아닙니다. 가맹비·교육비·인테리어·장비 구입비와 감가상각, 카드 수수료, 세금 등은 계산에 포함되지 않았고, 수익을 보장하지 않습니다. 실제 조건은 상담에서 안내해 드립니다.{' '}
          <Todo>계산기 항목 · 처음 값 (실제 운영 수치 기준)</Todo>
        </p>
      </div>
    </section>
  )
}
