import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ModalContextValue {
  isOpen: boolean
  content: ReactNode | null
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode | null>(null)

  const openModal = useCallback((newContent: ReactNode) => {
    setContent(newContent)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setContent(null)
  }, [])

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
      <ModalContainer isOpen={isOpen} onClose={closeModal}>
        {content}
      </ModalContainer>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}

interface ModalContainerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function ModalContainer({ isOpen, onClose, children }: ModalContainerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
