# Fichas individuales y animación de obras

Fecha: 2026-08-18

## Decisión

El prototipo público de obras incorpora una ficha individual en
`/obras/[slug]`. Mientras el administrador todavía no exponga estos campos, el
contenido se mantiene en `src/data/mock/obras.json` como contrato temporal.

Cada obra define:

- slug público estable;
- galería de imágenes;
- desafío del proyecto;
- solución implementada;
- materiales y sistemas utilizados;
- ubicación y testimonio.

Las tarjetas de la galería enlazan a estas fichas, las rutas conocidas se
generan estáticamente y se incorporan al sitemap. La ficha finaliza con una
consulta contextual por WhatsApp que incluye el nombre de la obra visitada.

## Movimiento

La entrada editorial inicial conserva su animación escalonada. Para evitar que
todo el recorrido repita el mismo efecto, el resto alterna tres tratamientos
progresivos y discretos: desplazamiento corto, aparición suave y aparición con
una escala mínima para composiciones fotográficas. Todos respetan
`prefers-reduced-motion` y no requieren hidratar componentes sólo para animar.

## Contenido final

El cierre general cambia a “Tu proyecto empieza con una idea. Nosotros la
convertimos en realidad.” para conectar la propuesta a medida con una acción
concreta y mantener una voz cercana.

## Alcance posterior

Al conectar estos datos al administrador, los campos mock deben trasladarse al
modelo remoto de obras conservando los slugs y la estructura de galería. El JSON
deja de ser fuente de verdad en ese momento.
