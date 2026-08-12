import { useState, useCallback } from 'react'
import { tagService } from '../services/tag.service'
import type { Etiqueta, EtiquetaFilter, EtiquetaCreate, EtiquetaUpdate } from '../types/tag'

interface UseTagsReturn {
  tags: Etiqueta[]
  isLoading: boolean
  error: string | null
  executeFetch: (filters: EtiquetaFilter) => Promise<void>
  reset: () => void
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Etiqueta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const executeFetch = useCallback(async (_filters?: EtiquetaFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await tagService.list()
      setTags(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar etiquetas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setTags([])
    setError(null)
  }, [])

  return {
    tags,
    isLoading,
    error,
    executeFetch,
    reset,
  }
}

interface UseTagFormReturn {
  isOpen: boolean
  editingTag: Etiqueta | null
  isLoading: boolean
  openCreate: () => void
  openEdit: (tag: Etiqueta) => void
  close: () => void
  submit: (data: EtiquetaCreate | EtiquetaUpdate) => Promise<Etiqueta>
}

export function useTagForm(onSuccess: () => void): UseTagFormReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Etiqueta | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = useCallback(() => {
    setEditingTag(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((tag: Etiqueta) => {
    setEditingTag(tag)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEditingTag(null)
  }, [])

  const submit = useCallback(async (data: EtiquetaCreate | EtiquetaUpdate) => {
    setIsLoading(true)
    try {
      let tag: Etiqueta
      if (editingTag) {
        tag = await tagService.update(editingTag.id, data as EtiquetaUpdate)
      } else {
        tag = await tagService.create(data as EtiquetaCreate)
      }
      onSuccess()
      close()
      return tag
    } finally {
      setIsLoading(false)
    }
  }, [editingTag, onSuccess, close])

  return {
    isOpen,
    editingTag,
    isLoading,
    openCreate,
    openEdit,
    close,
    submit,
  }
}
