import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TripGenerationErrorScreen from '../components/TripGenerationErrorScreen'
import { createTrip } from '../api'
import type { TripFormValues } from '../types'

interface ErrorLocationState {
  retryForm?: TripFormValues
}

export default function TripGenerationError() {
  const navigate = useNavigate()
  const location = useLocation()
  const retryForm = (location.state as ErrorLocationState | null)?.retryForm
  const [retrying, setRetrying] = useState(false)

  async function handleRetry() {
    if (!retryForm?.destination?.trim()) {
      navigate('/')
      return
    }

    setRetrying(true)
    try {
      const res = await createTrip(
        retryForm.destination.trim(),
        retryForm.startDate,
        retryForm.endDate,
        retryForm.interests || []
      )
      navigate(`/trip/${res.uuid}`, { replace: true, state: null })
    } catch {
      // Stay on the error page — message is already user-friendly
    } finally {
      setRetrying(false)
    }
  }

  return (
    <TripGenerationErrorScreen
      onRetry={retryForm?.destination ? handleRetry : undefined}
      retrying={retrying}
    />
  )
}
