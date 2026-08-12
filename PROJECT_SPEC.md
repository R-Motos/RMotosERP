RMotos ERP

Objetivo

Desarrollar un sistema de gestión para RMotos.

Será una aplicación web instalable (PWA), diseñada bajo el principio Mobile First, ya que aproximadamente el 90% de su uso será desde teléfonos móviles.

Durante el desarrollo se utilizará SQLite. La arquitectura deberá permitir migrar posteriormente a otro motor de base de datos para producción sin requerir una reestructuración importante.

La tecnología será elegida por el desarrollador, siempre respetando los principios definidos en AGENTS.md.

Módulo de Productos

El sistema contará con un módulo para administrar el inventario de productos.

Cada producto tendrá los siguientes campos:

Nombre

Imagen

SKU

Código de barras

Precio de compra

Precio de venta

Gestionar inventario (Sí / No)

Cantidad disponible

Stock mínimo

Categorías

Etiquetas

Marca

Estado (Publicado visible en el pos / Pendiente / Inactivo)

El módulo permitirá:

Crear productos.

Editar productos.

Eliminar productos.

También deberá contar con un buscador que permita localizar productos utilizando:

Nombre

SKU

Código de barras

Marca

Categoría

Etiquetas

Estado

Además deberá permitir aplicar filtros utilizando esos mismos campos.

Categorías

El sistema permitirá crear categorías.

Las categorías podrán asociarse a los productos.

Un producto podrá pertenecer a una o varias categorías.

Etiquetas

El sistema permitirá crear etiquetas.

Las etiquetas podrán asociarse a los productos.

Un producto podrá tener múltiples etiquetas.

Las etiquetas se utilizarán para indicar la compatibilidad de los productos con modelos de moto.

Marcas

El sistema permitirá crear marcas.

Las marcas podrán asociarse a los productos.

Importación y Exportación

El sistema permitirá importar productos mediante archivos CSV.

También permitirá descargar una plantilla oficial para realizar correctamente la importación.

El sistema permitirá exportar el inventario para trabajar con hojas de cálculo.

Durante la importación el sistema también deberá importar:

Categorías.

Marcas.

Etiquetas.

Si alguna de ellas no existe deberá crearla automáticamente y asociarla a los productos correspondientes.

Usuarios

El sistema contará con administración de usuarios.

Los usuarios serán creados únicamente por un administrador.

El acceso al sistema será mediante un PIN numérico de cuatro dígitos.

El inicio de sesión deberá realizarse utilizando un teclado numérico en pantalla.

El sistema permitirá recordar la sesión para evitar solicitar el PIN constantemente.

Roles y Permisos

Existirán tres roles:

Administrador

Gestor

Vendedor

El administrador podrá asignar permisos por módulo a cada usuario.

Los permisos no dependerán únicamente del rol.

Cada usuario podrá tener acceso únicamente a los módulos que el administrador autorice.

Clientes

El sistema contará con un módulo de clientes.

Cada cliente tendrá:

Nombre

Email

Teléfono

Además el sistema registrará automáticamente:

Cantidad de compras realizadas.

Total gastado en la tienda.

Los clientes podrán crearse desde:

El módulo de clientes.

El POS durante una venta.

Proveedores

El sistema contará con un módulo de proveedores.

Cada proveedor tendrá:

Imagen

Nombre

Email

Teléfono.

Órdenes de Compra

El sistema contará con un módulo para gestionar órdenes de compra a proveedores.

Cada orden permitirá seleccionar:

El proveedor.

Productos existentes en el inventario.

Cantidad solicitada.

Precio de compra.

Cuando una orden sea recibida:

Aumentará el inventario del producto.

Se recalculará el precio de compra del producto utilizando el costo promedio ponderado.

El sistema mostrará un panel con:

Órdenes pendientes.

Órdenes completadas.

Dinero invertido.

Margen esperado utilizando el precio de venta registrado en cada producto.

El precio de compra que se ingresa en la orden es el de esa compra específica, y al recibir se recalcula el promedio.

Cupones

El sistema permitirá crear cupones de descuento.

Cada cupón podrá ser:

Porcentaje.

Valor fijo.

Cada cupón tendrá un código.

Punto de Venta (POS)

El sistema contará con un módulo de Punto de Venta (POS).

En la pantalla principal se mostrarán los productos disponibles con:

Imagen.

Nombre.

Precio de venta.

Cantidad disponible.

El usuario podrá:

Agregar productos al carrito.

Aumentar la cantidad.

Disminuir la cantidad.

Aplicar descuentos.

Aplicar incrementos al precio.

Aplicar cupones de descuento.

Crear un cliente.

Seleccionar un cliente existente.

Los descuentos podrán aplicarse mediante:

Valor fijo.

Porcentaje.

Los incrementos también podrán aplicarse mediante:

Valor fijo.

Porcentaje.

El precio del producto nunca podrá modificarse manualmente.

Únicamente podrá alterarse mediante descuentos, incrementos o cupones.

Cuando el usuario confirme la venta aparecerán los métodos de pago disponibles.

Inicialmente existirán:

Efectivo.

