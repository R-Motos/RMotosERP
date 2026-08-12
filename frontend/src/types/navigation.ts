export interface NavItem {
  label: string
  href: string
  icon: string
  modulo?: string
  badge?: number
  children?: NavItem[]
}
