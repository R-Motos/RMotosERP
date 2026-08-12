import { useState, useCallback } from 'react'
import { clientService } from '../services/client.service'
import type { Cliente, ClienteCreate, ClienteUpdate } from '../types/client'

interface UseClientFormReturn {
  isOpen: boolean
  editingClient: Cliente | null
  isLoading: boolean
  openCreate: () => void
  openEdit: (client: Cliente) => void
  close: () => void
  submit: (data: ClienteCreate | ClienteUpdate) => Promise<void>
  changeState: (id: number, estado: Cliente['estado']) => Promise<void>
}

export function useClientForm(onSuccess: () => void): UseClientFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingClient(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((client: Cliente) => {
    setEditingClient(client)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingClient(null)
  }, [])

  const submit = useCallback(async (data: ClienteCreate | ClienteUpdate) => {
    setIsLoading(true)
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, data as ClienteUpdate)
      } else {
        await clientService.create(data as ClienteCreate)
      }
      close()
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [editingClient, close, onSuccess])

  const changeState = useCallback(async (id: number, estado: Cliente['estado']) => {
    setIsLoading(true)
    try {
      await clientService.changeState(id, estado)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  return {
    isOpen,
    editingClient,
    isLoading,
    openCreate,
    openEdit,
    close,
    submit,
    changeState,
  }
}
