# Buscador de medidas y filtro de vidrios

El filtro de medidas deja de desplegar el catálogo completo por defecto.

- Presenta cinco sugerencias iniciales.
- Permite buscar escribiendo formatos equivalentes con `x` o `×`.
- Enter selecciona una coincidencia exacta o el único resultado disponible.
- “Ver más” y “Ver menos” controlan la expansión sin perder la búsqueda.
- La medida seleccionada se mantiene visible al volver al estado inicial.

Las facetas del catálogo incorporan `glassOptions`, derivadas de
`Producto.opcionesVidrio` sobre el dataset completo y por tipología. El filtro
de vidrio comparte URL, carga completa, conteos y resumen removible con el resto
de filtros mediante el parámetro `vidrio`.
