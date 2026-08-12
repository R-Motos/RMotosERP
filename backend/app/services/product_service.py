from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
import csv
import io

from app.models.product import Producto, ProductoEstado, producto_categoria, producto_etiqueta
from app.models.brand import Marca
from app.models.category import Categoria
from app.models.tag import Etiqueta
from app.services import audit_service


ORDER_BY_WHITELIST = {
    'id': Producto.id,
    'nombre': Producto.nombre,
    'sku': Producto.sku,
    'codigo_barras': Producto.codigo_barras,
    'precio_compra': Producto.precio_compra,
    'precio_venta': Producto.precio_venta,
    'cantidad_disponible': Producto.cantidad_disponible,
    'estado': Producto.estado,
    'created_at': Producto.created_at,
    'updated_at': Producto.updated_at,
}


def create(db: Session, data) -> Producto:
    nombre = data.nombre.strip()
    if not nombre:
        raise ValueError('nombre es requerido')

    sku = data.sku.strip() if data.sku else None
    codigo_barras = data.codigo_barras.strip() if data.codigo_barras else None

    if sku:
        existing = db.query(Producto).filter(Producto.sku == sku).first()
        if existing:
            raise ValueError('SKU ya existe')
    if codigo_barras:
        existing = db.query(Producto).filter(Producto.codigo_barras == codigo_barras).first()
        if existing:
            raise ValueError('Codigo de barras ya existe')

    if data.precio_compra <= 0:
        raise ValueError('precio_compra debe ser mayor a 0')
    if data.precio_venta <= 0:
        raise ValueError('precio_venta debe ser mayor a 0')
    if data.cantidad_disponible < 0:
        raise ValueError('cantidad_disponible no puede ser negativa')
    if data.stock_minimo < 0:
        raise ValueError('stock_minimo no puede ser negativo')

    producto = Producto(
        nombre=nombre,
        imagen=data.imagen,
        sku=sku,
        codigo_barras=codigo_barras,
        precio_compra=data.precio_compra,
        precio_venta=data.precio_venta,
        gestionar_inventario=data.gestionar_inventario,
        cantidad_disponible=data.cantidad_disponible,
        stock_minimo=data.stock_minimo,
        marca_id=data.marca_id,
        estado=data.estado,
    )
    db.add(producto)
    db.flush()

    if data.categoria_ids:
        for cat_id in data.categoria_ids:
            db.execute(producto_categoria.insert().values(producto_id=producto.id, categoria_id=cat_id))
    if data.etiqueta_ids:
        for tag_id in data.etiqueta_ids:
            db.execute(producto_etiqueta.insert().values(producto_id=producto.id, etiqueta_id=tag_id))

    db.commit()
    db.refresh(producto)

    audit_service.log(
        db,
        usuario_id=1,
        modulo='productos',
        accion='crear',
        registro_id=producto.id,
        descripcion=f'Producto {producto.nombre} creado',
        datos_nuevos={'id': producto.id, 'nombre': producto.nombre},
    )

    return producto


def get(db: Session, producto_id: int) -> Producto | None:
    return db.get(Producto, producto_id)


def list(db: Session, filters) -> tuple[list[Producto], int]:
    query = db.query(Producto)

    if filters.q:
        query = query.filter(
            (Producto.nombre.ilike(f'%{filters.q}%')) |
            (Producto.sku.ilike(f'%{filters.q}%')) |
            (Producto.codigo_barras.ilike(f'%{filters.q}%'))
        )
    if filters.marca_id:
        query = query.filter(Producto.marca_id == filters.marca_id)
    if filters.categoria_id:
        query = query.join(producto_categoria).filter(producto_categoria.c.categoria_id == filters.categoria_id)
    if filters.etiqueta_id:
        query = query.join(producto_etiqueta).filter(producto_etiqueta.c.etiqueta_id == filters.etiqueta_id)
    if filters.estado:
        query = query.filter(Producto.estado == filters.estado)

    total = query.count()

    order_column = ORDER_BY_WHITELIST.get(filters.order_by, Producto.id)
    query = query.order_by(order_column)

    items = query.options(
        selectinload(Producto.marca),
        selectinload(Producto.categorias),
        selectinload(Producto.etiquetas),
    ).offset((filters.page - 1) * filters.size).limit(filters.size).all()
    return items, total


def get_by_sku(db: Session, sku: str) -> Producto | None:
    return db.query(Producto).filter(Producto.sku == sku).first()


def get_by_barcode(db: Session, codigo_barras: str) -> Producto | None:
    return db.query(Producto).filter(Producto.codigo_barras == codigo_barras).first()


