# RMotos Design System

## 1. Filosofía

El RMotos Design System es un sistema de diseño mobile-first, accesible y consistente para el ERP RMotos.

**Principios:**
- **Consistencia**: Todos los componentes usan los mismos tokens.
- **Accesibilidad**: Cumplimiento WCAG 2.1 AA.
- **Mobile First**: Diseño pensado para móvil, adaptado a desktop.
- **Simplicidad**: Componentes focused, sin sobre-ingeniería.

## 2. Tokens Oficiales

### 2.1 Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `primary-50` | `#eff6ff` | Fondos sutiles, hover states |
| `primary-100` | `#dbeafe` | Fondos, badges |
| `primary-200` | `#bfdbfe` | Bordes, divisores |
| `primary-300` | `#93c5fd` | Estados activos |
| `primary-400` | `#60a5fa` | Hover |
| `primary-500` | `#3b82f6` | Énfasis |
| `primary-600` | `#2563eb` | **Color primario principal** |
| `primary-700` | `#1d4ed8` | Active |
| `primary-800` | `#1e40af` | Hover oscuro |
| `primary-900` | `#1e3a8a` | Texto en fondos oscuros |
| `success-500` | `#22c55e` | Éxito |
| `success-600` | `#16a34a` | Active |
| `success-700` | `#15803d` | Hover oscuro |
| `warning-500` | `#f59e0b` | Advertencia |
| `warning-600` | `#d97706` | Active |
| `warning-700` | `#b45309` | Hover oscuro |
| `error-500` | `#ef4444` | Error |
| `error-600` | `#dc2626` | Active |
| `error-700` | `#b91c1c` | Hover oscuro |
| `neutral-50` | `#f8fafc` | Fondo principal |
| `neutral-100` | `#f1f5f9` | Fondo secundario |
| `neutral-200` | `#e2e8f0` | Bordes |
| `neutral-300` | `#cbd5e1` | Bordes disabled |
| `neutral-400` | `#94a3b8` | Placeholder |
| `neutral-500` | `#64748b` | Texto secundario |
| `neutral-600` | `#475569` | Texto |
| `neutral-700` | `#334155` | Texto |
| `neutral-800` | `#1e293b` | Texto |
| `neutral-900` | `#0f172a` | Texto principal |
| `neutral-950` | `#020617` | Texto en fondos oscuros |
| `overlay` | `#000000` | Fondos de overlay (usar con opacidad, ej: `/40`) |

### 2.2 Tipografía

| Token | Tamaño | Line Height | Uso |
|-------|--------|-------------|-----|
| `text-xs` | `0.75rem` | `1rem` | Labels, badges |
| `text-sm` | `0.875rem` | `1.25rem` | Body small, secondary |
| `text-base` | `1rem` | `1.5rem` | Body principal |
| `text-lg` | `1.125rem` | `1.75rem` | Lead text |
| `text-xl` | `1.25rem` | `1.75rem` | Subtítulo |
| `text-2xl` | `1.5rem` | `2rem` | Título página |
| `text-3xl` | `1.875rem` | `2.25rem` | Título sección |
| `text-4xl` | `2.25rem` | `2.5rem` | Hero |

**Familias:**
- `sans`: Inter, system-ui, -apple-system, sans-serif
- `mono`: JetBrains Mono, monospace

### 2.3 Espaciado

| Token | Valor | Uso |
|-------|-------|-----|
| `space-0` | `0` | Reset |
| `space-0.5` | `0.125rem` | Micro espaciado |
| `space-1` | `0.25rem` | Espaciado mínimo |
| `space-2` | `0.5rem` | Padding interno |
| `space-3` | `0.75rem` | Gap pequeño |
| `space-4` | `1rem` | Estándar |
| `space-5` | `1.25rem` | Medium |
| `space-6` | `1.5rem` | Large |
| `space-8` | `2rem` | Section spacing |
| `space-12` | `3rem` | Page spacing |

### 2.4 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-none` | `0` | Sin redondeo |
| `radius-sm` | `0.25rem` | Inputs pequeños |
| `radius-md` | `0.375rem` | Botones |
| `radius-lg` | `0.5rem` | Cards |
| `radius-xl` | `0.75rem` | Modales |
| `radius-2xl` | `1rem` | Contenedores |
| `radius-full` | `9999px` | Chips, avatars |

