import { useState } from 'react'
import { Button, Collapsible } from '@chakra-ui/react'
import ActivityItem from './ActivityItem'
import { ChevronDownIcon, MapIcon } from './icons'
import { formatDisplayDate } from '../utils/date'
import type { Activity, DayPlan } from '../types'

function buildDayJourneyMapUrl(activities: Activity[], destination: string) {
  const places = activities.map((a) => (destination ? `${a.name}, ${destination}` : a.name))
  if (places.length === 0) return null
  if (places.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[0])}`
  }
  const origin = encodeURIComponent(places[0])
  const dest = encodeURIComponent(places[places.length - 1])
  const waypointsParam = places.length > 2
    ? `&waypoints=${encodeURIComponent(places.slice(1, -1).join('|'))}`
    : ''
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypointsParam}`
}

interface DayCardProps {
  dayData: DayPlan
  dayIndex: number
  destination?: string
  onRemove: (dayIndex: number, activityIndex: number) => void
  onAdd: (dayIndex: number) => void
  customizing: boolean
  readOnly?: boolean
}

export default function DayCard({
  dayData,
  dayIndex,
  destination,
  onRemove,
  onAdd,
  customizing,
  readOnly,
}: DayCardProps) {
  const { day, date, activities: rawActivities = [] } = dayData
  const activities = rawActivities.filter((a) => a.icon !== 'flight' && a.icon !== 'hotel')
  const journeyMapUrl = buildDayJourneyMapUrl(activities, destination || '')
  const [open, setOpen] = useState(true)

  return (
    <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)} className="overflow-visible border-b border-app-border pb-6 transition-colors duration-300 last:border-b-0">
      <section className="overflow-visible">
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className="mb-4 flex w-full items-center justify-between gap-3 rounded-xl border-0 bg-transparent p-0 text-left hover:opacity-90"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-white shadow-md shadow-blue-500/30 transition-transform duration-300 hover:scale-105">
                {day}
              </div>
              <div>
                <h3 className="m-0 text-lg font-bold text-app-text">Day {day}</h3>
                {date && <p className="m-0 text-sm text-muted">{formatDisplayDate(date)}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {journeyMapUrl && (
                <a
                  href={journeyMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hidden items-center gap-1.5 rounded-lg border border-app-border bg-surface px-3 py-1.5 text-xs font-semibold text-accent no-underline hover:border-accent sm:inline-flex"
                >
                  <MapIcon className="h-3.5 w-3.5" />
                  Start your journey on Google Maps
                </a>
              )}
              <ChevronDownIcon
                className={`h-5 w-5 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </div>
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content className="overflow-visible">
          {journeyMapUrl && (
            <a
              href={journeyMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-app-border bg-surface px-3 py-1.5 text-xs font-semibold text-accent no-underline hover:border-accent sm:hidden"
            >
              <MapIcon className="h-3.5 w-3.5" />
            Start your journey on Google Maps
            </a>
          )}

          <div className="relative ml-3 overflow-visible py-1 pr-1">
            <div
              className="pointer-events-none absolute bottom-2 left-3 top-2 w-0 -translate-x-1/2 border-l-2 border-dotted border-accent/50"
              aria-hidden
            />
            <div className="flex flex-col gap-4 overflow-visible">
              {activities.map((act, idx) => (
                <div key={act.id ?? idx} className="relative z-0 flex gap-3 overflow-visible hover:z-10">
                  <div className="flex w-6 shrink-0 justify-center self-start pt-7">
                    <div
                      className="z-10 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent shadow-app-sm transition-transform duration-300 hover:scale-125"
                      aria-hidden
                    />
                  </div>
                  <ActivityItem
                    activity={act}
                    destination={destination}
                    onRemove={() => onRemove(dayIndex, idx)}
                    customizing={customizing}
                    readOnly={readOnly}
                  />
                </div>
              ))}
              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onAdd(dayIndex)}
                  disabled={customizing}
                  className="ml-9 mt-2 rounded-xl border-2 border-dashed border-app-border text-muted shadow-app-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft/30 hover:text-accent hover:shadow-app"
                >
                  + Add activity
                </Button>
              )}
            </div>
          </div>
        </Collapsible.Content>
      </section>
    </Collapsible.Root>
  )
}
