import { useNavigate } from 'react-router-dom'
import TripForm from '../components/TripForm'

function slugify(str) {
  return String(str || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function Planner() {
  const navigate = useNavigate()

  function handleSubmit({ destination, startDate, endDate, interests }) {
    const slug = slugify(destination)
    navigate(`/trip/${slug}`, {
      state: { destination, startDate, endDate, interests },
    })
  }

  return (
    <div className="planner-page">
      <div className="planner-hero-bg" aria-hidden />
      <main className="planner-main">
        <div className="planner-hero">
          <div className="planner-tag">
            <span className="planner-tag-dot" />
            AI-Powered Travel Planning
          </div>
          <h1 className="planner-title">
            Your Dream Trip, <span className="planner-title-accent">Planned Instantly.</span>
          </h1>
          <p className="planner-subtitle">
            Tell us where you're headed and what you love — we'll craft a perfect day-by-day itinerary.
          </p>
        </div>

        <div className="planner-search-wrap mb-10">
          <TripForm onSubmit={handleSubmit} loading={false} />
        </div>

        <div className="planner-features-wrap">
          <div className="planner-features">
          <div className="planner-feature-card">
            <div className="planner-feature-icon blue">🗺️</div>
            <h3 className="planner-feature-title">Day-by-Day Plans</h3>
            <p className="planner-feature-desc">Creates your trip according to time and follows logical routes.</p>
          </div>
          <div className="planner-feature-card">
            <div className="planner-feature-icon pink">🎯</div>
            <h3 className="planner-feature-title">Interest-Based</h3>
            <p className="planner-feature-desc">Activities matched to your preferences.</p>
          </div>
          <div className="planner-feature-card">
            <div className="planner-feature-icon amber">⚡</div>
            <h3 className="planner-feature-title">Instant Results</h3>
            <p className="planner-feature-desc">Get your itinerary in seconds.</p>
          </div>
          <div className="planner-feature-card">
            <div className="planner-feature-icon green">🛤️</div>
            <h3 className="planner-feature-title">Route & Time Optimized</h3>
            <p className="planner-feature-desc">Plans are built according to route and time — so your day flows logically and is easy to follow.</p>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
