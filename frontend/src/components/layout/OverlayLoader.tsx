import { useState, useEffect } from 'react'
import { Loader } from '@/components/ui/Loader'

export function OverlayLoader() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleShow = () => setIsVisible(true)
    const handleHide = () => setIsVisible(false)

    window.addEventListener('loader:show', handleShow)
    window.addEventListener('loader:hide', handleHide)
    return () => {
      window.removeEventListener('loader:show', handleShow)
      window.removeEventListener('loader:hide', handleHide)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-overlay/40 backdrop-blur-sm z-loader flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center gap-3">
        <Loader size="lg" />
        <p className="text-sm text-neutral-600 font-medium">Cargando...</p>
      </div>
    </div>
  )
}
