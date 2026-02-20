import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getItineraries, deleteItinerary, updateItinerary } from '../api'
import Landing from './Landing'
import Modal from '../components/Modal'

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editValue, setEditValue] = useState('')

  function openEditModal(it) {
    setMenuOpen(null)
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
    setEditingId(editModal.id)
    updateItinerary(editModal.id, { title: newTitle })
      .then((updated) => {
        setItineraries((prev) => prev.map((x) => (x.id === editModal.id ? { ...x, title: updated.title } : x)))
        closeEditModal()
      })
      .catch(() => {})
      .finally(() => setEditingId(null))
  }

  function openDeleteModal(id) {
    setMenuOpen(null)
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
        setItineraries((prev) => prev.filter((it) => it.id !== deleteModal))
        closeDeleteModal()
      })
      .catch(() => {})
      .finally(() => setDeleting(null))
  }

  function closeMenus() {
    setMenuOpen(null)
  }

  useEffect(() => {
    const fn = () => closeMenus()
    window.addEventListener('click', fn)
    return () => window.removeEventListener('click', fn)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    getItineraries()
      .then(setItineraries)
      .catch(() => setItineraries([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Landing />
  }

  return (
    <div className="page-container">
      <main className="page-main">
        <h1 className="page-title">My Trips</h1>
        <p className="mb-8" style={{ color: 'var(--text-soft)' }}>
          Hi, {user?.username}. Click a trip to view its itinerary.
        </p>

        {loading ? (
          <p className="empty">Loading…</p>
        ) : itineraries.length === 0 ? (
          <p className="empty">
            No trips yet.{' '}
            <Link to="/">Plan your first trip</Link>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((it) => (
              <div key={it.id} className="trip-card-wrapper">
                <Link to={`/my-trips/${it.id}`} className="trip-card">
                  <h3 className="trip-card-title">{it.title || it.destination || 'Untitled Trip'}</h3>
                  <p className="trip-card-destination">{it.destination || 'No destination'}</p>
                  {it.start_date && (
                    <p className="trip-card-dates">
                      {it.start_date} – {it.end_date || '—'}
                    </p>
                  )}
                  {it.plan?.length > 0 && (
                    <span className="trip-card-badge">
                      {it.plan.length} day{it.plan.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </Link>
                <div className="trip-card-actions">
                  <button
                    type="button"
                    className="trip-card-menu-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMenuOpen((prev) => (prev === it.id ? null : it.id))
                    }}
                    aria-label="Menu"
                  >
                    ⋮
                  </button>
                  {menuOpen === it.id && (
                    <div
                      className="trip-card-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="trip-card-dropdown-item"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openEditModal(it)
                        }}
                        disabled={editingId === it.id}
                      >
                        {editingId === it.id ? 'Saving…' : 'Edit name'}
                      </button>
                      <button
                        type="button"
                        className="trip-card-dropdown-item trip-card-dropdown-delete"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openDeleteModal(it.id)
                        }}
                        disabled={deleting === it.id}
                      >
                        {deleting === it.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
          placeholder="Trip name"
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={saveEditName}
            disabled={editingId === editModal?.id || !editValue.trim()}
          >
            {editingId === editModal?.id ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={closeDeleteModal} title="Delete trip?">
        <p style={{ color: 'var(--text-soft)' }}>This trip will be permanently deleted. This cannot be undone.</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={confirmDelete}
            disabled={!!deleting}
            style={{ background: 'var(--error)' }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
