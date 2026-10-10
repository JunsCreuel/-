import { scrollToId } from '../scroll'
import { Reveal } from '../ui'
export default function WarmRitual() {
  return <section id="warm-ritual" className="w-section w-section--green"><div className="w-container">
    <Reveal as="p" className="w-eyebrow">Warm Ritual</Reveal>
    <Reveal as="h2" className="w-title">추운 날,<br />나를 위한 따뜻한 예약.</Reveal>
    <Reveal as="p" className="w-lead">온열돔에서 편안히 쉬어가는 시간. 단독으로 이용하거나, 원하는 부위의 집중관리를 더해보세요.</Reveal>
    <div className="w-care-grid">
      {[['온열돔 단독 이용', '따뜻한 휴식이 필요한 날, 온열돔만 편안하게 이용하세요.'], ['정기 이용 상담', '일상 속 온열 루틴을 원하신다면, 방문 주기와 이용권 구성을 상담해 주세요.'], ['온열돔 + 집중관리', '따뜻하게 쉰 다음, 신경 쓰이는 한 부위를 더 세심하게 돌보세요.']].map(([title, text]) => <Reveal as="article" className="w-care-card" key={title}><h3>{title}</h3><p>{text}</p></Reveal>)}
    </div>
    <div className="w-hero__actions"><button type="button" className="w-btn w-btn--light" onClick={() => scrollToId('booking')}>온열돔 이용 상담</button></div>
    <p className="w-feel__note">100% 예약제 · 이용시간과 비용, 정기 이용 구성은 상담 시 안내합니다.</p>
  </div></section>
}
