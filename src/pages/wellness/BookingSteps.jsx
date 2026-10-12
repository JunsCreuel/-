import { useEffect, useRef, useState } from 'react'
import { AREAS, BRANCHES, telHref } from './data'
import { ChoiceChips, ConsentBox, PhoneField } from './FormParts'
import './wellness-consult.css'

// 접수 연결(Firebase 등) 전까지는 false로 둔다. false면 입력한 내용은 어디로도 전송되지 않고,
// 제출하면 전화로 예약하라는 안내만 보여 준다. 연결할 때 onSubmit 안에서 저장하는 코드를 넣고 true로 바꾼다.
const SUBMIT_ENABLED = false

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

const PULSE_MS = 2400 // 미리 선택된 칩이 두 번 맥박치는 시간(1.2s × 2)
const NOTICE_MS = 3200

// 목적격 조사: 마지막 한글 글자에 받침이 있으면 '을', 없으면 '를'('온열 웜업'을, '복부'를)
function objectParticle(word) {
  const code = word.trim().charCodeAt(word.trim().length - 1)
  if (code < 0xac00 || code > 0xd7a3) return '를'
  return (code - 0xac00) % 28 ? '을' : '를'
}

// 상담 신청 3단계: ① 신경 쓰이는 곳 ② 방문 시간대 ③ 연락받을 정보
// 위 섹션(컨디션 추천·메뉴·온열돔 카드)에서 고른 관리는 window 'w:pick' 이벤트로 넘어와 1단계를 미리 선택한다(scroll.js pickForBooking).
export default function BookingSteps() {
  const [form, setForm] = useState({ area: '', time: '', name: '', p1: '010', p2: '', p3: '', agree: false })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const [picked, setPicked] = useState(null) // { label, area } — 폼 위 '선택하신 관리' 알약
  const [pulse, setPulse] = useState(false) // 1단계 선택 칩 맥박
  const [notice, setNotice] = useState('') // 보조기기에도 읽히는 짧은 안내
  const formRef = useRef(null)
  const step2Ref = useRef(null)
  const phone = BRANCHES.zai.phone
  const ready = Object.keys(validate(form)).length === 0

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setPending(false)
  }

  // 고른 관리 이어받기: 1단계 칩을 미리 선택하고, 맥박·안내를 잠깐 보여 준 뒤 키보드 포커스를 2단계 질문으로 옮긴다.
  useEffect(() => {
    let pulseTimer = 0
    let noticeTimer = 0
    let raf = 0
    const onPick = (e) => {
      const { area, label } = e.detail || {}
      if (AREAS.includes(area)) {
        setForm((prev) => ({ ...prev, area }))
        setPending(false)
      }
      setPicked(label ? { label, area } : null)
      setNotice(area ? `‘${area}’${objectParticle(area)} 선택해 두었습니다.` : '')
      // 같은 관리를 다시 골라도 맥박이 처음부터 다시 뛰도록 한 번 내렸다가 다음 프레임에 올린다
      setPulse(false)
      clearTimeout(pulseTimer)
      clearTimeout(noticeTimer)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setPulse(true)
        step2Ref.current?.focus({ preventScroll: true })
      })
      pulseTimer = setTimeout(() => setPulse(false), PULSE_MS)
      noticeTimer = setTimeout(() => setNotice(''), NOTICE_MS)
    }
    window.addEventListener('w:pick', onPick)
    return () => {
      window.removeEventListener('w:pick', onPick)
      clearTimeout(pulseTimer)
      clearTimeout(noticeTimer)
      cancelAnimationFrame(raf)
    }
  }, [])

  // '지우기'는 알약만 지운다(칩 선택은 그대로). 버튼이 사라지므로 포커스는 선택된 칩으로 옮긴다.
  function clearPicked() {
    setPicked(null)
    requestAnimationFrame(() => {
      const target = formRef.current?.querySelector('input[name="b-area"]:checked') || step2Ref.current
      target?.focus({ preventScroll: true })
    })
  }

  function onSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setPending(false)
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"], [data-invalid] input')?.focus())
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
      {picked && (
        <p className="yw-pick">
          <span>
            선택하신 관리 · <b>{picked.label}</b>
          </span>
          <button type="button" onClick={clearPicked}>
            지우기
          </button>
        </p>
      )}

      <div className="w-steps__head">
        <h3>상담 신청</h3>
        <span>1 – 3단계</span>
      </div>

      <section className={'w-step' + (pulse ? ' is-prefilled' : '')}>
        <p className="w-step__q">
          <b>1</b>
          안녕하세요, 예뻐졌다 웰니스 스튜디오입니다.
          <br />
          요즘 가장 신경 쓰이는 곳은 어디인가요?
        </p>
        <ChoiceChips idPrefix="b" legend="신경 쓰이는 곳" name="area" options={AREAS} value={form.area} onChange={(v) => set('area', v)} error={errors.area} />
        <p className="yw-pick__notice" role="status">
          {notice}
        </p>
      </section>

      <section className="w-step">
        <p className="w-step__q" ref={step2Ref} tabIndex={-1}>
          <b>2</b>
          편하신 방문 시간대를 알려 주세요.
        </p>
        <ChoiceChips idPrefix="b" legend="방문 시간대" name="time" options={TIMES} value={form.time} onChange={(v) => set('time', v)} error={errors.time} />
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

      <button type="submit" className={`w-submit${ready ? ' is-ready' : ''}`}>
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
