# Obras destacadas en la Home

Fecha: 2026-08-18

## Decisión

La Home presenta como máximo tres obras destacadas y delega el catálogo,
categorías y fichas completas a `/obras`.

La composición se adapta por contexto:

- en mobile y tablet se usa el `Carousel` de shadcn, con una obra completa por
  slide, navegación por swipe e indicadores inferiores, sin flechas;
- desde `lg` se muestra una obra principal a la izquierda y dos secundarias
  apiladas a la derecha.

Cada fotografía incorpora una franja oscura compacta con tipo, título y sistema,
y enlaza a su ficha. El cierre unifica la invitación en un único bloque oscuro
con el CTA ámbar “Explorar todas las obras”; se retiran el botón outline y el CTA
de WhatsApp que antes competían entre sí.

## Integración temporal

La colección administrable de Home todavía no entrega el slug público de la
ficha. `ObrasSection` contiene una lista temporal de tres slugs mock y la aplica
por posición. Al extender el modelo remoto, cada obra destacada debe entregar su
slug y esta adaptación debe eliminarse.

El componente visual vive en
`features/works/components/HomeWorksShowcase.tsx`; la composición y adaptación de
datos permanece en `screens/home/sections/ObrasSection.tsx`.
