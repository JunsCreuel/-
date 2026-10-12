import { useRef, useState } from 'react'
import { BRANCHES, OPEN_BRANCHES, telHref } from './data'
import { ConsentBox, PhoneField } from './FormParts'

// 신청 접수가 연결되기 전까지는 false로 둔다. 이 값이 false면 입력한 내용은 어디로도 전송되지 않고,
// 제출하면 전화로 예약하라는 안내만 보여 준다. Firebase를 연결할 때 submit 안에서 저장하는 코드를 넣고 true로 바꾼다.
const SUBMIT_ENABLED = false

const TIMES = ['오전 (10시~12시)', '점심 (12시~2시)', '오후 (2시~5시)', '늦은 오후 (5시~7시)', '시간 무관']
const INTERESTS = ['두피-얼굴 관리', '전신웜업케어(온열돔)', '바디 케어', '림프 케어', '상담 후 결정']

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = '성함을 입력해 주시기 바랍니다.'
  if (!(/^01\d$/.test(f.p1) && /^\d{3,4}$/.test(f.p2) && /^\d{4}$/.test(f.p3))) e.phone = '연락처를 정확히 입력해 주시기 바랍니다.'
  if (!f.time) e.time = '연락 가능하신 시간대를 선택해 주시기 바랍니다.'
  if (!f.branch) e.branch = '방문 지점을 선택해 주시기 바랍니다.'
  if (!f.agree) e.agree = '개인정보 수집 및 이용에 동의해 주시기 바랍니다.'
  return e
}

export default function ConsultForm({ defaultBranch = 'zai' }) {
  const [form, setForm] = useState({ name: '', p1: '010', p2: '', p3: '', time: '', branch: defaultBranch, interest: '', agree: false })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const formRef = useRef(null)
  const phone = BRANCHES[form.branch]?.phone ?? BRANCHES.zai.phone

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
    // TODO(Firebase): 여기서 신청 내용을 저장하고 접수 완료 화면을 보여 준다.
  }

  const err = (id) => (errors[id] ? { 'aria-invalid': true, 'aria-describedby': `err-${id}` } : {})
  const errText = (id) =>
    errors[id] ? (
      <p className="w-form__error" id={`err-${id}`}>
        {errors[id]}
      </p>
    ) : null

  return (
    <form className="w-form" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="w-field">
        <label htmlFor="c-name">
          성함 <i aria-hidden="true">*</i>
        </label>
        <input
          id="c-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          aria-required="true"
          {...err('name')}
        />
        {errText('name')}
      </div>

      <PhoneField
        idPrefix="c"
        value={{ p1: form.p1, p2: form.p2, p3: form.p3 }}
        onChange={(next) => {
          setForm((prev) => ({ ...prev, ...next }))
          setPending(false)
        }}
        error={errors.phone}
      />

      <div className="w-field">
        <label htmlFor="c-time">
          연락 가능하신 시간대 <i aria-hidden="true">*</i>
        </label>
        <select id="c-time" value={form.time} onChange={(e) => set('time', e.target.value)} aria-required="true" {...err('time')}>
          <option value="">선택</option>
          {TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errText('time')}
      </div>

      {/* 오픈한 지점이 하나뿐이면 지점 선택 칸을 보이지 않고 그 지점으로 접수한다. */}
      {OPEN_BRANCHES.length > 1 && (
        <div className="w-field">
          <label htmlFor="c-branch">
            방문 지점 <i aria-hidden="true">*</i>
          </label>
          <select id="c-branch" value={form.branch} onChange={(e) => set('branch', e.target.value)} aria-required="true" {...err('branch')}>
            <option value="">선택</option>
            {OPEN_BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          {errText('branch')}
        </div>
      )}

      <div className="w-field">
        <label htmlFor="c-interest">관심 관리 (선택)</label>
        <select id="c-interest" value={form.interest} onChange={(e) => set('interest', e.target.value)}>
          <option value="">선택</option>
          {INTERESTS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ConsentBox
        idPrefix="c"
        purpose="상담 예약"
        items="성함, 연락처, 연락 가능 시간대, 방문 지점, 관심 관리(선택)"
        refusal="동의를 거부하실 수 있습니다. 다만 거부 시 온라인 상담 신청이 제한되며, 전화로 직접 예약하실 수 있습니다."
        checked={form.agree}
        onChange={(v) => set('agree', v)}
        error={errors.agree}
      />

      <button type="submit" className="w-submit">
        상담 예약 신청하기
      </button>

      {pending && (
        <p className="w-form__notice" role="status">
          신청 접수를 준비 중입니다. 입력하신 내용은 아직 전송되지 않았으니, 전화로 예약해 주시기 바랍니다.{' '}
          <a href={telHref(phone)}>{phone}</a>
        </p>
      )}
    </form>
  )
}
