# Mosaico de líneas del Home administrable

Fecha: 2026-08-21

## Decisión

La presentación editorial de cada línea en el mosaico de Inicio pasa a formar
parte de `LineaProducto` mediante `mosaicoInicio`. No se reutilizan
`descripcion` ni `idealPara[]` porque esos campos pertenecen a la página interna
del catálogo y tienen otra semántica.

`mosaicoInicio` contiene:

- `descripcion`: texto comercial mostrado exclusivamente en Inicio;
- `coloresDisponibles`: resumen libre mostrado en la ficha;
- `vidrios`: resumen libre mostrado en la ficha;
- `idealPara`: uso recomendado resumido;
- `productosIds`: hasta tres IDs ordenados de productos de la misma línea.

El orden de `productosIds` es visual: el primer producto ocupa la imagen
principal y los dos siguientes las posiciones laterales.

## Administración

`/admin/lineas/:slug` incorpora una sección “Presentación en Inicio”. Los cuatro
textos mantienen el autoguardado existente del editor. La selección de productos
se limita a la línea actual, admite hasta tres elementos y puede reordenarse con
el mismo patrón drag-and-drop usado por otras listas pequeñas del administrador.

## Persistencia

No se agrega una tabla ni columnas nuevas. `catalog_items.payload` continúa
siendo la representación JSON completa de la línea. La migración
`202608210001_mosaico_inicio_lineas.sql` inicializa el bloque en líneas existentes
y amplía `eliminar_producto_y_relaciones` para limpiar referencias del mosaico
cuando se borra un producto.

## Tienda pública

El Home deja de usar configuraciones hardcodeadas para Módena y Herrero. Renderiza
todas las líneas recibidas desde Supabase y consume `mosaicoInicio`. Si una línea
todavía no tiene tres productos seleccionados, la tienda completa temporalmente
los espacios con productos visibles de esa misma línea (y, como último respaldo,
el banner), evitando romper la composición mientras se termina de configurar.
