# Destacados de Home compactos en mobile

La Home presenta como máximo los primeros cuatro productos destacados según el
orden recibido. En teléfonos se muestran dentro de un carrusel manual, una card
por vez, con swipe e indicadores inferiores nativos; no incluye flechas ni
reproducción automática.

Desde `sm` se conserva la distribución de dos, tres y cuatro columnas. El
filtrado y el límite permanecen en el componente servidor, mientras que solo el
carrusel mobile hidrata interacción. El skeleton replica ambos modos.
