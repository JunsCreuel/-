import { useRef } from 'react'
import { BRAND } from './data'
import { Todo } from './ui'

// 상담 폼과 창업 문의 폼이 함께 쓰는 입력 조각.

// 연락처 세 칸: 숫자만 받고, 칸이 차면 다음 칸으로 넘어가며, 전체 번호를 붙여 넣으면 나눠 채운다.
export function PhoneField({ value, onChange, error, idPrefix }) {
  const p2Ref = useRef(null)
  const p3Ref = useRef(null)
  const errId = `err-${idPrefix}-phone`
  const invalid = error ? { 'aria-invalid': true, 'aria-describedby': errId } : {}

  function setDigits(field, text, max, next) {
    const digits = text.replace(/\D/g, '').slice(0, max)
    onChange({ ...value, [field]: digits })
    if (digits.length === max && next) next.current?.focus()
  }

  function onPaste(e) {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '')
    if (digits.length < 10 || !digits.startsWith('01')) return
    e.preventDefault()
    const tail = digits.slice(3, digits.length > 10 ? 11 : 10)
    const cut = tail.length - 4
    onChange({ p1: digits.slice(0, 3), p2: tail.slice(0, cut), p3: tail.slice(cut) })
  }

  return (
    <fieldset className="w-field">
      <legend>
        연락처 <i aria-hidden="true">*</i>
      </legend>
      <div className="w-phone" onPaste={onPaste}>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="tel-area-code"
          aria-label="연락처 앞자리"
          maxLength={3}
          value={value.p1}
          onChange={(e) => setDigits('p1', e.target.value, 3, p2Ref)}
          aria-required="true"
          {...invalid}
        />
        <span aria-hidden="true">-</span>
        <input
          ref={p2Ref}
          type="text"
          inputMode="numeric"
          aria-label="연락처 가운데 자리"
          maxLength={4}
          value={value.p2}
          onChange={(e) => setDigits('p2', e.target.value, 4, p3Ref)}
          aria-required="true"
          {...invalid}
        />
        <span aria-hidden="true">-</span>
        <input
          ref={p3Ref}
          type="text"
          inputMode="numeric"
          aria-label="연락처 뒷자리"
          maxLength={4}
          value={value.p3}
          onChange={(e) => setDigits('p3', e.target.value, 4)}
          aria-required="true"
          {...invalid}
        />
      </div>
      {error && (
        <p className="w-form__error" id={errId}>
          {error}
        </p>
      )}
    </fieldset>
  )
}

// 개인정보 수집·이용 동의문과 체크박스. 보유 기간과 처리 책임자는 확정 전이라 자리표시로 둔다.
export function ConsentBox({ idPrefix, purpose, items, refusal, checked, onChange, error }) {
  const labelId = `${idPrefix}-terms-label`
  const errId = `err-${idPrefix}-agree`
  return (
    <div className="w-field">
      <p className="w-field__label" id={labelId}>
        개인정보 수집 및 이용 동의 <i aria-hidden="true">*</i>
      </p>
      <div className="w-terms" tabIndex={0} role="region" aria-labelledby={labelId}>
        <p>
          {BRAND.company}(이하 &lsquo;회사&rsquo;)는 {purpose}을 위해 아래와 같이 개인정보를 수집·이용합니다.
        </p>
        <p>
          <strong>1. 수집 항목</strong>
          <br />
          {items}
        </p>
        <p>
          <strong>2. 수집·이용 목적</strong>
          <br />
          {purpose} 확인 및 안내 연락
        </p>
        <p>
          <strong>3. 보유 및 이용 기간</strong>
          <br />
          <Todo>보유 기간</Todo> 후 지체 없이 파기합니다.
        </p>
        <p>
          <strong>4. 동의를 거부할 권리 및 불이익</strong>
          <br />
          {refusal}
        </p>
        <p>
          <strong>5. 개인정보 처리 책임자</strong>
          <br />
          <Todo>책임자 이름 · 연락처</Todo>
        </p>
      </div>
      <label className="w-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          {...(error ? { 'aria-invalid': true, 'aria-describedby': errId } : {})}
        />
        <span>개인정보 수집 및 이용에 동의합니다.</span>
      </label>
      {error && (
        <p className="w-form__error" id={errId}>
          {error}
        </p>
      )}
    </div>
  )
}

// 알약 모양 선택지(라디오). 상담 신청 3단계와 창업 문의 단계 폼이 함께 쓴다.
export function ChoiceChips({ legend, name, options, value, onChange, error, idPrefix }) {
  const errId = `err-${idPrefix}-${name}`
  return (
    <fieldset className="w-step__choices" aria-describedby={error ? errId : undefined}>
      <legend className="sr-only">{legend}</legend>
      {options.map((o) => (
        <label key={o} className={`w-opt${value === o ? ' is-on' : ''}`}>
          <input type="radio" name={`${idPrefix}-${name}`} value={o} checked={value === o} onChange={() => onChange(o)} />
          <span>{o}</span>
        </label>
      ))}
      {error && (
        <p className="w-form__error" id={errId}>
          {error}
        </p>
      )}
    </fieldset>
  )
}
