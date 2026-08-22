# Simplificación de la ficha individual de obras

Fecha: 2026-08-22

## Objetivo

Dar a `/obras/[slug]` una presentación más editorial y simple, haciendo que el título, la descripción y las imágenes sean los protagonistas.

## Cambios

- Se retiraron de la ficha individual la categoría, especificación, ubicación, desafío, solución, materiales y el CTA inferior.
- La cabecera mantiene el título alineado a la izquierda y mejora su jerarquía tipográfica.
- Se agregaron únicamente apoyos editoriales fijos y discretos (`Proyecto realizado`, `Galería` y `Registro del proyecto`) para dar estructura visual sin sumar datos ficticios a la obra.
- La galería y su lightbox se conservan sin modificar su comportamiento.
- El skeleton se actualizó para reproducir la nueva composición.
- La ruta individual ya no carga `sitio` ni `categorias` porque esos datos dejaron de ser necesarios en esta pantalla, reduciendo trabajo del servidor.
