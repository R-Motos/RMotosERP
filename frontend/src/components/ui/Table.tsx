import * as React from 'react'
import { cn } from '@/utils/classNames'

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
  stickyFirstColumn?: boolean
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Sin datos',
  className,
  stickyFirstColumn = true,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                {columns.map((column, idx) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-neutral-700 bg-neutral-50 whitespace-nowrap',
                      stickyFirstColumn && idx === 0 && 'sticky left-0 z-30 bg-neutral-50',
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
                  {columns.map((column, idx) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-3 py-2.5 sm:px-4 sm:py-3 text-neutral-900 whitespace-nowrap',
                        stickyFirstColumn && idx === 0 && 'sticky left-0 z-10 bg-white',
                        column.className
                      )}
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
      </div>
    </div>
  )
}
