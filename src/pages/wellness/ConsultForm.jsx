import { useRef, useState } from 'react'
import { BRAND, BRANCHES, telHref } from './data'
import { Todo } from './ui'

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
  const p2Ref = useRef(null)
  const p3Ref = useRef(null)
  const phone = BRANCHES[form.branch]?.phone ?? BRANCHES.zai.phone

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setPending(false)
  }

  function setDigits(field, value, max, next) {
    const digits = value.replace(/\D/g, '').slice(0, max)
    set(field, digits)
    if (digits.length === max && next) next.current?.focus()
  }

  // 전체 번호를 붙여 넣으면 세 칸에 나누어 채운다.
  function onPastePhone(e) {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '')
    if (digits.length < 10 || !digits.startsWith('01')) return
    e.preventDefault()
    const tail = digits.slice(3, digits.length > 10 ? 11 : 10)
    const cut = tail.length - 4
    setForm((prev) => ({ ...prev, p1: digits.slice(0, 3), p2: tail.slice(0, cut), p3: tail.slice(cut) }))
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

      <fieldset className="w-field">
        <legend>
          연락처 <i aria-hidden="true">*</i>
        </legend>
        <div className="w-phone" onPaste={onPastePhone}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="tel-area-code"
            aria-label="연락처 앞자리"
            maxLength={3}
            value={form.p1}
            onChange={(e) => setDigits('p1', e.target.value, 3, p2Ref)}
            aria-required="true"
            {...err('phone')}
          />
          <span aria-hidden="true">-</span>
          <input
            ref={p2Ref}
            type="text"
            inputMode="numeric"
            aria-label="연락처 가운데 자리"
            maxLength={4}
            value={form.p2}
            onChange={(e) => setDigits('p2', e.target.value, 4, p3Ref)}
            aria-required="true"
            {...err('phone')}
          />
          <span aria-hidden="true">-</span>
          <input
            ref={p3Ref}
            type="text"
            inputMode="numeric"
            aria-label="연락처 뒷자리"
            maxLength={4}
            value={form.p3}
            onChange={(e) => setDigits('p3', e.target.value, 4)}
            aria-required="true"
            {...err('phone')}
          />
        </div>
        {errText('phone')}
      </fieldset>

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

      <div className="w-field">
        <label htmlFor="c-branch">
          방문 지점 <i aria-hidden="true">*</i>
        </label>
        <select id="c-branch" value={form.branch} onChange={(e) => set('branch', e.target.value)} aria-required="true" {...err('branch')}>
          <option value="">선택</option>
          {Object.values(BRANCHES).map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
        {errText('branch')}
      </div>

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

      <div className="w-field">
        <p className="w-field__label" id="c-terms-label">
          개인정보 수집 및 이용 동의 <i aria-hidden="true">*</i>
        </p>
        <div className="w-terms" tabIndex={0} role="region" aria-labelledby="c-terms-label">
          <p>
            {BRAND.company}(이하 &lsquo;회사&rsquo;)는 상담 예약을 위해 아래와 같이 개인정보를 수집·이용합니다.
          </p>
          <p>
            <strong>1. 수집 항목</strong>
            <br />
            성함, 연락처, 연락 가능 시간대, 방문 지점, 관심 관리(선택)
          </p>
          <p>
            <strong>2. 수집·이용 목적</strong>
            <br />
            상담 예약 확인 및 안내 연락
          </p>
          <p>
            <strong>3. 보유 및 이용 기간</strong>
            <br />
            <Todo>보유 기간</Todo> 후 지체 없이 파기합니다.
          </p>
          <p>
            <strong>4. 동의를 거부할 권리 및 불이익</strong>
            <br />
            동의를 거부하실 수 있습니다. 다만 거부 시 온라인 상담 신청이 제한되며, 전화로 직접 예약하실 수 있습니다.
          </p>
          <p>
            <strong>5. 개인정보 처리 책임자</strong>
            <br />
            <Todo>책임자 이름 · 연락처</Todo>
          </p>
        </div>
        <label className="w-check">
          <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} aria-required="true" {...err('agree')} />
          <span>개인정보 수집 및 이용에 동의합니다.</span>
        </label>
        {errText('agree')}
      </div>

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
