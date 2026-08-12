import { useState, useCallback } from 'react'
import { clientService } from '../services/client.service'
import type { Cliente, ClienteFilter } from '../types/client'

interface UseClientsReturn {
  clients: Cliente[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: ClienteFilter) => Promise<void>
  reset: () => void
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: ClienteFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await clientService.list(filters)
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setClients([])
    setError(null)
  }, [])

  return {
    clients,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}
