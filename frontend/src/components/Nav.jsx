import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  function handleLogout() {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [userMenuOpen])

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-icon">✈</span>
        <span className="font-semibold text-[1.1rem]">TripMate</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-home-link">
          <span className="nav-home-icon">✈</span>
          Home
        </Link>
        {isAuthenticated && <Link to="/my-trips">My Trips</Link>}
        {isAuthenticated ? (
          <div className={`nav-user-menu ${userMenuOpen ? 'nav-user-menu-open' : ''}`} ref={userMenuRef}>
            <button
              type="button"
              className="nav-user-trigger"
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              {user?.username || 'User'}
              <svg className="nav-user-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {userMenuOpen && (
              <div className="nav-user-dropdown">
                <button type="button" onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="nav-register">Register</Link>
          </>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle"
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}
