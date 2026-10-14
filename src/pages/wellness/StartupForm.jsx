import { useEffect, useRef, useState } from 'react'
import { BRANCHES, telHref } from './data'
import { ChoiceChips, ConsentBox, PhoneField } from './FormParts'
import { fireConfetti } from './motion'
import { scrollToId } from './scroll'
import './wellness-consult.css'

// 접수 연결(Firebase 등) 전까지는 false로 둔다. false면 입력한 내용은 어디로도 전송되지 않고,
// 제출하면 전화로 문의하라는 안내만 보여 준다(성공 화면과 폭죽도 나오지 않는다). 연결할 때 save() 안에서 저장하고 true로 바꾼다.
const SUBMIT_ENABLED = false

const KINDS = ['신규 창업 상담', '기존 샵 도입 상담']
const TIMINGS = ['3개월 이내', '6개월 이내', '1년 이내', '아직 정하지 않았습니다']

const STEPS = [
  { id: 'kind', short: '상담 유형', title: '어떤 상담을 원하시나요?' },
  { id: 'where', short: '지역 · 시기', title: '관심 있는 지역과 창업 희망 시기를 알려 주세요.' },
  { id: 'who', short: '연락처', title: '연락받으실 성함과 연락처를 남겨 주세요.' },
  { id: 'last', short: '마무리', title: '마지막으로, 궁금한 점이 있다면 남겨 주세요.' },
]
const LAST = STEPS.length - 1

// 단계별 검사: 해당 단계의 입력만 확인한다.
function validate(step, f) {
  const e = {}
  if (step === 0 && !f.kind) e.kind = '상담 유형을 선택해 주시기 바랍니다.'
  if (step === 1) {
    if (f.region.trim().length < 2) e.region = '관심 지역을 입력해 주시기 바랍니다.'
    if (!f.timing) e.timing = '창업 희망 시기를 선택해 주시기 바랍니다.'
  }
  if (step === 2) {
    if (f.name.trim().length < 2) e.name = '성함을 입력해 주시기 바랍니다.'
    if (!(/^01\d$/.test(f.p1) && /^\d{3,4}$/.test(f.p2) && /^\d{4}$/.test(f.p3))) e.phone = '연락처를 정확히 입력해 주시기 바랍니다.'
  }
  if (step === 3 && !f.agree) e.agree = '개인정보 수집 및 이용에 동의해 주시기 바랍니다.'
  return e
}

const validateAll = (f) => STEPS.reduce((acc, _, i) => ({ ...acc, ...validate(i, f) }), {})
const firstInvalidStep = (f) => STEPS.findIndex((_, i) => Object.keys(validate(i, f)).length > 0)

// 접수 연결 자리. SUBMIT_ENABLED를 true로 바꿀 때 여기서 문의 내용을 저장한다.
async function save() {
  // TODO(Firebase): 문의 내용을 저장한다.
}

