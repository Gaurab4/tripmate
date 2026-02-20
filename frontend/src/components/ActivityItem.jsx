const ICONS = {
  flight: '✈️',
  hotel: '🏨',
  attraction: '📍',
  food: '🍽️',
}

export default function ActivityItem({ activity, onReplace, onRemove, customizing, readOnly }) {
  const icon = ICONS[activity.icon] || ICONS.attraction

  return (
    <div className="activity-item">
      <span className="activity-icon" aria-hidden>{icon}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 className="activity-name">{activity.name}</h4>
        {activity.time && (
          <p className="activity-best-time">Best time: {activity.time}</p>
        )}
        <p className="activity-desc">{activity.description}</p>
        {!readOnly && (
          <div className="activity-actions">
            <button
              type="button"
              className="btn-outline-accent"
              onClick={() => onReplace()}
              disabled={customizing}
            >
              Replace
            </button>
            <button
              type="button"
              className="btn-outline-error"
              onClick={() => onRemove()}
              disabled={customizing}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
