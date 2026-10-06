import { Children } from 'react'

const MAX_LEN = 2000

// <T>의 자식(문자열, <br />)을 한 덩어리 문자열로 바꾼다. 줄바꿈은 \n으로 둔다.
export function childrenToText(children) {
  return Children.toArray(children)
    .map((c) => {
      if (typeof c === 'string' || typeof c === 'number') return String(c)
      if (c && c.type === 'br') return '\n'
      return ''
    })
    .join('')
}

// 저장된 값 중 문자열만, 길이 제한 안에서만 받아들인다.
export function sanitizeTexts(raw) {
  const out = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string' && value.length <= MAX_LEN) out[key] = value
  }
  return out
}

// 편집 중인 요소에서 읽은 글을 저장 형태로 정리한다.
export function normalizeEdited(text) {
  return text
    .replace(/ /g, ' ')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+$/, '')
}
