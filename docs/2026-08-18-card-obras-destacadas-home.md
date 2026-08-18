# Card de obras destacadas y autoplay mobile

La representación de obras destacadas de la Home se separó en
`FeaturedWorkCard`, evitando mezclar la tarjeta editorial con la lógica del
carrusel.

- En mobile usa la variante `vertical`: imagen `4/3`, contenido fuera de la
  fotografía y acceso explícito a la ficha del proyecto.
- En desktop usa la variante `overlay` dentro de la composición editorial 1+2.
- El carrusel mobile avanza automáticamente cada 5,5 segundos.
- El intervalo se reinicia después de un desplazamiento y se pausa durante la
  interacción del usuario.
- El avance automático se desactiva cuando el sistema solicita movimiento
  reducido.

Los controles y la estructura del carrusel continúan proviniendo del componente
shadcn instalado en `src/components/ui/carousel.tsx`.
