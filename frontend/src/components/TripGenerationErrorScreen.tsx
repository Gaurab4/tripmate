import { Link } from 'react-router-dom'
import { Spinner } from '@chakra-ui/react'
import { RefreshIcon } from './icons'

export const TRIP_GENERATION_ERROR_TITLE = "We couldn't create your itinerary"
export const TRIP_GENERATION_ERROR_MESSAGE =
  'Something went wrong while building your trip. This is usually temporary please wait a moment and try again.'

interface TripGenerationErrorScreenProps {
  onRetry?: () => void
  retrying?: boolean
  title?: string
  message?: string
}

export default function TripGenerationErrorScreen({
  onRetry,
  retrying = false,
  title = TRIP_GENERATION_ERROR_TITLE,
  message = TRIP_GENERATION_ERROR_MESSAGE,
}: TripGenerationErrorScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg)]">
      <div className="page-gradient pointer-events-none absolute inset-x-0 top-0 h-[50vh]" aria-hidden />

      <header className="relative px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline hover:opacity-90">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm text-white shadow-sm shadow-blue-500/20">
              ✈
            </span>
            <span className="text-lg font-bold tracking-tight text-app-text">TripMate</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-app-border bg-surface/90 px-4 py-2 text-sm font-medium text-text-soft no-underline backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            New search
          </Link>
        </div>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-4">
        <div className="animate-scale-in w-full max-w-[520px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-app ring-1 ring-amber-200">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>

          <h1 className="m-0 mb-3 text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-app-text">
            {title}
          </h1>
          <p className="m-0 mb-8 text-[0.9375rem] leading-relaxed text-muted">
            {message}
          </p>

          <div className="mb-8 rounded-2xl border border-app-border bg-surface p-5 text-left shadow-app-lg">
            <p className="m-0 mb-3 text-sm font-semibold text-app-text">What you can try</p>
            <ul className="m-0 list-none space-y-2.5 p-0 text-sm text-text-soft">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                Wait a few seconds and try again
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                Check your internet connection
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                Start a new search with the same destination
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={retrying}
                className="btn-primary inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold disabled:opacity-60"
              >
                {retrying ? (
                  <Spinner size="sm" className="text-white" />
                ) : (
                  <>
                    <RefreshIcon className="h-4 w-4" />
                    Try again
                  </>
                )}
              </button>
            )}
            <Link
              to="/"
              className="inline-flex min-w-[10rem] items-center justify-center rounded-full border border-app-border bg-surface px-6 py-3 text-sm font-semibold text-text-soft no-underline transition-colors hover:border-accent hover:text-accent"
            >
              Back to search
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
