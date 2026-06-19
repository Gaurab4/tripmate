import { Link } from 'react-router-dom'
import { Progress } from '@chakra-ui/react'

const LOADING_STEPS = [
  'Searching for the best places...',
  'Building your day-by-day plan...',
  'Optimizing routes and timing...',
  'Adding recommendations...',
]

interface TripLoadingScreenProps {
  activeStep: number
}

export default function TripLoadingScreen({ activeStep }: TripLoadingScreenProps) {
  const progressValue = ((activeStep + 1) / LOADING_STEPS.length) * 100

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg)]">
      <div className="page-gradient pointer-events-none absolute inset-x-0 top-0 h-[50vh]" aria-hidden />
      {/* Header */}
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

      {/* Main content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-4">
        <div className="w-full max-w-[640px]">
          {/* Badge */}
          <div className="mb-5 text-center">
            <span className="inline-flex animate-float items-center gap-1.5 rounded-full border border-accent-theme bg-accent-surface px-4 py-1.5 text-sm font-medium text-accent shadow-app-sm">
              <span aria-hidden>✨</span>
              AI is crafting your trip
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up m-0 mb-2 text-center text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-app-text">
            Creating your itinerary
          </h1>
          <p className="m-0 mb-10 text-center text-[0.9375rem] text-muted">
            This usually takes a few seconds
          </p>

          {/* Steps card */}
          <div className="animate-fade-in-up mb-8 rounded-2xl border border-app-border bg-surface p-6 shadow-app-lg" style={{ animationDelay: '100ms' }}>
            <ul className="m-0 list-none space-y-4 p-0">
              {LOADING_STEPS.map((step, i) => {
                const isCompleted = i < activeStep
                const isCurrent = i === activeStep
                const isPending = !isCompleted && !isCurrent

                return (
                  <li key={step} className="flex items-center gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {isCompleted && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path d="M11 4L5.5 9.5L3 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                      {isCurrent && (
                        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center" aria-label="Loading">
                          <span className="absolute inset-0 animate-pulse rounded-full bg-accent-surface-strong" aria-hidden />
                          <span className="absolute inset-0 animate-spin rounded-full border-2 border-accent-theme border-t-accent" aria-hidden />
                          <span className="relative h-2 w-2 animate-pulse rounded-full bg-accent/70" aria-hidden />
                        </span>
                      )}
                      {isPending && (
                        <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
                      )}
                    </span>
                    <span
                      className={`text-[0.9375rem] ${
                        isCurrent ? 'font-semibold text-app-text' : isCompleted ? 'font-medium text-app-text' : 'text-muted'
                      }`}
                    >
                      {step}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Skeleton cards */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ['w-full', 'w-3/5'],
              ['w-11/12', 'w-2/3'],
              ['w-10/12', 'w-1/2'],
            ].map(([lineOne, lineTwo], i) => (
              <div
                key={i}
                className="flex min-h-[5.5rem] flex-col justify-center gap-3 rounded-2xl border border-accent-soft bg-accent-surface p-5 shadow-app-sm"
              >
                <div className={`skeleton-shimmer h-2.5 animate-pulse rounded-full opacity-90 ${lineOne}`} />
                <div className={`skeleton-shimmer h-2 animate-pulse rounded-full opacity-70 ${lineTwo}`} />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <Progress.Root value={progressValue} className="mb-2">
              <Progress.Track className="h-1 overflow-hidden rounded-full bg-slate-200">
                <Progress.Range className="h-full rounded-full bg-accent transition-all duration-500 ease-out" />
              </Progress.Track>
            </Progress.Root>
            <p className="m-0 text-[0.8125rem] text-muted">
              Step {activeStep + 1} of {LOADING_STEPS.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { LOADING_STEPS }
