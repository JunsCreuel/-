import { createContext, useContext } from 'react'

export const ContentContext = createContext(null)

// Provider 밖에서도 페이지가 깨지지 않도록 null을 허용한다. 이때는 코드에 적힌 기본 문구를 그대로 쓴다.
export function useContent() {
  return useContext(ContentContext)
}

// 문구를 코드에서 직접 꺼내 써야 할 때(aria-label 등)의 도우미. 수정된 값이 있으면 그 값을 돌려준다.
export function useT() {
  const ctx = useContext(ContentContext)
  return (key, fallback) => ctx?.texts[key] ?? fallback
}
