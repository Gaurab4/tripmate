import { Link } from 'react-router-dom'
import { GITHUB_REPO_URL, MEDIUM_ARTICLE_URL } from '../constants/links'

function GitHubIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A8.203 8.203 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <header className="animate-fade-in-up mb-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-theme bg-pill px-4 py-1.5 text-sm font-semibold text-accent">
          About TripMate
        </span>
        <h1 className="m-0 text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-app-text">
          I built this because I was tired of opening{' '}
          <span className="text-accent">20 tabs</span> for every trip
        </h1>
      </header>

      <div className="animate-fade-in-up space-y-8">
        <section className="hero-card-gradient rounded-2xl border p-6 shadow-app-lg sm:p-8">
          <p className="m-0 text-lg leading-relaxed text-text-soft">
            I&apos;m{' '}
            <a href="https://medium.com/@gaurabth2002" target="_blank" rel="noopener noreferrer" className="font-bold text-accent hover:underline">
              Gaurab
            </a>
            . Every time I tried to plan a trip, I&apos;d end up with a mess {' '}
            <strong className="font-semibold text-app-text">10–15 Chrome tabs</strong>, random blogs,{' '}
            <strong className="font-semibold text-app-text">&ldquo;top 10 places&rdquo;</strong> lists that didn&apos;t match reality, and long YouTube videos where I&apos;d get lost and start watching{' '}
            <strong className="font-semibold text-app-text">cat videos</strong> instead.
          </p>
        </section>

        <section className="space-y-4 px-1 sm:px-2">
          <h2 className="m-0 text-sm font-bold uppercase tracking-widest text-accent">The problem</h2>
          <p className="m-0 text-[1.0625rem] leading-[1.75] text-text-soft">
            Even after hours of research, the plan still didn&apos;t make sense.{' '}
            <strong className="font-semibold text-app-text">Places were far from each other.</strong>{' '}
            I wasted time traveling. Some spots just weren&apos;t worth it.
          </p>
        </section>

        <blockquote className="m-0 rounded-2xl border-l-4 border-accent bg-accent-surface px-6 py-5 shadow-app-sm">
          <p className="m-0 text-[1.125rem] font-semibold leading-snug text-app-text sm:text-xl">
            &ldquo;Why can&apos;t I just enter where I&apos;m going and get a proper plan?&rdquo;
          </p>
          <p className="mb-0 mt-2 text-sm font-medium text-muted">That&apos;s where TripMate started.</p>
        </blockquote>

        <section className="space-y-4 px-1 sm:px-2">
          <h2 className="m-0 text-sm font-bold uppercase tracking-widest text-accent">What I wanted</h2>
          <p className="m-0 text-[1.0625rem] leading-[1.75] text-text-soft">
            I didn&apos;t want something fancy. I wanted to enter my{' '}
            <strong className="font-semibold text-app-text">destination, dates, and interests</strong> and get a{' '}
            <strong className="font-semibold text-app-text">day-by-day plan I could actually follow</strong>.
            Places grouped logically. Food and attractions mixed naturally. Not a long AI paragraph, but a{' '}
            <strong className="font-semibold text-app-text">flow I could use on the trip</strong>.
          </p>
        </section>

        <section className="rounded-2xl border border-app-border bg-surface px-6 py-5 shadow-app sm:px-8 sm:py-6">
          <p className="m-0 text-[1.0625rem] leading-[1.75] text-text-soft">
            The goal was never to build <strong className="font-semibold text-app-text">&ldquo;another AI app.&rdquo;</strong>{' '}
            I wanted something where I could look at the plan and think:{' '}
            <em className="font-medium not-italic text-app-text">okay cool, I can actually follow this.</em>
          </p>
        </section>

        <p className="m-0 px-1 text-center text-[1.0625rem] leading-relaxed text-muted sm:px-2">
          TripMate is still a <strong className="font-semibold text-app-text">work in progress</strong>. I keep coming back every week, improving small things and learning along the way.
        </p>
      </div>

      <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 border-t border-app-border pt-10 sm:flex-row sm:flex-wrap" style={{ animationDelay: '120ms' }}>
        <a
          href={MEDIUM_ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
        >
          <ExternalLinkIcon />
          Read my full story on Medium
        </a>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
        >
          <GitHubIcon />
          View on GitHub
        </a>
        <Link to="/" className="btn-outline inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline">
          Plan a trip
        </Link>
      </div>
    </main>
  )
}
