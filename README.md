# Lebaux Carrito

Tienda pública en Next.js App Router. El contenido público se consulta desde Supabase en el servidor; la Home, ficha de producto y catálogos técnicos se renderizan principalmente como Server Components. Solo búsqueda, filtros interactivos, configurador, carrito y checkout hidratan JavaScript.

## Desarrollo

```bash
npm install
npm run dev
```

Variables requeridas: ver `.env.example`.

El único estado persistente del navegador es `lebaux-cart`.
