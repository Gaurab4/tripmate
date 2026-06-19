import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Itinerary from '../components/Itinerary'
import TripLoadingScreen, { LOADING_STEPS } from '../components/TripLoadingScreen'
import TripGenerationErrorScreen from '../components/TripGenerationErrorScreen'
import TripSummaryCard from '../components/TripSummaryCard'
import { createTrip, getTripByUuid, customizeTrip } from '../api'
import { isValidUUID } from '../utils/uuid'
import type { TripPayload } from '../types'

const LOADING_STEPS_COUNT = LOADING_STEPS.length
const POLL_INTERVAL_MS = 2500

interface RetryPayload {
  destination: string
  start_date?: string
  end_date?: string
  interests?: string[]
}

export default function TripPlan() {
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()
  const [tripData, setTripData] = useState<TripPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [customizing, setCustomizing] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [generationFailed, setGenerationFailed] = useState(false)
  const [retryPayload, setRetryPayload] = useState<RetryPayload | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLoading(true)
    setActiveStep(0)
    setTripData(null)
    setGenerationFailed(false)
    setRetryPayload(null)

    if (!isValidUUID(uuid)) {
      setLoading(false)
      setGenerationFailed(true)
      return
    }
    const tripUuid = uuid

    function poll() {
      getTripByUuid(tripUuid)
        .then((data) => {
          if (data.status === 'completed') {
            setTripData({
              destination: data.destination ?? '',
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
            setRetryPayload({
              destination: data.destination ?? '',
              start_date: data.start_date,
              end_date: data.end_date,
              interests: data.interests || [],
            })
            setGenerationFailed(true)
            setLoading(false)
            return
          }
          pollTimerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        })
        .catch(() => {
          setGenerationFailed(true)
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
      setActiveStep((s) => Math.min(s + 1, LOADING_STEPS_COUNT - 1))
    }, 1200)
    return () => clearInterval(stepInterval)
  }, [loading])

  async function handleCustomize(
    action: string,
    dayIndex: number,
    activityIndex?: number | null,
    activityType = 'attraction',
    activityTime: string | null = null
  ) {
    if (!tripData?.plan) return
    setCustomizing(true)
    try {
      const res = await customizeTrip(
        tripData.plan,
        action,
        dayIndex,
        action !== 'add' ? activityIndex ?? undefined : undefined,
        action === 'add' ? activityType : undefined,
        action === 'add' ? activityTime ?? undefined : undefined
      )
      setTripData((prev) => (prev ? { ...prev, plan: res.plan } : null))
    } catch {
      // Customize errors stay on the results page — generation uses the error screen
    } finally {
      setCustomizing(false)
    }
  }

  async function handleRegenerate() {
    if (!tripData) return
    setRegenerating(true)
    try {
      const res = await createTrip(
        tripData.destination,
        tripData.start_date,
        tripData.end_date,
        tripData.interests || []
      )
      navigate(`/trip/${res.uuid}`, { replace: true })
      setLoading(true)
      setActiveStep(0)
      setTripData(null)
      setGenerationFailed(false)
      setRetryPayload(null)
    } catch {
      setGenerationFailed(true)
      setRetryPayload({
        destination: tripData.destination,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        interests: tripData.interests || [],
      })
    } finally {
      setRegenerating(false)
    }
  }

  async function handleRetryGeneration() {
    const payload = retryPayload || (tripData ? {
      destination: tripData.destination,
      start_date: tripData.start_date,
      end_date: tripData.end_date,
      interests: tripData.interests || [],
    } : null)

    if (!payload?.destination) {
      navigate('/')
      return
    }

    setRegenerating(true)
    try {
      const res = await createTrip(
        payload.destination,
        payload.start_date,
        payload.end_date,
        payload.interests || []
      )
      navigate(`/trip/${res.uuid}`, { replace: true })
      setLoading(true)
      setActiveStep(0)
      setTripData(null)
      setGenerationFailed(false)
      setRetryPayload(null)
    } catch {
      setGenerationFailed(true)
      setRetryPayload(payload)
    } finally {
      setRegenerating(false)
    }
  }

  if (loading && !generationFailed) {
    return <TripLoadingScreen activeStep={activeStep} />
  }

  if (generationFailed) {
    return (
      <TripGenerationErrorScreen
        onRetry={retryPayload?.destination ? handleRetryGeneration : undefined}
        retrying={regenerating}
      />
    )
  }

  return (
    <div className="relative pb-10">
      <main className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <div className="animate-fade-in mb-6 flex justify-end">
          <Link
            to="/"
            className="btn-outline inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium no-underline"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            New Trip
          </Link>
        </div>

        {tripData?.plan && tripData.plan.length > 0 && (
          <>
            <TripSummaryCard
              destination={tripData.destination}
              startDate={tripData.start_date}
              endDate={tripData.end_date}
              dayCount={tripData.plan.length}
              onRegenerate={handleRegenerate}
              regenerating={regenerating}
            />
            <Itinerary
              plan={tripData.plan}
              destination={tripData.destination}
              onCustomize={handleCustomize}
              customizing={customizing}
            />
          </>
        )}
      </main>
    </div>
  )
}
