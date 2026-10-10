import { Reveal } from '../ui'

const METHODS = [
  { no: '01', en: 'CONSULTATION', ko: '오늘의 고민을 듣습니다', text: '두피와 피부 상태, 신경 쓰이는 복부 라인, 무겁게 느껴지는 등과 하체. 오늘 집중하고 싶은 부위와 컨디션을 먼저 살핍니다.' },
  { no: '02', en: 'HEAT DOME', ko: '온열돔으로 따뜻하게', text: '명신메디칼 전신 온열돔에서 편안히 쉬어갑니다. 이용 중 상태와 불편함을 확인하며, 선택한 관리에 맞춰 온열 케어를 진행합니다.' },
  { no: '03', en: 'OUT CARE', ko: '고민 부위를 한 번 더', text: '온열돔 이용 후, 상담에서 확인한 고민 부위를 더욱 세심하게 관리합니다. 페이스 갈바닉·바디 갈바닉·웰스파를 부위와 프로그램에 맞춰 활용합니다.' },
  { no: '04', en: 'FINISH', ko: '마무리까지 세심하게', text: '관리 후 피부 상태와 편안함을 확인하고, 일상에서 이어갈 수 있는 관리 방법을 안내합니다.' },
]
export default function About() {
  return <section id="about" className="w-section"><div className="w-container">
    <Reveal as="p" className="w-eyebrow">Our Method</Reveal>
    <Reveal as="h2" className="w-title">온열이 몸을 준비시키고,<br />아웃케어가 완성합니다.</Reveal>
    <Reveal as="p" className="w-lead">아웃케어는 온열돔 후 고민 부위를 한 번 더 돌보는 집중관리입니다. 따뜻한 휴식부터 섬세한 디바이스 케어까지, 나에게 맞는 하나의 흐름으로 이어집니다.</Reveal>
    <div className="w-method__rows">{METHODS.map(m => <Reveal key={m.no} className="w-method__row">
      <p className="w-method__no">{m.no}</p><div><p className="w-method__en">{m.en}</p><h3 className="w-method__ko">{m.ko}</h3></div><p className="w-method__text">{m.text}</p>
    </Reveal>)}</div>
    <p className="w-method__note">온열돔 단독 이용도 가능합니다. 온열돔 포함 여부와 사용하는 디바이스는 프로그램에 따라 달라지며, 예약 전에 안내드립니다.</p>
  </div></section>
}
