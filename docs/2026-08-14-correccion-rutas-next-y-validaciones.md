# Corrección de rutas y validaciones de Next.js

## Contexto

Next.js trata `src/pages` como el directorio reservado del Pages Router. Las
pantallas reutilizables del storefront estaban allí aunque la aplicación usa
App Router, por lo que el validador generado las interpretaba como rutas legacy
y el build fallaba al no encontrar sus exports por defecto.

## Decisión

- Las pantallas de ruta reutilizables viven en `src/screens`.
- `src/app` mantiene exclusivamente las rutas y los límites propios del App
  Router.
- Los componentes cliente que consultan la URL se renderizan bajo `Suspense`
  para permitir el prerenderizado con `cacheComponents`.
- Los componentes de shadcn se conservan sin ediciones manuales; su regla de
  lint incompatible queda acotada a `src/components/ui`.

## Consecuencias

El build vuelve a generar las rutas de App Router correctamente y TypeScript
puede validar la aplicación sin confundir componentes internos con páginas
legacy.
