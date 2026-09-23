import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../store/useApp'

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    const result = await signup(nickname, password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const redirectTo = location.state?.from?.pathname ?? '/'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-page">
      <h1>회원가입</h1>
      <p className="auth-lead">닉네임과 비밀번호만으로 바로 시작할 수 있어요.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>닉네임</span>
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="다른 사람에게 보여줄 이름"
            autoComplete="username"
          />
        </label>
        <label className="auth-field">
          <span>비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            autoComplete="new-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? '가입하는 중...' : '가입하고 시작하기'}
        </button>
      </form>

      <p className="auth-switch">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>

      <p className="auth-disclaimer">
        닉네임과 비밀번호로 계정이 만들어지고, 남긴 사연은 이제 다른
        방문자에게도 보여요. 이메일 등록 없이 가입하는 간이 계정이라
        비밀번호를 잊으면 복구할 방법이 없으니 꼭 기억해두세요.
      </p>
    </div>
  )
}
