import { useState, useCallback } from 'react'
import { auditService } from '../services/audit.service'
import type { AuditLog, AuditFilter } from '../types/audit'

interface UseAuditReturn {
  logs: AuditLog[]
  total: number
  page: number
  size: number
  isLoading: boolean
  error: string | null
  executeFetch: (filters: AuditFilter) => void
  reset: () => void
}

export function useAudit(): UseAuditReturn {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: AuditFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await auditService.list(filters)
      setLogs(data.items)
      setTotal(data.total)
      setPage(data.page)
      setSize(data.size)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar auditoría')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLogs([])
    setTotal(0)
    setPage(1)
    setSize(20)
    setError(null)
  }, [])

  return {
    logs,
    total,
    page,
    size,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}
