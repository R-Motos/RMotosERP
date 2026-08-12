PREGUNTAS_AL_ARQUITECTO.md
Este documento contiene exclusivamente decisiones pendientes del PROJECT_SPEC.md que deben ser resueltas antes de avanzar con el diseño arquitectónico o la implementación.

1. Modelo de permisos: ¿Los roles son límites o son decorativos?
Parte del PROJECT_SPEC:

Existirán tres roles: Administrador, Gestor, Vendedor. El administrador podrá asignar permisos por módulo a cada usuario. Los permisos no dependerán únicamente del rol. Cada usuario podrá tener acceso únicamente a los módulos que el administrador autorice.

Por qué esta decisión afecta la arquitectura: Define si la tabla de permisos es completamente libre o si existe una validación a nivel de rol que restringe el máximo permiso posible. Si los roles son decorativos, un Vendedor podría recibir can_delete en Productos, lo que obliga al sistema a validar en cada endpoint si el rol permite esa acción. Si los roles son límites, la tabla de permisos debe validar contra el rol antes de aplicar permisos granulares.

Consecuencias de elegir una opción u otra:

Roles como límite: Middleware de auth más complejo, validación doble (rol + permisos), pero la especificación de "Vendedor" tiene un significado operativo robusto.
Roles decorativos: Simplifica la lógica de permisos a una sola tabla, pero redefine la semántica de los roles y requiere que el admin nunca asigne permisos incompatibles (confiando en UI/validación en lugar del modelo de datos).
2. Edición del precio de venta y su efecto en ventas en curso
Parte del PROJECT_SPEC:

(Módulo Productos) Precio de venta. (Módulo POS) El precio del producto nunca podrá modificarse manualmente. Únicamente podrá alterarse mediante descuentos, incrementos o cupones.

Por qué esta decisión afecta la arquitectura: Define si el precio de venta en el módulo de Productos es un dato editable gestionado por admin/gestor, o es un valor inmutable calculado. Si es editable, debe definirse si el cambio afecta a carritos activos en el POS, a facturas ya emitidas, o solo a futuras ventas.

Consecuencias de elegir una opción u otra:

Precio editable desde Productos: El POS debe usar precio fresco al momento de agregar al carrito; si el usuario navega y vuelve, el precio puede cambiar. El frontend debe manejar esta inestabilidad (mostrar precio actualizado o bloqueado al agregar).
Precio definido como campo congelado al momento de la venta: La edición en Productos solo afecta a nuevos productos o futuras operaciones POS, simplificando el flujo del carrito pero agregando lógica de "snapshot" de precio.
3. Las garantías generan transacciones de venta reales que impactan Finanzas
Parte del PROJECT_SPEC:

La reposición del producto se realizará mediante una nueva venta utilizando un código de descuento creado previamente por el administrador. Este código permitirá entregar el nuevo producto sin generar un nuevo cobro al cliente.

Por qué esta decisión afecta la arquitectura: Si la reposición por garantía es una venta total=0 con cupón del 100%, entonces el módulo de Finanzas reflejará estas transacciones como ventas normales (con ingreso $0, costo del producto, etc.). Finanzas debe saber distinguirlas, o bien el modelo de datos debe soportarlo.

Consecuencias de elegir una opción u otra:

Ventas de reposición como cualquier otra venta: Simplifica el modelo de datos (reusa Venta y VentaItem), pero requiere que Finanzas filtre o clasifique las garantías para no distorsionar métricas como "Total vendido".
Entidad separada Garantia con su propia tabla y sin generar Venta: Requiere lógica adicional en el POS para procesar cupones exclusivos de garantía, pero mantiene Finanzas limpia y separada de operaciones de servicio.
4. Definición exacta de los estados de producto y visibilidad en el POS
Parte del PROJECT_SPEC:

Estado (Publicado visible en el pos / Pendiente / Inactivo). En la pantalla principal se mostrarán los productos disponibles.

Por qué esta decisión afecta la arquitectura: El spec nombra tres estados pero solo aclara explícitamente la visibilidad de uno de ellos ("Publicado visible en el pos"). No define el comportamiento de "Pendiente" e "Inactivo" en el POS, y tampoco aclara si un producto "Pendiente" puede editarse, eliminarse o aparecer en reportes.

Consecuencias de elegir una opción u otra:

Solo "Publicado" visible en POS: El resto es backend-only. Esto fuerza un filtro explícito en todos los listados del POS y define claramente qué es "disponible".
"Pendiente" visible pero con marca visual o bloqueado: Agrega lógica de filtrado condicional en el frontend y posibles estados intermedios en el flujo de trabajo.
Interpretación diferente por módulo: Si "Inactivo" se muestra en reportes pero no en POS, el scope de visibilidad por estado debe documentarse en cada endpoint.
5. Almacenamiento de imágenes: filesystem o base de datos
Parte del PROJECT_SPEC:

Cada producto tendrá: Imagen. Cada marca tendrá: Imagen. Cada proveedor tendrá: Imagen. Nombre del negocio. Logo.

Por qué esta decisión afecta la arquitectura: Cuatro entidades manejan imágenes. Esto define la estrategia de almacenamiento, rutas de backup, tamaño de base de datos, y despliegue en producción (si SQLite se reemplaza por PostgreSQL, las imágenes deben migrar de forma compatible).

Consecuencias de elegir una opción u otra:

Base de datos (BLOB o path en columna + almacenamiento local): Backup simple (un solo archivo SQLite), pero crecimiento de tamaño de DB y lentitud en consultas con imágenes.
Filesystem + URL/path en DB: DB limpia, pero backup-restore requiere sincronizar archivos, y el deploy en producción necesita volumen persistente. PWA offline requiere estrategia de cacheo adicional.
6. Inmutabilidad de los Movimientos
Parte del PROJECT_SPEC:

Este módulo registrará automáticamente todos los movimientos generados por el sistema. Entre ellos: Ventas. Órdenes de compra. Importaciones de productos con inventario. Ingresos manuales. Gastos manuales.

Por qué esta decisión afecta la arquitectura: Finanzas calcula todas las estadísticas exclusivamente desde Movimientos. Si los movimientos pueden editarse o eliminarse, Finanzas pierde consistencia. El spec no aclara si son registros permanentes e inmutables o si admiten corrección.

Consecuencias de elegir una opción u otra:

Inmutables: No hay UPDATE ni DELETE en movimientos. Cualquier error requiere un movimiento de reversión (ej. "Corrección de venta #123"). Esto preserva la integridad de Finanzas automáticamente.
Editables/Cancelables: Finanzas debe consultar solo movimientos "válidos", agregar filtros por estado, y puede mostrar inconsistencias si un movimiento posterior corrige uno anterior sin trazabilidad explícita.
7. Comportamiento del módulo Restore sobre la sesión activa y datos concurrentes
Parte del PROJECT_SPEC:

También permitirá administrar la base de datos mediante las siguientes funciones: Crear una copia de seguridad (Backup). Restaurar una copia de seguridad (Restore).

Por qué esta decisión afecta la arquitectura: Un restore sobre un SQLite en uso puede corromper datos si hay escrituras concurrentes. Además, no está definido si el restore cierra la sesión de todos los usuarios, si valida la integridad del backup, o si permite restore parcial.

Consecuencias de elegir una opción u otra:

Restore con cierre de sesiones y modo mantenimiento: Garantiza integridad, pero requiere estado de mantenimiento en la app y manejo de bloqueo.
Restore en caliente sin bloqueo: Riesgo de corrupción de datos si un usuario del móvil escribe mientras se restaura. Requiere locks a nivel de aplicación o atomic replace del archivo.
Validación previa del backup (checksum, tamaño, fecha): Agrega robustez pero complejidad de implementación.
8. Manejo de cantidades decimales en inventario y ventas
Parte del PROJECT_SPEC:

Cantidad disponible. Cantidad solicitada. (Sin mención explícita de decimales)

Por qué esta decisión afecta la arquitectura: Si los productos se venden por unidades enteras, la precisión es Integer. Si se manejan fluidos, líquidos o piezas fraccionadas (común en repuestos), se requiere Decimal o Float, lo que afecta comparaciones, validaciones de stock, y fórmulas de costo promedio.

Consecuencias de elegir una opción u otra:

Entero (Integer): Validaciones simples, comparaciones exactas, sin rounding errors. Fuerza que las cantidades siempre sean números enteros.
Decimal (Numeric(10,3) o similar): Maneja piezas de stock fraccionado (ej. 0.5 litros de aceite, 1.25 metros de cable), pero requiere manejo de precisión en todas las operaciones de resta en POS y suma en recepción de órdenes.
9. App monousuario real vs multi-usuario concurrente
Parte del PROJECT_SPEC:

Los usuarios serán creados únicamente por un administrador. El acceso al sistema será mediante un PIN numérico de cuatro dígitos.

Por qué esta decisión afecta la arquitectura: SQLite maneja concurrencia limitada. Si el sistema planea usarse desde múltiples teléfonos simultáneamente (varios vendedores en mostrador), SQLite puede convertirse en cuello de botella o generar errores de base de datos bloqueada.

Consecuencias de elegir una opción u otra:

