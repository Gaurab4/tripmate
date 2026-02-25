import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ActivityItem from './ActivityItem'

function buildDayJourneyMapUrl(activities, destination) {
  const places = activities.map((a) => (destination ? `${a.name}, ${destination}` : a.name))
  if (places.length === 0) return null
  if (places.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[0])}`
  }
  const origin = encodeURIComponent(places[0])
  const dest = encodeURIComponent(places[places.length - 1])
  const waypointsParam = places.length > 2
    ? `&waypoints=${encodeURIComponent(places.slice(1, -1).join('|'))}`
    : ''
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypointsParam}`
}

export default function DayCard({ dayData, dayIndex, destination, onReplace, onRemove, onAdd, customizing, readOnly }) {
  const { day, date, activities: rawActivities = [] } = dayData
  const activities = rawActivities.filter((a) => a.icon !== 'flight' && a.icon !== 'hotel')
  const journeyMapUrl = buildDayJourneyMapUrl(activities, destination || '')

  return (
    <Box className="pb-10">
      <Box className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-md"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)' }}
        >
          {day}
        </div>
        <Box className="flex-1 min-w-0 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography variant="h6" component="h3" className="text-xl font-bold text-app-text m-0 mb-0.5" sx={{ color: 'var(--text)' }}>
              Day {day}
            </Typography>
            {date && (
              <Typography variant="body2" className="text-sm font-normal text-muted m-0" sx={{ color: 'var(--muted)' }}>
                {date}
              </Typography>
            )}
          </div>
          {journeyMapUrl && (
            <Button
              component="a"
              href={journeyMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              className="text-xs font-semibold text-accent bg-accent-soft border-app-border hover:bg-amber-200/25 hover:border-accent hover:text-accent-hover"
              sx={{ color: 'var(--accent)', bgcolor: 'var(--accent-soft)', borderColor: 'var(--border)' }}
              startIcon={<span className="text-sm" aria-hidden>📍</span>}
            >
              Create journey on map
            </Button>
          )}
        </Box>
      </Box>
      <Box className="relative pl-6">
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-sm opacity-70"
          aria-hidden
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <Box className="relative flex flex-col gap-4">
          {activities.map((act, idx) => (
            <ActivityItem
              key={act.id || idx}
              activity={act}
              destination={destination}
              onReplace={() => onReplace(dayIndex, idx)}
              onRemove={() => onRemove(dayIndex, idx)}
              customizing={customizing}
              readOnly={readOnly}
            />
          ))}
          {!readOnly && (
            <Button
              type="button"
              variant="outlined"
              className="mt-4 border-2 border-dashed border-app-border text-muted hover:border-accent hover:text-accent hover:bg-transparent"
              sx={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              onClick={() => onAdd(dayIndex)}
              disabled={customizing}
            >
              + Add activity
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
