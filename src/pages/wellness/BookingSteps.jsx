import { useRef, useState } from 'react'
import { BRANCHES, telHref } from './data'
import { ConsentBox, PhoneField } from './FormParts'
import './wellness-consult.css'

// 접수 연결(Firebase 등) 전까지는 false로 둔다. false면 입력한 내용은 어디로도 전송되지 않고,
// 제출하면 전화로 예약하라는 안내만 보여 준다. 연결할 때 onSubmit 안에서 저장하는 코드를 넣고 true로 바꾼다.
const SUBMIT_ENABLED = false

const AREAS = ['두피 · 얼굴', '등 · 어깨', '복부', '하체 · 림프', '온열 웜업', '상담 후 결정']
const TIMES = ['평일 오전', '평일 오후', '상담 시 조율']

function validate(f) {
  const e = {}
  if (!f.area) e.area = '신경 쓰이는 곳을 선택해 주시기 바랍니다.'
  if (!f.time) e.time = '방문 시간대를 선택해 주시기 바랍니다.'
  if (f.name.trim().length < 2) e.name = '성함을 입력해 주시기 바랍니다.'
  if (!(/^01\d$/.test(f.p1) && /^\d{3,4}$/.test(f.p2) && /^\d{4}$/.test(f.p3))) e.phone = '연락처를 정확히 입력해 주시기 바랍니다.'
  if (!f.agree) e.agree = '개인정보 수집 및 이용에 동의해 주시기 바랍니다.'
  return e
}

function Choice({ legend, name, options, value, onChange, error }) {
  const errId = `err-b-${name}`
  return (
    <fieldset className="w-step__choices" aria-describedby={error ? errId : undefined}>
      <legend className="sr-only">{legend}</legend>
      {options.map((o) => (
        <label key={o} className={`w-opt${value === o ? ' is-on' : ''}`}>
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
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

// 상담 신청 3단계: ① 신경 쓰이는 곳 ② 방문 시간대 ③ 연락받을 정보
export default function BookingSteps() {
  const [form, setForm] = useState({ area: '', time: '', name: '', p1: '010', p2: '', p3: '', agree: false })
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
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"], .w-step__choices:has(.w-form__error) input')?.focus())
      return
    }
    if (!SUBMIT_ENABLED) {
      setPending(true)
      return
    }
    // TODO(Firebase): 여기서 신청 내용을 저장하고 접수 완료 화면을 보여 준다.
  }

  return (
    <form className="w-form w-steps" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="w-steps__head">
        <h3>상담 신청</h3>
        <span>1 – 3단계</span>
      </div>

      <section className="w-step">
        <p className="w-step__q">
          <b>1</b>
          안녕하세요, 예뻐졌다 웰니스 스튜디오입니다.
          <br />
          요즘 가장 신경 쓰이는 곳은 어디인가요?
        </p>
        <Choice legend="신경 쓰이는 곳" name="area" options={AREAS} value={form.area} onChange={(v) => set('area', v)} error={errors.area} />
      </section>

      <section className="w-step">
        <p className="w-step__q">
          <b>2</b>
          편하신 방문 시간대를 알려 주세요.
        </p>
        <Choice legend="방문 시간대" name="time" options={TIMES} value={form.time} onChange={(v) => set('time', v)} error={errors.time} />
      </section>

      <section className="w-step">
        <p className="w-step__q">
          <b>3</b>
          연락받으실 정보를 남겨 주세요.
        </p>
        <div className="w-field">
          <label htmlFor="b-name">
            이름 <i aria-hidden="true">*</i>
          </label>
          <input
            id="b-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            aria-required="true"
            {...(errors.name ? { 'aria-invalid': true, 'aria-describedby': 'err-b-name' } : {})}
          />
          {errors.name && (
            <p className="w-form__error" id="err-b-name">
              {errors.name}
            </p>
          )}
        </div>
        <PhoneField
          idPrefix="b"
          value={{ p1: form.p1, p2: form.p2, p3: form.p3 }}
          onChange={(next) => {
            setForm((prev) => ({ ...prev, ...next }))
            setPending(false)
          }}
          error={errors.phone}
        />
        <ConsentBox
          idPrefix="b"
          purpose="상담 예약"
          items="신경 쓰이는 곳, 방문 시간대, 성함, 연락처"
          refusal="동의를 거부하실 수 있습니다. 다만 거부 시 온라인 상담 신청이 제한되며, 전화 또는 네이버 예약으로 직접 예약하실 수 있습니다."
          checked={form.agree}
          onChange={(v) => set('agree', v)}
          error={errors.agree}
        />
      </section>

      <button type="submit" className="w-submit">
        상담 신청하기
      </button>

      {pending && (
        <p className="w-form__notice" role="status">
          신청 접수를 준비 중입니다. 입력하신 내용은 아직 전송되지 않았으니, 전화 또는 네이버 예약으로 예약해 주시기 바랍니다. <a href={telHref(phone)}>{phone}</a>
        </p>
      )}
    </form>
  )
}
