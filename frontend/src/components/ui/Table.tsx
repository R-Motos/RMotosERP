import * as React from 'react'
import { cn } from '@/utils/classNames'

/**
 * Table - Mostrar datos tabulares.
 * 
 * @prop data - Array de datos
 * @prop columns - Definición de columnas
 * @prop keyExtractor - Función para key único
 * @prop emptyMessage - Mensaje cuando no hay datos
 */
interface TableProps<T> {
  data: T[]
  columns: {
    key: string
    header: string
    render?: (item: T) => React.ReactNode
    className?: string
  }[]
  keyExtractor: (item: T, index: number) => string | number
  emptyMessage?: string
  className?: string
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Sin datos',
  className,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            {columns.map(column => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 font-semibold text-neutral-700 bg-neutral-50',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className={cn('px-4 py-3 text-neutral-900', column.className)}
                >
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
