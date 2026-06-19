import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, IconButton, Menu, Portal } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import { getItineraries, deleteItinerary, updateItinerary } from '../api'
import Landing from './Landing'
import Modal from '../components/Modal'
import { CalendarIcon, MapPinIcon } from '../components/icons'
import { formatDateRange, formatDisplayDate } from '../utils/date'
import type { SavedItinerary } from '../types'

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<SavedItinerary | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function openEditModal(it: SavedItinerary) {
    setMenuOpenId(null)
    setEditModal(it)
    setEditValue(it.title || it.destination || 'Untitled Trip')
  }

  function closeEditModal() {
    setEditModal(null)
    setEditValue('')
  }

  function saveEditName() {
    if (!editModal) return
    const newTitle = editValue.trim()
    const current = editModal.title || editModal.destination || 'Untitled Trip'
    if (!newTitle || newTitle === current) {
      closeEditModal()
      return
    }
    const uuid = editModal.uuid
    setEditingId(uuid)
    updateItinerary(uuid, { title: newTitle })
      .then((updated) => {
        setItineraries((prev) => prev.map((x) => (x.uuid === uuid ? { ...x, title: updated.title } : x)))
        closeEditModal()
      })
      .catch(() => {})
      .finally(() => setEditingId(null))
  }

  function openDeleteModal(id: string) {
    setMenuOpenId(null)
    setDeleteModal(id)
  }

  function closeDeleteModal() {
    setDeleteModal(null)
  }

  function confirmDelete() {
    if (!deleteModal) return
    setDeleting(deleteModal)
    deleteItinerary(deleteModal)
      .then(() => {
        setItineraries((prev) => prev.filter((it) => it.uuid !== deleteModal))
        closeDeleteModal()
      })
      .catch(() => {})
      .finally(() => setDeleting(null))
  }

  useEffect(() => {
    if (!isAuthenticated) return
    getItineraries()
      .then((data) => setItineraries(Array.isArray(data) ? (data as SavedItinerary[]) : []))
      .catch(() => setItineraries([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Landing />
  }

  return (
    <div className="min-h-screen pb-12">
      <main className="relative mx-auto max-w-5xl px-6 py-4">
        <div className="animate-fade-in-up mb-8 text-center">
          <h1 className="m-0 mb-2 text-3xl font-bold text-app-text">My Trips</h1>
          <p className="m-0 text-text-soft">
            Hi, {user?.username}. Click a trip to view its itinerary.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-muted">Loading…</p>
        ) : itineraries.length === 0 ? (
          <div className="rounded-2xl border border-app-border bg-surface py-16 text-center shadow-app">
            <p className="m-0 text-muted">
              No trips yet.{' '}
              <Link to="/" className="font-semibold text-accent">Plan your first trip</Link>
            </p>
          </div>
        ) : (
          <div className="stagger-children grid grid-cols-1 gap-6 sm:grid-cols-2">
            {itineraries.map((it) => {
              const dayCount = it.plan?.length || 0

              return (
                <div
                  key={it.uuid}
                  className="group relative overflow-hidden rounded-2xl border border-app-border bg-surface shadow-app transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-app-xl"
                >
                  <Link
                    to={`/my-trips/${it.uuid}`}
                    className="block text-inherit no-underline"
                  >
                    <div className="trip-card-header-gradient px-6 py-8 pr-14 transition-colors duration-300 group-hover:opacity-95">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-icon-tile text-accent shadow-app transition-transform duration-300 group-hover:scale-110 group-hover:shadow-app-lg">
                        <MapPinIcon className="h-6 w-6" />
                      </div>
                      <h2 className="m-0 mb-1 text-xl font-bold text-app-text group-hover:text-accent">
                        {it.title || it.destination || 'Untitled Trip'}
                      </h2>
                      <p className="m-0 text-sm font-medium text-text-soft">
                        {it.destination || 'No destination'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 px-6 py-4 text-sm text-muted">
                        {it.start_date && (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarIcon className="h-4 w-4 text-accent" />
                            {formatDateRange(it.start_date, it.end_date)}
                          </span>
                        )}
                        {dayCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                            {dayCount} day{dayCount !== 1 ? 's' : ''}
                          </span>
                        )}
                        {it.created_at && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                            Created {formatDisplayDate(it.created_at)}
                          </span>
                        )}
                    </div>
                  </Link>

                  <div className="pointer-events-none absolute right-4 top-4 z-10">
                    <Menu.Root
                      open={menuOpenId === it.uuid}
                      onOpenChange={(e) => setMenuOpenId(e.open ? it.uuid : null)}
                    >
                      <Menu.Trigger asChild>
                        <IconButton
                          aria-label="Menu"
                          size="sm"
                          variant="ghost"
                          className="pointer-events-auto h-8 w-8 rounded-lg bg-surface text-muted shadow-app-sm hover:bg-surface-2 hover:text-app-text"
                        >
                          ⋮
                        </IconButton>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content
                            className="min-w-[120px] rounded-app border border-app-border bg-surface shadow-app-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Menu.Item
                              value="edit"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEditModal(it) }}
                              className="text-sm"
                              disabled={editingId === it.uuid}
                            >
                              {editingId === it.uuid ? 'Saving…' : 'Edit name'}
                            </Menu.Item>
                            <Menu.Item
                              value="delete"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteModal(it.uuid) }}
                              className="text-sm text-error"
                              disabled={deleting === it.uuid}
                            >
                              {deleting === it.uuid ? 'Deleting…' : 'Delete'}
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Modal isOpen={!!editModal} onClose={closeEditModal} title="Edit trip name">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && saveEditName()}
          autoFocus
          className="input-field mb-2"
        />
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={closeEditModal} className="rounded-app border-accent text-accent">
            Cancel
          </Button>
          <Button
            onClick={saveEditName}
            disabled={editingId === editModal?.uuid || !editValue.trim()}
            className="btn-primary rounded-app"
          >
            {editingId === editModal?.uuid ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={closeDeleteModal} title="Delete trip?">
        <p className="text-text-soft">This trip will be permanently deleted. This cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={closeDeleteModal} className="rounded-app border-accent text-accent">
            Cancel
          </Button>
          <Button colorPalette="red" onClick={confirmDelete} disabled={!!deleting} className="rounded-app">
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
