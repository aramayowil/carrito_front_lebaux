# Tipologías confiables y toolbar del catálogo

La navegación del catálogo por línea deja de inferir sus tipologías desde la
primera tanda de productos recibida por el cliente.

- El servidor obtiene las tipologías presentes desde el conjunto completo de
  productos visibles de la línea.
- Cada grupo de facetas incluye su total exacto de productos.
- Una tipología puede mostrarse desde el primer render aunque ninguno de sus
  productos esté dentro de la primera tanda paginada.
- Mientras una combinación necesita completar el catálogo en memoria, el
  contador comunica que los resultados se están actualizando.

La navegación se extrajo a `CatalogLineToolbar`:

- Tabs lineales compactos con indicador ámbar.
- Desplazamiento horizontal sin scrollbar visible.
- Filtros y ordenamiento reunidos en la misma toolbar.
- Segunda fila de acciones únicamente en mobile para preservar el ancho útil de
  las tipologías.
- `Sheet` mobile único y controlado desde la pantalla.
