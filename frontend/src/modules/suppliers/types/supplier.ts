export type ProveedorEstado = 'activo' | 'inactivo'

export interface Proveedor {
  id: number
  nombre: string
  nit: string | null
  contacto: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  ciudad: string | null
  observaciones: string | null
  estado: ProveedorEstado
  created_at: string
  updated_at: string
}

export interface ProveedorFilter {
  estado?: ProveedorEstado
  q?: string
}

export interface ProveedorCreate {
  nombre: string
  nit?: string | null
  contacto?: string | null
  telefono?: string | null
  email?: string | null
  direccion?: string | null
  ciudad?: string | null
  observaciones?: string | null
  estado?: ProveedorEstado
}

export interface ProveedorUpdate {
  nombre?: string
  nit?: string | null
  contacto?: string | null
  telefono?: string | null
  email?: string | null
  direccion?: string | null
  ciudad?: string | null
  observaciones?: string | null
  estado?: ProveedorEstado
}
