import { useState } from 'react'
import DayCard from './DayCard'
import Modal from './Modal'

export default function Itinerary({ plan, onCustomize, customizing, readOnly }) {
  const [addModal, setAddModal] = useState({ open: false, dayIndex: null })
  const [addTime, setAddTime] = useState('12:00')
  const [addType, setAddType] = useState('attraction')

  if (!plan || plan.length === 0) return null

  function handleReplace(dayIndex, activityIndex) {
    onCustomize?.('replace', dayIndex, activityIndex)
  }

  function handleRemove(dayIndex, activityIndex) {
    onCustomize?.('remove', dayIndex, activityIndex)
  }

  function handleAddClick(dayIndex) {
    setAddModal({ open: true, dayIndex })
    setAddTime('12:00')
    setAddType('attraction')
  }

  function handleAddConfirm() {
    if (addModal.dayIndex == null) return
    onCustomize?.('add', addModal.dayIndex, null, addType, addTime)
    setAddModal({ open: false, dayIndex: null })
  }

  return (
    <div className="itinerary-card">
      <h2 className="itinerary-title">Your itinerary</h2>
      <div>
        {plan.map((dayData, idx) => (
          <DayCard
            key={dayData.day ?? idx}
            dayData={dayData}
            dayIndex={idx}
            onReplace={handleReplace}
            onRemove={handleRemove}
            onAdd={handleAddClick}
            customizing={customizing}
            readOnly={readOnly}
          />
        ))}
      </div>
      <Modal
        isOpen={addModal.open}
        onClose={() => setAddModal({ open: false, dayIndex: null })}
        title="Add activity"
      >
        <div className="add-activity-form">
          <div className="form-group">
            <label className="add-activity-label">At what time?</label>
            <input
              type="time"
              value={addTime}
              onChange={(e) => setAddTime(e.target.value)}
              className="form-group input"
              required
            />
          </div>
          <div className="form-group">
            <label className="add-activity-label">Type</label>
            <select
              value={addType}
              onChange={(e) => setAddType(e.target.value)}
              className="add-activity-select"
              <option value="attraction">Attraction</option>
              <option value="food">Food</option>
              <option value="hotel">Hotel</option>
              <option value="flight">Flight</option>
            </select>
          </div>
          <div className="add-activity-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddModal({ open: false, dayIndex: null })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddConfirm}
              disabled={customizing}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