Transferencia.

Si el método de pago es efectivo:

El sistema mostrará un teclado numérico.

El usuario ingresará el valor recibido.

El sistema calculará automáticamente:

El cambio.

El dinero faltante.

Posteriormente permitirá finalizar la venta.

Al finalizar la compra mostrará las opciones:

Venta registrada.

Iniciar nueva venta.

Ver factura.

Las facturas deberán almacenarse permanentemente.

Cada factura podrá visualizarse, descargarse e imprimirse.

Desde el POS también será posible registrar un ingreso o un gasto no relacionado con productos, solicitando únicamente:

Descripción.

Valor.

Movimientos

El sistema contará con un módulo de Movimientos.

Este módulo registrará automáticamente todos los movimientos generados por el sistema.

Entre ellos:

Ventas.

Órdenes de compra.

Importaciones de productos con inventario.

Ingresos manuales.

Gastos manuales.

Cada movimiento registrará:

Usuario responsable.

Fecha.

Tipo de movimiento.

Si corresponde a un ingreso o un gasto.

Los administradores podrán consultar el detalle completo de cada movimiento, incluyendo los productos asociados cuando existan.

Las facturas de las ventas también podrán consultarse desde este módulo.

Finanzas

El sistema contará con un módulo de Finanzas.

Este módulo utilizará la información registrada en Movimientos para mostrar estadísticas generales del negocio.

No deberá duplicar información financiera.

Toda la información deberá obtenerse desde el módulo de Movimientos.

El módulo mostrará:

Productos más vendidos.

Total de ganancias.

Total vendido.

Total gastado.

Producto con más margen.

Todas las estadísticas deberán permitir filtrar por rango de fechas.


Flujo de trabajo

Cuando un producto no tenga inventario disponible, no podrá agregarse al carrito del POS.

En su lugar, el usuario podrá agregarlo directamente a un orden de compra.

El pedido quedará inicialmente en estado Pendiente.

Posteriormente un usuario autorizado podrá revisar el pedido y cambiar su estado a Solicitado, indicando que el pedido fue realizado al proveedor.

Cuando los productos sean recibidos, el pedido pasará a estado Completado.

Al completar el pedido:

Se actualizará el inventario de los productos.

Se recalculará el precio de compra de cada producto utilizando el costo promedio ponderado.

Inicio de la aplicación

Después de iniciar sesión, la primera pantalla del sistema será siempre el Punto de Venta (POS).

Este será el módulo principal del sistema.

Ventas

El sistema contará con un módulo de Ventas.

Todas las ventas realizadas desde el POS quedarán almacenadas permanentemente.

Cada venta conservará toda su información para futuras consultas.

Desde este módulo será posible:

Consultar ventas.

Buscar ventas.

Ver el detalle completo de una venta.

Descargar la factura.

Imprimir la factura.

Desde el detalle de una venta también será posible realizar:

Devoluciones.

Garantías.

Las devoluciones solo podrán realizarlas usuarios con rol de Administrador o Gestor.

Devoluciones

Las devoluciones se realizarán seleccionando uno o varios productos pertenecientes a una venta.

Al registrar una devolución:

La venta original permanecerá almacenada.

Se generará un nuevo movimiento de devolución.

El inventario aumentará nuevamente con los productos devueltos.

Las estadísticas financieras deberán reflejar correctamente la devolución.

Garantías

Las garantías se realizarán seleccionando uno o varios productos pertenecientes a una venta.

Una garantía:

No devolverá dinero al cliente.

No modificará el inventario.

No eliminará la venta original.

Los productos quedarán marcados como entregados por garantía.

La reposición del producto se realizará mediante una nueva venta utilizando un código de descuento creado previamente por el administrador creado manualmente con el modulo de cupones.

Este código permitirá entregar el nuevo producto sin generar un nuevo cobro al cliente.

Configuración

El sistema contará con un módulo de Configuración.

Este módulo permitirá administrar la información general del negocio.

Inicialmente contará con las siguientes opciones:

Nombre del negocio.

Logo.

Número de celular.

También permitirá administrar la base de datos mediante las siguientes funciones:

Crear una copia de seguridad (Backup).

Restaurar una copia de seguridad (Restore).

Cálculo del Costo Promedio

Cada producto tendrá un único precio de compra vigente.

Cuando se reciba una Orden de Compra, el sistema recalculará automáticamente el precio de compra utilizando un costo promedio ponderado.

Para calcular el nuevo costo promedio se utilizarán:

La cantidad actual del inventario.

El precio de compra actual.

La cantidad recibida.

El nuevo precio de compra.

La fórmula será:

(Valor total del inventario actual + Valor total de la nueva compra)÷(Cantidad actual del inventario + Cantidad recibida)

Una vez calculado:

El nuevo costo promedio reemplazará el precio de compra del producto.

Todas las unidades disponibles utilizarán ese nuevo costo promedio.

Las ventas ya realizadas no deberán modificar su utilidad.

Cada venta conservará el costo del producto existente en el momento en que fue registrada.

Únicamente las ventas futuras utilizarán el nuevo costo promedio para calcular la utilidad.