def update(db: Session, producto_id: int, data) -> Producto | None:
    producto = get(db, producto_id)
    if not producto:
        return None

    update_data = data.model_dump(exclude_unset=True)
    categoria_ids = update_data.pop('categoria_ids', None)
    etiqueta_ids = update_data.pop('etiqueta_ids', None)

    if 'nombre' in update_data:
        nombre = update_data['nombre'].strip()
        if not nombre:
            raise ValueError('nombre es requerido')
        update_data['nombre'] = nombre

    if 'sku' in update_data:
        sku = update_data['sku'].strip() if update_data['sku'] else None
        if sku:
            existing = db.query(Producto).filter(Producto.sku == sku, Producto.id != producto_id).first()
            if existing:
                raise ValueError('SKU ya existe')
        update_data['sku'] = sku

    if 'codigo_barras' in update_data:
        codigo_barras = update_data['codigo_barras'].strip() if update_data['codigo_barras'] else None
        if codigo_barras:
            existing = db.query(Producto).filter(Producto.codigo_barras == codigo_barras, Producto.id != producto_id).first()
            if existing:
                raise ValueError('Codigo de barras ya existe')
        update_data['codigo_barras'] = codigo_barras

    if 'precio_compra' in update_data and update_data['precio_compra'] <= 0:
        raise ValueError('precio_compra debe ser mayor a 0')
    if 'precio_venta' in update_data and update_data['precio_venta'] <= 0:
        raise ValueError('precio_venta debe ser mayor a 0')
    if 'cantidad_disponible' in update_data and update_data['cantidad_disponible'] < 0:
        raise ValueError('cantidad_disponible no puede ser negativa')
    if 'stock_minimo' in update_data and update_data['stock_minimo'] < 0:
        raise ValueError('stock_minimo no puede ser negativo')

    datos_anteriores = {
        'nombre': producto.nombre,
        'precio_compra': str(producto.precio_compra),
        'precio_venta': str(producto.precio_venta),
        'cantidad_disponible': str(producto.cantidad_disponible),
        'estado': producto.estado,
    }

    for key, value in update_data.items():
        setattr(producto, key, value)

    if categoria_ids is not None:
        db.execute(producto_categoria.delete().where(producto_categoria.c.producto_id == producto_id))
        for cat_id in categoria_ids:
            db.execute(producto_categoria.insert().values(producto_id=producto_id, categoria_id=cat_id))
    if etiqueta_ids is not None:
        db.execute(producto_etiqueta.delete().where(producto_etiqueta.c.producto_id == producto_id))
        for tag_id in etiqueta_ids:
            db.execute(producto_etiqueta.insert().values(producto_id=producto_id, etiqueta_id=tag_id))

    db.commit()
    db.refresh(producto)

    audit_service.log(
        db,
        usuario_id=1,
        modulo='productos',
        accion='editar',
        registro_id=producto.id,
        descripcion=f'Producto {producto.nombre} actualizado',
        datos_anteriores=datos_anteriores,
        datos_nuevos={'id': producto.id, 'nombre': producto.nombre},
    )

    return producto


# --- CSV Import/Export ---

import csv
import io
from decimal import Decimal

from app.models.brand import Marca
from app.models.category import Categoria
from app.models.tag import Etiqueta


def export_csv(db: Session) -> str:
    """Export all products to CSV format."""
    products = db.query(Producto).options(
        selectinload(Producto.marca),
        selectinload(Producto.categorias),
        selectinload(Producto.etiquetas),
    ).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'nombre', 'imagen', 'sku', 'codigo_barras',
        'precio_compra', 'precio_venta',
        'gestionar_inventario', 'cantidad_disponible', 'stock_minimo',
        'marca', 'categorias', 'etiquetas', 'estado'
    ])
    
    for p in products:
        writer.writerow([
            p.nombre,
            p.imagen or '',
            p.sku or '',
            p.codigo_barras or '',
            str(p.precio_compra),
            str(p.precio_venta),
            'true' if p.gestionar_inventario else 'false',
            str(p.cantidad_disponible),
            str(p.stock_minimo),
            p.marca.nombre if p.marca else '',
            ';'.join([c.nombre for c in p.categorias]),
            ';'.join([e.nombre for e in p.etiquetas]),
            p.estado.value if isinstance(p.estado, ProductoEstado) else p.estado,
        ])
    
    return output.getvalue()


