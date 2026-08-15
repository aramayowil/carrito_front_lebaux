# Consultar precio por variante en la tienda pública

Fecha: 2026-08-15

## Objetivo

Alinear la ficha pública de producto con el modelo incorporado en el administrador para ocultar precios de forma global o por combinación Medida × Color × Vidrio.

## Regla efectiva

La publicación de precio se resuelve siempre con:

```ts
producto.precios.consultarPrecio || variante?.consultarPrecio === true
```

`Producto.precios.consultarPrecio` sigue siendo el override global. Cuando está desactivado, cada `VarianteProducto.consultarPrecio` decide si esa combinación publica precio.

## Comportamiento de ProductDetail

- Una configuración con precio publicado mantiene precios, promociones y alta al carrito.
- Una configuración marcada como consultar precio no muestra importes ni promociones.
- En ese caso se oculta la acción de agregar al carrito y WhatsApp pasa a ser la acción principal.
- El mensaje de WhatsApp conserva producto, medida, color, vidrio, accesorios, mano y cantidad, pero no expone importes internos.
- Al cambiar a otra variante con precio publicado, el flujo normal vuelve automáticamente.

## Compatibilidad con datos históricos

Los productos se leen desde `products.payload` (JSONB). La tienda normaliza `precios.consultarPrecio` y `variantes[].consultarPrecio` con `false` cuando el campo no existe, complementando el backfill de la migración creada desde el administrador.

## Coherencia de catálogo y carrito

Las variantes a consultar no participan del precio “Desde” ni de promociones públicas. La reconciliación del carrito elimina una configuración si posteriormente pasa a consultar precio para evitar conservar precios obsoletos.
