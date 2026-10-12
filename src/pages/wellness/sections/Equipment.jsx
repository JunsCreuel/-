import { PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import Tabs from '../Tabs'
import { Reveal } from '../ui'

const FEATURES = ['원적외선 온열 케어', '누워서 즐기는 따뜻한 휴식', '단독 이용 또는 집중관리와 함께', '이용 중 상태와 불편함 확인']

const DEVICES = [
  {
    no: '02',
    name: '페이스 갈바닉',
    sub: '얼굴',
    photo: PHOTOS.faceGalvanic,
    alt: '갈바닉 기기 본체와 교체형 헤드 3종',
    lead: '미세전류와 전용 젤로 피부 컨디션을 섬세하게 가꾸는 디바이스',
    text: '갈바닉 미세전류를 전용 젤과 함께 사용해 제품이 피부에 고르게 닿도록 돕습니다. 부위에 맞는 헤드로 바꿔 가며 피부결과 촉촉함, 얼굴 라인까지 섬세하게 관리합니다.',
    tags: ['얼굴 전용', '교체형 헤드', '오일 대신 전용 젤'],
  },
  {
    no: '03',
    name: '바디 갈바닉',
    sub: '바디',
    photo: PHOTOS.bodyGalvanic,
    alt: '바디 갈바닉 기기 앞면',
    lead: '바디 피부에 맞춘 갈바닉 전류로 넓은 부위를 고르게 관리하는 디바이스',
    text: '진동 주기를 가진 갈바닉 전류와 넓은 면적의 컨덕터로 복부처럼 넓은 부위를 효율적으로 관리합니다. 피부 상태에 맞춘 자동 프로그램으로 진행하고, 화면과 알림음으로 진행 상태를 확인합니다.',
    tags: ['바디 전용 갈바닉', '넓은 면적 컨덕터', '자동 프로그램'],
  },
  {
    no: '04',
    name: '웰스파',
    sub: '바디',
    photo: PHOTOS.wellspa,
    alt: '웰스파 바디 디바이스 앞면과 마사지 헤드',
    lead: '무겁게 느껴지는 바디 라인을 부드럽게 쓸어 주듯 관리하는 디바이스',
    text: '웰스파 전용 제품과 함께 하체, 팔뚝, 복부처럼 붓고 무겁게 느껴지는 부위를 마사지하듯 관리합니다. 온열돔으로 몸이 따뜻해진 뒤 아웃케어로 이어서 진행합니다.',
    tags: ['바디 라인 관리', '하체 · 팔뚝 · 복부', '웰스파 전용 제품'],
  },
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

        <div className="w-dev-head">
          <Reveal as="p" className="w-label">
            Devices
          </Reveal>
          <Reveal as="h3" className="w-eq__title">
            관리의 시작은 온열돔이,
            <br />
            섬세한 마무리는 부위별 디바이스가 맡습니다.
          </Reveal>
        </div>
        <div className="w-dev-grid">
          {DEVICES.map((d, i) => (
            <Reveal key={d.no} delay={i * 80} className="w-dev">
              <div className="w-dev__tile">
                <img src={d.photo} alt={d.alt} loading="lazy" decoding="async" />
              </div>
              <p className="w-dev__no">
                <span>{d.no}</span>
                {d.name}
              </p>
              <h4 className="w-dev__lead">{d.lead}</h4>
              <details className="w-dev__more">
                <summary>자세히 보기</summary>
                <p>{d.text}</p>
                <ul className="w-tags">
                  {d.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </details>
            </Reveal>
          ))}
        </div>
        <p className="w-method__note">
          뉴스킨 디바이스와 각 기기에 맞는 전용 제품을 사용합니다. 사용하는 디바이스와 관리 구성은 프로그램에 따라 다르며, 예약 전에 안내해 드립니다. 체감은 개인에 따라 다를 수 있습니다.
        </p>

        <div className="w-eq__groups w-eq__groups--single">
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
