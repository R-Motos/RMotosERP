export interface SystemConfig {
  id: number
  nombre_negocio: string
  nit: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  logo: string | null
  moneda: string
  simbolo_moneda: string
  created_at: string
  updated_at: string
}

export interface SystemConfigUpdate {
  nombre_negocio?: string | null
  nit?: string | null
  telefono?: string | null
  email?: string | null
  direccion?: string | null
  ciudad?: string | null
  logo?: string | null
  moneda?: string | null
  simbolo_moneda?: string | null
}

export interface BackupResponse {
  backup_path: string
}

export interface RestoreResponse {
  message: string
}
