import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent } from './content-context'
import { clearToken, errorMessage, loadRemote, readToken, resolveRepo, saveRemote, writeToken } from './github'
import './wellness-editor.css'

const HELP_URL = 'https://github.com/JunsCreuel/-/blob/main/docs/text-edit-mode.md'

// 주소 끝에 ?edit를 붙였을 때만 나타나는 글 수정 바. 토큰이 있어야만 수정과 저장이 열린다.
export default function EditorBar() {
  const ctx = useContent()
  const [params, setParams] = useSearchParams()
  const wantEdit = params.has('edit')
  const [token, setToken] = useState(readToken)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const shaRef = useRef('')
  const triedRef = useRef(false)
  const repo = resolveRepo()

  const changedKeys = ctx
    ? [...new Set([...Object.keys(ctx.texts), ...Object.keys(ctx.saved)])].filter((k) => ctx.texts[k] !== ctx.saved[k])
    : []
  const dirty = changedKeys.length > 0

  async function connect(t) {
    // 어떤 경로로 연결했든 같은 주소에서 자동으로 다시 연결하지 않도록 기록한다.
    triedRef.current = true
    setBusy(true)
    setError('')
    try {
      if (!repo) throw new Error('이 주소에서는 저장할 수 없어요. 배포된 사이트 주소에서 열어 주세요.')
      const remote = await loadRemote(t, repo)
      shaRef.current = remote.sha
      writeToken(t)
      setToken(t)
      ctx.enterEdit(remote.texts)
    } catch (err) {
      setError(errorMessage(err))
      if (err?.status === 401) {
        clearToken()
        setToken('')
      }
    } finally {
      setBusy(false)
    }
  }

  // 토큰이 이미 저장돼 있으면 ?edit로 들어올 때 자동으로 이어서 연결한다.
  useEffect(() => {
    if (!wantEdit) {
      triedRef.current = false
      return
    }
    if (!ctx || ctx.editing || !token || triedRef.current) return
    connect(token)
  })

  // 저장하지 않은 수정이 있으면 창을 닫기 전에 한 번 더 묻는다.
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!ctx || (!wantEdit && !ctx.editing)) return null

  function leaveEditMode() {
    ctx.exitEdit()
    setNotice('')
    const next = new URLSearchParams(params)
    next.delete('edit')
    setParams(next, { replace: true })
  }

  function exit() {
    if (dirty && !window.confirm('저장하지 않은 수정이 있어요. 그래도 끝낼까요?')) return
    leaveEditMode()
  }

  async function save() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const result = await saveRemote(token, repo, shaRef.current, ctx.texts, `content: 랜딩 문구 수정 (${changedKeys.length}곳)`)
      shaRef.current = result.sha
      ctx.markSaved(ctx.texts)
      setNotice('저장했어요. 1~2분 뒤 사이트에 반영돼요.')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  function forgetToken() {
    if (dirty && !window.confirm('저장하지 않은 수정이 있어요. 그래도 토큰을 지울까요?')) return
    clearToken()
    setToken('')
    leaveEditMode()
  }

  // 아직 연결 전: 토큰 입력 또는 연결 중 표시
  if (!ctx.editing) {
    const connecting = Boolean(token) && !error
    return (
      <div className="w-editbar" role="dialog" aria-label="글 수정 모드">
        <p className="w-editbar__title">글 수정 모드</p>
        {connecting ? (
          <p className="w-editbar__msg">연결하는 중이에요…</p>
        ) : (
          <>
            <p className="w-editbar__msg">
              GitHub 토큰을 한 번 넣으면 이 화면에서 글을 바로 고칠 수 있어요.{' '}
              <a href={HELP_URL} target="_blank" rel="noopener noreferrer">
                토큰 만드는 방법
              </a>
            </p>
            <form
              className="w-editbar__form"
              onSubmit={(e) => {
                e.preventDefault()
                if (input.trim()) connect(input.trim())
              }}
            >
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="github_pat_…"
                autoComplete="off"
                aria-label="GitHub 토큰"
              />
              <button type="submit" disabled={busy || !input.trim()}>
                {busy ? '확인 중…' : '연결'}
              </button>
              <button type="button" className="is-quiet" onClick={leaveEditMode}>
                닫기
              </button>
            </form>
          </>
        )}
        {error && <p className="w-editbar__error">{error}</p>}
      </div>
    )
  }

  return (
    <div className="w-editbar" role="region" aria-label="글 수정 모드">
      <p className="w-editbar__title">
        글 수정 모드 <span>· 글을 눌러서 고치세요 · 수정한 곳 {changedKeys.length}개</span>
      </p>
      <p className="w-editbar__msg">전화번호, 주소, 영업시간, 링크, 사진은 여기서 고칠 수 없어요.</p>
      <div className="w-editbar__actions">
        <button type="button" onClick={save} disabled={busy || !dirty}>
          {busy ? '저장 중…' : '저장하고 사이트에 반영'}
        </button>
        <button type="button" className="is-quiet" onClick={ctx.revert} disabled={busy || !dirty}>
          수정 취소
        </button>
        <button type="button" className="is-quiet" onClick={exit} disabled={busy}>
          끝내기
        </button>
        <button type="button" className="is-quiet is-small" onClick={forgetToken} disabled={busy}>
          토큰 지우기
        </button>
      </div>
      {notice && <p className="w-editbar__notice">{notice}</p>}
      {error && <p className="w-editbar__error">{error}</p>}
    </div>
  )
}
