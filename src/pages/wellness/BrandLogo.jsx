const BASE = import.meta.env.BASE_URL

// 브랜드 로고: 마크(벡터) + "예뻐졌다"(작게) + "WELLNESS STUDIO"(크게).
// 모든 크기는 원본 로고 이미지(815px) 안의 픽셀 × --u로 계산해 비율을 지키고, 색은 원본에서 읽은 값(--w-logo-mark·--w-logo-text)이다.
// 글자 두 줄은 원본 로고 모양 그대로 벡터(SVG) 마스크로 따 두어 어떤 크기에서도 또렷하다.
// variant="nav": 가로형(마크 옆에 두 줄), variant="stack": 원본처럼 세로로 쌓은 형태.
// decorative: 이미 라벨이 있는 링크 안에서 쓸 때 스크린리더에서 숨긴다.
// data-logo(nav·stack은 로고 전체, mark·text·ko·en은 부분)는 쓰는 곳에서 크기(--u)·색이나 부분별 모양을 바꿀 때 고르는 이름이다.
const ROOT = {
  // 가로형: 마크 옆에 '예뻐졌다'(작게)와 'WELLNESS STUDIO'(크게)를 두 줄로. 좁은 폰에서는 조금 작게
  nav: 'items-center gap-[calc(var(--u)_*_36)] [--u:0.27px] [@media(max-width:420px)]:[--u:0.23px] [@media(max-width:360px)]:[--u:0.2px]',
  // 세로형: 원본 로고처럼 마크 → 예뻐졌다 → WELLNESS STUDIO 순서로 쌓는다
  stack: 'flex-col items-center [--u:0.46px] [@media(max-width:420px)]:[--u:0.4px]',
}
const TEXT = {
  nav: 'items-start gap-[calc(var(--u)_*_10)]',
  stack: 'mt-[calc(var(--u)_*_44)] items-center gap-[calc(var(--u)_*_49)]',
}
// 글자 두 줄: 원본 모양 그대로의 SVG 마스크에 글자색을 입힌다
const MASKED =
  'block bg-(--w-logo-text) [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]'
export default function BrandLogo({ variant = 'nav', decorative = false }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': '예뻐졌다 WELLNESS STUDIO' }
  const mask = (file) => {
    const url = `url(${BASE}wellness/${file})`
    return { WebkitMaskImage: url, maskImage: url }
  }

  return (
    <span className={`inline-flex leading-[0] ${ROOT[variant]}`} data-logo={variant} {...a11y}>
      <svg
        className="block h-[calc(var(--u)_*_103)] w-[calc(var(--u)_*_108)] flex-none text-(--w-logo-mark)"
        data-logo="mark" viewBox="0 0 108 103" aria-hidden="true" focusable="false">
        <path d="M0 103V40A40 40 0 0 1 40 0H65V25H42A17 17 0 0 0 25 42V103Z" fill="currentColor" />
        <rect x="83" y="10" width="25" height="93" fill="currentColor" />
      </svg>
      <span className={`flex flex-col ${TEXT[variant]}`} data-logo="text" aria-hidden="true">
        <span className={`${MASKED} h-[calc(var(--u)_*_41)] w-[calc(var(--u)_*_166)]`} data-logo="ko" style={mask('logo-ko.svg')} />
        <span className={`${MASKED} h-[calc(var(--u)_*_52)] w-[calc(var(--u)_*_630)]`} data-logo="en" style={mask('logo-wordmark.svg')} />
      </span>
    </span>
  )
}
