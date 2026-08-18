# Galería inmersiva en fichas de obras

Fecha: 2026-08-18

## Decisión

Las fotografías de `/obras/[slug]` abren una galería inmersiva construida con
los componentes shadcn `Dialog` y `Carousel`. La imagen seleccionada determina
la diapositiva inicial y la ficha permanece en segundo plano, sin navegación a
otra ruta.

La experiencia ofrece:

- fondo oscuro translúcido a pantalla completa;
- cierre explícito y mediante Escape;
- navegación con flechas y teclado en escritorio;
- navegación por swipe en dispositivos táctiles;
- contador de posición;
- zoom mediante control visible o doble click/toque;
- desplazamiento de la imagen ampliada para inspeccionar detalles.

Los controles que conviven con la superficie gestual usan botones nativos,
siguiendo la regla del carrusel documentada en `AGENTS.md`. El zoom desactiva
temporalmente el arrastre de Embla para evitar cambios accidentales de imagen.

## Responsive y accesibilidad

En mobile, la vista principal ocupa el ancho completo y las imágenes secundarias
forman una fila de dos columnas. Dentro del modal se priorizan swipe, doble toque
y controles táctiles amplios. En desktop aparecen controles laterales y se
mantiene la navegación por flechas del teclado.

El diálogo declara título y descripción para tecnologías de asistencia, cada
disparador tiene una etiqueta contextual y el foco visible se conserva en
miniaturas y controles.
