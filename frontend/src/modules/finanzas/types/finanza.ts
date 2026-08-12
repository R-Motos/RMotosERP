export interface MovimientoFinanciero {
  id: number
  tipo: 'ingreso' | 'egreso'
  concepto: string
  descripcion: string | null
  monto: number
  fecha: string
  origen: 'venta' | 'compra' | 'manual'
  referencia_id: number | null
  usuario_id: number
  created_at: string
  updated_at: string
}

export interface MovimientoFinancieroCreate {
  tipo: 'ingreso' | 'egreso'
  concepto: string
  descripcion?: string
  monto: number
  fecha: string
  origen?: 'venta' | 'compra' | 'manual'
  referencia_id?: number
  usuario_id: number
}

export interface MovimientoFinancieroUpdate {
  tipo?: 'ingreso' | 'egreso'
  concepto?: string
  descripcion?: string
  monto?: number
  fecha?: string
  origen?: 'venta' | 'compra' | 'manual'
  referencia_id?: number
}

export interface FinanzasListResponse {
  items: MovimientoFinanciero[]
  total: number
  page: number
  size: number
}

export interface BalanceData {
  total_ingresos: number
  total_egresos: number
  balance: number
}

export interface IngresosPorOrigen {
  venta: number
  manual: number
  total: number
}

export interface EgresosPorOrigen {
  compra: number
  manual: number
  total: number
}

export interface FinanzasStats {
  balance: BalanceData
  ingresos_por_origen: IngresosPorOrigen
  egresos_por_origen: EgresosPorOrigen
}