### 2.5 Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Cards |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Elevación media |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Modales, dropdowns |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | Overlays |

### 2.6 Animaciones

| Token | Valor | Uso |
|-------|-------|-----|
| `duration-fast` | `150ms` | Micro-interacciones |
| `duration-normal` | `200ms` | Transiciones estándar |
| `duration-slow` | `300ms` | Animaciones complejas |

**Curva de timing:** `ease-in-out` por defecto.

### 2.7 Z-Index

| Token | Valor | Uso |
|-------|-------|-----|
| `z-base` | `0` | Default |
| `z-dropdown` | `1000` | Menús, dropdowns |
| `z-sticky` | `1100` | Headers, sidebars |
| `z-overlay` | `1200` | Overlays |
| `z-modal` | `1300` | Modales, drawers |
| `z-toast` | `1400` | Notificaciones |
| `z-loader` | `1500` | Loaders |

### 2.8 Grid

**Columnas:** 12 columnas
**Gutter:** `1.5rem` (24px)
**Margen:** `1.5rem` (24px)

**Breakpoints:**
- `mobile`: `< 768px`
- `tablet`: `768px - 1023px`
- `desktop`: `>= 1024px`

### 2.9 Estados

| Estado | Aplicación |
|--------|-----------|
| `hover` | `hover:` en elementos interactivos |
| `active` | `active:` en elementos clickeables |
| `focus` | `focus-visible:` para accesibilidad |
| `disabled` | `disabled:` opacidad 50%, cursor not-allowed |
| `loading` | Spinner overlay o inline |
| `error` | Borde rojo, texto error, mensaje |
| `success` | Borde verde, check icon |
| `empty` | EmptyState component |

## 3. Convenciones

### 3.1 Imports

```tsx
// SIEMPRE usar alias @/
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/classNames'
```

### 3.2 Clases

- Usar solo tokens de Tailwind.
- Nunca hardcodear colores, espaciados o sombras.
- Usar `cn()` para combinar clases condicionales.

### 3.3 Accesibilidad

- Todos los elementos interactivos deben ser táctiles (`min-h-tactile`, `min-w-tactile`).
- Usar `aria-label` en botones de icono.
- Usar `role` en componentes semánticos.
- Contraste mínimo 4.5:1 para texto normal.

## 4. Componentes Oficiales

### 4.1 Button

**Propósito:** Botón principal para acciones.

**Cuándo usarlo:** Cualquier acción primaria o secundaria.

**Cuándo no usarlo:** Para links de navegación (usar Link).

**Variantes:**
- `primary` - Acción principal
- `secondary` - Acción secundaria
- `ghost` - Acción terciaria
- `danger` - Acción destructiva

**Tamaños:**
- `sm` - Compacto
- `md` - Estándar
- `lg` - Grande

**Propiedades:**
- `loading`: Muestra spinner inline
- `icon`: Icono a la izquierda
- `disabled`: Estado deshabilitado

**Ejemplo:**
```tsx
<Button variant="primary" size="md" loading={isSaving}>
  Guardar
</Button>
```

### 4.2 Input

**Propósito:** Campo de texto de una línea.

**Cuándo usarlo:** Formularios, filtros, búsquedas.

**Cuándo no usarlo:** Textos largos (usar Textarea).

**Variantes:**
- `default` - Estándar
- `error` - Con validación fallida
- `success` - Con validación exitosa

**Propiedades:**
- `label`: Texto del label
- `error`: Mensaje de error
- `leftIcon` / `rightIcon`: Iconos decorativos

**Ejemplo:**
```tsx
<Input label="Nombre" placeholder="Ingrese nombre" error={errors.name} />
```

### 4.3 Card

**Propósito:** Contenedor de contenido relacionado.

**Cuándo usarlo:** Agrupar información, estadísticas, formularios.

**Cuándo no usarlo:** Para elementos inline.

**Variantes:**
- `default` - Sombra estándar
- `elevated` - Sombra mayor
- `outlined` - Sin sombra, borde doble

**Propiedades:**
- `header`: Cabecera personalizada
- `footer`: Pie personalizado
- `padding`: none, sm, md, lg