// 창업·운영 상담 문의: 한 번에 한 질문씩 넘어가는 4단계 폼
export default function StartupForm() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState('fwd')
  const [form, setForm] = useState({ kind: '', region: '', timing: '', name: '', p1: '010', p2: '', p3: '', message: '', agree: false })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const formRef = useRef(null)
  const stepRef = useRef(null)
  const prevStep = useRef(step) // 단계가 실제로 바뀌었을 때만 포커스를 옮기기 위해
  const phone = BRANCHES.zai.phone

  // 단계가 바뀌면 새 단계의 첫 입력으로 포커스를 옮긴다(처음 그려질 때는 건드리지 않는다).
  // 단계마다 길이가 달라(4단계가 가장 길다) 아래쪽 '이전'·'다음'을 누르면 새 단계의 머리와 첫 칸이 고정 헤더 뒤나 화면 밖에 남을 수 있다.
  // 폼 머리(진행 막대)가 헤더에 가렸거나 첫 칸이 화면 아래로 벗어났으면 폼 제목으로 올린다(scroll-margin-top으로 헤더 아래에 멈춘다).
  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    const first = stepRef.current?.querySelector('input, textarea')
    first?.focus({ preventScroll: true })
    const navBottom = document.querySelector('.w-nav')?.getBoundingClientRect().bottom ?? 0
    const formTop = formRef.current?.getBoundingClientRect().top ?? 0
    const firstBottom = first?.getBoundingClientRect().bottom ?? 0
    if (formTop < navBottom || firstBottom > window.innerHeight) scrollToId('startup-form-title')
  }, [step])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setPending(false)
  }

  function focusInvalid() {
    requestAnimationFrame(() => stepRef.current?.querySelector('[aria-invalid="true"], [data-invalid] input')?.focus())
  }

  function goNext() {
    const found = validate(step, form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusInvalid()
      return
    }
    setDir('fwd')
    setStep((s) => Math.min(LAST, s + 1))
  }

  function goBack() {
    setErrors({})
    setDir('back')
    setStep((s) => Math.max(0, s - 1))
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (step < LAST) {
      goNext()
      return
    }
    const bad = firstInvalidStep(form)
    if (bad !== -1) {
      setErrors(validateAll(form))
      if (bad !== step) {
        setDir('back')
        setStep(bad)
      }
      focusInvalid()
      return
    }
    setErrors({})
    if (!SUBMIT_ENABLED) {
      setPending(true)
      return
    }
    const rect = e.currentTarget.querySelector('button[type="submit"]')?.getBoundingClientRect()
    await save()
    setDone(true)
    fireConfetti(rect && { x: rect.left + rect.width / 2, y: rect.top })
  }

  const ready = Object.keys(validate(step, form)).length === 0
  // 오류는 '다음'·제출 때 켜고(errors), 화면에는 그중 지금도 틀린 칸만 보인다. 칩을 고르거나 칸을 바로잡으면
  // 그 칸의 문구와 aria-invalid·data-invalid가 '다음'을 다시 누르기 전에 바로 사라진다.
  const now = validateAll(form)
  const shown = Object.fromEntries(Object.entries(errors).filter(([k]) => now[k]))
  const err = (id) => (shown[id] ? { 'aria-invalid': true, 'aria-describedby': `err-s-${id}` } : {})
  const errText = (id) =>
    shown[id] ? (
      <p className="w-form__error" id={`err-s-${id}`}>
        {shown[id]}
      </p>
    ) : null

  if (done) {
    return (
      <div className="w-wiz__done" role="status">
        <svg viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27l8 8 14-16" />
        </svg>
        <h4>문의가 접수되었습니다</h4>
        <p>남겨 주신 번호로 확인 후 연락드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form className="w-form w-wiz" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="w-wiz__progress" role="progressbar" aria-label="창업·운영 상담 신청 진행" aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-valuetext={`${STEPS.length}단계 중 ${step + 1}단계, ${STEPS[step].short}`}>
        <div className="w-wiz__meta">
          <span>
            STEP {step + 1} / {STEPS.length}
          </span>
          <span>{STEPS[step].short}</span>
        </div>
        <div className="w-wiz__track">
          <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div key={step} ref={stepRef} className={`w-wiz__step is-${dir}`}>
        <p className="w-step__q">
          <b>{step + 1}</b>
          {STEPS[step].title}
        </p>

        {step === 0 && <ChoiceChips idPrefix="s" legend="상담 유형" name="kind" options={KINDS} value={form.kind} onChange={(v) => set('kind', v)} error={shown.kind} />}

        {step === 1 && (
          <>
            <div className="w-field">
              <label htmlFor="s-region">
                관심 지역 <i aria-hidden="true">*</i>
              </label>
              <input id="s-region" type="text" autoComplete="address-level2" placeholder="예: 부산 남구" value={form.region} onChange={(e) => set('region', e.target.value)} aria-required="true" {...err('region')} />
              {errText('region')}
            </div>
            <div className="w-field">
              <p className="w-field__label" id="s-timing-label">
                창업 희망 시기 <i aria-hidden="true">*</i>
              </p>
              <ChoiceChips idPrefix="s" legend="창업 희망 시기" name="timing" options={TIMINGS} value={form.timing} onChange={(v) => set('timing', v)} error={shown.timing} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="w-field">
              <label htmlFor="s-name">
                성함 <i aria-hidden="true">*</i>
              </label>
              <input id="s-name" type="text" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-required="true" {...err('name')} />
              {errText('name')}
            </div>
            <PhoneField
              idPrefix="s"
              value={{ p1: form.p1, p2: form.p2, p3: form.p3 }}
              onChange={(next) => {
                setForm((prev) => ({ ...prev, ...next }))
                setPending(false)
              }}
              error={shown.phone}
            />
          </>
        )}

        {step === 3 && (
          <>
            <ul className="w-wiz__summary" aria-label="입력한 내용">
              <li>{form.kind}</li>
              <li>{form.region}</li>
              <li>{form.timing}</li>
              <li>{form.name}</li>
            </ul>
            <div className="w-field">
              <label htmlFor="s-message">문의 내용 (선택)</label>
              <textarea id="s-message" rows={3} value={form.message} onChange={(e) => set('message', e.target.value)} />
            </div>
            <ConsentBox
              idPrefix="s"
              purpose="창업·운영 상담"
              items="상담 유형, 성함, 연락처, 관심 지역, 창업 희망 시기, 문의 내용(선택)"
              refusal="동의를 거부하실 수 있습니다. 다만 거부 시 온라인 문의 신청이 제한되며, 전화로 직접 문의하실 수 있습니다."
              checked={form.agree}
              onChange={(v) => set('agree', v)}
              error={shown.agree}
            />
          </>
        )}
      </div>

      <div className="w-wiz__actions">
        {step > 0 && (
          <button type="button" className="w-link w-wiz__back" onClick={goBack}>
            이전
          </button>
        )}
        <button type="submit" className={`w-submit w-wiz__next${ready ? ' is-ready' : ''}`}>
          {step < LAST ? '다음' : '창업·운영 상담 신청하기'}
        </button>
      </div>

      {pending && (
        <p className="w-form__notice" role="status">
          문의 접수를 준비 중입니다. 입력하신 내용은 아직 전송되지 않았으니, 전화로 문의해 주시기 바랍니다.{' '}
          <a href={telHref(phone)}>{phone}</a>
        </p>
      )}
    </form>
  )
}
