import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TripForm from '../components/TripForm'
import { createTrip } from '../api'
import { BoltIcon, CalendarFeatureIcon, RouteIcon, TargetIcon } from '../components/icons'
import type { TripFormValues } from '../types'

const FEATURES = [
  {
    Icon: CalendarFeatureIcon,
    title: 'Day-by-Day Plans',
    description: 'Creates your trip according to time and follows logical routes.',
  },
  {
    Icon: TargetIcon,
    title: 'Interest-Based',
    description: 'Activities matched to your preferences.',
  },
  {
    Icon: BoltIcon,
    title: 'Instant Results',
    description: 'Get your itinerary in seconds.',
  },
  {
    Icon: RouteIcon,
    title: 'Route Optimized',
    description: 'Plans built around route and time so your day flows logically.',
  },
]

export default function Planner() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit({ destination, startDate, endDate, interests }: TripFormValues) {
    setSubmitting(true)
    try {
      const res = await createTrip(destination, startDate, endDate, interests)
      navigate(`/trip/${res.uuid}`, { replace: true })
    } catch {
      navigate('/trip/error', {
        state: {
          retryForm: { destination, startDate, endDate, interests },
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-16">
      <div className="animate-fade-in-up mb-20 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-theme bg-pill px-4 py-2 text-sm font-medium text-text-soft shadow-app backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          AI-Powered Travel Planning
        </div>
        <h1 className="m-0 mb-4 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-tight tracking-tight text-app-text">
          Your Dream Trip, <span className="text-accent font-bold ">Planned Instantly</span>
        </h1>
        <p className="m-0 mx-auto max-w-[36rem] text-lg leading-relaxed text-text-soft">
          Tell me where you're headed and what you love, and I'll craft a perfect day-by-day itinerary.
        </p>
      </div>

      <div className="animate-fade-in-up mb-20" style={{ animationDelay: '120ms' }}>
        <TripForm onSubmit={handleSubmit} loading={submitting} />
      </div>

      <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ Icon, title, description }) => (
          <article
            key={title}
            className="card-surface group relative p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-app-xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-surface text-accent shadow-app-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-surface-strong group-hover:shadow-app">
              <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <h2 className="m-0 mb-1.5 text-base font-semibold text-app-text transition-colors duration-300 group-hover:text-accent">
              {title}
            </h2>
            <p className="m-0 text-sm leading-relaxed text-text-soft">{description}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
