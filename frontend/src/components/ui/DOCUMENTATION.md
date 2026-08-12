# Componentes UI

Documentación oficial de componentes del RMotos Design System.

## Button

**Propósito:** Botón principal para acciones.

**Cuándo usarlo:** Cualquier acción primaria, secundaria o terciaria.

**Cuándo no usarlo:** Para links de navegación (usar `<Link>`).

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

## IconButton

**Propósito:** Botón con icono para acciones compactas.

**Cuándo usarlo:** En headers, toolbars, tarjetas.

**Cuándo no usarlo:** Para acciones principales (usar Button).

**Variantes:** primary, secondary, ghost, danger

**Tamaños:** sm, md, lg

**Ejemplo:**
```tsx
<IconButton icon={<Bell size={20} />} aria-label="Notificaciones" />
```

## Input

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

## SearchInput

**Propósito:** Campo de búsqueda con icono.

**Cuándo usarlo:** Barras de búsqueda, filtros.

**Cuándo no usarlo:** Inputs generales (usar Input).

**Ejemplo:**
```tsx
<SearchInput placeholder="Buscar..." onSearch={handleSearch} />
```

## Textarea

**Propósito:** Campo de texto multilínea.

**Cuándo usarlo:** Descripciones, comentarios, campos largos.

**Cuándo no usarlo:** Texto corto (usar Input).

**Variantes:** default, error

**Ejemplo:**
```tsx
<Textarea label="Descripción" rows={4} error={errors.descripcion} />
```

## Select

**Propósito:** Selección de opciones.

**Cuándo usarlo:** Selección de valores predefinidos.

**Cuándo no usarlo:** Selección múltiple (usar Checkbox).

**Variantes:** default, error

**Ejemplo:**
```tsx
<Select label="Estado" options={estados} value={estado} onChange={setEstado} />
```

## Checkbox

**Propósito:** Selección múltiple booleana.

**Cuándo usarlo:** Opciones booleanas, aceptar términos.

**Cuándo no usarlo:** Selección única (usar Radio o Switch).

**Variantes:** default, error

**Ejemplo:**
```tsx
<Checkbox label="Acepto términos" checked={accepted} onChange={setAccepted} />
```

## Switch

**Propósito:** Toggle booleano.

**Cuándo usarlo:** Configuraciones on/off, preferencias.

**Cuándo no usarlo:** Selección múltiple (usar Checkbox).

**Variantes:** default, success, error

**Ejemplo:**
```tsx
<Switch label="Notificaciones" checked={notifications} onChange={setNotifications} />
```

## Chip

**Propósito:** Tag o etiqueta removable.

**Cuándo usarlo:** Filtros, tags, categorías.

**Cuándo no usarlo:** Información permanente (usar Badge).

**Variantes:** default, primary, success, warning, error

**Ejemplo:**
```tsx
<Chip onRemove={() => removeTag(tag.id)}>{tag.nombre}</Chip>
```

## Badge

**Propósito:** Indicador de estado o contador.

**Cuándo usarlo:** Estados, contadores, notificaciones.

**Cuándo no usarlo:** Información removable (usar Chip).

**Variantes:** default, primary, success, warning, error

**Ejemplo:**
```tsx
<Badge variant="success" dot>Activo</Badge>
```

## Avatar

**Propósito:** Representación visual de usuario.

**Cuándo usarlo:** Perfiles, listas de usuarios.

**Cuándo no usarlo:** Logos o imágenes genéricas (usar img).

**Tamaños:** sm, md, lg, xl

**Ejemplo:**
```tsx
<Avatar name="Juan Pérez" size="md" />
<Avatar src="/avatar.jpg" alt="Usuario" />
```

## Card

**Propósito:** Contenedor de contenido relacionado.

**Cuándo usarlo:** Agrupar información, estadísticas, formularios.

**Cuándo no usarlo:** Elementos inline.

**Variantes:** default, elevated, outlined

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

## Modal

**Propósito:** Diálogo modal para acciones confirmatorias o formularios.

**Cuándo usarlo:** Confirmaciones, formularios emergentes.

**Cuándo no usarlo:** Navegación, información temporal (usar Toast).

**Tamaños:** sm, md, lg

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

## Drawer

**Propósito:** Panel lateral para contenido secundario.

**Cuándo usarlo:** Detalles, edición rápida, filtros.

**Cuándo no usarlo:** Contenido principal (usar Modal).

**Posiciones:** left, right

**Ejemplo:**
```tsx
<Drawer isOpen={isOpen} onClose={onClose} title="Detalles">
  <p>Contenido del drawer</p>
</Drawer>
```

## Dialog

**Propósito:** Diálogo de confirmación simple.

**Cuándo usarlo:** Confirmaciones de acción destructiva.

**Cuándo no usarlo:** Formularios complejos (usar Modal).

**Variantes:** default, danger

**Ejemplo:**
```tsx
<Dialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={handleDelete}
  title="¿Eliminar?"
  description="Esta acción no se puede deshacer."
  variant="danger"
/>
```

## Toast

**Propósito:** Notificación temporal.

