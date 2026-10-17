import { useEffect, useRef, useState } from 'react'
import { PICS } from '../data'
import { Folio, Footnote, Pic, SplitLines } from '../editorial'
import { hasFinePointer, prefersReducedMotion, useInView } from '../motion'
import './yw-story.css'

// No. 01 Our Story와 No. 02 Ritual(관리 네 단계).
// 관리 순서는 화면에 보이는 동안 한 단계씩 자동으로 넘어간다(STEP_MS마다, 마지막 다음은 처음으로).
// 진행은 활성 단계 버튼 밑줄이 차오르는 CSS 애니메이션이 곧 타이머다(animationend → 다음 단계).
// 마우스를 올리거나 키보드 포커스가 들어오면, 또는 '멈춤'을 누르면 멈춘다. 단계 버튼이나 사진을 누르면 그 단계부터 다시 센다.
// 모션 줄이기에서는 자동으로 넘어가지 않는다.

const STEPS = [
  { ko: '상담', en: 'CONSULTATION', text: '오늘의 컨디션과 신경 쓰이는 부위를 먼저 여쭙니다.' },
  { ko: '온열돔 웜업', en: 'HEAT DOME', text: '전신 온열돔에 편히 누워 몸을 데웁니다.' },
  { ko: '아웃케어', en: 'OUT CARE', text: '고른 부위를 손길과 디바이스로 한 번 더 관리합니다.' },
  { ko: '마무리', en: 'FINISH', text: '피부 상태와 편안함을 확인하고 일상 관리법을 알려 드립니다.' },
]
const STEP_PICS = [PICS.ritual1, PICS.ritual2, PICS.ritual3, PICS.ritual4]
const STEP_MS = 4000
const two = (n) => String(n).padStart(2, '0')

// 단계가 넘어갈수록 바탕이 데워진다. 온열돔 무렵 가장 따뜻하고 마무리에서 살짝 식는다.
const WARM = [0, 0.85, 0.7, 0.4]

export default function About() {
  const ritualRef = useRef(null)
  const imgRefs = useRef([])
  const [step, setStep] = useState(0)
  const [round, setRound] = useState(0) // 같은 단계를 다시 고르면 밑줄 타이머를 처음부터 다시 시작하게 하는 열쇠
  const [stopped, setStopped] = useState(false) // '멈춤' 버튼
  const [held, setHeld] = useState(false) // 마우스를 올렸거나 포커스가 안에 있는 동안
  const [reduced] = useState(prefersReducedMotion)
  const inView = useInView(ritualRef, { once: false, threshold: 0.4 })

  const auto = !reduced
  const running = auto && inView && !stopped && !held

  const goTo = (i) => {
    setStep(((i % STEPS.length) + STEPS.length) % STEPS.length)
    setRound((r) => r + 1)
  }

  // 다음 장면을 미리 디코드해 바뀔 때 깜빡이지 않게 한다.
  useEffect(() => {
    if (inView) imgRefs.current[(step + 1) % STEPS.length]?.decode?.().catch(() => {})
  }, [step, inView])

  const holdOn = () => setHeld(true)
  const holdOff = (e) => {
    if (e.type === 'blur' && ritualRef.current?.contains(e.relatedTarget)) return
    setHeld(false)
  }

  const cls = `yw-ritual${auto ? ' is-auto' : ''}${running ? '' : ' is-paused'}`

  return (
    <section id="about" className="yw-section yw-story" data-theme="light">
      <div className="yw-wrap yw-story__head">
        <div className="yw-story__lead">
          <Folio no="01" en="Our Story" />
          <SplitLines
            as="h2"
            className="yw-story__title"
            lines={['온기로 시작해,', '손끝으로 완성합니다.']}
          />
        </div>
      </div>


      <div
        id="ritual"
        ref={ritualRef}
        className={cls}
        style={{ '--warm': WARM[step], '--step-ms': `${STEP_MS}ms` }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && hasFinePointer() && holdOn()}
        onPointerLeave={(e) => e.pointerType === 'mouse' && holdOff(e)}
        onFocus={(e) => e.target.matches?.(':focus-visible') && holdOn()}
        onBlur={holdOff}
      >
        <div className="yw-ritual__stage">
          <div className="yw-wrap yw-ritual__grid">
            <div className="yw-ritual__head">
              <Folio no="02" en="Ritual" />
              <h3 className="yw-ritual__title">한 번의 방문, 네 단계</h3>
            </div>

            <figure className="yw-ritual__arch" data-cursor="" onClick={() => goTo(step + 1)}>
              {STEP_PICS.map((pic, i) => (
                <Pic
                  key={STEPS[i].en}
                  pic={pic}
                  sizes="(min-width: 64rem) 36vw, 90vw"
                  aria-hidden="true"
                  data-active={step === i ? '' : undefined}
                  imgRef={(el) => {
                    imgRefs.current[i] = el
                  }}
                />
              ))}
              <span className="yw-ritual__count" aria-hidden="true">
                {two(step + 1)} / {two(STEPS.length)}
              </span>
            </figure>

            <div className="yw-ritual__body">
              <div className="yw-ritual__steps" role="group" aria-label="관리 단계">
                {STEPS.map((s, i) => (
                  <button
                    key={s.en}
                    type="button"
                    className="yw-ritual__step"
                    aria-pressed={step === i}
                    data-done={i < step ? '' : undefined}
                    onClick={() => goTo(i)}
                  >
                    <b>{two(i + 1)}</b>
                    <span>{s.ko}</span>
                    <small>{s.en}</small>
                    {auto && step === i ? (
                      <i
                        key={round}
                        className="yw-ritual__bar"
                        aria-hidden="true"
                        onAnimationEnd={() => goTo(step + 1)}
                      />
                    ) : (
                      <i className="yw-ritual__bar" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>

              <ol className="yw-ritual__texts" aria-live={running ? 'off' : 'polite'}>
                {STEPS.map((s, i) => (
                  <li
                    key={s.en}
                    className="yw-ritual__text"
                    data-active={step === i ? '' : undefined}
                    aria-current={step === i ? 'step' : undefined}
                  >
                    {s.text}
                  </li>
                ))}
              </ol>

              {auto && (
                <button
                  type="button"
                  className="yw-ritual__play"
                  aria-pressed={stopped}
                  onClick={() => setStopped((v) => !v)}
                >
                  <span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span>
                  {stopped ? '재생' : '멈춤'}
                </button>
              )}

              <Footnote>
                온열돔 단독 이용도 가능합니다. 온열돔 포함 여부와 사용하는 디바이스는 프로그램에 따라 다르며, 예약 전에 안내해 드립니다.
              </Footnote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
