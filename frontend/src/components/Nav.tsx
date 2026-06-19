import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, IconButton, Menu, Portal } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from './icons'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function BrandLogo() {
  return (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm text-white shadow-app-glow transition-transform duration-300 hover:scale-105">
        ✈
      </span>
      <span className="text-lg font-bold tracking-tight text-app-text">TripMate</span>
    </>
  )
}

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const linkClass =
    'px-2 py-2 text-sm font-medium text-text-soft no-underline transition-all duration-200 hover:text-accent hover:drop-shadow-sm'

  return (
    <header className="relative z-50 bg-transparent">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline hover:opacity-90">
          <BrandLogo />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/" className={`hidden sm:inline-flex ${linkClass}`}>
            Home
          </Link>

          <Link to="/about" className={linkClass}>
            About
          </Link>

          {isAuthenticated && (
            <Link to="/my-trips" className={linkClass}>
              My Trips
            </Link>
          )}

          {isAuthenticated ? (
            <Menu.Root open={menuOpen} onOpenChange={(e) => setMenuOpen(e.open)}>
              <Menu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-text-soft hover:bg-transparent hover:text-accent"
                >
                  {user?.username || 'User'}
                  <svg className="ml-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content className="min-w-[140px] animate-scale-in rounded-xl border border-app-border bg-surface shadow-app-lg">
                    <Menu.Item value="logout" onClick={handleLogout} className="text-sm">
                      Log out
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-primary ml-1 rounded-xl px-4 py-2 text-sm font-semibold no-underline"
              >
                Sign up
              </Link>
            </>
          )}

          <IconButton
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="ml-1 h-9 w-9 rounded-full border border-app-border bg-surface/80 text-text-soft shadow-app-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-accent hover:bg-surface hover:text-accent hover:shadow-app"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-[1.125rem] w-[1.125rem]" />
            ) : (
              <MoonIcon className="h-[1.125rem] w-[1.125rem]" />
            )}
          </IconButton>
        </div>
      </div>
    </header>
  )
}
