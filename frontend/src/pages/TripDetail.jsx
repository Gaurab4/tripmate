import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getItinerary } from '../api'
import Itinerary from '../components/Itinerary'
import TripFooter from '../components/TripFooter'

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [tripData, setTripData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    getItinerary(id)
      .then(setTripData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated, navigate])

  if (!isAuthenticated) return null
  if (loading) return <div className="container"><p className="empty">Loading…</p></div>
  if (error || !tripData) {
    return (
      <div className="container">
        <p className="error-msg">{error || 'Trip not found'}</p>
        <button type="button" className="btn btn-secondary mt-4" onClick={() => navigate('/my-trips')}>
          Back to My Trips
        </button>
      </div>
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
    <div className="page-container">
      <main className="page-main">
        <button type="button" className="back-link" onClick={() => navigate('/my-trips')}>
          ← Back to My Trips
        </button>

        {tripData.destination && (
          <div className="trip-summary-card">
            <h1 className="planner-feature-title">{tripData.title || tripData.destination}</h1>
            <p className="trip-card-dates">
              {tripData.destination} • {tripData.start_date} – {tripData.end_date || '—'}
              {tripData.interests?.length > 0 && ` • ${tripData.interests.join(', ')}`}
            </p>
          </div>
        )}

        {tripData.plan?.length > 0 ? (
          <>
            <Itinerary plan={tripData.plan} readOnly />
            <div className="mt-10">
              <TripFooter tripData={dataForItinerary} />
            </div>
          </>
        ) : (
          <p className="empty">No itinerary for this trip yet.</p>
        )}
      </main>
    </div>
  )
}
