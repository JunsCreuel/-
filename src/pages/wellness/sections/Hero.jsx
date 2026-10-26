import { useEffect, useState } from 'react'
import BrandLogo from '../BrandLogo'
import { prefersReducedMotion } from '../motion'
import WaterCanvas from './WaterCanvas'
import './yw-hero.css'

// 메인 비주얼 — 얕은 물 아래 모래 사진 한 장을 물결처럼 일렁이게 그린 화면(WaterCanvas) 위에 로고 하나만.
// 들어오면 흰 포말이 이는 파도 한 줄기가 왼쪽 위에서 오른쪽 아래로 쓸고 지나가고(WaterCanvas),
// 파도가 지나간 자리에서 로고가 같은 방향으로 드러난 뒤 빛이 한 번 스친다(yw-hero.css, .is-go일 때).
// 물결을 그리지 못하는 기기에서는 잠깐 뒤 로고만 같은 방식으로 드러난다.
// '멈춤'으로 물결을 세울 수 있고, 모션 줄이기·WebGL이 없는 기기에서는 사진과 로고가 멈춘 채 바로 보인다.
const WATER = `${import.meta.env.BASE_URL}wellness/photos/hero-water.webp`

export default function Hero() {
  const [reduced] = useState(prefersReducedMotion)
  const [stopped, setStopped] = useState(reduced)
  const [go, setGo] = useState(reduced)

  // 물결이 시작되지 않으면(WebGL 없음·사진 늦음) 1.5초 뒤 로고만 드러낸다
  useEffect(() => {
    if (go) return undefined
    const t = setTimeout(() => setGo(true), 1500)
    return () => clearTimeout(t)
  }, [go])

  return (
    <section id="top" className={`yw-section yw-hero yw-hero--water yw-hero--logo${go ? ' is-go' : ''}`} data-theme="dark" data-cursor-off>
      <div className="yw-hero__media" aria-hidden="true">
        <img src={WATER} alt="" fetchPriority="high" />
        <WaterCanvas src={WATER} paused={stopped} onStart={() => setGo(true)} className="yw-hero__water" />
      </div>
      <div className="yw-hero__shade" aria-hidden="true" />

      <h1 className="yw-hero__brand">
        <BrandLogo variant="stack" />
      </h1>

      {!reduced && (
        <button
          type="button"
          className="yw-hero__pause yw-hero__pause--corner"
          aria-pressed={stopped}
          aria-label={stopped ? '물결 움직임 재생' : '물결 움직임 멈춤'}
          onClick={() => setStopped((v) => !v)}
        >
          <span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span>
        </button>
      )}
    </section>
  )
}
