import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createItinerary } from '../api'

export default function TripFooter({ tripData, onSaveSuccess }) {
  const { isAuthenticated } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  if (!tripData) return null

  const { destination, start_date, end_date, interests, plan } = tripData

  async function handleSave() {
    if (!isAuthenticated) {
      setError('Please log in to save your trip.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const saved = await createItinerary({
        title: `${destination} Trip`,
        destination,
        start_date,
        end_date,
        interests: interests || [],
        plan: plan || [],
      })
      onSaveSuccess?.(saved)
    } catch (e) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function handleDownload() {
    const blob = new Blob(
      [JSON.stringify(tripData, null, 2)],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tripmate-${destination.replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleShare() {
    const text = `My TripMate itinerary: ${destination} (${start_date} – ${end_date})\n\n${(plan || []).map((d) =>
      `Day ${d.day}: ${(d.activities || []).map((a) => a.name).join(' → ')}`
    ).join('\n')}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <footer className="trip-footer">
      <div className="trip-footer-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Trip'}
        </button>
        <button type="button" className="trip-footer-ghost" onClick={handleDownload}>
          Download JSON
        </button>
        <button type="button" className="trip-footer-ghost" onClick={handleShare}>
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
      {error && <p className="trip-footer-error">{error}</p>}
      {!isAuthenticated && (
        <p className="trip-footer-hint">
          <Link to="/login">Log in</Link> to save trips to your account.
        </p>
      )}
    </footer>
  )
}
