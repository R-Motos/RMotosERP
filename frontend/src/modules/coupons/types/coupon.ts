export type CuponTipo = 'porcentaje' | 'valor_fijo'

export type CuponEstado = 'activo' | 'inactivo'

export interface Cupon {
  id: number
  codigo: string
  tipo: CuponTipo
  valor: number
  fecha_inicio: string
  fecha_fin: string
  uso_maximo: number
  usos_realizados: number
  estado: CuponEstado
  created_at: string
  updated_at: string
}

export interface CuponFilter {
  estado?: CuponEstado
  q?: string
}

export interface CuponCreate {
  codigo: string
  tipo: CuponTipo
  valor: number
  fecha_inicio: string
  fecha_fin: string
  uso_maximo: number
  estado?: CuponEstado
}

export interface CuponUpdate {
  codigo?: string
  tipo?: CuponTipo
  valor?: number
  fecha_inicio?: string
  fecha_fin?: string
  uso_maximo?: number
  estado?: CuponEstado
}
