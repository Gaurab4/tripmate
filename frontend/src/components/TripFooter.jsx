import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function TripFooter({ tripData }) {
  const [copied, setCopied] = useState(false)

  if (!tripData) return null

  const { destination, start_date, end_date, plan } = tripData

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
    <Box
      component="footer"
      className="sticky bottom-0 border-t border-app-border bg-surface py-4 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      sx={{ borderColor: 'var(--border)', bgcolor: 'var(--surface)' }}
    >
      <div className="max-w-[56rem] mx-auto flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="outlined"
          className="border-app-border text-app-text hover:bg-surface-2"
          sx={{ borderColor: 'var(--border)', color: 'var(--text)', '&:hover': { bgcolor: 'var(--surface-2)' } }}
          onClick={handleDownload}
        >
          Download JSON
        </Button>
        <Button
          variant="outlined"
          className="border-app-border text-app-text hover:bg-surface-2"
          sx={{ borderColor: 'var(--border)', color: 'var(--text)', '&:hover': { bgcolor: 'var(--surface-2)' } }}
          onClick={handleShare}
        >
          {copied ? 'Copied!' : 'Share'}
        </Button>
      </div>
    </Box>
  )
}
