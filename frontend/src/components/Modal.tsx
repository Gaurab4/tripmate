import type { ReactNode } from 'react'
import { Dialog, Portal } from '@chakra-ui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop className="animate-fade-in bg-slate-900/40 backdrop-blur-sm" />
        <Dialog.Positioner className="flex items-center justify-center p-4">
          <Dialog.Content className="animate-scale-in w-full max-w-[420px] rounded-app-lg border border-app-border bg-surface shadow-app-xl">
            {title && (
              <Dialog.Header className="flex items-center justify-between border-b border-app-border px-5 py-4">
                <Dialog.Title className="text-lg font-semibold text-app-text">{title}</Dialog.Title>
                <Dialog.CloseTrigger className="rounded-app p-1 text-muted hover:bg-surface-2 hover:text-app-text">
                  ×
                </Dialog.CloseTrigger>
              </Dialog.Header>
            )}
            <Dialog.Body className="p-5">{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
