import { useEffect, useState } from 'react'
import { useTween } from '../motion'
import { scrollToId } from '../scroll'
import { Todo } from '../ui'

// 창업 비용 구조 계산기. 입력한 숫자로 "매출 − 비용"을 계산해 보여 주는 계산기일 뿐이다.
// 처음 값은 15평 매장 기준 예시(월세 150만원·관리비 40만원·기타 10만원 → 매장 고정비 약 200만원)이고,
// 매출·인건비·재료비 처음 값은 계산 방식을 보여 주기 위한 예시다. 근거 없는 예상 수익처럼 보이지 않도록(가맹사업법 제9조),
// 슬라이더를 직접 움직이기 전에는 수익 결과를 보여 주지 않고, 매출 대비 비율·연 환산도 내지 않는다.
// 매장 고정비(월세·관리비·기타)는 비용 정보라 처음부터 보여 준다.
//
// 월세·관리비는 평당 단가로 기억한다. 평수를 바꾸면 같은 단가로 금액이 함께 바뀌고(15평 → 30평이면 두 배),
// 월세·관리비 슬라이더를 직접 움직이면 그 금액에 맞춰 평당 단가가 다시 정해진다.
const DEFAULTS = { area: 15, rentRate: 10, mgmtRate: 40 / 15, etc: 10, sales: 1500, labor: 400, material: 12 }

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

// 평당 단가: 10 → '10만원', 2.666… → '약 2.7만원'
function fmtRate(rate) {
  const r = Math.round(rate * 10) / 10
  const exact = Math.abs(rate - r) < 0.01
  return `${exact ? '' : '약 '}${r.toLocaleString('ko-KR')}만원`
}

function calc(s) {
  const rent = Math.round(s.rentRate * s.area)
  const mgmt = Math.round(s.mgmtRate * s.area)
  const store = rent + mgmt + s.etc // 매장 고정비(월세·관리비·기타)
  const material = (s.sales * s.material) / 100
  const fixed = store + s.labor // 손익분기 계산용 고정비(인건비 포함)
  const profit = s.sales - fixed - material
  const bep = fixed / (1 - s.material / 100)
  return { rent, mgmt, store, material, fixed, profit, bep }
}

// 슬라이더 목록. 월세·관리비의 범위는 평수에 맞춰 바뀐다(평당 2~30만원, 0~8만원).
function fieldsFor(s, r) {
  return [
    {
      id: 'area',
      label: '매장 규모',
      min: 10,
      max: 60,
      step: 1,
      value: s.area,
      shown: `${s.area}평`,
      valuetext: `${s.area}평, 매장 고정비 ${fmtMan(r.store)}`,
      hint: '평수를 바꾸면 월세·관리비가 지금의 평당 단가 그대로 함께 바뀝니다.',
    },
    {
      id: 'rent',
      label: '월세',
      min: s.area * 2,
      max: s.area * 30,
      step: 1,
      value: r.rent,
      shown: fmtMan(r.rent),
      sub: `평당 ${fmtRate(s.rentRate)}`,
      hint: '15평 기준 예시는 월 150만원(평당 10만원)입니다. 지역·층·건물에 따라 크게 다릅니다.',
    },
    {
      id: 'mgmt',
      label: '관리비',
      min: 0,
      max: s.area * 8,
      step: 1,
      value: r.mgmt,
      shown: fmtMan(r.mgmt),
      sub: `평당 ${fmtRate(s.mgmtRate)}`,
      hint: '건물 관리비(공용 전기·청소·주차 등)로, 보통 평수에 비례해 매겨집니다. 15평 기준 예시는 월 40만원입니다.',
    },
    {
      id: 'etc',
      label: '기타 고정비',
      min: 0,
      max: 300,
      step: 5,
      value: s.etc,
      shown: fmtMan(s.etc),
      hint: '통신·보험·광고·세무처럼 평수와 상관없는 고정 비용입니다.',
    },
    {
      id: 'sales',
      label: '월 매출',
      min: 500,
      max: 15000,
      step: 100,
      value: s.sales,
      shown: fmtMan(s.sales),
      hint: '방문 수 × 객단가로 직접 가늠해 넣어 보세요.',
    },
    {
      id: 'labor',
      label: '월 인건비',
      min: 0,
      max: 1500,
      step: 50,
      value: s.labor,
      shown: fmtMan(s.labor),
      hint: '본인 급여를 넣을지는 직접 정하세요. 평수가 늘면 관리사도 늘 수 있습니다.',
    },
    {
      id: 'material',
      label: '재료·소모품 비율',
      min: 3,
      max: 40,
      step: 1,
      value: s.material,
      shown: `${s.material}%`,
      hint: '월 매출 대비 비율입니다.',
    },
  ]
}

