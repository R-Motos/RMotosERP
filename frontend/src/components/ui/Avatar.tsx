import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/classNames'

/**
 * Avatar - Representación visual de usuario.
 * 
 * @prop size - sm | md | lg | xl
 * @prop name - Nombre para generar iniciales
 * @prop src - URL de imagen
 * @prop alt - Texto alternativo
 */
const avatarVariants = cva(
  'rounded-full object-cover flex items-center justify-center font-medium text-white bg-primary-600',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  name?: string
  src?: string
  alt?: string
}

export function Avatar({ className, size, name, src, alt, ...props }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      />
    )
  }

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {initials || '?'}
    </div>
  )
}
