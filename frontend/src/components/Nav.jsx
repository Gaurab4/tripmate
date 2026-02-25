import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  function handleMenuOpen(e) {
    setAnchorEl(e.currentTarget)
  }

  function handleMenuClose() {
    setAnchorEl(null)
  }

  function handleLogout() {
    logout()
    navigate('/')
    handleMenuClose()
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className="bg-surface border-b border-app-border"
      sx={{ backgroundColor: 'var(--surface)' }}
    >
      <Toolbar className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-4 min-h-14">
        <Button
          component={Link}
          to="/"
          className="normal-case font-semibold text-base text-app-text"
          sx={{ color: 'var(--text)' }}
          startIcon={<span className="text-xl">✈</span>}
        >
          TripMate
        </Button>
        <div className="flex items-center gap-1">
          <Button
            component={Link}
            to="/"
            startIcon={<span className="text-base">✈</span>}
            className="normal-case font-medium text-text-soft hover:bg-accent-soft hover:text-accent"
            sx={{ color: 'var(--text-soft)' }}
          >
            Home
          </Button>
          {isAuthenticated && (
            <Button component={Link} to="/my-trips" className="normal-case font-medium text-text-soft">
              My Trips
            </Button>
          )}
          {isAuthenticated ? (
            <>
              <Button
                id="user-menu-button"
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuOpen}
                endIcon={
                  <svg className="w-3.5 h-3.5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                }
                className="normal-case font-medium text-text-soft hover:bg-accent-soft hover:text-accent"
                sx={{ color: 'var(--text-soft)' }}
              >
                {user?.username || 'User'}
              </Button>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{ 'aria-labelledby': 'user-menu-button' }}
                slotProps={{ paper: { className: 'rounded-app shadow-app-lg mt-2', sx: { boxShadow: 'var(--shadow-lg)', bgcolor: 'var(--surface)', border: '1px solid var(--border)' } } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" className="normal-case font-medium text-text-soft">
                Log in
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                className="normal-case bg-accent hover:bg-accent-hover text-white"
                sx={{ backgroundColor: 'var(--accent)', '&:hover': { backgroundColor: 'var(--accent-hover)' } }}
              >
                Register
              </Button>
            </>
          )}
          <IconButton
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            aria-label="Toggle theme"
            className="text-text-soft"
            sx={{ color: 'var(--text-soft)' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}