**Cuándo usarlo:** Feedback de acciones, errores, éxitos.

**Cuándo no usarlo:** Información permanente (usar Badge).

**Variantes:** success, error, warning, info

**Ejemplo:**
```tsx
addToast({ type: 'success', message: 'Guardado correctamente' })
```

## Table

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

## EmptyState

**Propósito:** Estado vacío con acción.

**Cuándo usarlo:** Listados vacíos, sin resultados.

**Cuándo no usarlo:** Errores (usar mensaje de error).

**Ejemplo:**
```tsx
<EmptyState
  title="Sin productos"
  description="Agrega tu primer producto al inventario."
  action={<Button>Agregar producto</Button>}
/>
```

## Pagination

**Propósito:** Navegación de páginas.

**Cuándo usarlo:** Listados paginados.

**Cuándo no usarlo:** Scroll infinito.

**Ejemplo:**
```tsx
<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

## Tabs

**Propósito:** Navegación por pestañas.

**Cuándo usarlo:** Secciones relacionadas en la misma vista.

**Cuándo no usarlo:** Navegación entre páginas (usar Link).

**Ejemplo:**
```tsx
<Tabs items={tabs} activeKey={activeTab} onTabChange={setActiveTab} />
```

## SegmentedControl

**Propósito:** Selección única entre opciones limitadas.

**Cuándo usarlo:** Filtros, vistas, opciones mutuamente excluyentes.

**Cuándo no usarlo:** Selección múltiple (usar Checkbox).

**Ejemplo:**
```tsx
<SegmentedControl items={viewOptions} value={view} onChange={setView} />
```

## Dropdown

**Propósito:** Menú contextual.

**Cuándo usarlo:** Acciones contextuales, menús de opciones.

**Cuándo no usarlo:** Navegación principal.

**Ejemplo:**
```tsx
<Dropdown
  trigger={<IconButton icon={<MoreVertical size={18} />} />
  items={[
    { key: 'edit', label: 'Editar', icon: <Edit size={16} />, onClick: handleEdit },
    { key: 'delete', label: 'Eliminar', icon: <Trash2 size={16} />, onClick: handleDelete },
  ]}
/>
```

## Tooltip

**Propósito:** Información contextual al hover.

**Cuándo usarlo:** Ayuda, aclaraciones, iconos con significado.

**Cuándo no usarlo:** Información permanente.

**Ejemplo:**
```tsx
<Tooltip content="Eliminar elemento" side="top">
  <IconButton icon={<Trash2 size={18} />} />
</Tooltip>
```

## Breadcrumb

**Propósito:** Navegación de jerarquía.

**Cuándo usarlo:** Páginas con niveles profundos.

**Cuándo no usarlo:** Navegación principal (usar Sidebar).

**Ejemplo:**
```tsx
<Breadcrumb items={[
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Detalle' },
]} />
```

## StatCard

**Propósito:** Métrica con tendencia.

**Cuándo usarlo:** Dashboards, resúmenes.

**Cuándo no usarlo:** Datos detallados.

**Ejemplo:**
```tsx
<StatCard title="Ventas" value="$1,234" trend={{ value: 12, label: 'vs mes anterior' }} />
```

## MetricCard

**Propósito:** Métrica con descripción.

**Cuándo usarlo:** Indicadores, KPIs.

**Cuándo no usarlo:** Métricas con tendencia (usar StatCard).

**Ejemplo:**
```tsx
<MetricCard label="Total clientes" value={156} description="Clientes activos" />
```

## Skeleton

**Propósito:** Placeholder durante carga.

**Cuándo usarlo:** Estados de carga de datos.

**Cuándo no usarlo:** Contenido vacío (usar EmptyState).

**Variantes:** text, circular, rectangular

**Ejemplo:**
```tsx
<Skeleton variant="text" width="60%" />
<SkeletonTable rows={5} cols={4} />
```

## Divider

**Propósito:** Separador visual.

**Cuándo usarlo:** Separar secciones, grupos.

**Cuándo no usarlo:** Espaciado (usar margin/padding).

**Ejemplo:**
```tsx
<Divider label="O" />
```

## PageHeader

**Propósito:** Encabezado de página estandarizado.

**Cuándo usarlo:** Todas las páginas del sistema.

**Cuándo no usarlo:** Secciones dentro de una página.

**Ejemplo:**
```tsx
<PageHeader
  title="Productos"
  description="Gestión de inventario"
  breadcrumbs={[
    { label: 'Inicio', href: '/' },
    { label: 'Productos' },
  ]}
  actions={<Button>Nuevo</Button>}
/>
```

## Loader

**Propósito:** Indicador de carga centrado.

**Cuándo usarlo:** Cargas de página o contenido completo.

**Cuándo no usarlo:** Carga inline (usar Spinner).

**Ejemplo:**
```tsx
<Loader size="lg" text="Cargando datos..." />
```

## Spinner

**Propósito:** Indicador de carga inline.

**Cuándo usarlo:** Cargas parciales, botones.

**Cuándo no usarlo:** Cargas completas (usar Loader).

**Ejemplo:**
```tsx
<Spinner size="sm" />
```
