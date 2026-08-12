import { Table } from '@/components/ui/Table'
import type { MovimientoFinanciero } from '../types/finanza'

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface FinanzasTableProps {
  data: MovimientoFinanciero[]
}

export function FinanzasTable({ data }: FinanzasTableProps) {
  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (item: MovimientoFinanciero) => new Date(item.fecha).toLocaleDateString('es-ES'),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (item: MovimientoFinanciero) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${item.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
        </span>
      ),
    },
    { key: 'concepto', header: 'Concepto' },
    {
      key: 'monto',
      header: 'Monto',
      render: (item: MovimientoFinanciero) => formatCOP(item.monto),
    },
    { key: 'origen', header: 'Origen' },
  ]

  return (
    <Table<MovimientoFinanciero>
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="Sin movimientos financieros"
    />
  )
}