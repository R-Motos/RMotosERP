import { useState, useCallback } from 'react'
import { settingsService } from '../services/settings.service'
import { useToast } from '@/components/layout/ToastContainer'

interface UseBackupReturn {
  isBackingUp: boolean
  createBackup: () => Promise<void>
}

export function useBackup(): UseBackupReturn {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const { addToast } = useToast()

  const createBackup = useCallback(async () => {
    setIsBackingUp(true)
    try {
      const result = await settingsService.backup()
      addToast({ type: 'success', message: `Backup creado: ${result.backup_path}` })
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Error al crear backup' })
    } finally {
      setIsBackingUp(false)
    }
  }, [addToast])

  return {
    isBackingUp,
    createBackup,
  }
}