**Ejemplo:**
```tsx
<Card header={<h3>Productos</h3>} footer={<Button>Guardar</Button>}>
  <p>Contenido</p>
</Card>
```

### 4.4 Modal

**Propósito:** Diálogo modal para acciones confirmatorias o formularios.

**Cuándo usarlo:** Confirmaciones, formularios emergentes.

**Cuándo no usarlo:** Navegación, información temporal (usar Toast).

**Variantes:** Por tamaño (`sm`, `md`, `lg`)

**Propiedades:**
- `title`: Título del modal
- `description`: Subtítulo
- `footer`: Acciones del pie
- `onClose`: Callback de cierre

**Ejemplo:**
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Confirmar">
  <p>¿Está seguro?</p>
  <footer>
    <Button onClick={onConfirm}>Sí</Button>
  </footer>
</Modal>
```

### 4.5 Table

**Propósito:** Mostrar datos tabulares.

**Cuándo usarlo:** Listados de datos con múltiples columnas.

**Cuándo no usarlo:** Datos simples (usar Cards).

**Propiedades:**
- `data`: Array de datos
- `columns`: Definición de columnas
- `keyExtractor`: Función para key único
- `emptyMessage`: Mensaje cuando no hay datos

**Ejemplo:**
```tsx
<Table
  data={users}
  columns={[
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
  ]}
  keyExtractor={(user) => user.id}
/>
```

### 4.6 StatCard

**Propósito:** Mostrar métricas clave con tendencia.

**Cuándo usarlo:** Dashboards, resúmenes.

**Cuándo no usarlo:** Datos detallados.

**Propiedades:**
- `title`: Título de la métrica
- `value`: Valor principal
- `trend`: Objeto con valor y label
- `icon`: Icono decorativo

**Ejemplo:**
```tsx
<StatCard title="Ventas" value="$1,234" trend={{ value: 12, label: 'vs mes anterior' }} />
```

### 4.7 Skeleton

**Propósito:** Placeholder durante carga.

**Cuándo usarlo:** Estados de carga de datos.

**Cuándo no usarlo:** Contenido vacío (usar EmptyState).

**Variantes:**
- `text`
- `circular`
- `rectangular`

**Ejemplo:**
```tsx
<Skeleton variant="text" width="60%" />
<SkeletonTable rows={5} cols={4} />
```

## 5. Reglas de Estado

### 5.1 Hover
- Botones: cambio de color más oscuro
- Cards: `bg-neutral-50`
- Links: subrayado o cambio de color

### 5.2 Active
- Botones: `active:bg-primary-800`
- Links: `active:text-primary-900`

### 5.3 Focus
- Usar `focus-visible:` para accesibilidad
- Outline: `2px solid primary-500`
- Offset: `2px`

### 5.4 Disabled
- Opacidad: `50%`
- Cursor: `not-allowed`
- Fondo: `neutral-100`

### 5.5 Loading
- Spinner inline o overlay
- Botones: spinner a la izquierda
- Contenido: Skeleton

### 5.6 Error
- Borde: `error-500`
- Texto: `error-600`
- Icono: AlertCircle

### 5.7 Success
- Borde: `success-500`
- Icono: CheckCircle

### 5.8 Empty
- Usar EmptyState
- Icono: Inbox o custom
- Acción: Botón para crear

## 6. Accesibilidad

- Todos los componentes interactivos tienen `min-h-tactile` (44px) y `min-w-tactile`.
- Uso de `aria-label` en botones de icono.
- Estados `focus-visible` con outline de 2px.
- Contraste mínimo 4.5:1 para texto normal.

## 7. Responsive

- **Mobile First**: Estilos base para mobile, `md:` para tablet, `lg:` para desktop.
- Breakpoints oficiales:
  - `mobile`: `< 768px`
  - `tablet`: `768px - 1023px`
  - `desktop`: `>= 1024px`

## 8. Naming

- Componentes: PascalCase
- Archivos: PascalCase para componentes, camelCase para hooks/utils
- Clases Tailwind: utility-first, sin clases personalizadas salvo `.btn`, `.input`, `.card`

## 9. Mantenimiento

- Todos los cambios de diseño pasan por este documento.
- No se introducen tokens nuevos sin aprobación.
- Los componentes se actualizan para alinearse a este documento.
