import { useState, useCallback } from 'react'
import { userService } from '../services/user.service'
import type { User, UserFilter, UserCreate, UserUpdate } from '../types/user'

interface UseUsersReturn {
  users: User[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: UserFilter) => Promise<void>
  reset: () => void
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (filters: UserFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await userService.list(filters)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setUsers([])
    setError(null)
  }, [])

  return {
    users,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}

interface UseUserFormReturn {
  isOpen: boolean
  editingUser: User | null
  isLoading: boolean
  readOnly: boolean
  openCreate: () => void
  openEdit: (user: User) => void
  openView: (user: User) => void
  close: () => void
  submit: (data: UserCreate | UserUpdate) => Promise<void>
  changeState: (id: number, estado: 'activo' | 'inactivo') => Promise<void>
}

export function useUserForm(onSuccess: () => void): UseUserFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingUser(null)
    setReadOnly(false)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((user: User) => {
    setEditingUser(user)
    setReadOnly(false)
    setIsOpen(true)
  }, [])

  const openView = useCallback((user: User) => {
    setEditingUser(user)
    setReadOnly(true)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingUser(null)
    setReadOnly(false)
  }, [])

  const submit = useCallback(async (data: UserCreate | UserUpdate) => {
    setIsLoading(true)
    try {
      if (editingUser) {
        await userService.update(editingUser.id, data as UserUpdate)
      } else {
        await userService.create(data as UserCreate)
      }
      close()
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [editingUser, close, onSuccess])

  const changeState = useCallback(async (id: number, estado: 'activo' | 'inactivo') => {
    setIsLoading(true)
    try {
      await userService.changeState(id, estado)
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  return {
    isOpen,
    editingUser,
    isLoading,
    readOnly,
    openCreate,
    openEdit,
    openView,
    close,
    submit,
    changeState,
  }
}
