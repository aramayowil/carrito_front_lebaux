# Zoom táctil contenido en el lightbox de Obras

Fecha: 2026-08-21

## Problema

En dispositivos móviles, el visor ampliado de `/obras/[slug]` usaba
`touch-auto` cuando la imagen estaba ampliada. El navegador podía interpretar
el gesto de dos dedos como zoom del viewport completo, rompiendo la composición
del diálogo y de la página en lugar de ampliar únicamente la fotografía.

## Decisión

`WorkGalleryLightbox` controla ahora el pinch dentro de la imagen activa:

- el zoom táctil queda limitado entre `1x` y `4x`;
- con zoom `1x`, un dedo sigue reservado al swipe horizontal de Embla;
- con dos dedos, el componente calcula la distancia entre toques y actualiza el
  zoom de la fotografía, bloqueando la propagación del gesto al carrusel;
- al estar ampliada, la superficie usa paneo táctil horizontal y vertical sobre
  su propio `overflow`, sin habilitar `pinch-zoom` del navegador;
- el carrusel desactiva temporalmente `watchDrag` mientras existe un pinch;
- doble toque y botón de zoom se mantienen como alternativas accesibles;
- `overscroll` queda contenido en el lightbox para evitar rebotes hacia la página.

La implementación conserva la geometría previa del modal y no modifica la
página de detalle fuera del visor fotográfico.
