import { Fragment, useEffect, useRef, useState } from 'react'
import { BRAND, STARTUP_CONTACTS, telHref } from './data'
import { ChoiceChips, ConsentBox, PhoneField } from './FormParts'
import { scrollToId } from './scroll'
import './wellness-consult.css'

// 창업·운영 상담은 문자·전화로 받는다(서버에 저장하지 않는다).
// - 휴대폰: 문자 앱을 열어 SMS_PHONE으로 보낼 상담 내용을 채워 준다(전송은 손님이 누른다).
// - PC: 전화번호와 상담 내용 복사를 안내한다.
// 창업 상담은 용호 자이점에서 진행하므로 문자는 첫 번째 번호(용호 자이점)로 보낸다. 전화는 STARTUP_CONTACTS를 지점 이름과 함께 모두 보여 준다.
const SMS_PHONE = STARTUP_CONTACTS[0].phone
const onlyDigits = (s) => s.replace(/\D/g, '')
const smsHref = (text) => `sms:${onlyDigits(SMS_PHONE)}?&body=${encodeURIComponent(text)}`

// 웰니스 스튜디오 창업은 모두 신규 창업이다. 두 번째는 창업이 아니라, 이미 운영 중인 샵이 장비·프로그램만 들이는 문의다.
const KINDS = ['신규 창업 상담', '기존 샵 장비·프로그램 도입 상담']
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

// 문자로 보낼 상담 내용
function buildMessage(f) {
  return [
    `[${BRAND.company} 홈페이지 창업·운영 상담]`,
    `상담 유형: ${f.kind}`,
    `관심 지역: ${f.region.trim()}`,
    `희망 시기: ${f.timing}`,
    `성함: ${f.name.trim()}`,
    `연락처: ${f.p1}-${f.p2}-${f.p3}`,
    ...(f.message.trim() ? [`문의 내용: ${f.message.trim()}`] : []),
  ].join('\n')
}

// 창업·운영 상담 문의: 한 번에 한 질문씩 넘어가는 4단계 폼
export default function StartupForm() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState('fwd')
  const [form, setForm] = useState({ kind: '', region: '', timing: '', name: '', p1: '010', p2: '', p3: '', message: '', agree: false })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null) // null | 'sms' | 'pc'
  const [copied, setCopied] = useState(false)
  const formRef = useRef(null)
  const stepRef = useRef(null)
  const prevStep = useRef(step) // 단계가 실제로 바뀌었을 때만 포커스를 옮기기 위해

  // 단계가 바뀌면 새 단계의 첫 입력으로 포커스를 옮긴다(처음 그려질 때는 건드리지 않는다).
  // 단계마다 길이가 달라(4단계가 가장 길다) 아래쪽 '이전'·'다음'을 누르면 새 단계의 머리와 첫 칸이 고정 헤더 뒤나 화면 밖에 남을 수 있다.
  // 폼 머리(진행 막대)가 헤더에 가렸거나 첫 칸이 화면 아래로 벗어났으면 폼 제목으로 올린다(scroll-margin-top으로 헤더 아래에 멈춘다).
  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    const first = stepRef.current?.querySelector('input, textarea')
    first?.focus({ preventScroll: true })
    const navBottom = document.querySelector('[data-site-nav]')?.getBoundingClientRect().bottom ?? 0
    const formTop = formRef.current?.getBoundingClientRect().top ?? 0
    const firstBottom = first?.getBoundingClientRect().bottom ?? 0
    if (formTop < navBottom || firstBottom > window.innerHeight) scrollToId('startup-form-title')
  }, [step])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
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

  function onSubmit(e) {
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
    const touch = window.matchMedia?.('(pointer: coarse)').matches
    if (touch) {
      setDone('sms')
      window.location.href = smsHref(buildMessage(form))
    } else {
      setDone('pc')
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(buildMessage(form))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  function restart() {
    setDone(null)
    setCopied(false)
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
      <div className="w-wiz__done w-wiz__done--contact" role="status">
        {done === 'sms' ? (
          <>
            <h4>문자 앱에 상담 내용을 채워 두었어요</h4>
            <p>문자 앱에서 전송을 누르시면 바로 접수됩니다. 앱이 열리지 않았다면 아래 버튼을 눌러 주세요.</p>
            <a className="w-submit w-wiz__done-go" href={smsHref(buildMessage(form))}>
              문자로 보내기
            </a>
          </>
        ) : (
          <>
            <h4>전화 또는 문자로 접수해 주세요</h4>
            <p>아래 번호로 전화 주시거나, 상담 내용을 복사해 문자로 보내 주시면 바로 연락드리겠습니다.</p>
            <button type="button" className="w-submit w-wiz__done-go" onClick={copyMessage}>
              {copied ? '복사했어요' : '상담 내용 복사'}
            </button>
          </>
        )}
        <p className="w-wiz__done-tels">
          {STARTUP_CONTACTS.map((c, i) => (
            <Fragment key={c.id}>
              {i > 0 && ' · '}
              {c.label} <a href={telHref(c.phone)}>{c.phone}</a>
            </Fragment>
          ))}
        </p>
        <button type="button" className="w-link w-wiz__again" onClick={restart}>
          다시 작성하기
        </button>
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
              onChange={(next) => setForm((prev) => ({ ...prev, ...next }))}
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
              items="[필수] 상담 유형, 성함, 휴대전화번호, 관심 지역, 창업 희망 시기 · [선택] 문의 내용"
              refusal="개인정보 수집·이용에 대한 동의를 거부하실 수 있습니다. 다만 동의하지 않으시면 온라인 상담 신청이 제한되며, 전화로 문의하실 수 있습니다."
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
          {step < LAST ? '다음' : '상담 신청하기'}
        </button>
      </div>

    </form>
  )
}
