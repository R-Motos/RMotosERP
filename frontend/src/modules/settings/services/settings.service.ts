import { httpClient } from '@/services/httpClient'
import type { SystemConfig, SystemConfigUpdate, BackupResponse, RestoreResponse } from '../types/settings'

export const settingsService = {
  async get(): Promise<SystemConfig> {
    return httpClient.get<SystemConfig>('/configuracion')
  },

  async update(data: SystemConfigUpdate): Promise<SystemConfig> {
    return httpClient.put<SystemConfig>('/configuracion', data)
  },

  async backup(): Promise<BackupResponse> {
    return httpClient.post<BackupResponse>('/configuracion/backup')
  },

  async restore(file: File): Promise<RestoreResponse> {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.post<RestoreResponse>('/configuracion/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
