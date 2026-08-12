import { useState, useCallback } from 'react'
import { settingsService } from '../services/settings.service'
import { useToast } from '@/components/layout/ToastContainer'

interface UseRestoreReturn {
  isRestoring: boolean
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
  restore: () => Promise<void>
}

export function useRestore(): UseRestoreReturn {
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { addToast } = useToast()

  const restore = useCallback(async () => {
    if (!selectedFile) return
    setIsRestoring(true)
    try {
      const result = await settingsService.restore(selectedFile)
      addToast({ type: 'success', message: result.message })
      setSelectedFile(null)
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Error al restaurar la base de datos' })
    } finally {
      setIsRestoring(false)
    }
  }, [selectedFile, addToast])

  return {
    isRestoring,
    selectedFile,
    setSelectedFile,
    restore,
  }
}
