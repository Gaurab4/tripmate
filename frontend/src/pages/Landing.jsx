import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="landing">
      <section className="hero">
        <h1 className="hero-title">
          Plan your next trip, <span className="hero-accent">one place.</span>
        </h1>
        <p className="hero-subtitle">
          TripMate helps you search for destinations, save itineraries, and keep all your travel plans in one place.
        </p>
        <div className="hero-cta">
          <Link to="/" className="btn btn-hero btn-primary">
            Plan a trip (no account needed)
          </Link>
          <Link to="/register" className="btn btn-hero btn-ghost">
            Get started — it's free
          </Link>
          <Link to="/login" className="btn btn-hero btn-ghost">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="about">
        <h2 className="about-title">What is TripMate?</h2>
        <p className="about-lead">
          TripMate is your travel planning companion. Create an account to search for places, save itineraries you like, and come back to them anytime.
        </p>
        <ul className="features">
          <li className="feature">
            <span className="feature-icon" aria-hidden>📍</span>
            <div>
              <strong>Search itineraries</strong> — Look up destinations and trip ideas.
            </div>
          </li>
          <li className="feature">
            <span className="feature-icon" aria-hidden>💾</span>
            <div>
              <strong>Save what you like</strong> — Keep your favourite itineraries in one list.
            </div>
          </li>
          <li className="feature">
            <span className="feature-icon" aria-hidden>✏️</span>
            <div>
              <strong>Edit anytime</strong> — Add dates, notes, and day-by-day plans.
            </div>
          </li>
        </ul>
        <div className="about-cta">
          <Link to="/register" className="btn btn-primary">Create free account</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>TripMate — Plan. Save. Travel.</p>
      </footer>
    </main>
  )
}
