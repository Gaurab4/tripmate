import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const ICONS = {
  hotel: '🏨',
  attraction: '📍',
  viewpoint: '👁️',
  trek: '🥾',
  food: '🍽️',
  eating: '🍽️',
}

const TYPE_LABELS = {
  attraction: 'Landmark',
  viewpoint: 'Viewpoint',
  trek: 'Trek',
  food: 'Food',
  eating: 'Food',
}

const NO_TIME_ICONS = ['food', 'eating', 'hotel']

export default function ActivityItem({ activity, destination, onReplace, onRemove, customizing, readOnly }) {
  const icon = ICONS[activity.icon] || ICONS.attraction
  const typeLabel = TYPE_LABELS[activity.icon] || 'Landmark'
  const showTime = activity.time && !NO_TIME_ICONS.includes(activity.icon)
  const mapQuery = [activity.name, destination].filter(Boolean).join(' ')
  const mapUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : null
  const duration = activity.duration || activity.duration_minutes

  return (
    <Card
      variant="outlined"
      className="relative flex items-start gap-4 p-5 rounded-app-lg bg-surface border border-app-border shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:border-amber-200/50"
      sx={{ bgcolor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div
        className="absolute -left-6 top-7 w-2.5 h-2.5 rounded-full bg-accent shrink-0"
        aria-hidden
        style={{ backgroundColor: 'var(--accent)' }}
      />
      <CardContent className="flex items-start gap-4 w-full p-0">
        <div className="w-[72px] h-[72px] shrink-0 rounded-app-sm bg-surface-2 flex items-center justify-center border border-app-border">
          <span className="text-3xl" aria-hidden>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <Chip
              size="small"
              label={
                <>
                  <span className="mr-1 text-sm" aria-hidden>{icon}</span>
                  {typeLabel}
                </>
              }
              className="text-xs font-semibold bg-surface-2 border border-app-border"
              sx={{ bgcolor: 'var(--surface-2)', borderColor: 'var(--border)' }}
            />
          </div>
          <Typography variant="subtitle1" component="h4" className="text-[1.0625rem] font-bold text-app-text mb-1 leading-tight" sx={{ color: 'var(--text)' }}>
            {activity.name}
          </Typography>
          <div className="flex flex-wrap gap-3 gap-y-1 text-[0.8125rem] text-muted mb-2">
            {showTime && (
              <span className="inline-flex items-center gap-1 text-accent font-medium" style={{ color: 'var(--accent)' }}>
                <span className="text-xs opacity-90" aria-hidden>🕐</span>
                Best time: {activity.time}
              </span>
            )}
            {duration && (
              <span className="inline-flex items-center gap-1">
                <span className="text-xs opacity-90" aria-hidden>⏱</span>
                {typeof duration === 'number' ? `~${duration} min` : duration}
              </span>
            )}
          </div>
          {activity.description && (
            <Typography variant="body2" className="text-[0.9375rem] text-text-soft leading-normal mb-3" sx={{ color: 'var(--text-soft)' }}>
              {activity.description}
            </Typography>
          )}
          <div className="flex flex-wrap items-center gap-3 gap-y-1">
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-accent hover:underline"
                style={{ color: 'var(--muted)' }}
              >
                View on map →
              </a>
            )}
            {!readOnly && (
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outlined"
                  className="text-xs font-medium border-app-border text-muted hover:bg-app-border hover:text-text-soft"
                  sx={{ borderColor: 'var(--border)', color: 'var(--muted)', '&:hover': { bgcolor: 'var(--border)', color: 'var(--text-soft)' } }}
                  onClick={() => onReplace()}
                  disabled={customizing}
                >
                  Replace
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  className="text-xs font-medium"
                  onClick={() => onRemove()}
                  disabled={customizing}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
