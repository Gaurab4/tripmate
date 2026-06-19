import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await login(username, password)
      setToken(data.token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-6 py-8">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="card-surface animate-scale-in mx-auto max-w-[380px] p-8">
          <h1 className="mb-5 text-center text-xl font-semibold text-app-text">Log in</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-soft">Username</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-soft">Password</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-field"
              />
            </label>
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-1 w-full rounded-app py-2.5 font-semibold"
            >
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Don't have an account? <Link to="/register" className="font-medium text-accent">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
