import { useState, useEffect } from 'react'

const INTEREST_OPTIONS = [
  { id: 'history', label: 'History', icon: '🏛️' },
  { id: 'food', label: 'Food', icon: '🍴' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'museums', label: 'Museums', icon: '🏛️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'beaches', label: 'Beaches', icon: '🏖️' },
  { id: 'culture', label: 'Culture', icon: '🏺' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
]

export default function TripForm({ onSubmit, loading, initialValues }) {
  const [destination, setDestination] = useState(initialValues?.destination || '')
  const [startDate, setStartDate] = useState(initialValues?.startDate || '')
  const [endDate, setEndDate] = useState(initialValues?.endDate || '')
  const [interests, setInterests] = useState(initialValues?.interests || [])

  useEffect(() => {
    if (initialValues) {
      setDestination(initialValues.destination || '')
      setStartDate(initialValues.startDate || '')
      setEndDate(initialValues.endDate || '')
      setInterests(Array.isArray(initialValues.interests) ? initialValues.interests : [])
    }
  }, [initialValues])

  function toggleInterest(id) {
    setInterests((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      destination: destination.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      interests,
    })
  }

  const selectedCount = interests.length
  const today = new Date().toISOString().slice(0, 10)
  const minEnd = startDate || today

  return (
    <form onSubmit={handleSubmit} className="trip-form-airbnb">
      <div className="trip-search-bar">
        <div className="trip-search-item trip-search-destination">
          <label className="trip-search-label">Where</label>
          <input
            type="text"
            placeholder="Search destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="trip-search-input"
          />
        </div>
        <div className="trip-search-divider" />
        <div className="trip-search-item trip-search-dates">
          <label className="trip-search-label">Start</label>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="trip-search-input"
          />
        </div>
        <div className="trip-search-divider" />
        <div className="trip-search-item trip-search-dates">
          <label className="trip-search-label">End</label>
          <input
            type="date"
            value={endDate}
            min={minEnd}
            onChange={(e) => setEndDate(e.target.value)}
            className="trip-search-input"
          />
        </div>
        <div className="trip-search-divider" />
        <button
          type="submit"
          disabled={loading || !destination.trim()}
          className="trip-search-btn"
          aria-label="Create itinerary"
        >
          {loading ? (
            <span className="trip-search-spinner">…</span>
          ) : (
            <svg className="trip-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </button>
      </div>

      <div className="trip-form-interests-wrap">
        <label className="trip-form-label">
          Interests {selectedCount > 0 && `(${selectedCount})`}
        </label>
        <div className="trip-form-interests">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleInterest(opt.id)}
              className={`trip-form-interest-tag ${interests.includes(opt.id) ? 'trip-form-interest-tag-selected' : ''}`}
            >
              <span className="trip-form-interest-icon">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
