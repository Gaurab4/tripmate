import ActivityItem from './ActivityItem'

export default function DayCard({ dayData, dayIndex, onReplace, onRemove, onAdd, customizing, readOnly }) {
  const { day, date, activities = [] } = dayData

  return (
    <div className="day-card">
      <div className="day-card-connector" />
      <div className="flex gap-4 pb-8" style={{ display: 'flex', gap: '1rem', paddingBottom: '2rem' }}>
        <div className="day-card-badge">{day}</div>
        <div style={{ minWidth: 0, flex: 1, paddingBottom: '0.5rem' }}>
          <h3 className="day-card-header">
            Day {day}
            {date && <span className="day-card-date">{date}</span>}
          </h3>
          <div style={{ marginTop: '1rem' }}>
            {activities.map((act, idx) => (
              <ActivityItem
                key={act.id || idx}
                activity={act}
                onReplace={() => onReplace(dayIndex, idx)}
                onRemove={() => onRemove(dayIndex, idx)}
                customizing={customizing}
                readOnly={readOnly}
              />
            ))}
          </div>
          {!readOnly && (
            <button
              type="button"
              className="add-activity-btn"
              onClick={() => onAdd(dayIndex)}
              disabled={customizing}
            >
              + Add activity
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
