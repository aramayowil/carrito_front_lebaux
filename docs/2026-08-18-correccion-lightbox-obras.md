# Corrección de composición y ancho del lightbox de obras

Fecha: 2026-08-18

## Ajustes

La primera versión del visor heredaba el límite `sm:max-w-md` del `Dialog`, por
lo que no ocupaba todo el viewport en pantallas medianas y grandes. La ficha
ahora sobrescribe también esa variante responsive y fija el contenido, carrusel
y diapositivas al ancho y alto completos del viewport.

Las imágenes del visor se precargan porque la galería mock contiene sólo tres
recursos por obra y la navegación debe ser inmediata. La galería visible de la
ficha vuelve a una única columna en todos los tamaños, con proporción más
horizontal desde `sm`, para mantener una lectura fotográfica simple.

Esta corrección reemplaza la composición mobile de dos miniaturas mencionada en
`2026-08-18-galeria-inmersiva-obras.md`.
