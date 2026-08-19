# Obras dinámicas desde Supabase

Fecha: 2026-08-19.

## Alcance

La Home, `/obras`, `/obras/[slug]` y el sitemap comparten ahora la colección
publicada `catalog_items.kind = 'obra'`. Se retiraron el JSON y el adaptador mock
que alimentaban el portfolio experimental.

La Home filtra `destacadaEnInicio`, ordena por `ordenInicio` y muestra como
máximo tres proyectos. El portfolio no aplica ese límite y presenta todas las
obras publicadas. Los filtros se construyen con la colección dinámica
`categoria_obra`.

Antes/Después se deriva de cada obra cuyo bloque opcional
`antesYDespues.activo` esté habilitado. La ficha individual consulta su slug
directamente en Supabase, por lo que no necesita parámetros estáticos generados
desde contenido local.

## Compatibilidad

El servidor normaliza temporalmente las obras anteriores: si aún no tienen los
campos nuevos, conserva su imagen como primera foto de galería y las considera
destacadas. La migración del administrador realiza el backfill persistente.
