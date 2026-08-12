import { httpClient } from './httpClient'

export const api = {
  get: <T>(endpoint: string) => httpClient.get<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) => httpClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: unknown) => httpClient.put<T>(endpoint, data),
  delete: <T>(endpoint: string) => httpClient.delete<T>(endpoint),
}