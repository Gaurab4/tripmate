import { Button } from '@chakra-ui/react'
import { CalendarIcon, ClockIcon, MapIcon, RefreshIcon, SparkleIcon } from './icons'
import { formatDateRange, formatDisplayDate } from '../utils/date'

interface TripSummaryCardProps {
  destination: string
  startDate?: string
  endDate?: string
  dayCount: number
  createdAt?: string
  onRegenerate?: () => void
  regenerating?: boolean
}

export default function TripSummaryCard({
  destination,
  startDate,
  endDate,
  dayCount,
  createdAt,
  onRegenerate,
  regenerating,
}: TripSummaryCardProps) {
  const mapUrl = destination
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`
    : null

  return (
    <div className="animate-fade-in-up hero-card-gradient glow-surface mb-8 rounded-2xl border p-6 shadow-app-lg transition-shadow duration-300 hover:shadow-app-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-accent-theme bg-pill px-3 py-1 text-xs font-semibold text-accent">
            <SparkleIcon className="h-3.5 w-3.5" />
            Your Itinerary is ready
          </span>
          <h1 className="m-0 mb-3 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-app-text">
            {destination}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-text-soft">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-accent" />
              {formatDateRange(startDate, endDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-accent" />
              {dayCount} day{dayCount !== 1 ? 's' : ''}
            </span>
            {createdAt && (
              <span className="inline-flex items-center gap-1.5 text-muted">
                Created {formatDisplayDate(createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {onRegenerate && (
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={regenerating}
              className="w-48 rounded-xl border-app-border bg-surface font-semibold text-app-text hover:border-accent hover:text-accent"
            >
              <RefreshIcon className="mr-2 h-4 w-4" />
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
          )}
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold no-underline"
            >
              <MapIcon className="h-4 w-4" />
              View on map
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
