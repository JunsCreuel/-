import { Reveal } from '../ui'

// 핵심 가치 5가지. 이미 사이트에 있는 사실(온열돔, 아웃케어, 상담, 100% 예약제, 4년 운영)만 쓴다.
const ICONS = {
  dome: 'M3 19h18M5 19a7 7 0 0 1 14 0M9.5 9.5c-1-1.2 1-2.2 0-3.6M14.5 9.5c-1-1.2 1-2.2 0-3.6',
  drop: 'M12 3.5c3.2 3.8 5.5 6.6 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.6 5.5-9.4z',
  chat: 'M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5z',
  calendar: 'M5 6.5h14v13H5zM5 10.5h14M9 4.5v4M15 4.5v4',
  shield: 'M12 3.5l7 2.8v5.2c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6.3zM9 12l2.2 2.2L15.2 10',
}

const VALUES = [
  { icon: 'dome', title: '온열돔 케어', text: '명신메디칼 전신 온열돔에서 편안히 쉬어갑니다.' },
  { icon: 'drop', title: '디바이스 아웃케어', text: '고민 부위를 부위와 프로그램에 맞춰 한 번 더 세심하게 돌봅니다.' },
  { icon: 'chat', title: '상담에서 시작', text: '오늘의 고민과 컨디션을 먼저 듣고 관리를 정합니다.' },
  { icon: 'calendar', title: '100% 예약제', text: '소요시간과 비용, 온열돔 포함 여부를 예약 전에 안내합니다.' },
  { icon: 'shield', title: '4년의 운영', text: '4년간 운영해 온 예뻐졌다 웰니스 스튜디오입니다.' },
]

export default function Values() {
  return (
    <section id="values" className="w-section w-values">
      <div className="w-container">
        <Reveal as="p" className="w-eyebrow w-values__eyebrow">
          Why 예뻐졌다
        </Reveal>
        <Reveal as="h2" delay={80} className="w-title w-values__title">
          예뻐졌다가 특별한 이유
        </Reveal>
        <ul className="w-values__list">
          {VALUES.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 70} className="w-values__item">
              <span className="w-values__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICONS[v.icon]} />
                </svg>
              </span>
              <div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
