import { useState, useCallback, useRef } from 'react'
import { ApiError, getErrorMessage } from '@/utils/errors'

export interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: ApiError) => void
  immediate?: boolean
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & {
  execute: () => Promise<T | null>
  reset: () => void
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: options.immediate ?? false,
    error: null,
  })

  const optionsRef = useRef(options)
  optionsRef.current = options

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await fetcher()
      setState({ data, isLoading: false, error: null })
      optionsRef.current.onSuccess?.(data)
      return data
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Error desconocido', 500)
      const message = getErrorMessage(apiError)
      setState(prev => ({ ...prev, isLoading: false, error: message }))
      optionsRef.current.onError?.(apiError)
      return null
    }
  }, [fetcher])

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return { ...state, execute, reset }
}

export function useMutation<TData, TVariables>(
  mutator: (variables: TVariables) => Promise<TData>,
  options: UseApiOptions = {}
): {
  data: TData | null
  isLoading: boolean
  error: string | null
  mutate: (variables: TVariables) => Promise<TData | null>
  reset: () => void
} {
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const optionsRef = useRef(options)
  optionsRef.current = options

  const mutate = useCallback(async (variables: TVariables) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutator(variables)
      setData(result)
      optionsRef.current.onSuccess?.(result)
      return result
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Error desconocido', 500)
      const message = getErrorMessage(apiError)
      setError(message)
      optionsRef.current.onError?.(apiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [mutator])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { data, isLoading, error, mutate, reset }
}
