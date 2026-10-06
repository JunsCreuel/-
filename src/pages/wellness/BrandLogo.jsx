import './wellness-logo.css'

const BASE = import.meta.env.BASE_URL

// 브랜드 로고: 마크(벡터) + "예뻐졌다"(작게) + "WELLNESS STUDIO"(크게).
// 글자 두 줄은 원본 로고 모양 그대로 알파 이미지로 잘라 두고, 색은 주변 글자색(currentColor)을 따른다.
// variant="nav": 가로형(마크 옆에 두 줄), variant="stack": 원본처럼 세로로 쌓은 형태.
// decorative: 이미 라벨이 있는 링크 안에서 쓸 때 스크린리더에서 숨긴다.
export default function BrandLogo({ variant = 'nav', decorative = false }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': '예뻐졌다 WELLNESS STUDIO' }
  const mask = (file) => {
    const url = `url(${BASE}wellness/${file})`
    return { WebkitMaskImage: url, maskImage: url }
  }

  return (
    <span className={`w-logo w-logo--${variant}`} {...a11y}>
      <svg className="w-logo__mark" viewBox="0 0 108 103" aria-hidden="true" focusable="false">
        <path d="M0 103V40A40 40 0 0 1 40 0H65V25H42A17 17 0 0 0 25 42V103Z" fill="currentColor" />
        <rect x="83" y="10" width="25" height="93" fill="currentColor" />
      </svg>
      <span className="w-logo__text" aria-hidden="true">
        <span className="w-logo__ko" style={mask('logo-ko.png')} />
        <span className="w-logo__en" style={mask('logo-wordmark.png')} />
      </span>
    </span>
  )
}
