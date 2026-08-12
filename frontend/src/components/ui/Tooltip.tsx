import * as React from 'react'
import { cn } from '@/utils/classNames'

/**
 * Tooltip - Información contextual al hover.
 * 
 * @prop content - Texto del tooltip
 * @prop children - Elemento trigger
 * @prop side - top | bottom | left | right
 */
interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-tooltip px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap pointer-events-none',
            sideClasses[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
