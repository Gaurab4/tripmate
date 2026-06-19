import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { API_BASE } from '../api'
import type { AuthContextValue, User } from '../types'

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'tripmate_token'
const USER_KEY = 'tripmate_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(USER_KEY)
      return s ? (JSON.parse(s) as User) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken)
    if (newToken) localStorage.setItem(TOKEN_KEY, newToken)
    else localStorage.removeItem(TOKEN_KEY)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }, [setToken])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    fetch(`${API_BASE}/api/auth/me/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('unauthorized'))))
      .then((data: User) => {
        setUser(data)
        localStorage.setItem(USER_KEY, JSON.stringify(data))
      })
      .catch(() => {
        logout()
      })
      .finally(() => setLoading(false))
  }, [token, logout])

  const value: AuthContextValue = {
    token,
    user,
    loading,
    setToken,
    setUser,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
