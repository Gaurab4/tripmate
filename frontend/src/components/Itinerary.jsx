import { useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import DayCard from './DayCard'
import Modal from './Modal'

export default function Itinerary({ plan, destination, onCustomize, customizing, readOnly }) {
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
    const needsTime = !['food', 'eating'].includes(addType)
    onCustomize?.('add', addModal.dayIndex, null, addType, needsTime ? addTime : null)
    setAddModal({ open: false, dayIndex: null })
  }

  return (
    <div
      className="rounded-app-lg border border-app-border bg-surface p-6 shadow-app-lg"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)' }}
    >
      <Typography variant="h6" component="h2" className="text-xl font-semibold mb-6 text-app-text" sx={{ color: 'var(--text)' }}>
        Your itinerary
      </Typography>
      <div>
        {plan.map((dayData, idx) => (
          <DayCard
            key={dayData.day ?? idx}
            dayData={dayData}
            dayIndex={idx}
            destination={destination}
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
        <div className="space-y-5">
          {!['food', 'eating'].includes(addType) && (
            <div className="mb-5">
              <Typography component="label" className="block mb-1.5 text-text-soft text-sm font-medium" sx={{ color: 'var(--text-soft)' }}>
                At what time?
              </Typography>
              <TextField
                type="time"
                value={addTime}
                onChange={(e) => setAddTime(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--surface-2)' } }}
              />
            </div>
          )}
          <div className="mb-5">
            <Typography component="label" className="block mb-1.5 text-text-soft text-sm font-medium" sx={{ color: 'var(--text-soft)' }}>
              Type
            </Typography>
            <TextField
              select
              value={addType}
              onChange={(e) => setAddType(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--surface-2)' } }}
            >
              <MenuItem value="attraction">Attraction</MenuItem>
              <MenuItem value="viewpoint">Admire / Viewpoint</MenuItem>
              <MenuItem value="trek">Trek</MenuItem>
              <MenuItem value="eating">Eating place</MenuItem>
              <MenuItem value="food">Food</MenuItem>
            </TextField>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setAddModal({ open: false, dayIndex: null })}
              className="border-accent text-accent hover:bg-accent-soft"
              sx={{ borderColor: 'var(--accent)', color: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-soft)' } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddConfirm}
              disabled={customizing}
              className="bg-accent hover:bg-accent-hover"
              sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
