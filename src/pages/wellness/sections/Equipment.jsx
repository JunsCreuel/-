import { REVIEWS } from '../data'
import { Reveal } from '../ui'
const DEVICES = [
  ['01', '페이스 갈바닉', '얼굴 피부를 위한 섬세한 디바이스 케어. 피부 상태에 맞춰 전용 제품과 함께 진행합니다.'],
  ['02', '바디 갈바닉', '전용 바디 쉐이핑 젤과 함께, 복부 등 고민 부위를 집중적으로 돌보는 바디 케어입니다.'],
  ['03', '웰스파', '바디 라인과 무겁게 느껴지는 부위를 세심하게 돌봅니다. 웰스파 전용 제품을 함께 사용합니다.'],
]
export default function Equipment() {
  return <section id="equipment" className="w-section"><div className="w-container">
    <Reveal as="p" className="w-eyebrow">Our Equipment</Reveal>
    <Reveal as="h2" className="w-title">따뜻한 휴식의 시작,<br />명신메디칼 전신 온열돔.</Reveal>
    <Reveal className="w-equipment">
      <figure><img src={REVIEWS[0].photo.src} alt="자이점에서 사용하는 전신 온열돔" width="1280" height="853" loading="lazy" /><figcaption>예뻐졌다 자이점 · 온열돔 관리 공간</figcaption></figure>
      <div><p className="w-lead">원적외선 온열 기술을 활용한 전신 온열 케어입니다. 편안히 누워 온기를 느끼며 쉬어가고, 선택한 프로그램에 따라 고민 부위 아웃케어로 이어집니다.</p>
      <ul className="w-ruled"><li>원적외선 온열 케어</li><li>누워서 즐기는 따뜻한 휴식</li><li>단독 이용 또는 집중관리와 함께</li><li>이용 중 상태와 불편함 확인</li></ul></div>
    </Reveal>
    <Reveal as="h3" className="w-device-heading">부위에 맞춰 섬세하게,<br />세 가지 디바이스 아웃케어.</Reveal>
    <div className="w-care-grid">{DEVICES.map(([no, name, text]) => <Reveal as="article" className="w-care-card" key={no}><p className="w-program__no">{no}</p><h3>{name}</h3><p>{text}</p></Reveal>)}</div>
    <p className="w-method__note">뉴스킨 디바이스와 각 기기에 맞는 전용 제품을 사용합니다. 사용하는 디바이스와 관리 구성은 프로그램에 따라 다릅니다.</p>
  </div></section>
}
