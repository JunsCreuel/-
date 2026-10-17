import { useEffect, useId, useState } from 'react'
import { BRAND, BRANCHES, telHref } from '../data'
import './yw-quick.css'

// 히어로(첫 화면)의 간편 상담 카드: 상담 종류(예약·가맹) + 이름 + 연락처 + 동의 한 줄.
// 휴대폰(64rem 미만)은 제목 아래 흐름 속에, 데스크톱은 첫 화면 오른쪽에 떠 있다(yw-quick.css).
//
// 접수 연결(구글 폼·Firebase 등) 전까지는 SUBMIT_ENABLED = false로 둔다. 그동안은 내용을 어디에도 저장하지 않고,
// - 휴대폰: 문자 앱을 열어 매장 번호로 보낼 접수 내용을 채워 준다(전송은 손님이 누른다).
// - PC: 전화번호와 접수 내용 복사, 예약이면 네이버 예약을 안내한다.
// 연결할 때 sendLead() 안에서 저장하고 true로 바꾸면, 기기와 상관없이 바로 '접수되었습니다'가 나온다.
const SUBMIT_ENABLED = false

const KINDS = [
  { id: 'booking', label: '예약 상담' },
  { id: 'franchise', label: '가맹 상담' },
]

const onlyDigits = (s) => s.replace(/\D/g, '')

// 입력하는 대로 010-1234-5678 꼴로 하이픈을 넣는다(10자리는 3-3-4).
function formatPhone(value) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = '성함을 입력해 주세요.'
  if (!/^01[016789]\d{7,8}$/.test(onlyDigits(f.phone))) e.phone = '연락처를 정확히 입력해 주세요.'
  if (!f.agree) e.agree = '개인정보 수집·이용에 동의해 주세요.'
  return e
}

// 접수 연결 자리. SUBMIT_ENABLED를 true로 바꿀 때 여기서 { kind, name, phone }을 저장한다.
async function sendLead() {
  // TODO(접수 연결): 구글 폼 또는 Firebase로 보낸다.
}

// 매장 번호로 보낼 문자. iOS·안드로이드 모두 'sms:번호?&body=' 꼴을 받는다.
function smsHref(text) {
  return `sms:${onlyDigits(BRANCHES.zai.phone)}?&body=${encodeURIComponent(text)}`
}

