import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

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

  const fieldSxWithBorder = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--surface)',
      borderRadius: 0,
      '& fieldset': { border: 'none', borderRight: '1px solid var(--border)' },
    },
  }
  const fieldSxNoBorder = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--surface)',
      borderRadius: 0,
      '& fieldset': { border: 'none' },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div className="flex items-stretch bg-surface border border-app-border rounded-app overflow-hidden flex-wrap">
        <TextField
          label="Where"
          placeholder="Search destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          variant="outlined"
          size="small"
          className="flex-1 min-w-[140px]"
          sx={fieldSxWithBorder}
        />
        <div className="w-px bg-app-border shrink-0" />
        <TextField
          label="Start"
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: true }}
          className="min-w-[120px]"
          sx={fieldSxWithBorder}
        />
        <div className="w-px bg-app-border shrink-0" />
        <TextField
          label="End"
          type="date"
          value={endDate}
          min={minEnd}
          onChange={(e) => setEndDate(e.target.value)}
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: true }}
          className="min-w-[120px]"
          sx={fieldSxNoBorder}
        />
        <div className="w-px bg-app-border shrink-0" />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !destination.trim()}
          className="min-w-12 rounded-none shadow-none bg-accent hover:bg-accent-hover"
          sx={{ backgroundColor: 'var(--accent)', '&:hover': { backgroundColor: 'var(--accent-hover)' } }}
          aria-label="Create itinerary"
        >
          {loading ? (
            <span className="inline-block animate-spin">…</span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </Button>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-app-text mb-2">
          Interests {selectedCount > 0 && `(${selectedCount})`}
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              label={
                <>
                  <span className="mr-1">{opt.icon}</span>
                  {opt.label}
                </>
              }
              onClick={() => toggleInterest(opt.id)}
              color={interests.includes(opt.id) ? 'primary' : 'default'}
              variant={interests.includes(opt.id) ? 'filled' : 'outlined'}
              className="text-[0.8125rem]"
            />
          ))}
        </div>
      </div>
    </form>
  )
}
