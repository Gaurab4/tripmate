import { useState, useEffect, useMemo } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import TripForm from '../components/TripForm'
import Itinerary from '../components/Itinerary'
import TripFooter from '../components/TripFooter'
import { createTrip, customizeTrip } from '../api'

const LOADING_STEPS = [
  'Searching for the best places...',
  'Building your day-by-day plan...',
  'Optimizing routes and timing...',
  'Adding recommendations...',
]

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function TripPlan() {
  const { destination: slug } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [tripData, setTripData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customizing, setCustomizing] = useState(false)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(0)

  const searchParams = state || {}
  let { destination, startDate, endDate, interests } = searchParams || {}
  // On refresh, state is lost. Recover from URL slug if possible.
  if (!destination && slug) {
    destination = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    const today = new Date().toISOString().slice(0, 10)
    startDate = startDate || today
    endDate = endDate || startDate || today
    interests = interests || []
  }

  useEffect(() => {
    if (!destination || !slug) {
      setLoading(false)
      setError('Please search again to create your itinerary.')
      return
    }
    if (slugify(destination) !== slug) {
      setLoading(false)
      setError('Destination mismatch')
      return
    }

    const stepInterval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1))
    }, 1200)

    createTrip(
      destination,
      startDate || new Date().toISOString().slice(0, 10),
      endDate || startDate || new Date().toISOString().slice(0, 10),
      interests || []
    )
      .then(setTripData)
      .catch((e) => setError(e.message || 'Failed to create trip'))
      .finally(() => {
        clearInterval(stepInterval)
        setLoading(false)
      })
  }, [destination, startDate, endDate, interests, slug])

  async function handleSubmit({ destination: dest, startDate: start, endDate: end, interests: int }) {
    const newSlug = slugify(dest)
    navigate(`/trip/${newSlug}`, {
      state: { destination: dest, startDate: start, endDate: end, interests: int },
      replace: true,
    })
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

  const initialValues = useMemo(
    () =>
      destination
        ? { destination, startDate: startDate || '', endDate: endDate || '', interests: Array.isArray(interests) ? interests : [] }
        : null,
    [destination, startDate, endDate, interests]
  )

  return (
    <div className="planner-page trip-plan-page">
      <div className="planner-hero-bg" aria-hidden />
      <main className="trip-plan-main">
        <div className="planner-search-wrap mb-10">
          <TripForm
            onSubmit={handleSubmit}
            loading={loading}
            initialValues={initialValues}
          />
        </div>

        {error && (
          <div className="trip-plan-error">
            <p className="error-alert">{error}</p>
            {!destination && (
              <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                Back to search
              </Link>
            )}
          </div>
        )}

        {loading && (
          <div className="trip-plan-skeleton-wrap">
            <h2 className="trip-plan-skeleton-title">Creating your itinerary</h2>
            <ul className="trip-plan-skeleton-steps">
              {LOADING_STEPS.map((step, i) => (
                <li
                  key={step}
                  className={`trip-plan-skeleton-step ${i <= activeStep ? 'trip-plan-skeleton-step-active' : ''}`}
                >
                  <span className="trip-plan-skeleton-dot" />
                  <span className="trip-plan-skeleton-text">{step}</span>
                </li>
              ))}
            </ul>
            <div className="trip-plan-skeleton-cards">
              {[1, 2, 3].map((i) => (
                <div key={i} className="trip-plan-skeleton-card">
                  <div className="trip-plan-skeleton-card-icon" />
                  <div className="trip-plan-skeleton-card-line trip-plan-skeleton-card-title" />
                  <div className="trip-plan-skeleton-card-line trip-plan-skeleton-card-desc" />
                  <div className="trip-plan-skeleton-card-line trip-plan-skeleton-card-desc short" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tripData?.plan?.length > 0 && (
          <div className="trip-plan-itinerary-wrap">
            {tripData.destination && (
              <div className="trip-summary-card">
                <h3 className="planner-feature-title">{tripData.destination}</h3>
                <p className="trip-card-dates">
                  {tripData.start_date} – {tripData.end_date}
                  {tripData.interests?.length > 0 && ` • ${tripData.interests.join(', ')}`}
                </p>
                {tripData.flights?.length > 0 && (
                  <p className="text-sm text-[var(--text-soft)] mt-2">
                    Flights: {tripData.flights.map((f) => `${f.type} ${f.flight_no}`).join(' • ')}
                  </p>
                )}
              </div>
            )}
            <Itinerary
              plan={tripData.plan}
              onCustomize={handleCustomize}
              customizing={customizing}
            />
            <div className="mt-10">
              <TripFooter
                tripData={tripData}
                onSaveSuccess={() => setError('')}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
