import { Package } from 'lucide-react'
import { cn } from '@/utils/classNames'

interface ProductImageProps {
  src: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

export function ProductImage({ src, name, size = 'md' }: ProductImageProps) {
  return (
    <div className={cn(sizeMap[size], 'rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0')}>
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ) : (
        <Package size={size === 'lg' ? 24 : 16} className="text-neutral-400" />
      )}
    </div>
  )
}
