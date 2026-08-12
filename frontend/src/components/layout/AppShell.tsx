import { ReactNode, useState, useEffect } from 'react'
import { cn } from '@/utils/classNames'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { OverlayLoader } from './OverlayLoader'

const SIDEBAR_COLLAPSED_KEY = 'rmotos_sidebar_collapsed'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  })

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed))
  }, [sidebarCollapsed])

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(prev => !prev)}
        />
        <main className={cn(
          "flex-1 pt-16 transition-all duration-normal",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}>
          {children}
        </main>
      </div>
      <OverlayLoader />
    </div>
  )
}
