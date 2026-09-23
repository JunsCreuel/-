import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AppContext = createContext(null)

// Firebase Auth는 이메일 형식을 요구하므로, 닉네임을 해시해서 고유한
// 가짜 이메일로 바꿔 사용한다. 같은 닉네임은 항상 같은 이메일이 되므로
// 회원가입 시 "이미 사용 중인 닉네임"도 Firebase의 email-already-in-use
// 에러로 자연스럽게 걸러진다.
async function nicknameToEmail(nickname) {
  const data = new TextEncoder().encode(nickname)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `u${hex}@sabyeok.local`
}

function authErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return '이미 사용 중인 닉네임이에요.'
    case 'auth/weak-password':
      return '비밀번호는 6자 이상이어야 해요.'
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return '닉네임 또는 비밀번호가 일치하지 않아요.'
    default:
      return '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.'
  }
}

export function AppProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true)
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null)
        setProfile(null)
        setAuthLoading(false)
        return
      }
      const snap = await getDoc(doc(db, 'users', user.uid))
      setFirebaseUser(user)
      setProfile(snap.exists() ? snap.data() : null)
      setAuthLoading(false)
    })
    return unsubscribe
  }, [])

  function getCurrentUser() {
    if (!firebaseUser) return null
    return { id: firebaseUser.uid, nickname: profile?.nickname ?? '' }
  }

  async function signup(nickname, password) {
    const trimmed = nickname.trim()
    if (!trimmed || !password) {
      return { ok: false, error: '닉네임과 비밀번호를 모두 입력해주세요.' }
    }
    try {
      const email = await nicknameToEmail(trimmed)
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', credential.user.uid), {
        nickname: trimmed,
        createdAt: serverTimestamp(),
      })
      return { ok: true }
    } catch (error) {
      return { ok: false, error: authErrorMessage(error) }
    }
  }

  async function login(nickname, password) {
    const trimmed = nickname.trim()
    if (!trimmed || !password) {
      return { ok: false, error: '닉네임과 비밀번호를 모두 입력해주세요.' }
    }
    try {
      const email = await nicknameToEmail(trimmed)
      await signInWithEmailAndPassword(auth, email, password)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: authErrorMessage(error) }
    }
  }

  function logout() {
    return signOut(auth)
  }

  const value = { authLoading, getCurrentUser, signup, login, logout }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp은 AppProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
