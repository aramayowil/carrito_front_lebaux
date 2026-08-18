# Composición responsive de la galería de obras

Fecha: 2026-08-18

## Decisión final

La vista previa fotográfica de `/obras/[slug]` usa dos composiciones según el
espacio disponible:

- antes de `lg`, un carrusel horizontal sin flechas, navegable por swipe y con
  una parte de la siguiente imagen visible como indicación de continuidad;
- desde `lg`, una imagen principal grande a la izquierda y dos imágenes
  apiladas a la derecha.

En escritorio se muestran como máximo tres vistas previas. Cuando la galería
contiene más recursos, la tercera mantiene su fotografía de fondo y agrega una
capa `+N`, donde `N` representa las imágenes restantes. Al seleccionar cualquier
vista se abre el lightbox en su posición correspondiente y desde allí puede
recorrerse la colección completa.

El primer proyecto mock incluye cinco imágenes para permitir la validación
visual del estado `+2`.

Este documento reemplaza las composiciones exteriores descritas en
`2026-08-18-galeria-inmersiva-obras.md` y
`2026-08-18-correccion-lightbox-obras.md`; el comportamiento del modal se
mantiene.
