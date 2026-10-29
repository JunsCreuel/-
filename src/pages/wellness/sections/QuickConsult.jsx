import { useEffect, useId, useState } from 'react'
import { BRAND, BRANCHES, telHref } from '../data'

// 간편 상담 카드(예약 장, 흰 바탕): 상담 종류(예약·가맹) + 이름 + 연락처 + 동의 한 줄.
// 입력 글자는 16px 이상(iOS가 확대하지 않게). 데스크톱(64rem 이상)은 이름·연락처를 위아래로, 그보다 좁으면 한 줄에 둔다.
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

// 버튼·링크에 글꼴을 물려받게(브라우저 기본 버튼 글꼴 대신)
const FONT = '[font-family:inherit] [font-weight:inherit] [line-height:inherit]'
const CARD =
  'grid w-full max-w-[36rem] rounded-[1.25rem] border border-line bg-white p-[clamp(1rem,3.5vw,1.4rem)] text-left text-ink [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-accent-deep'
const EYEBROW = 'm-0 font-label text-[0.75rem] leading-[1.3] font-normal tracking-[0.2em] text-accent-deep uppercase'
const TITLE = 'm-0 font-serif text-[clamp(1.1rem,4vw,1.3rem)] leading-[1.35] font-medium tracking-[-0.01em] break-keep text-espresso'
const SUB = 'm-0 text-[0.86rem] leading-[1.6] break-keep text-muted'
const TEXT_BTN = `cursor-pointer border-0 bg-transparent p-0 ${FONT} text-[0.8rem] underline underline-offset-[0.2em]`
const INPUT = `min-h-[2.9rem] w-full min-w-0 rounded-[0.8rem] border border-line-strong bg-white px-[0.85rem] py-0 ${FONT} text-[1rem] text-ink transition-[border-color,background-color] duration-200 ease-[ease] placeholder:text-muted focus:border-accent-deep focus:bg-white aria-invalid:border-[#b4442a]`
const LINK = 'font-label tracking-[0.04em] text-ink underline underline-offset-[0.25em]'

