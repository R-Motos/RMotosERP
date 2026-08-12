export class ApiError extends Error {
  public status: number
  public code?: string
  public details?: Record<string, unknown>
  public isNetworkError: boolean

  constructor(message: string, status: number, code?: string, details?: Record<string, unknown>) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
    this.isNetworkError = status === 0 || status === 503
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new ApiError('Error de conexión', 0, 'NETWORK_ERROR')
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'UNKNOWN_ERROR')
  }

  return new ApiError('Error desconocido', 500, 'UNKNOWN_ERROR')
}

export function getErrorMessage(error: unknown): string {
  const normalized = normalizeError(error)

  if (normalized.isNetworkError) {
    return 'No se pudo conectar con el servidor. Verifique su conexión.'
  }

  if (normalized.status === 401) {
    return 'Sesión expirada. Por favor, inicie sesión nuevamente.'
  }

  if (normalized.status === 403) {
    return 'No tiene permisos para realizar esta acción.'
  }

  if (normalized.status === 404) {
    return 'El recurso solicitado no existe.'
  }

  if (normalized.status === 500) {
    return 'Error interno del servidor. Intente nuevamente.'
  }

  return normalized.message || 'Ha ocurrido un error inesperado.'
}