// variant='light'는 예약 장(흰 바탕)용. listen이면 위에서 고른 관리('w:pick')를 이어받아 접수 내용에 '관심 관리'로 붙인다.
export default function QuickConsult({ variant = 'dark', listen = false }) {
  const uid = useId()
  const phone = BRANCHES.zai.phone
  const [form, setForm] = useState({ kind: 'booking', name: '', phone: '', agree: false })
  const [errors, setErrors] = useState({})
  const [termsOpen, setTermsOpen] = useState(false)
  const [done, setDone] = useState(null) // null | 'sent' | 'sms' | 'pc'
  const [copied, setCopied] = useState(false)
  const [pick, setPick] = useState('') // 위에서 고른 관리 이름

  useEffect(() => {
    if (!listen) return undefined
    const onPick = (e) => {
      setPick(e.detail?.label || e.detail?.area || '')
      setForm((prev) => ({ ...prev, kind: 'booking' }))
      setDone(null)
    }
    window.addEventListener('w:pick', onPick)
    return () => window.removeEventListener('w:pick', onPick)
  }, [listen])
  const kind = KINDS.find((k) => k.id === form.kind)

  // 고친 칸의 오류는 바로 지운다(다시 제출할 때 처음부터 다시 검사한다).
  const now = validate(form)
  const shown = Object.fromEntries(Object.entries(errors).filter(([k]) => now[k]))
  const firstError = shown.name || shown.phone || shown.agree
  const errId = `${uid}-err`
  const invalid = (key) => (shown[key] ? { 'aria-invalid': true, 'aria-describedby': errId } : {})

  const message = [`[${BRAND.company} 홈페이지 간편 상담]`, `상담: ${kind.label}`, ...(pick && form.kind === 'booking' ? [`관심 관리: ${pick}`] : []), `이름: ${form.name.trim()}`, `연락처: ${formatPhone(form.phone)}`].join('\n')
  const cls = `yw-quick${variant === 'light' ? ' yw-quick--light' : ''}`
  const btn = variant === 'light' ? 'yw-btn yw-btn--ink' : 'yw-btn yw-btn--cream'

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = ['name', 'phone', 'agree'].find((k) => found[k])
      e.currentTarget.querySelector(`[data-field="${first}"]`)?.focus()
      return
    }
    if (SUBMIT_ENABLED) {
      await sendLead({ kind: kind.label, name: form.name.trim(), phone: formatPhone(form.phone) })
      setDone('sent')
      return
    }
    const touch = window.matchMedia?.('(pointer: coarse)').matches
    if (touch) {
      setDone('sms')
      window.location.href = smsHref(message)
    } else {
      setDone('pc')
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  function restart() {
    setDone(null)
    setCopied(false)
  }

  if (done) {
    return (
      <div className={`${cls} yw-quick--done`} role="status">
        <p className="yw-quick__eyebrow">{kind.label}</p>
        {done === 'sent' && (
          <>
            <p className="yw-quick__title">접수되었습니다</p>
            <p className="yw-quick__sub">확인 후 {formatPhone(form.phone)}로 연락드리겠습니다.</p>
          </>
        )}
        {done === 'sms' && (
          <>
            <p className="yw-quick__title">문자 앱에 접수 내용을 채워 두었어요</p>
            <p className="yw-quick__sub">문자 앱에서 전송을 누르시면 매장으로 바로 접수됩니다. 앱이 열리지 않았다면 아래 버튼을 눌러 주세요.</p>
            <div className="yw-quick__row">
              <a className={`${btn} yw-quick__go`} href={smsHref(message)}>
                <span>문자로 보내기</span>
              </a>
              <a className="yw-quick__link" href={telHref(phone)}>
                전화 {phone}
              </a>
            </div>
          </>
        )}
        {done === 'pc' && (
          <>
            <p className="yw-quick__title">PC 온라인 접수는 준비 중이에요</p>
            <p className="yw-quick__sub">아래 번호로 전화 주시거나, 접수 내용을 복사해 문자로 보내 주시면 바로 연락드리겠습니다.</p>
            <a className="yw-quick__tel" href={telHref(phone)}>
              {phone}
            </a>
            <div className="yw-quick__row">
              <button type="button" className={`${btn} yw-quick__go`} onClick={copyMessage}>
                <span>{copied ? '복사했어요' : '접수 내용 복사'}</span>
              </button>
              {form.kind === 'booking' && BRANCHES.zai.booking && (
                <a className="yw-quick__link" href={BRANCHES.zai.booking} target="_blank" rel="noopener noreferrer">
                  네이버 예약 ↗<span className="sr-only">(새 창)</span>
                </a>
              )}
            </div>
          </>
        )}
        <button type="button" className="yw-quick__again" onClick={restart}>
          다시 작성하기
        </button>
      </div>
    )
  }

  return (
    <form className={cls} onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`}>
      <div className="yw-quick__head">
        <p className="yw-quick__eyebrow" aria-hidden="true">
          Quick Consult
        </p>
        <h2 id={`${uid}-title`} className="yw-quick__title">
          간편 상담 신청
        </h2>
        <p className="yw-quick__sub">이름과 연락처만 남겨 주시면 확인 후 연락드려요.</p>
      </div>

      {pick && form.kind === 'booking' && (
        <p className="yw-quick__pick">
          관심 관리 <b>{pick}</b>
          <button type="button" className="yw-quick__unpick" onClick={() => setPick('')} aria-label={`관심 관리 ${pick} 지우기`}>
            지우기
          </button>
        </p>
      )}

      <fieldset className="yw-quick__kinds">
        <legend className="sr-only">상담 종류</legend>
        {KINDS.map((k) => (
          <label key={k.id} className={`yw-quick__kind${form.kind === k.id ? ' is-on' : ''}`}>
            <input type="radio" name={`${uid}-kind`} value={k.id} checked={form.kind === k.id} onChange={() => set('kind', k.id)} />
            <span>{k.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="yw-quick__fields">
        <label className="sr-only" htmlFor={`${uid}-name`}>
          성함
        </label>
        <input
          id={`${uid}-name`}
          data-field="name"
          className="yw-quick__input"
          type="text"
          autoComplete="name"
          placeholder="이름"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          aria-required="true"
          {...invalid('name')}
        />
        <label className="sr-only" htmlFor={`${uid}-phone`}>
          연락처
        </label>
        <input
          id={`${uid}-phone`}
          data-field="phone"
          className="yw-quick__input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="휴대폰 번호"
          value={form.phone}
          onChange={(e) => set('phone', formatPhone(e.target.value))}
          aria-required="true"
          {...invalid('phone')}
        />
      </div>

      <div className="yw-quick__agree">
        <label>
          <input
            data-field="agree"
            type="checkbox"
            checked={form.agree}
            onChange={(e) => set('agree', e.target.checked)}
            aria-required="true"
            {...invalid('agree')}
          />
          <span>[필수] 개인정보 수집·이용 동의</span>
        </label>
        <button
          type="button"
          className="yw-quick__more"
          aria-expanded={termsOpen}
          aria-controls={`${uid}-terms`}
          onClick={() => setTermsOpen((v) => !v)}
        >
          {termsOpen ? '접기' : '보기'}
        </button>
      </div>
      <p id={`${uid}-terms`} className="yw-quick__terms" hidden={!termsOpen}>
        상담 연락을 위해 이름·연락처·상담 종류를 받으며, 상담을 마친 뒤 지체 없이 파기합니다. 동의하지 않으셔도 전화({phone})로
        상담하실 수 있습니다. 개인정보 보호책임자: 대표 {BRAND.representative}
      </p>

      <p id={errId} className="yw-quick__error" aria-live="polite">
        {firstError || ''}
      </p>

      <button type="submit" className={`${btn} yw-quick__submit`}>
        <span>{kind.label} 신청</span>
      </button>
    </form>
  )
}
