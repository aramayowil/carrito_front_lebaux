# Filtros y encabezado de resultados del catálogo

Los filtros del catálogo por línea se reorganizaron como listas de selección
exclusiva. Las opciones dejan de representarse como grupos de píldoras y pasan a
usar filas livianas con estado, etiqueta y cantidad alineada.

- El mismo `CatalogFiltersPanel` se comparte entre sidebar y Sheet.
- Los grupos extensos limitan su altura y permiten scroll interno.
- Las medidas mantienen búsqueda cuando superan el umbral compacto.
- El sidebar desktop pierde la Card envolvente y se integra al layout mediante
  un divisor vertical.
- El resumen para limpiar filtros se presenta dentro del panel.

El nuevo `CatalogResultsHeader` reúne título, contador, carga y filtros activos:

- El título tiene prioridad sobre la cantidad.
- Los resultados parciales comunican su actualización con estado accesible.
- Los filtros activos usan acciones rectangulares compactas, removibles por
  separado o en conjunto.
- El skeleton refleja el encabezado y sidebar aligerados.
