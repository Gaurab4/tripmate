import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import { getItinerary } from '../api'
import Itinerary from '../components/Itinerary'
import TripSummaryCard from '../components/TripSummaryCard'
import { isValidUUID } from '../utils/uuid'
import type { TripPayload } from '../types'

export default function TripDetail() {
  const { id: uuid } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [tripData, setTripData] = useState<TripPayload | null>(null)
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
      .then((data) => setTripData(data as unknown as TripPayload))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Trip not found'))
      .finally(() => setLoading(false))
  }, [uuid, isAuthenticated, navigate])

  if (!isAuthenticated) return null
  if (authLoading) {
    return (
      <div className="mx-auto max-w-[480px] p-6">
        <p className="py-8 text-center text-muted">Loading…</p>
      </div>
    )
  }
  if (!isValidUUID(uuid)) {
    return (
      <div className="mx-auto max-w-[480px] p-6">
        <p className="mt-2 text-sm text-error">Trip not found</p>
        <Button variant="outline" className="mt-4 rounded-app" onClick={() => navigate('/my-trips')}>
          Back to My Trips
        </Button>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="mx-auto max-w-[480px] p-6">
        <p className="py-8 text-center text-muted">Loading…</p>
      </div>
    )
  }
  if (error || !tripData) {
    return (
      <div className="mx-auto max-w-[480px] p-6">
        <p className="mt-2 text-sm text-error">{error || 'Trip not found'}</p>
        <Button variant="outline" className="mt-4 rounded-app" onClick={() => navigate('/my-trips')}>
          Back to My Trips
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <main className="relative mx-auto max-w-4xl px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/my-trips')}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl  bg-accent-surface px-4 py-2 text-sm font-medium text-text-soft hover:text-accent"
        >
          ← Back to My Trips
        </button>

        {tripData.destination && (
          <TripSummaryCard
            destination={tripData.title || tripData.destination}
            startDate={tripData.start_date}
            endDate={tripData.end_date}
            dayCount={tripData.plan?.length || 0}
            createdAt={tripData.created_at}
          />
        )}

        {tripData.plan && tripData.plan.length > 0 ? (
          <>
            <Itinerary plan={tripData.plan} destination={tripData.destination} readOnly />
          </>
        ) : (
          <p className="py-8 text-center text-muted">No itinerary for this trip yet.</p>
        )}
      </main>
    </div>
  )
}
