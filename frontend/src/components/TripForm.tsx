import { useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { Spinner } from '@chakra-ui/react'
import { CalendarIcon, MapPinIcon, SearchIcon } from './icons'
import type { TripFormProps } from '../types'

const MAX_TRIP_DAYS = 15

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function tripDayCount(start: string, end: string): number {
  const s = new Date(`${start}T12:00:00`)
  const e = new Date(`${end}T12:00:00`)
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

function getDateWarning(start: string, end: string, today: string): string | null {
  if (start && start < today) {
    return 'Start date cannot be before today.'
  }
  if (start && end && end < start) {
    return 'End date cannot be before start date.'
  }
  if (start && end && tripDayCount(start, end) > MAX_TRIP_DAYS) {
    return `Trips can be planned for a maximum of ${MAX_TRIP_DAYS} days. Please choose a shorter range.`
  }
  return null
}

function FloatingField({
  label,
  icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  className = '',
  min,
  max,
  required,
  ariaLabel,
}: {
  label: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'date'
  placeholder?: string
  className?: string
  min?: string
  max?: string
  required?: boolean
  ariaLabel?: string
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const active = focused || value.length > 0

  return (
    <div
      role="presentation"
      onClick={() => inputRef.current?.focus()}
      className={`form-field-surface relative min-h-[56px] w-full min-w-0 cursor-text rounded-full px-4 sm:px-5 ${className}`}
    >
      <span
        className={`pointer-events-none absolute left-4 flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ease-out sm:left-5 ${
          active
            ? 'top-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-muted'
            : 'top-1/2 -translate-y-1/2 text-sm font-semibold text-text-soft'
        }`}
      >
        {icon}
        {label}
      </span>

      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : undefined}
        min={min}
        max={max}
        required={required}
        aria-label={ariaLabel || label}
        className={`w-full min-w-0 border-0 bg-transparent outline-none transition-all duration-200 ${
          active
            ? 'pointer-events-auto pt-7 pb-2.5  pl-1 text-lg opacity-100 text-app-text '
            : 'pointer-events-none absolute inset-0 opacity-0'
        } ${type === 'text' ? 'text-base' : 'pr-1 [&::-webkit-calendar-picker-indicator]:cursor-pointer'}`}
      />
    </div>
  )
}

export default function TripForm({ onSubmit, loading, initialValues, compact = false }: TripFormProps & { compact?: boolean }) {
  const [destination, setDestination] = useState(initialValues?.destination || '')
  const [startDate, setStartDate] = useState(initialValues?.startDate || '')
  const [endDate, setEndDate] = useState(initialValues?.endDate || '')
  const [dateWarning, setDateWarning] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const minEnd = startDate || today
  const maxEnd = startDate ? addDays(startDate, MAX_TRIP_DAYS - 1) : undefined

  useEffect(() => {
    if (initialValues) {
      setDestination(initialValues.destination || '')
      setStartDate(initialValues.startDate || '')
      setEndDate(initialValues.endDate || '')
      setDateWarning(
        getDateWarning(
          initialValues.startDate || '',
          initialValues.endDate || '',
          today
        )
      )
    }
  }, [initialValues, today])

  function handleStartChange(value: string) {
    setStartDate(value)
    setDateWarning(getDateWarning(value, endDate, today))
  }

  function handleEndChange(value: string) {
    setEndDate(value)
    setDateWarning(getDateWarning(startDate, value, today))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const warning = getDateWarning(startDate, endDate, today)
    if (warning) {
      setDateWarning(warning)
      return
    }
    onSubmit({
      destination: destination.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      interests: [],
    })
  }

  const hasDateError = Boolean(dateWarning)

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl">
      <div className="rounded-[2rem] border border-app-border bg-surface p-2 shadow-app-lg transition-shadow duration-300 hover:shadow-app-xl sm:rounded-full sm:p-5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_11rem_11rem_auto] sm:items-stretch lg:grid-cols-[minmax(0,1.5fr)_12rem_12rem_auto]">
          <FloatingField
            label="Where to"
            icon={<MapPinIcon className="h-3.5 w-3.5 shrink-0 text-accent" />}
            value={destination}
            onChange={setDestination}
            placeholder="Search destination"
            required
          />

          <FloatingField
            label="Start"
            icon={<CalendarIcon className="h-3.5 w-3.5 shrink-0 text-accent" />}
            value={startDate}
            onChange={handleStartChange}
            type="date"
            min={today}
            ariaLabel="Start date"
          />

          <FloatingField
            label="End"
            icon={<CalendarIcon className="h-3.5 w-3.5 shrink-0 text-accent" />}
            value={endDate}
            onChange={handleEndChange}
            type="date"
            min={minEnd}
            max={maxEnd}
            ariaLabel="End date"
          />

          <button
            type="submit"
            disabled={loading || !destination.trim() || hasDateError}
            className={`btn-primary flex w-full shrink-0 items-center justify-center gap-2 rounded-full font-semibold disabled:opacity-50 sm:w-auto ${
              compact ? 'min-h-[56px] px-5 sm:min-w-[3.25rem]' : 'min-h-[56px] px-5 sm:min-w-[8.75rem] sm:px-6'
            }`}
            aria-label={compact ? 'Create itinerary' : 'Plan trip'}
          >
            {loading ? (
              <Spinner size="sm" className="text-white" />
            ) : compact ? (
              <SearchIcon className="h-5 w-5" />
            ) : (
              <>
                <SearchIcon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Plan trip</span>
              </>
            )}
          </button>
        </div>
      </div>
      {dateWarning && (
        <p className="mt-3 text-center text-sm font-medium text-amber-600" role="alert">
          {dateWarning}
        </p>
      )}
    </form>
  )
}
