# Robustez de carga de la galería de obras

Fecha: 2026-08-21

## Problemas revisados

La ficha `/obras/[slug]` tenía varias situaciones silenciosas que podían producir
una galería incompleta o una experiencia distinta entre desktop y mobile:

- `galeria` se confiaba directamente desde el `payload` de Supabase; URLs vacías
  o repetidas llegaban al render.
- el lightbox usaba `next/image` directamente mientras las vistas previas usaban
  `ProductImage`, por lo que una fuente no soportada por Next podía fallar solo
  al ampliar.
- no había estado estable para una obra sin imágenes válidas.
- el índice activo no se protegía si la colección cambiaba de tamaño.
- el primer recurso podía marcarse como prioritario dos veces porque mobile y
  desktop se renderizan simultáneamente y se alternan por CSS.
- la ruta de detalle heredaba el skeleton global, que no representa la geometría
  real de la galería.

## Solución

- Las URLs se recortan, filtran y deduplican en servidor; la imagen principal se
  usa como fallback solo cuando la galería queda vacía.
- `WorkGalleryLightbox` repite la validación defensiva antes de construir Embla.
- El visor ampliado usa `ProductImage`, igual que las vistas previas.
- Se muestra un placeholder estable cuando no existe ninguna foto válida.
- Los índices se limitan al tamaño real de la colección.
- Al abrir el lightbox se priorizan la imagen activa y sus vecinas para reducir
  parpadeos durante swipes rápidos.
- Se conserva un único preload de la imagen principal mediante un `sizes` común
  para mobile y desktop.
- `/obras/[slug]/loading.tsx` usa `WorkDetailPageSkeleton`, con carrusel 4:3 en
  mobile y mosaico 1+2 en desktop.
