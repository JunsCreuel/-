import { useRef } from 'react'
import { BRAND, BRANCHES } from './data'

// 상담 폼과 창업 문의 폼이 함께 쓰는 입력 조각과 클래스.

// 입력 칸 묶음(fieldset·div). 안의 * 표시는 잉크색
export const FIELD = 'm-0 min-w-0 border-0 p-0 [&_i]:text-ink [&_i]:not-italic'
// 칸 이름(label·legend·p)
export const LABEL = 'mb-[0.2rem] block p-0 text-[0.82rem] tracking-[0.04em] text-muted'
// 밑줄 하나짜리 입력 칸. 포커스하면 밑줄이 진해진다. 여러 줄 칸은 틀리면 붉은 밑줄(포커스 중에는 진한 밑줄)이고, 포커스하면 모서리가 둥글어진다
const FONT = '[font-family:inherit] [font-style:inherit] [font-variant:inherit] [font-weight:inherit]'
const LINE_INPUT = `block rounded-none border-0 border-b border-line-strong bg-transparent px-0 py-[0.55rem] ${FONT} text-[1.05rem] text-ink focus:border-b-ink focus:shadow-[0_1px_0_var(--w-ink)] focus:outline-none`
export const INPUT = `${LINE_INPUT} min-h-12 w-full leading-[inherit]`
export const TEXTAREA = `${LINE_INPUT} min-h-[6.5rem] w-full resize-y leading-[1.7] focus-visible:rounded-[6px] aria-invalid:border-b-[#9a3b2e] aria-invalid:focus:border-b-ink`
export const ERROR = 'mt-[0.4rem] text-[0.85rem] font-semibold text-[#9a3b2e]'

// 연락처 세 칸: 숫자만 받고, 칸이 차면 다음 칸으로 넘어가며, 전체 번호를 붙여 넣으면 나눠 채운다.
// fit이면 좁은 카드에서도 세 칸이 카드 안에 들어오게 칸이 줄어든다.
export function PhoneField({ value, onChange, error, idPrefix, fit = false }) {
  const p2Ref = useRef(null)
  const p3Ref = useRef(null)
  const errId = `err-${idPrefix}-phone`
  const invalid = error ? { 'aria-invalid': true, 'aria-describedby': errId } : {}
  // 입력 칸과 같은 모양이고 폭과 가운데 정렬만 다르다
  const cell = `${LINE_INPUT} min-h-12 leading-[inherit] text-center ${fit ? 'w-auto min-w-0 max-w-[5.2rem] flex-[1_1_0]' : 'w-[5.2rem]'}`

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
    <fieldset className={FIELD}>
      <legend className={LABEL}>
        연락처 <i aria-hidden="true">*</i>
      </legend>
      <div className={`flex items-center ${fit ? 'gap-2' : 'gap-[0.7rem]'} [&>span]:text-muted`} onPaste={onPaste}>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="tel-area-code"
          aria-label="연락처 앞자리"
          className={cell}
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
          className={cell}
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
          className={cell}
          maxLength={4}
          value={value.p3}
          onChange={(e) => setDigits('p3', e.target.value, 4)}
          aria-required="true"
          {...invalid}
        />
      </div>
      {error && (
        <p className={ERROR} id={errId}>
          {error}
        </p>
      )}
    </fieldset>
  )
}

// 개인정보 수집·이용 동의문과 체크박스. 보유 기간·책임자는 사장님 확인 후 바꿀 수 있다(docs v13).
export function ConsentBox({ idPrefix, purpose, items, refusal, checked, onChange, error }) {
  const labelId = `${idPrefix}-terms-label`
  const errId = `err-${idPrefix}-agree`
  return (
    <div className={FIELD}>
      <p className={LABEL} id={labelId}>
        개인정보 수집 및 이용 동의 <i aria-hidden="true">*</i>
      </p>
      <div
        className="mt-[0.4rem] h-[8.6rem] overflow-y-auto border border-line bg-[color-mix(in_srgb,var(--w-ink)_3%,var(--w-bg))] px-4 py-[0.9rem] text-[0.82rem] leading-[1.8] text-muted [&_p+p]:mt-[0.7rem]"
        tabIndex={0} role="region" aria-labelledby={labelId}>
        <p>
          {BRAND.company}(이하 &lsquo;스튜디오&rsquo;)는 「개인정보 보호법」 제15조에 따라 {purpose} 신청에 필요한 최소한의
          개인정보를 아래와 같이 수집·이용합니다.
        </p>
        <p>
          <strong>1. 수집·이용 목적</strong>
          <br />
          {purpose} 신청 접수, 상담 내용 확인 및 회신 연락
        </p>
        <p>
          <strong>2. 수집 항목</strong>
          <br />
          {items}
        </p>
        <p>
          <strong>3. 보유 및 이용 기간</strong>
          <br />
          상담 목적 달성 시 지체 없이 파기합니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.
        </p>
        <p>
          <strong>4. 동의를 거부할 권리 및 불이익</strong>
          <br />
          {refusal}
        </p>
        <p>
          <strong>5. 개인정보 보호책임자</strong>
          <br />
          대표 {BRAND.representative} · {BRANCHES.zai.phone}
        </p>
      </div>
      <label className="mx-0 mt-4 mb-0 flex cursor-pointer items-start gap-[0.7rem] p-0 text-[0.95rem] tracking-[0] text-ink">
        <input
          className="mx-0 mt-[0.15rem] mb-0 size-5 flex-none accent-ink"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          {...(error ? { 'aria-invalid': true, 'aria-describedby': errId } : {})}
        />
        <span>위 개인정보 수집 및 이용에 동의합니다.</span>
      </label>
      {error && (
        <p className={ERROR} id={errId}>
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
    <fieldset className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0" aria-describedby={error ? errId : undefined} data-invalid={error ? true : undefined}>
      <legend className="sr-only">{legend}</legend>
      {options.map((o) => (
        <label
          key={o}
          className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-[1.15rem] text-[0.92rem] transition-[background-color,color,border-color] duration-200 ease-[ease] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-accent motion-reduce:transition-none ${
            value === o ? 'border-espresso bg-espresso font-semibold text-white motion-safe:animate-opt-pop' : 'border-line-strong bg-transparent text-muted'
          }`}
        >
          <input className="absolute inset-0 m-0 size-full cursor-pointer opacity-0" type="radio" name={`${idPrefix}-${name}`} value={o} checked={value === o} onChange={() => onChange(o)} />
          <span>{o}</span>
        </label>
      ))}
      {error && (
        <p className={`${ERROR} basis-full`} id={errId}>
          {error}
        </p>
      )}
    </fieldset>
  )
}
