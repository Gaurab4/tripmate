import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function Landing() {
  return (
    <Box component="main" className="pb-12">
      <Box component="section" className="text-center py-12 px-6 max-w-[560px] mx-auto">
        <Typography variant="h1" className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold leading-tight m-0 mb-4 text-app-text" sx={{ color: 'var(--text)' }}>
          Plan your next trip, <span className="text-accent" style={{ color: 'var(--accent)' }}>one place.</span>
        </Typography>
        <Typography className="text-[1.05rem] text-text-soft m-0 mb-7 leading-relaxed" sx={{ color: 'var(--text-soft)' }}>
          TripMate helps you search for destinations, save itineraries, and keep all your travel plans in one place.
        </Typography>
        <Box className="flex flex-col gap-3 items-center">
          <Button component={Link} to="/" variant="contained" className="min-w-[220px] py-3 px-6 font-semibold rounded-app normal-case bg-accent hover:bg-accent-hover text-white" sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}>
            Plan a trip (no account needed)
          </Button>
          <Button component={Link} to="/register" variant="outlined" className="min-w-[220px] py-3 px-6 font-semibold rounded-app normal-case bg-transparent text-muted border border-app-border hover:text-text-soft hover:border-muted" sx={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
            Get started — it's free
          </Button>
          <Button component={Link} to="/login" variant="outlined" className="min-w-[220px] py-3 px-6 font-semibold rounded-app normal-case bg-transparent text-muted border border-app-border hover:text-text-soft hover:border-muted" sx={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
            I already have an account
          </Button>
        </Box>
      </Box>

      <Box component="section" className="max-w-[560px] mx-auto px-6 pb-8">
        <Typography variant="h2" className="text-[1.35rem] font-semibold m-0 mb-3 text-app-text" sx={{ color: 'var(--text)' }}>
          What is TripMate?
        </Typography>
        <Typography className="text-text-soft m-0 mb-6 leading-relaxed" sx={{ color: 'var(--text-soft)' }}>
          TripMate is your travel planning companion. Create an account to search for places, save itineraries you like, and come back to them anytime.
        </Typography>
        <ul className="list-none p-0 m-0 mb-6">
          <li className="flex gap-4 items-start py-4 border-b border-app-border text-text-soft leading-normal" sx={{ borderColor: 'var(--border)' }}>
            <span className="text-2xl shrink-0" aria-hidden>📍</span>
            <div><strong className="text-app-text" style={{ color: 'var(--text)' }}>Search itineraries</strong> — Look up destinations and trip ideas.</div>
          </li>
          <li className="flex gap-4 items-start py-4 border-b border-app-border text-text-soft leading-normal" sx={{ borderColor: 'var(--border)' }}>
            <span className="text-2xl shrink-0" aria-hidden>💾</span>
            <div><strong className="text-app-text" style={{ color: 'var(--text)' }}>Save what you like</strong> — Keep your favourite itineraries in one list.</div>
          </li>
          <li className="flex gap-4 items-start py-4 border-b border-app-border text-text-soft leading-normal last:border-b-0" sx={{ borderColor: 'var(--border)' }}>
            <span className="text-2xl shrink-0" aria-hidden>✏️</span>
            <div><strong className="text-app-text" style={{ color: 'var(--text)' }}>Edit anytime</strong> — Add dates, notes, and day-by-day plans.</div>
          </li>
        </ul>
        <Box className="text-center">
          <Button component={Link} to="/register" variant="contained" className="bg-accent hover:bg-accent-hover" sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}>
            Create free account
          </Button>
        </Box>
      </Box>

      <Box component="footer" className="text-center py-8 px-6 text-muted text-sm border-t border-app-border" sx={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
        <Typography component="p" className="m-0">TripMate — Plan. Save. Travel.</Typography>
      </Box>
    </Box>
  )
}
