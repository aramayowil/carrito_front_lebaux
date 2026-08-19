# Galería de producto selectiva y responsive

Fecha: 2026-08-19

## Decisión

La galería de la ficha deja de comportarse como carrusel en escritorio. La
imagen principal es una vista estática que cambia al seleccionar una miniatura y
abre el visor inmersivo al pulsarla.

La columna lateral muestra como máximo seis posiciones:

- Las primeras cinco funcionan como selectores de la imagen principal.
- Cuando existen más de seis fotografías, la sexta utiliza el fondo de la sexta
  imagen y muestra `+N`, contando todas las fotografías restantes desde esa
  posición. Al pulsarla abre el visor en esa imagen.
- Si hay seis fotografías o menos, todas las miniaturas son selectores normales.

En mobile se utiliza el carrusel de shadcn/Embla con una imagen completa por
vista, navegación gestual e indicadores inferiores, sin flechas. Pulsar cualquier
imagen abre el mismo visor de pantalla completa utilizado en escritorio.

El visor conserva navegación por carrusel, controles desktop, indicadores,
doble toque y zoom desplazable. Todos los controles que conviven con superficies
gestuales son botones nativos.
