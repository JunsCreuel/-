import { PHOTOS } from '../data'
import { Reveal } from '../ui'

// 디바이스마다 맞춘 전용 제품. 성분 설명은 시안(Claude Design 캔버스 "05 전용 젤") 문구 그대로다.
// icon이 있는 성분은 동그란 사진과 함께, 없으면 이름과 설명만 보여 준다.
const GELS = [
  {
    no: '01',
    kind: '바디 갈바닉 전용 젤',
    name: '에이지락 바디 쉐이핑 젤',
    en: 'Body Shaping Gel · 300 mL',
    photo: PHOTOS.gelShaping,
    alt: '파란색 튜브의 에이지락 바디 쉐이핑 젤',
    text: '바디 갈바닉 관리에 함께 쓰는 전용 젤입니다. 갈바닉 전류가 피부에 고르게 닿도록 돕고, 복부처럼 넓은 부위를 부드럽게 관리할 수 있게 해 줍니다.',
    ingredients: [
      { icon: PHOTOS.ingKelp, iconAlt: '초록빛 해조류', name: '호스테일켈프 추출물', en: 'Laminaria Digitata Extract', desc: '바다에서 자라는 갈조류에서 얻은 성분' },
      { icon: PHOTOS.ingTheobromine, iconAlt: '맑은 물방울 구조', name: '테오브로민', en: 'Theobromine', desc: '카카오에 들어 있는 성분' },
    ],
  },
  {
    no: '02',
    kind: '웰스파 전용 세럼',
    name: '에이지락 바디 세럼',
    en: 'Body Serum · 100 mL',
    photo: PHOTOS.gelSerum,
    alt: '손바닥에 덜어 낸 에이지락 바디 세럼',
    hand: true,
    text: '웰스파 관리 때 함께 쓰는 전용 세럼입니다. 셀룰라이트가 신경 쓰이는 부위와 탄력, 바디 라인을 관리할 때 사용합니다.',
    ingredients: [
      { name: '바디 실루엣 블렌드', desc: '보태니컬 성분 복합체로 바디 피부를 탄탄하게 가꿔 줍니다.' },
      { name: 'AI 펩타이드', desc: 'AI로 찾아낸 펩타이드로 탄력 있는 바디 피부를 돕습니다.' },
      { name: '타라열매 & 코토니 추출물', desc: '외부 환경으로부터 피부를 보호해 매끄럽고 촉촉하게 지켜 줍니다.' },
      { name: '스킨 컨디셔닝 블렌드', desc: '마카다미아넛오일, 해바라기씨오일 추출물, 알란토인, 판테놀' },
      { name: '에이지락 블렌드', desc: '세월의 흐름에 따른 피부 고민을 케어하는 프리미엄 블렌드' },
    ],
  },
  {
    no: '03',
    kind: '웰스파 전용 젤',
    name: '에이지락 바디 액티베이팅 젤',
    en: 'Body Activating Gel · 150 mL',
    photo: PHOTOS.gelActivating,
    alt: '손바닥에 짜내는 에이지락 바디 액티베이팅 젤',
    hand: true,
    text: '웰스파 관리 때 함께 쓰는 전용 젤입니다. 순환이 답답하게 느껴질 때, 뻐근하게 뭉친 부위와 붓기가 신경 쓰일 때 사용합니다.',
    ingredients: [
      { name: '서양벌노랑이꽃 추출물', desc: '정체된 바디 사이클을 깨우고 전반적인 밸런스를 챙겨 줍니다.' },
      { name: '록샘파이어 추출물', desc: '가벼운 아침을 위한 상쾌한 리프레시 케어' },
      { name: '윈터체리뿌리 추출물', desc: '바디 피부에 쌓인 스트레스를 덜어 편안하게 가꿔 줍니다.' },
      { name: '에이지락 블렌드', desc: '세월의 흐름에 따른 피부 고민을 케어하는 프리미엄 블렌드' },
    ],
  },
]

// 전용 젤: 오일 대신 디바이스마다 맞춘 제품을 쓴다는 설명. 제품마다 사진 한 장 + 성분 목록.
export default function Gel() {
  return (
    <section id="gel" className="w-section w-section--band w-gel">
      <div className="w-container">
        <Reveal as="p" className="w-label">
          Exclusive Gel
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title w-gel__title">
          피부에 닿는 것까지,
          <br />
          <em>전용</em>으로
        </Reveal>
        <Reveal as="p" delay={120} className="w-lead">
          예뻐졌다는 관리할 때 오일 대신 디바이스마다 맞춘 전용 젤을 사용합니다.
        </Reveal>

        <div className="w-gel__list">
          {GELS.map((g) => (
            <Reveal as="article" key={g.no} className="w-gel__item">
              <div className={`w-gel__fig${g.hand ? ' w-gel__fig--hand' : ''}`}>
                <img src={g.photo} alt={g.alt} loading="lazy" decoding="async" />
              </div>
              <div className="w-gel__body">
                <p className="w-gel__kind">
                  <span>{g.no}</span>
                  {g.kind}
                </p>
                <h3 className="w-gel__name">{g.name}</h3>
                <p className="w-gel__en">{g.en}</p>
                <p className="w-gel__text">{g.text}</p>
                <div className="w-gel__ing">
                  <p className="w-gel__ing-label">주요 성분</p>
                  <ul className="w-gel__ings">
                    {g.ingredients.map((ing) => (
                      <li key={ing.name} className={ing.icon ? 'has-icon' : undefined}>
                        {ing.icon && <img src={ing.icon} alt={ing.iconAlt} width="72" height="72" loading="lazy" decoding="async" />}
                        <div>
                          <p className="w-gel__ing-name">{ing.name}</p>
                          {ing.en && <p className="w-gel__ing-en">{ing.en}</p>}
                          <p className="w-gel__ing-desc">{ing.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="w-method__note">사용하는 제품은 디바이스와 프로그램에 따라 다르며, 예약 전에 안내해 드립니다. 체감은 개인에 따라 다를 수 있습니다.</p>
      </div>
    </section>
  )
}
