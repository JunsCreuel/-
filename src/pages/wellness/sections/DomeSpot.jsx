import { PICS, PROGRAMS, SHOW_PRICES, won } from '../data'
import { Pic } from '../editorial'
import { pickForBooking } from '../scroll'
import { BTN_INK, H2, RULE, SECTION } from '../tw'

// 온열돔(풀 바디 웜업케어) 소개 — 왼쪽에 제목과 사실 몇 줄, 오른쪽에 매장 온열돔 사진.
// 효능(혈류·면역·지방 등)은 쓰지 않고 실제로 하는 일만 적는다.
const WARMUP = PROGRAMS.find((p) => p.id === 'warmup')

const FACTS = [
  ['시간', '편하게 누운 채 40분'],
  ['시작', '그날 컨디션에 맞는 아로마를 바르고 시작합니다'],
  ['진행', '100% 예약제, 한 분씩 프라이빗하게'],
  ['함께', '원하시면 온열돔 뒤에 고민 부위 하나를 이어서 관리합니다'],
]

export default function DomeSpot() {
  return (
    <section id="warm-dome" className={`${SECTION} ${RULE}`} data-theme="light" aria-labelledby="warm-dome-title">
      <div className="mx-auto grid w-full max-w-(--yw-max) items-center gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="min-w-0">
          <h2 id="warm-dome-title" className={`${H2} m-0`}>
            풀 바디 웜업케어
          </h2>
          <p className="mt-4 max-w-[34ch] break-keep text-muted">아로마로 시작해 온열돔 안에서 몸을 천천히 따뜻하게 데우는 관리입니다.</p>

          <dl className="mx-0 mt-[clamp(1.5rem,4vw,2.25rem)] mb-0 border-b border-line [&_dd]:m-0 [&_dd]:break-keep [&_dd]:text-ink [&_dt]:text-muted [&>div]:grid [&>div]:grid-cols-[4.5rem_minmax(0,1fr)] [&>div]:gap-4 [&>div]:border-t [&>div]:border-line [&>div]:py-3 [&>div]:text-[0.95rem] [&>div]:leading-[1.65]">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            {WARMUP && SHOW_PRICES && (
              <div>
                <dt>가격</dt>
                <dd className="tabular-nums">{won(WARMUP.price)}</dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            className={`${BTN_INK} mt-7 max-sm:w-full`}
            data-cursor=""
            onClick={() => pickForBooking({ area: '온열 웜업', programId: WARMUP?.id, label: WARMUP?.label })}
          >
            <span>온열돔 예약 상담</span>
          </button>
        </div>

        <div className="grid min-w-0 place-items-center rounded-card bg-white px-[8%] py-[12%] max-lg:order-first">
          <Pic
            pic={PICS.domeCut}
            sizes="(min-width: 64rem) 40rem, 84vw"
            alt="매장의 전신 온열돔"
            className="h-auto w-full [filter:drop-shadow(0_18px_22px_rgb(29_26_23/0.14))]"
          />
        </div>
      </div>
    </section>
  )
}