def get_csv_template() -> str:
    """Generate CSV template for product import."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow([
        'nombre', 'imagen', 'sku', 'codigo_barras',
        'precio_compra', 'precio_venta',
        'gestionar_inventario', 'cantidad_disponible', 'stock_minimo',
        'marca', 'categorias', 'etiquetas', 'estado'
    ])
    
    # Example row
    writer.writerow([
        'Freno delantero XR 150',
        'https://example.com/freno.jpg',
        'FREN-DEL-XR150',
        '7501234567890',
        '16',
        '29',
        'true',
        '10',
        '2',
        'Brembo',
        'Frenos;Repuestos',
        'XR150;Mantenimiento',
        'publicado'
    ])
    
    return output.getvalue()


def _get_or_create_marca(db: Session, nombre: str) -> Marca | None:
    if not nombre:
        return None
    marca = db.query(Marca).filter(Marca.nombre == nombre.strip()).first()
    if not marca:
        marca = Marca(nombre=nombre.strip())
        db.add(marca)
        db.flush()
    return marca


def _get_or_create_categoria(db: Session, nombre: str) -> Categoria | None:
    if not nombre:
        return None
    cat = db.query(Categoria).filter(Categoria.nombre == nombre.strip()).first()
    if not cat:
        cat = Categoria(nombre=nombre.strip())
        db.add(cat)
        db.flush()
    return cat


def _get_or_create_etiqueta(db: Session, nombre: str) -> Etiqueta | None:
    if not nombre:
        return None
    tag = db.query(Etiqueta).filter(Etiqueta.nombre == nombre.strip()).first()
    if not tag:
        tag = Etiqueta(nombre=nombre.strip())
        db.add(tag)
        db.flush()
    return tag


def import_csv(db: Session, csv_content: str) -> dict:
    """Import products from CSV. Auto-creates brands, categories, tags."""
    reader = csv.DictReader(io.StringIO(csv_content))
    
    created = 0
    updated = 0
    errors = []
    
    for row_num, row in enumerate(reader, start=2):  # row 1 is header
        try:
            nombre = row.get('nombre', '').strip()
            if not nombre:
                errors.append(f'Fila {row_num}: nombre es requerido')
                continue
            
            # Check if product exists by SKU or codigo_barras
            sku = row.get('sku', '').strip() or None
            codigo_barras = row.get('codigo_barras', '').strip() or None
            
            existing = None
            if sku:
                existing = db.query(Producto).filter(Producto.sku == sku).first()
            if not existing and codigo_barras:
                existing = db.query(Producto).filter(Producto.codigo_barras == codigo_barras).first()
            
            marca = _get_or_create_marca(db, row.get('marca', ''))
            
            categorias = []
            if row.get('categorias'):
                for cat_name in row['categorias'].split(';'):
                    cat = _get_or_create_categoria(db, cat_name.strip())
                    if cat:
                        categorias.append(cat)
            
            etiquetas = []
            if row.get('etiquetas'):
                for tag_name in row['etiquetas'].split(';'):
                    tag = _get_or_create_etiqueta(db, tag_name.strip())
                    if tag:
                        etiquetas.append(tag)
            
            estado_str = row.get('estado', 'pendiente').strip().lower()
            estado = ProductoEstado(estado_str) if estado_str in ['publicado', 'pendiente', 'inactivo'] else ProductoEstado.pendiente
            
            def to_int(value: str, default: int = 0) -> int:
                try:
                    return int(float((value or '0').strip()))
                except (ValueError, TypeError):
                    return default
            
            precio_compra = to_int(row.get('precio_compra', ''), 0)
            precio_venta = to_int(row.get('precio_venta', ''), 0)
            cantidad = to_int(row.get('cantidad_disponible', ''), 0)
            stock_min = to_int(row.get('stock_minimo', ''), 0)
            
            if precio_compra <= 0 or precio_venta <= 0:
                errors.append(f'Fila {row_num}: precios deben ser mayores a 0')
                continue
            
            if existing:
                # Update existing
                existing.nombre = nombre
                existing.imagen = row.get('imagen', '').strip() or None
                existing.sku = sku
                existing.codigo_barras = codigo_barras
                existing.precio_compra = precio_compra
                existing.precio_venta = precio_venta
                existing.gestionar_inventario = row.get('gestionar_inventario', 'true').lower() == 'true'
                existing.cantidad_disponible = cantidad
                existing.stock_minimo = stock_min
                existing.marca_id = marca.id if marca else None
                existing.estado = estado
                
                # Update relationships
                existing.categorias = categorias
                existing.etiquetas = etiquetas
                
                updated += 1
            else:
                # Create new
                producto = Producto(
                    nombre=nombre,
                    imagen=row.get('imagen', '').strip() or None,
                    sku=sku,
                    codigo_barras=codigo_barras,
                    precio_compra=precio_compra,
                    precio_venta=precio_venta,
                    gestionar_inventario=row.get('gestionar_inventario', 'true').lower() == 'true',
                    cantidad_disponible=cantidad,
                    stock_minimo=stock_min,
                    marca_id=marca.id if marca else None,
                    estado=estado,
                )
                db.add(producto)
                db.flush()
                
                producto.categorias = categorias
                producto.etiquetas = etiquetas
                
                created += 1
            
        except ValueError as e:
            errors.append(f'Fila {row_num}: {str(e)}')
        except Exception as e:
            errors.append(f'Fila {row_num}: Error inesperado - {str(e)}')
    
    if created > 0 or updated > 0:
        db.commit()
    
    return {
        'created': created,
        'updated': updated,
        'errors': errors
    }
