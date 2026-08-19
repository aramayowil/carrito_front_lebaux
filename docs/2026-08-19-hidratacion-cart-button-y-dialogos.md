# Hidratación del botón de carrito junto a diálogos

Fecha: 2026-08-19

## Problema

Base UI aplica `inert` y `aria-hidden` al contenido externo cuando abre un
`Dialog` o `Sheet` modal. `CartButton` estaba renderizado en el servidor dentro
de una frontera `Suspense` independiente. Si una galería se abría antes de que
esa frontera terminara de hidratar, Base UI modificaba su HTML y React detectaba
atributos distintos a los enviados por el servidor.

## Decisión

`CartButton` se carga con `next/dynamic` y `ssr: false` desde la frontera cliente
`CarritoGlobal`. El FAB no aporta contenido indexable, ya posee animación de
entrada y depende de estado persistente y de la ruta actual, por lo que montarlo
después de hidratar no perjudica el contenido principal.

No se usa `suppressHydrationWarning`: se evita que exista HTML pendiente de
hidratar en el nodo que Base UI puede marcar como inerte.
