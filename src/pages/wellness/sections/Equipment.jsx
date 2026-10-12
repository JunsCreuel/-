import { PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import Tabs from '../Tabs'
import { Reveal } from '../ui'

const FEATURES = ['원적외선 온열 케어', '누워서 즐기는 따뜻한 휴식', '단독 이용 또는 집중관리와 함께', '이용 중 상태와 불편함 확인']

const DEVICES = [
  { id: 'face', label: '페이스 갈바닉', text: '얼굴 피부를 위한 섬세한 디바이스 케어. 피부 상태에 맞춰 전용 제품과 함께 진행합니다.' },
  { id: 'body', label: '바디 갈바닉', text: '전용 바디 쉐이핑 젤과 함께, 복부 등 고민 부위를 집중적으로 돌보는 바디 케어입니다.' },
  { id: 'wellspa', label: '웰스파', text: '바디 라인과 무겁게 느껴지는 부위를 세심하게 돌봅니다. 웰스파 전용 제품을 함께 사용합니다.' },
]

const USES = [
  { id: 'solo', label: '온열돔 단독 이용', text: '따뜻한 휴식이 필요한 날, 온열돔만 편안하게 이용하세요.' },
  { id: 'regular', label: '정기 이용 상담', text: '일상 속 온열 루틴을 원하신다면, 방문 주기와 이용권 구성을 상담해 주세요.' },
  { id: 'combo', label: '온열돔 + 집중관리', text: '따뜻하게 쉰 다음, 신경 쓰이는 한 부위를 더 세심하게 돌보세요.' },
]

// 온열돔과 디바이스: 큰 제품 사진 옆에 핵심만 두고, 디바이스·이용 방법은 알약 탭으로 하나씩 보여 준다.
export default function Equipment() {
  return (
    <section id="equipment" className="w-section w-eq-sec">
      <div className="w-container">
        <div className="w-eq">
          <Reveal mode="toggle" className="w-eq__fig">
            <img src={PHOTOS.heatDome} alt="전신 온열돔" width="1200" height="954" loading="lazy" decoding="async" />
          </Reveal>

          <div className="w-eq__text">
            <Reveal as="p" className="w-label">
              Our Equipment
            </Reveal>
            <Reveal as="h2" delay={80} className="w-title">
              따뜻한 휴식의 시작,
              <br />
              명신메디칼 전신 온열돔.
            </Reveal>
            <Reveal as="p" delay={120} className="w-lead">
              원적외선 온열 기술을 활용한 전신 온열 케어입니다. 편안히 누워 온기를 느끼며 쉬어가고, 선택한 프로그램에 따라 고민 부위 아웃케어로 이어집니다.
            </Reveal>
            <Reveal as="ul" delay={160} className="w-tags">
              {FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="w-eq__groups">
          <Reveal className="w-eq__group">
            <h3 className="w-eq__title">
              부위에 맞춰 섬세하게,
              <br />
              세 가지 디바이스 아웃케어.
            </h3>
            <Tabs label="디바이스 아웃케어" items={DEVICES} />
            <p className="w-method__note">뉴스킨 디바이스와 각 기기에 맞는 전용 제품을 사용합니다. 사용하는 디바이스와 관리 구성은 프로그램에 따라 다릅니다.</p>
          </Reveal>

          <Reveal className="w-eq__group" id="warm-ritual">
            <h3 className="w-eq__title">
              추운 날,
              <br />
              나를 위한 따뜻한 예약.
            </h3>
            <p className="w-eq__lead">온열돔에서 편안히 쉬어가는 시간. 단독으로 이용하거나, 원하는 부위의 집중관리를 더해보세요.</p>
            <Tabs label="온열돔 이용 방법" items={USES} />
            <div className="w-eq__actions">
              <button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>
                온열돔 이용 상담
              </button>
            </div>
            <p className="w-method__note">100% 예약제 · 이용시간과 비용, 정기 이용 구성은 상담 시 안내합니다.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
