# Cierre de revisión visual y de imágenes de Home

La revisión integral de la Home incorpora tres ajustes coordinados:

- Nosotros recupera `bg-background` y un divisor definido para separarse del
  fondo `bg-muted/40` de Obras.
- El espaciado base de Catálogos, Promociones, Destacados, Beneficios, Obras y
  Nosotros se reduce únicamente en mobile; los ritmos desde `sm` se conservan.
- El logo local utiliza `next/image` con dimensiones intrínsecas. El Hero
  mantiene `<picture>` para servir piezas diferentes por viewport, pero sus URLs
  de Cloudinary ahora incluyen formato/calidad automáticos y `srcset` responsive.

Los skeletons reproducen los nuevos espacios y fondos para evitar saltos de
layout.
