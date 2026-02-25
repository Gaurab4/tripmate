import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../context/AuthContext'
import { getItinerary } from '../api'
import Itinerary from '../components/Itinerary'
import TripFooter from '../components/TripFooter'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function isValidUUID(s) {
  return typeof s === 'string' && UUID_REGEX.test(s)
}

export default function TripDetail() {
  const { id: uuid } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [tripData, setTripData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!isValidUUID(uuid)) {
      setError('Trip not found')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    getItinerary(uuid)
      .then(setTripData)
      .catch((e) => setError(e.message || 'Trip not found'))
      .finally(() => setLoading(false))
  }, [uuid, isAuthenticated, navigate])

  if (!isAuthenticated) return null
  if (authLoading) {
    return (
      <Box className="max-w-[480px] mx-auto p-6">
        <Typography className="text-center text-muted py-8 text-[0.95rem]" sx={{ color: 'var(--muted)' }}>Loading…</Typography>
      </Box>
    )
  }
  if (!isValidUUID(uuid)) {
    return (
      <Box className="max-w-[480px] mx-auto p-6">
        <Typography color="error" className="text-sm mt-2">Trip not found</Typography>
        <Button variant="outlined" className="mt-4" onClick={() => navigate('/my-trips')}>Back to My Trips</Button>
      </Box>
    )
  }
  if (loading) {
    return (
      <Box className="max-w-[480px] mx-auto p-6">
        <Typography className="text-center text-muted py-8 text-[0.95rem]" sx={{ color: 'var(--muted)' }}>Loading…</Typography>
      </Box>
    )
  }
  if (error || !tripData) {
    return (
      <Box className="max-w-[480px] mx-auto p-6">
        <Typography color="error" className="text-sm mt-2">{error || 'Trip not found'}</Typography>
        <Button variant="outlined" className="mt-4" onClick={() => navigate('/my-trips')}>Back to My Trips</Button>
      </Box>
    )
  }

  const dataForItinerary = {
    destination: tripData.destination,
    start_date: tripData.start_date,
    end_date: tripData.end_date,
    interests: tripData.interests || [],
    plan: tripData.plan || [],
    flights: tripData.flights || [],
    hotels: tripData.hotels || [],
  }

  return (
    <Box className="min-h-screen bg-[var(--bg)]">
      <Box component="main" className="max-w-[56rem] mx-auto py-8 px-6">
        <Button className="block mb-6 text-accent font-medium normal-case" sx={{ color: 'var(--accent)' }} onClick={() => navigate('/my-trips')}>
          ← Back to My Trips
        </Button>

        {tripData.destination && (
          <Box className="mb-8 py-6 px-5 rounded-app-lg border border-app-border bg-surface shadow-app" sx={{ borderColor: 'var(--border)', bgcolor: 'var(--surface)' }}>
            <Typography variant="h4" className="text-[1.75rem] font-bold text-app-text m-0 mb-2 tracking-tight" sx={{ color: 'var(--text)' }}>
              {tripData.title || tripData.destination}
            </Typography>
            <Box className="flex flex-wrap gap-4 gap-y-1 text-[0.9375rem] text-text-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="opacity-90" aria-hidden>📅</span>
                {tripData.start_date} – {tripData.end_date || '—'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="opacity-90" aria-hidden>📍</span>
                {tripData.destination}
                {tripData.interests?.length > 0 && ` • ${tripData.interests.join(', ')}`}
              </span>
            </Box>
          </Box>
        )}

        {tripData.plan?.length > 0 ? (
          <>
            <Itinerary plan={tripData.plan} destination={tripData.destination} readOnly />
            <Box className="mt-10">
              <TripFooter tripData={dataForItinerary} />
            </Box>
          </>
        ) : (
          <Typography className="text-center text-muted py-8 text-[0.95rem]" sx={{ color: 'var(--muted)' }}>No itinerary for this trip yet.</Typography>
        )}
      </Box>
    </Box>
  )
}
