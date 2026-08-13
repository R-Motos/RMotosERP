import { ApiError, normalizeError } from '@/utils/errors'
import { authStorage } from '@/services/auth.service'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const DEFAULT_TIMEOUT = 15000

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: Response) => Response | Promise<Response>
type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>

interface RequestConfig {
  url: string
  options: RequestInit
  signal?: AbortSignal
}

class HttpClient {
  private baseURL: string
  private timeout: number
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []
  private accessToken: string | null = null

  constructor(baseURL: string, timeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  setAccessToken(accessToken: string | null) {
    this.accessToken = accessToken
  }

  getAccessToken() {
    return this.accessToken
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor)
  }

  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config)
    }
    return config
  }

  private async executeResponseInterceptors(response: Response): Promise<Response> {
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response)
    }
    return response
  }

  private async executeErrorInterceptors(error: ApiError): Promise<ApiError> {
    for (const interceptor of this.errorInterceptors) {
      error = await interceptor(error)
    }
    return error
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, signal?: AbortSignal): Promise<T> {
    const isFormData = options.body instanceof FormData
    let config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      options: {
        ...options,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      },
      signal,
    }

    config = await this.executeRequestInterceptors(config)

    const controller = signal ? undefined : new AbortController()
    const requestSignal = signal || controller?.signal

    const timeoutId = setTimeout(() => {
      controller?.abort()
    }, this.timeout)

    try {
      const response = await fetch(config.url, {
        ...config.options,
        signal: requestSignal,
      })

      const processedResponse = await this.executeResponseInterceptors(response)

      if (!processedResponse.ok) {
        let errorData: { message?: string; code?: string; details?: Record<string, unknown> } = {}
        try {
          errorData = await processedResponse.json()
        } catch {
          // ignore JSON parse error
        }

        const apiError = new ApiError(
          errorData.message || `HTTP ${processedResponse.status}`,
          processedResponse.status,
          errorData.code,
          errorData.details
        )

        const finalError = await this.executeErrorInterceptors(apiError)
        throw finalError
      }

      if (processedResponse.status === 204) {
        return undefined as T
      }

      const data = await processedResponse.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        const finalError = await this.executeErrorInterceptors(error)
        throw finalError
      }

      if (error instanceof TypeError) {
        const apiError = new ApiError('Error de red', 0, 'NETWORK_ERROR')
        const finalError = await this.executeErrorInterceptors(apiError)
        throw finalError
      }

      const apiError = normalizeError(error)
      const finalError = await this.executeErrorInterceptors(apiError)
      throw finalError
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, signal)
  }

  async post<T>(endpoint: string, data?: unknown, optionsOrSignal?: RequestInit | AbortSignal): Promise<T> {
    const isFormData = data instanceof FormData
    const options: RequestInit = {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...(typeof optionsOrSignal === 'undefined' || optionsOrSignal instanceof AbortSignal
        ? { signal: optionsOrSignal }
        : optionsOrSignal),
    }
    return this.request<T>(endpoint, options)
  }

  async put<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, signal)
  }

  async patch<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, signal)
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, signal)
  }
}

export const httpClient = new HttpClient(API_BASE_URL)

httpClient.addRequestInterceptor(async config => {
  const token = httpClient.getAccessToken()
  if (token) {
    config.options.headers = {
      ...config.options.headers,
      'Authorization': `Bearer ${token}`,
    }
  }
  return config
})

httpClient.addResponseInterceptor(response => {
  return response
})

httpClient.addErrorInterceptor(async error => {
  if (error.status === 401) {
    authStorage.clear()
  }
  return error
})
