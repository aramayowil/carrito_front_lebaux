# Página pública experimental de Nuestras obras

Fecha: 2026-08-18

## Decisión

La Home conserva como resumen únicamente las primeras tres obras recibidas desde Supabase y suma un acceso explícito a `/obras`.

La nueva ruta se diseña inicialmente con seis casos mock para validar composición, textos, imágenes y movimiento antes de definir la administración definitiva del contenido. El teléfono de contacto continúa viniendo de la configuración pública del sitio.

## Arquitectura

- Los casos temporales viven en `src/data/mock/obras.ts` y reutilizan el tipo global `Obra`.
- Las imágenes generadas para el prototipo viven en `public/images/obras/`.
- La tarjeta compartida entre Home y la página pública vive en `src/features/site-content/components/WorkCard.tsx`.
- La composición editorial vive en `src/screens/works/WorksPage.tsx`; App Router sólo resuelve metadata, datos de contacto y wiring.
- La ruta se enlaza desde la Home y el Footer, y se declara en el sitemap.

## Movimiento y responsive

Las animaciones de portada y revelado progresivo se implementan en CSS. El revelado por scroll usa `animation-timeline: view()` como mejora progresiva y todos los efectos quedan desactivados mediante `prefers-reduced-motion`.

La composición usa la escala y los breakpoints semánticos de Tailwind, sin breakpoints en píxeles ni estado cliente adicional.

## Próximo paso

Cuando el diseño y el modelo editorial queden aprobados, la colección completa deberá migrarse a Supabase y el panel deberá distinguir las tres obras mostradas en Home del resto de la galería.
