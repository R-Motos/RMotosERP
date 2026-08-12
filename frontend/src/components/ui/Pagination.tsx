import * as React from 'react'
import { cn } from '@/utils/classNames'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Pagination - Navegación de páginas.
 * 
 * @prop page - Página actual
 * @prop totalPages - Total de páginas
 * @prop onPageChange - Callback al cambiar página
 */
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = React.useMemo(() => {
    const delta = 1
    const range: (number | string)[] = []
    const rangeWithDots: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i)
      }
    }

    let prev = 0
    for (const i of range) {
      if (typeof i === 'number') {
        if (prev && i - prev > 1) {
          rangeWithDots.push('...')
        }
        rangeWithDots.push(i)
        prev = i
      }
    }

    return rangeWithDots
  }, [page, totalPages])

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      <Button
        variant="secondary"
        size="sm"
        icon={<ChevronLeft size={16} />}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
      />
      {pages.map((p, index) =>
        typeof p === 'number' ? (
          <Button
            key={index}
            variant={p === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(p)}
            aria-label={`Página ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        ) : (
          <span key={index} className="px-2 text-neutral-400">
            {p}
          </span>
        )
      )}
      <Button
        variant="secondary"
        size="sm"
        icon={<ChevronRight size={16} />}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
      />
    </nav>
  )
}
