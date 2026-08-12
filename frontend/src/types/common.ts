export type Size = 'sm' | 'md' | 'lg'
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  testId?: string
}

export interface LoadingState {
  loading?: boolean
  disabled?: boolean
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
