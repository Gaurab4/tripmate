import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="pb-12">
      <section className="mx-auto max-w-[560px] px-6 py-12 text-center">
        <h1 className="m-0 mb-4 text-[clamp(1.75rem,5vw,2.25rem)] font-bold leading-tight text-app-text">
          Plan your next trip, <span className="text-accent">one place.</span>
        </h1>
        <p className="m-0 mb-7 text-[1.05rem] leading-relaxed text-text-soft">
          TripMate helps you search for destinations, save itineraries, and keep all your travel plans in one place.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link to="/" className="btn-primary min-w-[220px] rounded-app px-6 py-3 font-semibold no-underline">
            Plan a trip (no account needed)
          </Link>
          <Link to="/register" className="btn-outline min-w-[220px] rounded-app px-6 py-3 font-semibold no-underline">
            Get started — it's free
          </Link>
          <Link to="/login" className="btn-outline min-w-[220px] rounded-app px-6 py-3 font-semibold no-underline">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[560px] px-6 pb-8">
        <h2 className="m-0 mb-3 text-[1.35rem] font-semibold text-app-text">What is TripMate?</h2>
        <p className="m-0 mb-6 leading-relaxed text-text-soft">
          TripMate is your travel planning companion. Create an account to search for places, save itineraries you like, and come back to them anytime.
        </p>
        <ul className="m-0 mb-6 list-none p-0">
          {[
            { icon: '📍', title: 'Search itineraries', text: 'Look up destinations and trip ideas.' },
            { icon: '💾', title: 'Save what you like', text: 'Keep your favourite itineraries in one list.' },
            { icon: '✏️', title: 'Edit anytime', text: 'Add dates, notes, and day-by-day plans.' },
          ].map((item, i, arr) => (
            <li
              key={item.title}
              className={`flex items-start gap-4 border-b border-app-border py-4 text-text-soft leading-normal ${i === arr.length - 1 ? 'border-b-0' : ''}`}
            >
              <span className="shrink-0 text-2xl" aria-hidden>{item.icon}</span>
              <div>
                <strong className="text-app-text">{item.title}</strong> — {item.text}
              </div>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <Link to="/register" className="btn-primary rounded-app px-5 py-2.5 font-semibold no-underline">
            Create free account
          </Link>
        </div>
      </section>

      <footer className="border-t border-app-border px-6 py-8 text-center text-sm text-muted">
        <p className="m-0">TripMate — Plan. Save. Travel.</p>
      </footer>
    </main>
  )
}
