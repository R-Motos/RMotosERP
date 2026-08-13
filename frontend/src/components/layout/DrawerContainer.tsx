import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '@/utils/classNames'

interface DrawerContextValue {
  isOpen: boolean
  content: ReactNode | null
  openDrawer: (content: ReactNode) => void
  closeDrawer: () => void
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode | null>(null)

  const openDrawer = useCallback((newContent: ReactNode) => {
    setContent(newContent)
    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsOpen(false)
    setContent(null)
  }, [])

  return (
    <DrawerContext.Provider value={{ isOpen, content, openDrawer, closeDrawer }}>
      {children}
      <DrawerContainer isOpen={isOpen} onClose={closeDrawer}>
        {content}
      </DrawerContainer>
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider')
  }
  return context
}

interface DrawerContainerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  position?: 'left' | 'right'
}

export function DrawerContainer({ isOpen, onClose, children, position = 'right' }: DrawerContainerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-modal">
      <div className="absolute inset-0 bg-overlay/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'absolute top-0 bottom-0 bg-white shadow-xl w-[85vw] max-w-sm flex flex-col z-[60]',
          position === 'right' ? 'right-0 rounded-l-2xl' : 'left-0 rounded-r-2xl'
        )}
      >
        {children}
      </div>
    </div>
  )
}
