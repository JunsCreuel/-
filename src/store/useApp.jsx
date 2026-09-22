import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'sabyeok:app:v2'

const AppContext = createContext(null)

// state shape
// {
//   users: [{ id, nickname, password }],   // 데모용 평문 저장, 이 브라우저에만 존재
//   session: { userId } | null,
// }
function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { users: [], session: null }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.users)) {
      return { users: [], session: null }
    }
    return { users: parsed.users, session: parsed.session ?? null }
  } catch {
    return { users: [], session: null }
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 저장 공간이 없거나 접근이 막힌 경우, 화면 동작에는 지장이 없도록 조용히 무시합니다.
    }
  }, [state])

  function getCurrentUser() {
    if (!state.session) return null
    return state.users.find((user) => user.id === state.session.userId) ?? null
  }

  function signup(nickname, password) {
    const trimmedNickname = nickname.trim()
    if (!trimmedNickname || !password) {
      return { ok: false, error: '닉네임과 비밀번호를 모두 입력해주세요.' }
    }
    if (state.users.some((user) => user.nickname === trimmedNickname)) {
      return { ok: false, error: '이미 사용 중인 닉네임이에요.' }
    }

    const newUser = { id: crypto.randomUUID(), nickname: trimmedNickname, password }
    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      session: { userId: newUser.id },
    }))
    return { ok: true }
  }

  function login(nickname, password) {
    const trimmedNickname = nickname.trim()
    const user = state.users.find(
      (candidate) => candidate.nickname === trimmedNickname && candidate.password === password,
    )
    if (!user) {
      return { ok: false, error: '닉네임 또는 비밀번호가 일치하지 않아요.' }
    }
    setState((prev) => ({ ...prev, session: { userId: user.id } }))
    return { ok: true }
  }

  function logout() {
    setState((prev) => ({ ...prev, session: null }))
  }

  const value = { getCurrentUser, signup, login, logout }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp은 AppProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
