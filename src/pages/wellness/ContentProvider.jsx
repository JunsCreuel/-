import { useCallback, useMemo, useRef, useState } from 'react'
import bundled from './content.json'
import { ContentContext } from './content-context'
import { sanitizeTexts } from './content-utils'

// 화면에 보이는 문구의 "수정본"을 들고 있는다.
// 방문자: 빌드에 포함된 content.json 값을 그대로 쓴다.
// 수정 모드: GitHub에서 받아 온 최신 값에 고치는 내용이 쌓이고, 저장하면 content.json으로 기록된다.
export default function ContentProvider({ children }) {
  const [initial] = useState(() => sanitizeTexts(bundled.texts))
  const [texts, setTexts] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [revision, setRevision] = useState(0)
  // 각 <T>가 코드에 적힌 기본 문구를 여기에 등록한다. 기본과 같아지면 수정본에서 뺀다.
  const defaultsRef = useRef({})

  const setText = useCallback((key, value) => {
    setTexts((prev) => {
      const next = { ...prev }
      if (value === '' || value === defaultsRef.current[key]) delete next[key]
      else next[key] = value
      return next
    })
  }, [])

  const enterEdit = useCallback((remoteTexts) => {
    const clean = sanitizeTexts(remoteTexts)
    setTexts(clean)
    setSaved(clean)
    setRevision((r) => r + 1)
    setEditing(true)
  }, [])

  const exitEdit = useCallback(() => {
    setTexts(saved)
    setRevision((r) => r + 1)
    setEditing(false)
  }, [saved])

  const markSaved = useCallback((next) => setSaved(next), [])

  const revert = useCallback(() => {
    setTexts(saved)
    setRevision((r) => r + 1)
  }, [saved])

  const value = useMemo(
    () => ({ texts, saved, editing, revision, defaultsRef, setText, enterEdit, exitEdit, markSaved, revert }),
    [texts, saved, editing, revision, setText, enterEdit, exitEdit, markSaved, revert],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
