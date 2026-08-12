# Patrón de Módulo Reutilizable - RMotos ERP

Este documento define el patrón arquitectónico que todos los módulos del ERP deben seguir.

## Estructura del Módulo

```
src/
  modules/{moduleName}/
    components/
      {Module}Table.tsx        # Tabla de listado con columnas
      {Module}Filters.tsx      # Filtros de búsqueda y filtrado
      {Module}Toolbar.tsx      # Barra de herramientas (título, acciones)
      {Module}Form.tsx         # Formulario de creación/edición
      {Module}StatusBadge.tsx  # Badge de estado
      {Module}Image.tsx        # Visualización de imagen
      Delete{Module}Dialog.tsx # Diálogo de confirmación de eliminación
    hooks/
      use{ModulePlural}()      # Hook principal de datos
      use{Module}Filters()     # Hook de estado de filtros
      use{Module}Form()        # Hook de estado del formulario
    services/
      {moduleName}.service.ts  # Única capa HTTP del módulo
    types/
      {moduleName}.ts          # Tipos TypeScript del módulo
  pages/
    {Module}List.tsx           # Página orquestadora (solo componentes + hooks)
```

## Responsabilidades

### `types/`
Define todas las interfaces del módulo:
- Entidad principal (ej: `Producto`)
- Creación/actualización (ej: `ProductoCreate`, `ProductoUpdate`)
- Filtros (ej: `ProductoFilter`)
- Opciones para selects (ej: `MarcaOption`)
- Respuestas paginadas

### `services/`
Contiene **únicamente** llamadas HTTP. No tiene lógica de negocio ni estado.
- Usa `httpClient` de la infraestructura central
- Retorna tipos tipados
- No conoce la UI

### `components/`
Componentes visuales puros. No conocen la API.
- Reciben datos via props
- Reciben callbacks via props
- No importan servicios
- No importan httpClient
- Reutilizan componentes del Design System

### `hooks/`
Contienen toda la lógica de negocio y estado.
- `use{ModulePlural}`: fetching, paginación, loading, error
- `use{Module}Filters`: estado de filtros, búsqueda, ordenamiento
- `use{Module}Form`: estado del formulario, submit, delete, changeState

### `pages/`
Página orquestadora. Solo combina componentes y hooks.
- No tiene lógica de negocio propia
- No llama a la API directamente
- Solo orquesta componentes y pasa props

## Flujo de Datos

```
Page (orquesta)
  ├── use{ModulePlural}() → datos, loading, error
  ├── use{Module}Filters() → filtros, búsqueda
  ├── use{Module}Form() → formulario, submit, delete
  ├── ProductToolbar → título, acciones
  ├── ProductFilters → filtros, búsqueda
  ├── ProductTable → listado
  ├── ProductForm → creación/edición (en Modal)
  └── Delete{Module}Dialog → confirmación de eliminación
```

## Reglas

1. Ningún componente visual conoce la API
2. Toda llamada HTTP vive únicamente en `services/`
3. Toda la validación del formulario vive en el hook `use{Module}Form`
4. La página no tiene lógica de negocio propia
5. Los hooks son reutilizables entre módulos
6. Los componentes son puros y reciben todo via props
7. Los tipos están en `types/` y son compartidos por todo el módulo

## Ejemplo de Reutilización

Para crear un nuevo módulo (ej: Marcas):

1. Copiar la estructura de directorios
2. Crear `types/brand.ts` con las interfaces
3. Crear `services/brand.service.ts` con las llamadas HTTP
4. Crear los componentes reutilizando `ProductTable`, `ProductFilters`, etc.
5. Crear los hooks reutilizando la misma estructura
6. Crear la página orquestadora

Los componentes `ProductTable`, `ProductFilters`, `ProductToolbar`, `ProductForm`, `DeleteProductDialog` son genéricos y pueden ser parametrizados para cualquier módulo.
