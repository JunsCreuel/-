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

  function handleSubmit(event) {
    event.preventDefault()
    const result = signup(nickname, password)
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

        <button type="submit" className="auth-submit">
          가입하고 시작하기
        </button>
      </form>

      <p className="auth-switch">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>

      <p className="auth-disclaimer">
        이 데모의 로그인은 실제 서버 인증이 아니에요. 닉네임과 비밀번호는 이
        브라우저에만 저장되고, 다른 사람에게 전달되지 않아요.
      </p>
    </div>
  )
}
