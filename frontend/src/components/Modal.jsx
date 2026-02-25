import MuiDialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <MuiDialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        className: 'rounded-app-lg shadow-app-lg border border-app-border max-w-[420px] w-full',
        sx: { bgcolor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' },
      }}
    >
      {title && (
        <DialogTitle
          id="modal-title"
          className="text-lg font-semibold py-4 px-5 border-b border-app-border flex items-center justify-between"
          sx={{ borderColor: 'var(--border)' }}
        >
          {title}
          <IconButton aria-label="Close" onClick={onClose} className="text-muted" size="small" sx={{ color: 'var(--muted)' }}>
            ×
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent className="p-5">{children}</DialogContent>
    </MuiDialog>
  )
}
