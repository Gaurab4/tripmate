import { useState } from 'react'
import { Button, NativeSelect } from '@chakra-ui/react'
import DayCard from './DayCard'
import Modal from './Modal'
import type { DayPlan } from '../types'

export type CustomizeHandler = (
  action: string,
  dayIndex: number,
  activityIndex?: number | null,
  activityType?: string,
  activityTime?: string | null
) => void

interface ItineraryProps {
  plan: DayPlan[]
  destination?: string
  onCustomize?: CustomizeHandler
  customizing?: boolean
  readOnly?: boolean
}

export default function Itinerary({ plan, destination, onCustomize, customizing = false, readOnly }: ItineraryProps) {
  const [addModal, setAddModal] = useState<{ open: boolean; dayIndex: number | null }>({ open: false, dayIndex: null })
  const [addTime, setAddTime] = useState('12:00')
  const [addType, setAddType] = useState('attraction')

  if (!plan || plan.length === 0) return null

  function handleRemove(dayIndex: number, activityIndex: number) {
    onCustomize?.('remove', dayIndex, activityIndex)
  }

  function handleAddClick(dayIndex: number) {
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
    <div className="animate-fade-in-up overflow-visible rounded-2xl border border-app-border bg-surface p-6 shadow-app-lg transition-shadow duration-300 hover:shadow-app-xl sm:p-8" style={{ animationDelay: '100ms' }}>
      <h2 className="mb-6 text-xl font-bold text-app-text">Your itinerary</h2>
      <div className="space-y-2 overflow-visible">
        {plan.map((dayData, idx) => (
          <DayCard
            key={dayData.day ?? idx}
            dayData={dayData}
            dayIndex={idx}
            destination={destination}
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
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-soft">At what time?</span>
              <input
                type="time"
                value={addTime}
                onChange={(e) => setAddTime(e.target.value)}
                className="input-field"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-soft">Type</span>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={addType}
                onChange={(e) => setAddType(e.target.value)}
                className="input-field"
              >
                <option value="attraction">Attraction</option>
                <option value="viewpoint">Admire / Viewpoint</option>
                <option value="trek">Trek</option>
                <option value="eating">Eating place</option>
                <option value="food">Food</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </label>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setAddModal({ open: false, dayIndex: null })}
              className="rounded-app border-accent text-accent hover:bg-accent-soft"
            >
              Cancel
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleAddConfirm}
              disabled={customizing}
              className="btn-primary rounded-app"
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