// 결과 자리에서 슬라이더 쪽을 가리키는 손짓(장식). 계산기가 2열(900px 이상)이면 왼쪽, 1열이면 위를 가리킨다.
function Nudge() {
  return (
    <span className="yw-sim__nudge" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M10 9.5V4a2 2 0 0 0-4 0v10" />
        <path d="M10 9.5V9a2 2 0 0 1 4 0v1" />
        <path d="M14 10a2 2 0 0 1 4 0v1" />
        <path d="M18 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.3l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" />
      </svg>
    </span>
  )
}

// 창업 장(Startup)의 접힘 안에 들어가는 계산기: 자체 섹션·라벨·제목·리드 없이 sr-only h3를 두고,
// 힌트 문장은 ⓘ 토글팁(말풍선)으로 보여 준다.
export default function Simulator() {
  const [s, setS] = useState(DEFAULTS)
  const [touched, setTouched] = useState(false) // 슬라이더를 한 번이라도 움직였는지
  const [said, setSaid] = useState('') // 스크린리더 안내(움직임이 멈춘 뒤 한 번만 읽힌다)
  const [tip, setTip] = useState(null) // 열린 도움말(필드 id)
  const [tipX, setTipX] = useState(0) // 말풍선 꼬리 위치(ⓘ 가운데, px)
  const r = calc(s)
  const profitShown = useTween(r.profit)
  const fields = fieldsFor(s, r)

  // 막대: 매출을 100%로 보고 비용 칸과 남는 칸을 나눈다. 비용이 매출을 넘으면 비용 합을 100%로 본다.
  const total = Math.max(s.sales, r.store + s.labor + r.material)
  const pct = (n) => `${Math.max(0, (n / total) * 100).toFixed(2)}%`
  const parts = [
    { id: 'fixed', label: '매장 고정비', detail: `월세 ${fmtMan(r.rent)} · 관리비 ${fmtMan(r.mgmt)} · 기타 ${fmtMan(s.etc)}`, value: r.store },
    { id: 'labor', label: '인건비', value: s.labor },
    { id: 'material', label: '재료·소모품', value: r.material },
  ]
  const loss = r.profit < 0
  const shownResult = touched ? fmtMan(profitShown) : '—'

  // 슬라이더를 끄는 동안 매번 읽지 않도록, 멈추고 0.8초 뒤에 결과를 한 번 알린다
  useEffect(() => {
    if (!touched) return undefined
    const id = setTimeout(() => setSaid(`입력값 기준 계산 결과 ${loss ? '부족 금액' : '매출에서 비용을 뺀 금액'} ${fmtMan(Math.abs(r.profit))}`), 800)
    return () => clearTimeout(id)
  }, [touched, loss, r.profit])

  // 도움말 말풍선: 바깥을 누르거나 Escape면 닫는다
  useEffect(() => {
    if (!tip) return undefined
    const onDown = (e) => {
      if (!e.target.closest?.('.yw-tip')) setTip(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [tip])

  function toggleTip(e, id) {
    const btn = e.currentTarget
    setTipX(btn.offsetLeft + btn.offsetWidth / 2)
    setTip((t) => (t === id ? null : id))
  }

  function onTipKey(e) {
    if (e.key === 'Escape' && tip) {
      e.stopPropagation()
      setTip(null)
    }
  }

  // 월세·관리비는 금액을 받아 평당 단가로 바꿔 기억한다. 평수는 단가를 그대로 두고 바꾼다.
  function set(id, raw) {
    const value = Number(raw)
    setS((prev) => {
      if (id === 'rent') return { ...prev, rentRate: value / prev.area }
      if (id === 'mgmt') return { ...prev, mgmtRate: value / prev.area }
      return { ...prev, [id]: value }
    })
    setTouched(true)
  }

  function reset() {
    setS(DEFAULTS)
    setTouched(false)
    setSaid('')
  }

  // 상담 문의에는 입력 조건만 넘긴다(계산된 손익은 넘기지 않는다)
  function toInquiry() {
    const summary = `[시뮬레이터 입력 조건] 규모 ${s.area}평, 월세 ${fmtMan(r.rent)}, 관리비 ${fmtMan(r.mgmt)}, 기타 고정비 ${fmtMan(s.etc)}(매장 고정비 ${fmtMan(r.store)}), 월 매출 ${fmtMan(s.sales)}, 인건비 ${fmtMan(s.labor)}, 재료·소모품 ${s.material}%`
    window.dispatchEvent(new CustomEvent('w-sim-summary', { detail: summary }))
    scrollToId('startup')
    document.getElementById('startup-form-title')?.focus({ preventScroll: true })
  }

  const field = (f) => {
    const fill = f.max > f.min ? ((f.value - f.min) / (f.max - f.min)) * 100 : 0
    return (
      <div key={f.id} className="w-sim__field">
        <div className="w-sim__row">
          <label htmlFor={`sim-${f.id}`}>{f.label}</label>
          <button
            type="button"
            className="yw-tip"
            aria-label={`${f.label} 도움말`}
            aria-expanded={tip === f.id}
            aria-controls={`sim-hint-${f.id}`}
            onClick={(e) => toggleTip(e, f.id)}
          >
            <span aria-hidden="true">i</span>
          </button>
          <output htmlFor={`sim-${f.id}`}>
            {f.shown}
            {f.sub && <small className="yw-sim__rate">{f.sub}</small>}
          </output>
        </div>
        <p id={`sim-hint-${f.id}`} className="yw-tip__body" hidden={tip !== f.id} style={{ '--tail': `${tipX}px` }}>
          {f.hint}
        </p>
        <input
          id={`sim-${f.id}`}
          type="range"
          min={f.min}
          max={f.max}
          step={f.step}
          value={f.value}
          style={{ '--fill': `${Math.min(100, Math.max(0, fill))}%` }}
          aria-valuetext={f.valuetext ?? (f.sub ? `${f.shown}, ${f.sub}` : f.shown)}
          aria-describedby={`sim-hint-${f.id}`}
          onChange={(e) => set(f.id, e.target.value)}
        />
      </div>
    )
  }

  const grid = (
    <div className="w-sim__grid">
      <div className="w-sim__inputs">
        <div className="w-sim__mini" aria-hidden="true">
          <span>입력값 기준 계산</span>
          <b className={touched && loss ? 'is-loss' : undefined}>{shownResult}</b>
        </div>

        {fields.slice(0, 4).map(field)}

        {/* 매장 고정비 합계: 비용 정보라 처음부터 보인다. 평수를 바꾸면 함께 바뀐다(15평 200만원 → 30평 390만원). */}
        <div className="yw-sim__store">
          <p className="yw-sim__store-row">
            <span>매장 고정비</span>
            <b>{fmtMan(r.store)}</b>
          </p>
          <p className="yw-sim__store-sub">
            {s.area}평 · 월세 {fmtMan(r.rent)} + 관리비 {fmtMan(r.mgmt)} + 기타 {fmtMan(s.etc)}
          </p>
        </div>

        {fields.slice(4).map(field)}

        <button type="button" className="w-link w-sim__reset" onClick={reset}>
          처음 값으로 되돌리기
        </button>
      </div>

      <div className={`w-sim__result${touched ? '' : ' is-idle'}`}>
        <p className="w-sim__eyebrow">입력값 기준 월 계산 결과</p>
        <p className={`w-sim__profit${touched && loss ? ' is-loss' : ''}`}>
          {shownResult}
          {!touched && <Nudge />}
        </p>
        <p className="w-sim__sub">
          {!touched ? '왼쪽 조건을 직접 움직이면 계산 결과가 나타납니다.' : loss ? '이 조건에서는 비용이 매출보다 큽니다.' : '입력한 월 매출에서 입력한 비용을 뺀 금액입니다.'}
        </p>

        {touched && (
          <>
            <div className="w-sim__bar" role="img" aria-label={`월 매출 ${fmtMan(s.sales)} 중 비용과 나머지의 비율`}>
              {parts.map((p) => (
                <span key={p.id} className={`w-sim__seg is-${p.id}`} style={{ width: pct(p.value) }} />
              ))}
              {!loss && <span className="w-sim__seg is-profit" style={{ width: pct(r.profit) }} />}
            </div>
            <ul className="w-sim__legend">
              {parts.map((p) => (
                <li key={p.id}>
                  <i className={`is-${p.id}`} aria-hidden="true" />
                  <span>
                    {p.label}
                    {p.detail && <small className="yw-sim__detail">{p.detail}</small>}
                  </span>
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
  )

  const note = (
    <p className="w-method__note">
      처음 값은 15평 매장 기준 예시입니다(월세 150만원 · 관리비 40만원 · 기타 10만원, 매장 고정비 약 200만원). 평수를 바꾸면 월세·관리비가 같은 평당
      단가로 함께 바뀌지만, 실제 임대 조건은 지역·층·건물에 따라 크게 다릅니다. 매출·인건비·재료비 처음 값은 계산 방식을 보여 드리기 위한 예시로 실제
      매장의 수치가 아닙니다. 가맹비·교육비·인테리어·장비 구입비와 감가상각, 카드 수수료, 세금 등은 계산에 포함되지 않았고, 수익을 보장하지 않습니다.
      실제 조건은 상담에서 안내해 드립니다. <Todo>매출·인건비 처음 값 (실제 운영 수치 기준)</Todo>
    </p>
  )

  return (
    // Escape로 열린 도움말을 닫는다(포커스가 계산기 안 어디에 있든)
    <div className="yw-sim" onKeyDown={onTipKey}>
      <h3 className="sr-only">창업 비용 구조 계산기</h3>
      {grid}
      {note}
    </div>
  )
}
