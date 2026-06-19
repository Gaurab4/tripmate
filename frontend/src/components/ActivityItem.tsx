import type { Activity } from '../types'
import { ActivityTypeIcon, ClockIcon, CloseIcon, MapPinIcon } from './icons'

const TYPE_LABELS: Record<string, string> = {
  attraction: 'LANDMARK',
  viewpoint: 'VIEWPOINT',
  trek: 'TREK',
  food: 'FOOD',
  eating: 'FOOD',
}

const NO_TIME_ICONS = ['food', 'eating', 'hotel']

interface ActivityItemProps {
  activity: Activity
  destination?: string
  onRemove: () => void
  customizing: boolean
  readOnly?: boolean
}

export default function ActivityItem({ activity, destination, onRemove, customizing, readOnly }: ActivityItemProps) {
  const iconKey = activity.icon || 'attraction'
  const typeLabel = TYPE_LABELS[iconKey] || 'LANDMARK'
  const showTime = activity.time && !NO_TIME_ICONS.includes(iconKey)
  const mapQuery = [activity.name, destination].filter(Boolean).join(' ')
  const mapUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : null
  const duration = activity.duration ?? activity.duration_minutes

  return (
    <article className="interactive-card group relative z-0 flex min-w-0 flex-1 items-start gap-4 p-5 hover:z-10">
      <div className="min-w-0 flex-1">
        <span className="mb-2 inline-block rounded-md bg-accent-surface px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-accent">
          {typeLabel}
        </span>

        <h4 className="mb-2 text-[1.0625rem] font-bold leading-tight text-app-text">
          {activity.name}
        </h4>

        <div className="mb-2 flex flex-wrap gap-4 gap-y-1 text-[0.8125rem] text-muted">
          {showTime && (
            <span className="inline-flex items-center gap-1.5 text-accent">
              <ClockIcon className="h-3.5 w-3.5 text-accent" />
              Best time to visit: <span className="font-medium text-app-text">{activity.time}</span>
            </span>
          )}
          {duration != null && (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-muted" />
              {typeof duration === 'number' ? `~${duration} min` : duration}
            </span>
          )}
        </div>

        {activity.description && (
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-text-soft">
            {activity.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-foreground"
            >
              <MapPinIcon className="h-3.5 w-3.5" />
              View on map →
            </a>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={onRemove}
              disabled={customizing}
              className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-sm font-medium text-text-soft hover:text-error disabled:opacity-50"
            >
              <CloseIcon />
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-surface text-accent shadow-app-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-accent-surface-strong group-hover:shadow-app">
        <ActivityTypeIcon type={iconKey} className="h-6 w-6" />
      </div>
    </article>
  )
}