Uso estrictamente monousuario o multi-dispositivo con turnos rotativos: SQLite es adecuado sin cambios, backend simple, sin colas ni locks complejos.
Uso concurrente real desde múltiples dispositivos simultáneamente: SQLite requiere WAL mode y manejo cuidadoso de errores database is locked. La migración a PostgreSQL/MySQL para producción se vuelve obligatoria antes del crecimiento, no después.
10. Actualización de purchases_count y total_spent en Clientes
Parte del PROJECT_SPEC:

Además el sistema registrará automáticamente: Cantidad de compras realizadas. Total gastado en la tienda.

Por qué esta decisión afecta la arquitectura: Estos campos pueden calcularse en tiempo real desde las Ventas/Clientes o almacenarse como columnas denormalizadas. El spec dice "registrará automáticamente", pero no define si es trigger, cálculo al vuelo, o campo materializado.

Consecuencias de elegir una opción u otra:

Campos materializados (actualizados al crear venta/devolución/garantía): Lectura instantánea, pero requiere transacciones atómicas y manejo de race conditions en alta concurrencia.
Cálculo al vuelo (COUNT/SUM): Consistencia garantizada por DB, pero rendimiento degradado al listar clientes si hay miles de ventas. Requiere índices compuestos.
Espero tus respuestas para continuar con el diseño arquitectónico.


1. Modelo de permisos

Decisión:

Los roles son plantillas iniciales, no límites.

La autoridad real son los permisos por módulo.

Es decir:

Admin puede darle cualquier permiso a cualquier usuario.
Un vendedor puede terminar teniendo acceso a Productos si el administrador así lo decide.
El rol sirve para crear usuarios rápidamente con permisos por defecto.

De esta forma solo existe una fuente de verdad.

No se valida:

rol + permisos

solo:

permisos

Muchísimo más simple.

2. Precio de venta

Aquí el PROJECT_SPEC ya responde.

El precio de venta sí es editable desde Productos.

Lo único que no puede hacerse es modificarlo manualmente durante una venta.

Entonces:

editar producto → cambia precio
futuras ventas usan ese precio
ventas existentes mantienen el snapshot del precio

El carrito conserva el precio con el que fue agregado.

No cambia automáticamente si alguien modifica el producto.

3. Garantías

Aquí sí cambiaría ligeramente la arquitectura.

La garantía sí genera una venta, porque así lo dice el spec.

Pero esa venta debe tener un tipo.

Ejemplo:

NORMAL

GARANTIA

o

sale_type

Entonces Finanzas simplemente ignora:

sale_type = GARANTIA

cuando calcule ingresos.

No hace falta crear otra entidad enorme.

4. Estados del producto

Yo lo definiría así.

Publicado

visible POS
visible administración

Pendiente

solo administración
no aparece en POS

Inactivo

solo administración
no aparece en POS
conserva historial

Nada más.

5. Imágenes

Aquí tengo una opinión fuerte.

Nunca guardaría imágenes dentro de SQLite.

SQLite es para datos.

Las imágenes:

uploads/

products/

brands/

suppliers/

config/

La base solo guarda:

image_path

El backup simplemente copia:

database.db

+

uploads/

Muchísimo más limpio.

6. Movimientos

Inmutables.

Nunca se editan.

Nunca se eliminan.

Si algo fue incorrecto:

crear un movimiento de corrección.

Eso evita cientos de problemas en Finanzas.

7. Restore

Modo mantenimiento.

Todos fuera.

Se restaura.

Se reinicia.

Fin.

No vale la pena complicarlo.

8. Cantidades

Integer.

Vendes repuestos.

No harina.

No gasolina.

No metros.

No litros.

Todo entero.

Si algún día aparece un producto fraccionado se diseña ese caso.

No antes.

9. Multiusuario

Este punto sí lo respondería diferente.

La aplicación debe soportar varios vendedores al mismo tiempo.

Aunque SQLite tenga limitaciones.

Por eso desde el principio:

WAL Mode
timeout de escritura
transacciones pequeñas

Cuando el negocio crezca simplemente cambias SQLite por PostgreSQL.

No cambiar la arquitectura.

Solo el motor.

10. purchases_count y total_spent

Materializados.

Cada venta actualiza:

purchase_count

total_spent

Cada devolución resta.

No calcularlos cada vez.

Es mucho más rápido.

Hay dos preguntas más que yo añadiría

Estas sí me parecen más importantes que varias de las que aparecen.

11. ¿Se puede eliminar información con historial?

Ejemplo:

una categoría usada
una marca usada
un cliente con ventas
un proveedor con órdenes

Yo respondería:

No.

Solo podrán desactivarse.

Porque romperías el historial.

12. ¿Cómo se manejan los cambios de inventario?

Todo cambio de inventario debe pasar por un movimiento.

Nunca hacer:

producto.stock += 5

directamente.

Siempre:

Compra

Venta

Devolución

Ajuste manual

Importación

Inventario físico

Cada uno genera un movimiento.