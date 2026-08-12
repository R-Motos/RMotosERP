import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from '@/components/layout/ToastContainer'
import { ModalProvider } from '@/components/layout/ModalContainer'
import { DrawerProvider } from '@/components/layout/DrawerContainer'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { CartProvider } from '@/app/providers/CartProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ModalProvider>
          <DrawerProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </DrawerProvider>
        </ModalProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
