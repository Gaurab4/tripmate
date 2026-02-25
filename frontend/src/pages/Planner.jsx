import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TripForm from '../components/TripForm'
import { createTrip } from '../api'

export default function Planner() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit({ destination, startDate, endDate, interests }) {
    setError('')
    setSubmitting(true)
    try {
      const res = await createTrip(destination, startDate, endDate, interests)
      navigate(`/trip/${res.uuid}`, { replace: true })
    } catch (e) {
      setError(e.message || 'Failed to create trip')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box className="min-h-screen relative bg-[var(--bg)]">
      <div
        className="absolute inset-x-0 top-0 h-[50vh] z-0 pointer-events-none bg-gradient-to-b from-amber-100/95 via-amber-200/70 to-lime-100/40"
        aria-hidden
      />
      <Box component="main" className="relative max-w-[42rem] mx-auto py-10 px-6">
        <Box className="text-center mb-12">
          <Box className="inline-flex items-center gap-2 py-2 px-4 bg-surface rounded-full text-sm font-medium text-text-soft mb-4 shadow-app border border-app-border">
            <span className="w-2 h-2 rounded-full bg-accent" style={{ backgroundColor: 'var(--accent)' }} />
            AI-Powered Travel Planning
          </Box>
          <Typography variant="h1" className="text-[clamp(2.25rem,5vw,3rem)] font-bold tracking-tight text-app-text leading-tight m-0 mb-4" sx={{ color: 'var(--text)' }}>
            Your Dream Trip, <span className="text-accent" style={{ color: 'var(--accent)' }}>Planned Instantly.</span>
          </Typography>
          <Typography className="text-lg text-text-soft max-w-[36rem] mx-auto leading-relaxed m-0" sx={{ color: 'var(--text-soft)' }}>
            Tell us where you're headed and what you love — we'll craft a perfect day-by-day itinerary.
          </Typography>
        </Box>

        <Box className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-4 mb-10">
          <TripForm onSubmit={handleSubmit} loading={submitting} />
          {error && <Typography className="text-sm mt-4" color="error">{error}</Typography>}
        </Box>

        <Box className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6">
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Paper
              variant="outlined"
              className="p-8 rounded-app-lg bg-surface border border-app-border shadow-app"
              sx={{ bgcolor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl mb-4 bg-blue-500/15">🗺️</div>
              <Typography variant="h6" className="text-lg font-semibold text-app-text m-0 mb-1" sx={{ color: 'var(--text)' }}>Day-by-Day Plans</Typography>
              <Typography className="text-[0.9375rem] text-text-soft leading-relaxed m-0" sx={{ color: 'var(--text-soft)' }}>Creates your trip according to time and follows logical routes.</Typography>
            </Paper>
            <Paper
              variant="outlined"
              className="p-8 rounded-app-lg bg-surface border border-app-border shadow-app"
              sx={{ bgcolor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl mb-4 bg-pink-500/15">🎯</div>
              <Typography variant="h6" className="text-lg font-semibold text-app-text m-0 mb-1" sx={{ color: 'var(--text)' }}>Interest-Based</Typography>
              <Typography className="text-[0.9375rem] text-text-soft leading-relaxed m-0" sx={{ color: 'var(--text-soft)' }}>Activities matched to your preferences.</Typography>
            </Paper>
            <Paper
              variant="outlined"
              className="p-8 rounded-app-lg bg-surface border border-app-border shadow-app"
              sx={{ bgcolor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl mb-4 bg-amber-500/15">⚡</div>
              <Typography variant="h6" className="text-lg font-semibold text-app-text m-0 mb-1" sx={{ color: 'var(--text)' }}>Instant Results</Typography>
              <Typography className="text-[0.9375rem] text-text-soft leading-relaxed m-0" sx={{ color: 'var(--text-soft)' }}>Get your itinerary in seconds.</Typography>
            </Paper>
            <Paper
              variant="outlined"
              className="p-8 rounded-app-lg bg-surface border border-app-border shadow-app"
              sx={{ bgcolor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl mb-4 bg-green-500/15">🛤️</div>
              <Typography variant="h6" className="text-lg font-semibold text-app-text m-0 mb-1" sx={{ color: 'var(--text)' }}>Route & Time Optimized</Typography>
              <Typography className="text-[0.9375rem] text-text-soft leading-relaxed m-0" sx={{ color: 'var(--text-soft)' }}>Plans are built according to route and time — so your day flows logically and is easy to follow.</Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
