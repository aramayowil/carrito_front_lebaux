# Rediseño comercial de la ficha de producto

Fecha: 2026-08-18

## Objetivo

Mejorar la jerarquía visual de `ProductDetailPage` para que la imagen, el nombre,
el precio y la acción principal se comprendan antes que las opciones técnicas.

## Decisiones

- La galería conserva el visor ampliado, suma zoom desplazable y adopta una
  superficie cuadrada porque las fotografías públicas de producto usan
  relación 1:1.
- Línea y tipología se presentan como metadatos editoriales, sin badges, para
  reducir ruido alrededor del nombre.
- El precio reactivo se muestra antes de los selectores. La cantidad y las
  acciones permanecen al final del configurador.
- Cuando existen muchas medidas, las opciones frecuentes permanecen visibles y
  “Ver todas” abre un selector modal con búsqueda local y cierre automático al
  elegir una medida.
- `Agregar al carrito` es la acción principal cuando existe un precio. WhatsApp
  pasa a ser una alternativa visualmente secundaria; recupera protagonismo
  cuando la configuración requiere cotización.
- El configurador elimina sombra, reduce radios y evita encabezados redundantes.
- Los bloques de confianza aparecen inmediatamente después del bloque de compra.
  La descripción extensa se presenta como contenido editorial con menos cajas.
- Los controles ubicados sobre o junto al carrusel usan botones nativos para no
  superponer el manejo de puntero de Base UI con el desplazamiento de la galería.
- Los skeletons replican el nuevo orden, proporción y geometría para minimizar
  saltos durante la carga.

## Responsive

- En mobile se conserva la barra fija de precio y compra.
- Las miniaturas laterales aparecen desde tablet; en teléfonos la navegación se
  realiza mediante desplazamiento horizontal.
- La fotografía principal mantiene relación cuadrada en todos los breakpoints.