// listen이면 위에서 고른 관리('w:pick')를 이어받아 접수 내용에 '관심 관리'로 붙인다.
export default function QuickConsult({ listen = false }) {
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
  const btn = 'yw-btn yw-btn--ink'

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
      <div className={`${CARD} gap-[0.6rem]`} role="status">
        <p className={EYEBROW}>{kind.label}</p>
        {done === 'sent' && (
          <>
            <p className={TITLE}>접수되었습니다</p>
            <p className={SUB}>확인 후 {formatPhone(form.phone)}로 연락드리겠습니다.</p>
          </>
        )}
        {done === 'sms' && (
          <>
            <p className={TITLE}>문자 앱에 접수 내용을 채워 두었어요</p>
            <p className={SUB}>문자 앱에서 전송을 누르시면 매장으로 바로 접수됩니다. 앱이 열리지 않았다면 아래 버튼을 눌러 주세요.</p>
            <div className="mt-[0.2rem] flex flex-wrap items-center gap-x-4 gap-y-2">
              <a className={`${btn} min-h-[2.9rem] px-[1.4rem]`} href={smsHref(message)}>
                <span>문자로 보내기</span>
              </a>
              <a className={`${LINK} inline-flex min-h-11 items-center text-[0.9rem]`} href={telHref(phone)}>
                전화 {phone}
              </a>
            </div>
          </>
        )}
        {done === 'pc' && (
          <>
            <p className={TITLE}>PC 온라인 접수는 준비 중이에요</p>
            <p className={SUB}>아래 번호로 전화 주시거나, 접수 내용을 복사해 문자로 보내 주시면 바로 연락드리겠습니다.</p>
            <a className={`${LINK} justify-self-start text-[1.35rem]`} href={telHref(phone)}>
              {phone}
            </a>
            <div className="mt-[0.2rem] flex flex-wrap items-center gap-x-4 gap-y-2">
              <button type="button" className={`${btn} min-h-[2.9rem] px-[1.4rem]`} onClick={copyMessage}>
                <span>{copied ? '복사했어요' : '접수 내용 복사'}</span>
              </button>
              {form.kind === 'booking' && BRANCHES.zai.booking && (
                <a
                  className={`${LINK} inline-flex min-h-11 items-center text-[0.9rem]`}
                  href={BRANCHES.zai.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  네이버 예약 ↗<span className="sr-only">(새 창)</span>
                </a>
              )}
            </div>
          </>
        )}
        <button type="button" className={`${TEXT_BTN} min-h-10 justify-self-start text-muted`} onClick={restart}>
          다시 작성하기
        </button>
      </div>
    )
  }

  return (
    <form className={`${CARD} gap-[0.7rem]`} onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`}>
      <div className="grid gap-[0.2rem]">
        <h2 id={`${uid}-title`} className={TITLE}>
          간편 상담 신청
        </h2>
        <p className={SUB}>이름과 연락처만 남겨 주시면 확인 후 연락드려요.</p>
      </div>

      {pick && form.kind === 'booking' && (
        <p className="m-0 flex flex-wrap items-center gap-x-[0.6rem] gap-y-1 text-[0.86rem] [&_b]:font-semibold">
          관심 관리 <b>{pick}</b>
          <button
            type="button"
            className={`${TEXT_BTN} min-h-11 text-inherit opacity-80`}
            onClick={() => setPick('')}
            aria-label={`관심 관리 ${pick} 지우기`}
          >
            지우기
          </button>
        </p>
      )}

      <fieldset className="m-0 grid grid-cols-[1fr_1fr] gap-1 rounded-full border border-line p-1">
        <legend className="sr-only">상담 종류</legend>
        {KINDS.map((k) => (
          <label
            key={k.id}
            className={`relative grid min-h-10 cursor-pointer place-items-center rounded-full text-[0.92rem] font-semibold transition-[background-color,color] duration-250 ease-[ease] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-champagne [&_input]:absolute [&_input]:inset-0 [&_input]:m-0 [&_input]:cursor-pointer [&_input]:opacity-0 ${
              form.kind === k.id ? 'bg-espresso text-white' : 'text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[rgb(241_243_228/0.12)]'
            }`}
          >
            <input type="radio" name={`${uid}-kind`} value={k.id} checked={form.kind === k.id} onChange={() => set('kind', k.id)} />
            <span>{k.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-2 lg:grid-cols-[minmax(0,1fr)]">
        <label className="sr-only" htmlFor={`${uid}-name`}>
          성함
        </label>
        <input
          id={`${uid}-name`}
          data-field="name"
          className={INPUT}
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
          className={INPUT}
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

      <div className="flex items-center justify-between gap-2 text-[0.82rem]">
        <label className="inline-flex min-h-9 cursor-pointer items-center gap-2">
          <input
            className="m-0 size-[1.15rem] flex-none accent-espresso"
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
          className={`${TEXT_BTN} min-h-11 min-w-11 flex-none text-muted`}
          aria-expanded={termsOpen}
          aria-controls={`${uid}-terms`}
          onClick={() => setTermsOpen((v) => !v)}
        >
          {termsOpen ? '접기' : '보기'}
        </button>
      </div>
      <div
        id={`${uid}-terms`}
        className="mx-0 -mt-[0.2rem] mb-0 rounded-[0.7rem] bg-(--w-band) px-[0.8rem] py-[0.65rem] text-[0.76rem] leading-[1.6] break-keep text-muted [&_b]:mr-[0.35em] [&_b]:font-semibold [&_ol]:mx-0 [&_ol]:mt-[0.45rem] [&_ol]:mb-0 [&_ol]:grid [&_ol]:gap-[0.3rem] [&_ol]:pl-[1.1rem] [&_p]:m-0"
        hidden={!termsOpen}
      >
        <p>
          {BRAND.company}(이하 &lsquo;스튜디오&rsquo;)는 「개인정보 보호법」 제15조에 따라 상담 신청에 필요한 최소한의 개인정보를
          아래와 같이 수집·이용합니다.
        </p>
        <ol>
          <li>
            <b>수집·이용 목적</b> 상담 신청 접수, 상담 내용 확인 및 회신 연락
          </li>
          <li>
            <b>수집 항목</b> [필수] 성함, 휴대전화번호, 상담 종류 · [선택] 관심 관리
          </li>
          <li>
            <b>보유·이용 기간</b> 상담 목적 달성 시 지체 없이 파기합니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간
            동안 보관합니다.
          </li>
          <li>
            <b>동의 거부 권리 및 불이익</b> 개인정보 수집·이용에 대한 동의를 거부하실 수 있습니다. 다만 동의하지 않으시면 온라인 상담
            신청이 제한되며, 전화({phone})로 상담하실 수 있습니다.
          </li>
          <li>
            <b>개인정보 보호책임자</b> 대표 {BRAND.representative} · {phone}
          </li>
        </ol>
      </div>

      <p id={errId} className="mx-0 -mt-1 mb-0 text-[0.8rem] leading-[1.4] text-[#b4442a] empty:hidden" aria-live="polite">
        {firstError || ''}
      </p>

      <button type="submit" className={`${btn} min-h-12 w-full`}>
        <span>{kind.label} 신청</span>
      </button>
    </form>
  )
}
