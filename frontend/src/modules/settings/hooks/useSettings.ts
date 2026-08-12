import { useState, useCallback, useEffect } from 'react'
import { settingsService } from '../services/settings.service'
import type { SystemConfig, SystemConfigUpdate } from '../types/settings'

interface UseSettingsReturn {
  config: SystemConfig | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  updateConfig: (data: SystemConfigUpdate) => Promise<void>
}

export function useSettings(): UseSettingsReturn {
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await settingsService.get()
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la configuración')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateConfig = useCallback(async (data: SystemConfigUpdate) => {
    const updated = await settingsService.update(data)
    setConfig(updated)
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
    updateConfig,
  }
}
