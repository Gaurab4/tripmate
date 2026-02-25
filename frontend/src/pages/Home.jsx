import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '../context/AuthContext'
import { getItineraries, deleteItinerary, updateItinerary } from '../api'
import Landing from './Landing'
import Modal from '../components/Modal'
import TextField from '@mui/material/TextField'

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editValue, setEditValue] = useState('')

  function openEditModal(it) {
    setMenuAnchor(null)
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
    setEditingId(editModal.uuid)
    updateItinerary(editModal.uuid, { title: newTitle })
      .then((updated) => {
        setItineraries((prev) => prev.map((x) => (x.uuid === editModal.uuid ? { ...x, title: updated.title } : x)))
        closeEditModal()
      })
      .catch(() => {})
      .finally(() => setEditingId(null))
  }

  function openDeleteModal(id) {
    setMenuAnchor(null)
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
      .then(setItineraries)
      .catch(() => setItineraries([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Landing />
  }

  return (
    <Box className="min-h-screen bg-[var(--bg)]">
      <Box component="main" className="max-w-[56rem] mx-auto py-8 px-6">
        <Typography variant="h5" component="h1" className="text-2xl font-semibold mb-6 text-center text-app-text" sx={{ color: 'var(--text)' }}>My Trips</Typography>
        <Typography className="text-text-soft mb-6" sx={{ color: 'var(--text-soft)' }}>
          Hi, {user?.username}. Click a trip to view its itinerary.
        </Typography>

        {loading ? (
          <Typography className="text-center text-muted py-8 text-[0.95rem]" sx={{ color: 'var(--muted)' }}>Loading…</Typography>
        ) : itineraries.length === 0 ? (
          <Typography className="text-center text-muted py-8 text-[0.95rem]" sx={{ color: 'var(--muted)' }}>
            No trips yet. <Link to="/" className="text-accent font-medium" style={{ color: 'var(--accent)' }}>Plan your first trip</Link>
          </Typography>
        ) : (
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.map((it) => (
              <Box key={it.uuid} className="relative">
                <Card
                  component={Link}
                  to={`/my-trips/${it.uuid}`}
                  className="block pt-10 pb-5 px-5 rounded-app border border-app-border bg-surface no-underline text-inherit transition-[border-color,box-shadow] hover:border-accent hover:shadow-app"
                  sx={{ borderColor: 'var(--border)', bgcolor: 'var(--surface)' }}
                >
                  <CardActionArea component="span" className="block">
                    <CardContent className="p-0">
                      <Typography variant="subtitle1" className="text-[1.1rem] font-semibold text-app-text m-0 mb-1" sx={{ color: 'var(--text)' }}>
                        {it.title || it.destination || 'Untitled Trip'}
                      </Typography>
                      <Typography variant="body2" className="text-sm text-text-soft m-0" sx={{ color: 'var(--text-soft)' }}>
                        {it.destination || 'No destination'}
                      </Typography>
                      {it.start_date && (
                        <Typography variant="caption" className="block mt-2 text-[0.85rem] text-muted" sx={{ color: 'var(--muted)' }}>
                          {it.start_date} – {it.end_date || '—'}
                        </Typography>
                      )}
                      {it.plan?.length > 0 && (
                        <span className="absolute top-4 right-4 text-xs py-1 px-2 bg-accent-soft text-accent rounded-md" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                          {it.plan.length} day{it.plan.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Box className="absolute top-3 right-3 z-[2]">
                  <IconButton
                    size="small"
                    className="w-8 h-8 bg-surface-2 text-muted rounded-md text-xl hover:bg-app-border hover:text-app-text"
                    sx={{ bgcolor: 'var(--surface-2)', color: 'var(--muted)' }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMenuAnchor(menuAnchor === it.uuid ? null : { el: e.currentTarget, uuid: it.uuid })
                    }}
                    aria-label="Menu"
                  >
                    ⋮
                  </IconButton>
                  <Menu
                    open={Boolean(menuAnchor && menuAnchor.uuid === it.uuid)}
                    anchorEl={menuAnchor?.el}
                    onClose={() => setMenuAnchor(null)}
                    slotProps={{ paper: { className: 'min-w-[120px]', sx: { bgcolor: 'var(--surface)', border: '1px solid var(--border)' } } }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEditModal(it) }} disabled={editingId === it.uuid}>
                      {editingId === it.uuid ? 'Saving…' : 'Edit name'}
                    </MenuItem>
                    <MenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteModal(it.uuid) }} disabled={deleting === it.uuid} sx={{ color: 'var(--error)' }}>
                      {deleting === it.uuid ? 'Deleting…' : 'Delete'}
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Modal isOpen={!!editModal} onClose={closeEditModal} title="Edit trip name">
        <TextField fullWidth label="Trip name" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEditName()} autoFocus variant="outlined" size="small" className="mb-2" sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--surface-2)' } }} />
        <Box className="flex gap-3 justify-end mt-5">
          <Button variant="outlined" color="primary" onClick={closeEditModal} className="border-accent text-accent" sx={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Cancel</Button>
          <Button variant="contained" onClick={saveEditName} disabled={editingId === editModal?.uuid || !editValue.trim()} className="bg-accent hover:bg-accent-hover" sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}>
            {editingId === editModal?.uuid ? 'Saving…' : 'Save'}
          </Button>
        </Box>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={closeDeleteModal} title="Delete trip?">
        <Typography color="text.secondary">This trip will be permanently deleted. This cannot be undone.</Typography>
        <Box className="flex gap-3 justify-end mt-5">
          <Button variant="outlined" color="primary" onClick={closeDeleteModal} className="border-accent text-accent" sx={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={!!deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
        </Box>
      </Modal>
    </Box>
  )
}
