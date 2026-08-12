import { useAuth } from '@/app/providers/AuthProvider'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { Menu, LogOut } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-sticky">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} className="text-neutral-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg text-neutral-900 hidden sm:block">
              RMotos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {user && (
            <Dropdown
              align="right"
              trigger={
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors">
                  <Avatar name={user.nombre} size="sm" />
                  <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                    {user.nombre}
                  </span>
                </button>
              }
              items={[
                {
                  key: 'logout',
                  label: 'Cerrar sesión',
                  icon: <LogOut size={16} />,
                  onClick: logout,
                },
              ]}
            />
          )}
        </div>
      </div>
    </header>
  )
}
