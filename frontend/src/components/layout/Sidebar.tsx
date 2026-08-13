import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Warehouse, FileText, CreditCard, FolderOpen, Tag, Ticket, User, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/utils/classNames'
import { useAuth } from '@/app/providers/AuthProvider'
import { DrawerContainer } from './DrawerContainer'
import { Tooltip } from '@/components/ui/Tooltip'
import type { NavItem } from '@/types/navigation'

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', modulo: 'dashboard' },
  { label: 'POS', href: '/pos', icon: 'CreditCard', modulo: 'pos' },
  { label: 'Productos', href: '/productos', icon: 'Package', modulo: 'productos' },
  { label: 'Categorías', href: '/categorias', icon: 'FolderOpen', modulo: 'categorias' },
  { label: 'Marcas', href: '/marcas', icon: 'Tag', modulo: 'marcas' },
  { label: 'Etiquetas', href: '/etiquetas', icon: 'Tag', modulo: 'etiquetas' },
  { label: 'Cupones', href: '/cupones', icon: 'Ticket', modulo: 'cupones' },
  { label: 'Usuarios', href: '/usuarios', icon: 'User', modulo: 'usuarios' },
  { label: 'Inventario', href: '/inventario', icon: 'Warehouse', modulo: 'movimientos' },
  { label: 'Ventas', href: '/ventas', icon: 'ShoppingCart', modulo: 'ventas' },
  { label: 'Clientes', href: '/clientes', icon: 'Users', modulo: 'clientes' },
  { label: 'Proveedores', href: '/proveedores', icon: 'Users', modulo: 'proveedores' },
  { label: 'Órdenes', href: '/ordenes-compra', icon: 'Package', modulo: 'ordenes_compra' },
  { label: 'Finanzas', href: '/finanzas', icon: 'FileText', modulo: 'finanzas' },
  { label: 'Auditoría', href: '/auditoria', icon: 'FileText', modulo: 'auditoria' },
  { label: 'Configuración', href: '/configuracion', icon: 'Settings', modulo: 'configuracion' },
]

const iconMap = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Warehouse,
  FileText,
  CreditCard,
  FolderOpen,
  Tag,
  Ticket,
  User,
}

interface SidebarProps {
  open?: boolean
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export function Sidebar({ open, onClose, collapsed = false, onToggleCollapsed }: SidebarProps) {
  const toggleCollapsed = onToggleCollapsed || (() => {})
  const { user } = useAuth()
  const userModules = (user?.modules && user.modules.length > 0)
    ? user.modules
    : []

  const filteredNavItems = navItems.filter(item => userModules.includes(item.modulo || ''))

  const desktopNavLinks = (
    <nav className="flex-1 p-2 space-y-1 overflow-y-auto flex flex-col">
      {filteredNavItems.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap]
        const linkContent = (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )
            }
          >
            {Icon && <Icon size={20} />}
            <span className={cn(collapsed && 'hidden')}>{item.label}</span>
          </NavLink>
        )

        if (collapsed) {
          return (
            <Tooltip key={item.href} content={item.label} side="right">
              {linkContent}
            </Tooltip>
          )
        }

        return linkContent
      })}
    </nav>
  )

  const desktopSidebar = (
    <aside className={cn(
      "fixed left-0 top-16 bottom-0 bg-white border-r border-neutral-200 hidden md:flex flex-col z-overlay transition-all duration-normal",
      collapsed ? "w-16" : "w-64"
    )}>
      {desktopNavLinks}
      <div className="p-2 border-t border-neutral-200">
        <button
          onClick={toggleCollapsed}
          className="flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors w-full"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <span className={cn(collapsed && 'hidden')}>Contraer</span>
        </button>
      </div>
    </aside>
  )

  const mobileSidebarContent = (
    <aside className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <span className="text-lg font-bold text-primary-600">RMotos</span>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto flex flex-col">
        {filteredNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )
              }
            >
              {Icon && <Icon size={20} />}
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <>
      {desktopSidebar}
      <DrawerContainer isOpen={!!open} onClose={onClose || (() => {})} position="left">
        {mobileSidebarContent}
      </DrawerContainer>
    </>
  )
}
