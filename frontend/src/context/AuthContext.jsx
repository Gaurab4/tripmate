import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'tripmate_token'
const USER_KEY = 'tripmate_user'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem(USER_KEY)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const setToken = useCallback((newToken) => {
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
    fetch('/api/auth/me/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data)
        localStorage.setItem(USER_KEY, JSON.stringify(data))
      })
      .catch(() => {
        logout()
      })
      .finally(() => setLoading(false))
  }, [token, logout])

  const value = {
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

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
