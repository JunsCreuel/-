import { useRef, useState } from 'react'
import { BRANCHES, telHref } from './data'
import { ConsentBox, PhoneField } from './FormParts'
import './wellness-consult.css'

// 접수 연결(Firebase 등) 전까지는 false로 둔다. false면 입력한 내용은 어디로도 전송되지 않고,
// 제출하면 전화로 문의하라는 안내만 보여 준다. 연결할 때 onSubmit 안에서 저장하는 코드를 넣고 true로 바꾼다.
const SUBMIT_ENABLED = false

const TIMINGS = ['3개월 이내', '6개월 이내', '1년 이내', '아직 정하지 않았습니다']

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = '성함을 입력해 주시기 바랍니다.'
  if (!(/^01\d$/.test(f.p1) && /^\d{3,4}$/.test(f.p2) && /^\d{4}$/.test(f.p3))) e.phone = '연락처를 정확히 입력해 주시기 바랍니다.'
  if (f.region.trim().length < 2) e.region = '관심 지역을 입력해 주시기 바랍니다.'
  if (!f.timing) e.timing = '창업 희망 시기를 선택해 주시기 바랍니다.'
  if (!f.agree) e.agree = '개인정보 수집 및 이용에 동의해 주시기 바랍니다.'
  return e
}

// 창업·운영 상담 문의 폼
export default function StartupForm() {
  const [form, setForm] = useState({ name: '', p1: '010', p2: '', p3: '', region: '', timing: '', message: '', agree: false })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const formRef = useRef(null)
  const phone = BRANCHES.zai.phone

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setPending(false)
  }

  function onSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setPending(false)
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    if (!SUBMIT_ENABLED) {
      setPending(true)
      return
    }
    // TODO(Firebase): 여기서 문의 내용을 저장하고 접수 완료 화면을 보여 준다.
  }

  const err = (id) => (errors[id] ? { 'aria-invalid': true, 'aria-describedby': `err-s-${id}` } : {})
  const errText = (id) =>
    errors[id] ? (
      <p className="w-form__error" id={`err-s-${id}`}>
        {errors[id]}
      </p>
    ) : null

  return (
    <form className="w-form" ref={formRef} onSubmit={onSubmit} noValidate>
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
        error={errors.phone}
      />

      <div className="w-field">
        <label htmlFor="s-region">
          관심 지역 <i aria-hidden="true">*</i>
        </label>
        <input id="s-region" type="text" autoComplete="address-level2" placeholder="예: 부산 남구" value={form.region} onChange={(e) => set('region', e.target.value)} aria-required="true" {...err('region')} />
        {errText('region')}
      </div>

      <div className="w-field">
        <label htmlFor="s-timing">
          창업 희망 시기 <i aria-hidden="true">*</i>
        </label>
        <select id="s-timing" value={form.timing} onChange={(e) => set('timing', e.target.value)} aria-required="true" {...err('timing')}>
          <option value="">선택</option>
          {TIMINGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errText('timing')}
      </div>

      <div className="w-field">
        <label htmlFor="s-message">문의 내용 (선택)</label>
        <textarea id="s-message" rows={3} value={form.message} onChange={(e) => set('message', e.target.value)} />
      </div>

      <ConsentBox
        idPrefix="s"
        purpose="창업·운영 상담"
        items="성함, 연락처, 관심 지역, 창업 희망 시기, 문의 내용(선택)"
        refusal="동의를 거부하실 수 있습니다. 다만 거부 시 온라인 문의 신청이 제한되며, 전화로 직접 문의하실 수 있습니다."
        checked={form.agree}
        onChange={(v) => set('agree', v)}
        error={errors.agree}
      />

      <button type="submit" className="w-submit">
        창업·운영 상담 신청하기
      </button>

      {pending && (
        <p className="w-form__notice" role="status">
          문의 접수를 준비 중입니다. 입력하신 내용은 아직 전송되지 않았으니, 전화로 문의해 주시기 바랍니다.{' '}
          <a href={telHref(phone)}>{phone}</a>
        </p>
      )}
    </form>
  )
}
