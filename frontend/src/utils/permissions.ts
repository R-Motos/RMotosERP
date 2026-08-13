const ROL_PERMISOS: Record<string, string[]> = {
  administrador: [
    'productos',
    'categorias',
    'marcas',
    'etiquetas',
    'clientes',
    'usuarios',
    'proveedores',
    'ordenes_compra',
    'recepciones_compra',
    'ventas',
    'movimientos',
    'finanzas',
    'configuracion',
    'dashboard',
    'auditoria',
    'pos',
    'cupones',
    'devoluciones',
    'garantias',
  ],
  gestor: [
    'productos',
    'categorias',
    'marcas',
    'etiquetas',
    'clientes',
    'proveedores',
    'ordenes_compra',
    'recepciones_compra',
    'ventas',
    'movimientos',
    'finanzas',
    'dashboard',
    'cupones',
    'devoluciones',
    'garantias',
  ],
  vendedor: [
    'productos',
    'clientes',
    'ventas',
    'movimientos',
    'pos',
    'cupones',
  ],
}

export function getModulesForRole(role: string): string[] {
  return ROL_PERMISOS[role] || []
}

export function getModulesForRoles(roles: string[]): string[] {
  const modules = new Set<string>()
  for (const role of roles) {
    const roleModules = ROL_PERMISOS[role]
    if (roleModules) {
      for (const mod of roleModules) {
        modules.add(mod)
      }
    }
  }
  return Array.from(modules)
}

const moduloALabelMap: Record<string, string> = {
  productos: 'productos',
  categorias: 'categorias',
  marcas: 'marcas',
  etiquetas: 'etiquetas',
  clientes: 'clientes',
  usuarios: 'usuarios',
  proveedores: 'proveedores',
  ordenes_compra: 'ordenes-compra',
  recepciones_compra: 'recepciones-compra',
  ventas: 'ventas',
  movimientos: 'movimientos',
  finanzas: 'finanzas',
  configuracion: 'configuracion',
  dashboard: 'dashboard',
  auditoria: 'auditoria',
  pos: 'pos',
  cupones: 'cupones',
  devoluciones: 'devoluciones',
  garantias: 'garantias',
}

export function moduloALabel(modulo: string): string | undefined {
  return moduloALabelMap[modulo]
}
