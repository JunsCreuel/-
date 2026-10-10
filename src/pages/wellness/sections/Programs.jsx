import { PHOTOS } from '../data'
import { scrollToId } from '../scroll'
import { Reveal } from '../ui'

const SIGNATURE = [
  { no: '01', en: 'SCALP REFRESH', title: '두피 리프레시', text: '답답하게 느껴지는 두피를 세심하게 돌보는, 나를 위한 휴식 시간. 두피 상태와 고민을 상담해 관리 방향을 정합니다.', tags: ['두피 집중', '편안한 휴식'] },
  { no: '02', en: 'FACE CONDITIONING', title: '페이스 컨디셔닝', text: '피부 상태에 맞춘 제품과 페이스 갈바닉으로 진행하는 섬세한 얼굴 관리. 건조함과 피부 컨디션 등 오늘의 고민을 함께 살핍니다.', tags: ['얼굴 집중', '페이스 갈바닉'] },
  { no: '03', en: 'ABDOMEN CARE', title: '복부 슬리밍 케어', text: '복부 라인이 고민인 분을 위한 온열돔과 복부 집중 아웃케어. 바디 디바이스와 전용 제품을 활용해 신경 쓰이는 부위를 세심하게 관리합니다.', tags: ['온열돔 + 복부', '바디 디바이스'] },
]
export default function Programs() {
  return <section id="programs" className="w-section w-section--band"><div className="w-container">
    <Reveal as="p" className="w-eyebrow">Signature & Total Care</Reveal>
    <Reveal as="h2" className="w-title">두피부터 얼굴, 복부까지.<br />나의 고민에서 시작하는 관리.</Reveal>
    <p className="w-lead">세 가지 시그니처부터 여러 부위를 함께 돌보는 전신 집중관리까지, 필요한 케어를 선택하세요.</p>
    <div className="w-care-grid">{SIGNATURE.map(p => <Reveal as="article" key={p.no} className="w-care-card">
      <p className="w-program__no">{p.no}</p><p className="w-method__en">{p.en}</p><h3>{p.title}</h3><p>{p.text}</p>
      <ul className="w-tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
      <button className="w-link" type="button" onClick={() => scrollToId('booking')}>{p.title} 상담 →</button>
    </Reveal>)}</div>
    <Reveal className="w-total-care">
      <figure className="w-photo"><img src={PHOTOS.back} alt="등 부위 집중관리 모습" width="736" height="986" loading="lazy" /></figure>
      <div><p className="w-eyebrow">Intensive Full Body</p><h3 className="w-title">전신 밸런스 케어</h3>
        <p className="w-lead">등·복부·하체 등 여러 부위의 고민을 함께 살피는 전신 맞춤 관리. 온열돔 후 필요한 부위에 집중하는 아웃케어로 이어집니다.</p>
        <ul className="w-tags"><li>등 · 어깨</li><li>복부</li><li>하체</li><li>전신</li></ul>
        <div className="w-hero__actions"><button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>전신 집중관리 상담</button></div>
      </div>
    </Reveal>
    <p className="w-method__note">관리 부위와 구성에 따라 소요시간과 비용이 달라집니다. 온열돔 포함 여부와 함께 예약 전에 안내드립니다.</p>
  </div></section>
}
