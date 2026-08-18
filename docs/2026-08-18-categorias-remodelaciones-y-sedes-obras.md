# Categorías, remodelaciones y sedes en Nuestras obras

Fecha: 2026-08-18

## Decisión temporal

La experiencia de `/obras` usa `src/data/mock/obras.json` como contrato provisional mientras se define su administración en Supabase. El JSON separa:

- categorías;
- obras y su relato particular;
- remodelaciones con imágenes antes/después;
- sedes y zonas de cobertura;
- eslogan comercial final.

Las categorías iniciales son Cerramientos, Casas, Locales y Personalizados. La interfaz no codifica esos cuatro valores: genera los filtros recorriendo la colección recibida, por lo que admite cualquier cantidad y orden futuro.

## Interacción

`WorksGallery` mantiene el filtro activo como estado efímero de React. No se introduce un store global. Los controles usan `Button` de shadcn/ui, son navegables por teclado y exponen `aria-pressed`.

Cada tarjeta incorpora un texto editorial único y ubicación. La remodelación compara dos fotografías del mismo edificio en una grilla apilada en mobile y paralela desde tablet.

## Recursos visuales

La fotografía del estado anterior se generó a partir del estado final conservando encuadre y geometría. El recurso final optimizado vive en `public/images/obras/remodelacion-fachada-antes.webp`; el estado posterior reutiliza la imagen ya existente de la obra.

## Migración futura

Al implementar el administrador, categorías, obras, remodelaciones y sedes deberán convertirse en recursos Supabase ordenables y publicados. El JSON se retirará cuando esa fuente remota cubra el contrato actual.
