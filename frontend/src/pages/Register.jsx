import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useAuth } from '../context/AuthContext'
import { register as apiRegister, login } from '../api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await apiRegister(username, password, email)
      const data = await login(username, password)
      setToken(data.token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box className="min-h-[calc(100vh-60px)] flex items-center justify-center py-8 px-6">
      <Box className="max-w-[480px] w-full mx-auto">
        <Paper variant="outlined" className="p-8 rounded-app border border-app-border bg-surface shadow-app max-w-[380px] mx-auto" sx={{ bgcolor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <Typography variant="h5" component="h1" className="mb-5 text-center text-app-text" sx={{ color: 'var(--text)' }}>Create account</Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField id="username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" fullWidth variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--surface-2)' } }} />
            <TextField id="email" label="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" fullWidth variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--surface-2)' } }} />
            <TextField id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" fullWidth variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--surface-2)' } }} />
            {error && <Typography color="error" className="text-sm mt-1">{error}</Typography>}
            <Button type="submit" variant="contained" fullWidth disabled={submitting} className="mt-1 bg-accent hover:bg-accent-hover" sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}>
              {submitting ? 'Creating account…' : 'Register'}
            </Button>
          </form>
          <Typography className="mt-5 text-center text-muted text-sm" sx={{ color: 'var(--muted)' }}>
            Already have an account? <Link to="/login" className="font-medium text-accent" style={{ color: 'var(--accent)' }}>Log in</Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
