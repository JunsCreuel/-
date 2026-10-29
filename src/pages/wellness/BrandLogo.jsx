import './wellness-logo.css'

const BASE = import.meta.env.BASE_URL

// 브랜드 로고: 마크(벡터) + "예뻐졌다"(작게) + "WELLNESS STUDIO"(크게).
// 글자 두 줄은 원본 로고 모양 그대로 벡터(SVG) 마스크로 따 두어 어떤 크기에서도 또렷하고, 색은 원본에서 읽은 값(--w-logo-*)을 입힌다.
// variant="nav": 가로형(마크 옆에 두 줄), variant="stack": 원본처럼 세로로 쌓은 형태.
// decorative: 이미 라벨이 있는 링크 안에서 쓸 때 스크린리더에서 숨긴다.
// data-logo(mark·text·ko·en)는 쓰는 곳에서 부분별로 모양을 바꿀 때 고르는 이름이다.
export default function BrandLogo({ variant = 'nav', decorative = false }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': '예뻐졌다 WELLNESS STUDIO' }
  const mask = (file) => {
    const url = `url(${BASE}wellness/${file})`
    return { WebkitMaskImage: url, maskImage: url }
  }

  return (
    <span className={`w-logo w-logo--${variant}`} {...a11y}>
      <svg className="w-logo__mark" data-logo="mark" viewBox="0 0 108 103" aria-hidden="true" focusable="false">
        <path d="M0 103V40A40 40 0 0 1 40 0H65V25H42A17 17 0 0 0 25 42V103Z" fill="currentColor" />
        <rect x="83" y="10" width="25" height="93" fill="currentColor" />
      </svg>
      <span className="w-logo__text" data-logo="text" aria-hidden="true">
        <span className="w-logo__ko" data-logo="ko" style={mask('logo-ko.svg')} />
        <span className="w-logo__en" data-logo="en" style={mask('logo-wordmark.svg')} />
      </span>
    </span>
  )
}
