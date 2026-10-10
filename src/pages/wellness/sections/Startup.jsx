import { BRANCHES, telHref } from '../data'
import { Reveal } from '../ui'
export default function Startup() {
  return <section id="startup" className="w-section w-section--band"><div className="w-container">
    <Reveal as="p" className="w-eyebrow">Business Inquiry</Reveal>
    <Reveal as="h2" className="w-title">웰니스 공간을<br />시작하고 싶으신가요?</Reveal>
    <Reveal as="p" className="w-lead">온열돔과 부위별 디바이스 케어를 결합한 웰니스 운영 방식이 궁금하다면, 창업·운영 상담으로 만나보세요.</Reveal>
    <ul className="w-tags"><li>신규 창업 상담</li><li>기존 샵 도입 상담</li></ul>
    <p className="w-program__text">희망 지역, 준비 단계, 궁금한 내용을 알려주시면 상담 가능한 범위를 안내해 드립니다.</p>
    <div className="w-hero__actions"><a className="w-btn w-btn--primary" href={telHref(BRANCHES.zai.phone)}>창업·운영 전화 상담</a><a className="w-link" href={telHref(BRANCHES.zai.phone)}>{BRANCHES.zai.phone}</a></div>
  </div></section>
}
