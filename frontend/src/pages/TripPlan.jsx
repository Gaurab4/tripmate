import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import TripForm from '../components/TripForm'
import Itinerary from '../components/Itinerary'
import TripFooter from '../components/TripFooter'
import { getTripByUuid, customizeTrip } from '../api'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function isValidUUID(s) {
  return typeof s === 'string' && UUID_REGEX.test(s)
}

const LOADING_STEPS = [
  'Searching for the best places...',
  'Building your day-by-day plan...',
  'Optimizing routes and timing...',
  'Adding recommendations...',
]

const POLL_INTERVAL_MS = 2500

export default function TripPlan() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const [tripData, setTripData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customizing, setCustomizing] = useState(false)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const pollTimerRef = useRef(null)

  useEffect(() => {
    if (!uuid || !isValidUUID(uuid)) {
      setLoading(false)
      setError('Invalid trip. Please search again.')
      return
    }

    function poll() {
      getTripByUuid(uuid)
        .then((data) => {
          if (data.status === 'completed') {
            setTripData({
              destination: data.destination,
              start_date: data.start_date,
              end_date: data.end_date,
              interests: data.interests || [],
              plan: data.plan || [],
              flights: data.flights || [],
              hotels: data.hotels || [],
            })
            setLoading(false)
            return
          }
          if (data.status === 'failed') {
            setError(data.error_message || 'Failed to generate itinerary')
            setLoading(false)
            return
          }
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        })
        .catch((e) => {
          setError(e.message || 'Failed to load trip')
          setLoading(false)
        })
    }

    poll()
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    }
  }, [uuid])

  useEffect(() => {
    if (!loading) return
    const stepInterval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1))
    }, 1200)
    return () => clearInterval(stepInterval)
  }, [loading])

  function handleSubmit() {
    navigate('/')
  }

  async function handleCustomize(action, dayIndex, activityIndex, activityType = 'attraction', activityTime = null) {
    if (!tripData?.plan) return
    setCustomizing(true)
    setError('')
    try {
      const res = await customizeTrip(
        tripData.plan,
        action,
        dayIndex,
        action !== 'add' ? activityIndex : undefined,
        action === 'add' || action === 'replace' ? activityType : undefined,
        action === 'add' ? activityTime : undefined
      )
      setTripData((prev) => ({ ...prev, plan: res.plan }))
    } catch (e) {
      setError(e.message || 'Failed to update')
    } finally {
      setCustomizing(false)
    }
  }

  const initialValues = tripData
    ? {
        destination: tripData.destination,
        startDate: tripData.start_date || '',
        endDate: tripData.end_date || '',
        interests: Array.isArray(tripData.interests) ? tripData.interests : [],
      }
    : null

  return (
    <Box className="min-h-screen relative bg-[var(--bg)]">
      <div className="absolute inset-x-0 top-0 h-[50vh] z-0 pointer-events-none bg-gradient-to-b from-amber-100/95 via-transparent to-transparent" aria-hidden />
      <Box component="main" className="relative max-w-none py-8 px-6">
        {!loading && (
          <Box className="w-screen relative left-1/2 -ml-[50vw] px-4 mb-10">
            <TripForm onSubmit={handleSubmit} loading={false} initialValues={initialValues} />
          </Box>
        )}

        {error && (
          <Box className="mt-4">
            <Typography color="error" className="text-sm mb-2">{error}</Typography>
            <Button component={Link} to="/" variant="contained" className="mt-4 no-underline">
              Back to search
            </Button>
          </Box>
        )}

        {loading && (
          <Box className="w-full max-w-[560px] mx-auto mb-10 py-8 px-4 text-center">
            <Typography className="inline-flex items-center gap-1.5 text-sm font-medium text-accent mb-3" sx={{ color: 'var(--accent)' }}>
              <span aria-hidden>✨</span>
              AI is crafting your trip
            </Typography>
            <Typography variant="h5" className="text-2xl font-bold text-app-text m-0 mb-1" sx={{ color: 'var(--text)' }}>Creating your itinerary</Typography>
            <Typography className="text-[0.9375rem] text-muted m-0 mb-8" sx={{ color: 'var(--muted)' }}>This usually takes a few seconds</Typography>

            <Box className="relative text-left max-w-[320px] mx-auto mb-8">
              <div className="absolute left-2.5 top-6 bottom-6 w-0.5 rounded-sm bg-accent" aria-hidden style={{ backgroundColor: 'var(--accent)' }} />
              <ul className="list-none p-0 m-0 relative">
                {LOADING_STEPS.map((step, i) => {
                  const isCompleted = i < activeStep
                  const isCurrent = i === activeStep
                  return (
                    <li key={step} className={`flex items-center gap-4 py-2 ${!isCompleted && !isCurrent ? 'opacity-60' : ''}`}>
                      <span
                        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 ${
                          isCompleted ? 'bg-accent border-accent' : isCurrent ? 'bg-accent-soft border-muted' : 'bg-transparent border-app-border'
                        }`}
                        style={isCompleted ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : isCurrent ? { backgroundColor: 'var(--accent-soft)', borderColor: 'var(--muted)' } : {}}
                      >
                        {isCompleted && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path d="M11 4L5.5 9.5L3 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {isCurrent && (
                          <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                        )}
                      </span>
                      <span className={`text-[0.9375rem] font-medium ${isCompleted || isCurrent ? 'text-app-text' : 'text-muted'}`} style={{ color: isCompleted || isCurrent ? 'var(--text)' : 'var(--muted)' }}>{step}</span>
                    </li>
                  )
                })}
              </ul>
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <Box key={i} className="p-4 rounded-app-lg bg-accent-soft border border-amber-500/25 shadow-app" sx={{ bgcolor: 'var(--accent-soft)' }}>
                  <div className="h-20 rounded-app-sm bg-amber-500/20 mb-3" />
                  <div className="h-2 rounded bg-amber-500/25 mb-2" />
                  <div className="h-2 rounded bg-amber-500/25 w-[85%] mb-2" />
                  <div className="h-2 rounded bg-amber-500/25 w-[60%]" />
                </Box>
              ))}
            </Box>

            <Box className="max-w-[320px] mx-auto">
              <LinearProgress variant="determinate" value={((activeStep + 1) / LOADING_STEPS.length) * 100} sx={{ height: 6, borderRadius: 3, mb: 0.5, '& .MuiLinearProgress-bar': { backgroundColor: 'var(--accent)' } }} />
              <Typography variant="caption" className="text-[0.8125rem] text-muted m-0" sx={{ color: 'var(--muted)' }}>
                Step {activeStep + 1} of {LOADING_STEPS.length}
              </Typography>
            </Box>
          </Box>
        )}

        {!loading && tripData?.plan?.length > 0 && (
          <Box className="w-full max-w-[min(70vw,960px)] mx-auto px-6 pb-10">
            {tripData.destination && (
              <Box className="mb-8 py-6 px-5 rounded-app-lg border border-app-border bg-surface shadow-app" sx={{ borderColor: 'var(--border)', bgcolor: 'var(--surface)' }}>
                <Typography variant="h4" className="text-[1.75rem] font-bold text-app-text m-0 mb-2 tracking-tight" sx={{ color: 'var(--text)' }}>{tripData.destination}</Typography>
                <Box className="flex flex-wrap gap-4 gap-y-1 text-[0.9375rem] text-text-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="opacity-90" aria-hidden>📅</span>
                    {tripData.start_date} – {tripData.end_date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="opacity-90" aria-hidden>📍</span>
                    {tripData.destination}
                    {tripData.interests?.length > 0 && ` • ${tripData.interests.join(', ')}`}
                  </span>
                </Box>
              </Box>
            )}
            <Itinerary plan={tripData.plan} destination={tripData.destination} onCustomize={handleCustomize} customizing={customizing} />
            <Box className="mt-10">
              <TripFooter tripData={tripData} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
