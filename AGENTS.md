# AGENTS.md

Guía para cualquier IA (Claude, Copilot, Cursor, etc.) que trabaje en este repositorio.
Leer esto antes de tocar código. El historial de decisiones está en `docs/`.

## Qué es este proyecto

Lebaux — tienda online (carrito de compras) de carritos de aluminio para ventas.
Stack: React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui + TanStack Query + Supabase + Zustand solo para el carrito.

## Reglas no negociables

1. **Componentes de UI = shadcn/ui, exclusivamente.**
   No se escriben primitivos de UI a mano (botones, inputs, dialogs, etc.) ni se
   instalan librerías de componentes alternativas. Si un componente de shadcn no
   está instalado, se agrega con la CLI:

   ```bash
   npx shadcn@latest add <componente>
   ```

   Un agente de IA en este entorno puede no tener acceso de red a `ui.shadcn.com`
   para ejecutar la CLI. En ese caso: **no inventar el componente a mano** — avisar
   al usuario el comando exacto a correr y esperar confirmación.

2. **Arquitectura de carpetas: Screaming Architecture.**
   La carpeta `src/features/` es la que "grita" de qué se trata la app (carrito,
   productos, checkout), no la tecnología usada. Ver detalle abajo.

3. **Cada cambio de arquitectura, paleta, o decisión técnica importante se
   documenta** en `docs/` con un archivo markdown nuevo (no se edita el
   historial existente), y se referencia acá si cambia una regla general.

4. **Paleta de colores:** ver `docs/2026-08-02-paleta-de-colores.md`. Las
   variables viven en `src/index.css` (`:root` / `.dark`) en formato OKLCH y se
   consumen solo vía clases de Tailwind (`bg-primary`, `text-success`, etc.),
   nunca hex hardcodeado en componentes.

5. **Responsive sin píxeles hardcodeados.**
   Usar la escala de Tailwind y sus breakpoints semánticos. Si hace falta un
   breakpoint adicional, definirlo como token en `@theme` usando `rem` y
   consumir su variante; no usar clases como `min-[360px]:...`. Ver
   `docs/2026-08-03-breakpoint-responsive-xs.md`.

6. **Supabase es la única fuente de verdad del contenido de negocio.**
   El estado remoto se consume con TanStack Query. No crear stores Zustand para
   productos, catálogos, administración, sitio ni estado efímero de UI. Zustand
   queda reservado exclusivamente al carrito persistente `lebaux-cart`; el estado
   visual temporal se resuelve con estado React o Context.

## Estructura de carpetas (Screaming Architecture)

```
src/
├── app/                 # composition root: App.tsx, providers, wiring
├── features/            # ⭐ el corazón screaming — una carpeta por capacidad de negocio
│   ├── cart/             # carrito: agregar/quitar, totales, persistencia
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/       # contexto React para UI efímera del flujo
│   │   ├── providers/     # proveedor del contexto de UI
│   │   ├── store/         # único store Zustand: carrito `lebaux-cart`
│   │   ├── services/
│   │   └── types/
│   ├── products/         # catálogo, filtros, detalle de producto
│   ├── checkout/         # flujo de compra
│   ├── admin/             # panel /admin: auth, formularios y CRUD de contenido
│   ├── site-content/      # documentos públicos: sitio, Inicio y experiencia
│   └── theme/             # toggle claro/oscuro
├── screens/              # pantallas de ruta, componen features entre sí
│   └── home/
│       └── sections/      # secciones propias de ESA página (no reutilizables)
├── routes/               # definición de rutas
├── components/
│   ├── ui/                # ⚠️ SOLO shadcn CLI. No editar a mano, no crear acá.
│   └── layout/             # shell de la app: Header, Footer, RootLayout
├── hooks/                # hooks genéricos, no atados a un feature
├── lib/                  # utils genéricas (cn, etc.)
├── services/              # cliente http base / config de API
├── types/                 # ⭐ tipos de dominio globales (catálogo, carrito, sitio)
├── data/mock/             # datos mock mientras no hay backend
└── assets/
```

### Regla para decidir dónde va un archivo nuevo

- ¿Es un primitivo de UI genérico (botón, input, card)? → `components/ui`, vía shadcn CLI.
- ¿Es parte del "esqueleto" de la app (header, footer, nav)? → `components/layout`.
- ¿Pertenece a una lógica de negocio concreta (carrito, productos, checkout)? → `features/<esa-cosa>`.
- ¿Es una sección visual que solo se usa en una página puntual? → `screens/<esa-página>/sections`.
- ¿Se reutiliza en más de un feature? → si es UI pura, `components/`; si es lógica, evaluar
  moverlo a `features/` compartido o a `lib/` según corresponda. No hay carpeta
  automática "shared" — se crea cuando aparece la segunda reutilización, no antes.
- ¿Es un tipo/interfaz de dominio (catálogo, carrito, sitio) usado por más de
  un feature o página? → `src/types` (un archivo por dominio + `index.ts`
  barrel). ¿Es un tipo exclusivo de un solo componente/hook? → se queda
  junto a ese archivo, no va a `src/types`.

## Convenciones de código

- Alias de imports: `@/*` → `src/*` (definido en `tsconfig.json` y `vite.config.ts`). No usar rutas relativas largas (`../../../`).
- `components.json` de shadcn no se toca: los alias de `ui`, `lib`, `hooks` apuntan
  a las rutas de siempre (`@/components/ui`, `@/lib`, `@/hooks`) a propósito, para
  que la CLI de shadcn siga funcionando sin reconfigurar nada.
- Cada componente de layout/feature lleva un comentario corto arriba explicando
  su propósito si no es autoevidente por el nombre.
- Cualquier control clickeable que viva sobre o al lado de una superficie con
  gestos propios (drag, swipe, pan — ej: flechas de un carrusel Embla) va con
  `<button>` nativo, no con `<Button>` de `@/components/ui/button`. Apilar la
  lógica de puntero de `@base-ui/react` sobre la de Embla causó clicks que a
  veces no disparaban, de forma intermitente y sin errores en consola (ver
  `src/components/ui/carousel.tsx`, `CarouselPrevious`/`CarouselNext`). Para
  todo lo demás, `<Button>` sigue siendo lo correcto.

## Estado del proyecto (ir actualizando)

- [x] Paleta de colores definida (logo → ámbar/gris + semánticos).
- [x] Estructura de carpetas Screaming Architecture.
- [x] Layout de aplicación completo (Navbar/Footer/RootLayout + HomePage).
- [x] Router (`react-router-dom` v7, `src/routes/router.tsx`).
- [x] Tipos globales del catálogo/carrito/sitio en `src/types` (ver
      `docs/2026-08-02-tipos-globales.md`).
- [x] Navbar, Footer y Home completos (Hero, Benefits, productos, Obras y
      About) desde `carrito_responsive_actualizado`; navegación de catálogo
      responsive incluida (ver `docs/2026-08-02-migracion-home.md`).
- [x] Primitivos de shadcn requeridos instalados mediante la CLI y verificados
      contra el registro oficial con `shadcn diff`.
- [x] Cards de ofertas y destacados de la Home migradas a
      `features/products` (ver `docs/2026-08-03-migracion-cards-home.md` y
      `docs/2026-08-18-promociones-home-livianas.md` y
      `docs/2026-08-18-promociones-home-imagen-cuadrada.md` y
      `docs/2026-08-18-promociones-home-proporcion-compacta.md` y
      `docs/2026-08-18-promociones-home-imagen-real-y-card-contenida.md` y
      `docs/2026-08-18-promociones-home-recorte-moderado.md` y
      `docs/2026-08-18-promociones-home-recorte-4-3.md` y
      `docs/2026-08-18-promociones-home-proporcion-original.md` y
      `docs/2026-08-18-promociones-home-card-angosta.md` y
      `docs/2026-08-18-promociones-home-card-compacta.md` y
      `docs/2026-08-18-promociones-home-card-reducida.md` y
      `docs/2026-08-18-destacados-home-card-reducida.md` y
      `docs/2026-08-18-cards-home-tamano-original.md` y
      `docs/2026-08-18-destacados-home-imagen-borde-a-borde.md` y
      `docs/2026-08-18-ancho-unificado-cards-home.md` y
      `docs/2026-08-18-geometria-unificada-cards-home.md`).
- [x] `features/products` completo: líneas, tipologías, filtros, catálogo,
      detalle y configurador (ver
      `docs/2026-08-03-migracion-catalogo-carrito-checkout.md`).
- [x] Carrito persistente con Zustand y checkout por WhatsApp en
      `features/cart` y `features/checkout`.
- [x] Home reorganizada con banner compacto, catálogos prioritarios, promociones
      y destacados separados, ritmo vertical unificado y Navbar sticky estable
      (ver `docs/2026-08-10-redisenio-home-ecommerce-y-navbar-sticky.md`).
- [x] Catálogo por línea rediseñado con hero editorial, filtros derivados con
      estado en URL, toolbar sticky, Sheet mobile y cards comparativas (ver
      `docs/2026-08-10-redisenio-catalogo-por-linea.md` y
      `docs/2026-08-18-introduccion-compacta-catalogo-linea.md` y
      `docs/2026-08-18-introduccion-tipografica-catalogo-linea.md` y
      `docs/2026-08-18-tipologias-confiables-y-toolbar-catalogo.md` y
      `docs/2026-08-18-filtros-y-resultados-catalogo-linea.md` y
      `docs/2026-08-18-buscador-medidas-y-filtro-vidrios.md` y
      `docs/2026-08-18-contraste-sidebar-filtros-catalogo.md` y
      `docs/2026-08-18-cards-producto-catalogo-livianas.md` y
      `docs/2026-08-18-cierre-compacto-catalogo-linea.md`).
- [x] Beneficios e indicaciones “Ideal para” administrables por línea, sin
      mapas editoriales cerrados en la vista pública (ver
      `docs/2026-08-11-contenido-editorial-lineas-administrable.md`).

- [x] Rework visual y responsive de checkout, catálogos, Home, navegación,
      Footer y cards de producto (ver
      `docs/2026-08-03-cierre-rework-visual-responsive.md`).
- [x] Panel admin en `/admin` (productos, líneas, obras, beneficios y datos
      del sitio) sobre un store de contenido único en `localStorage`, con
      login simple hardcodeado. El sitio público lee de ese store, no de
      `data/mock`, directamente (ver `docs/2026-08-04-panel-admin.md`).
- [x] Catálogos técnicos externos administrables por línea, con acceso
      compacto en Home, biblioteca pública dedicada, enlace en Footer y
      descarga contextual por línea (ver
      `docs/2026-08-10-catalogos-tecnicos-por-linea.md` y
      `docs/2026-08-18-home-acceso-documentacion-tecnica.md` y
      `docs/2026-08-18-redisenio-biblioteca-catalogos-tecnicos.md` y
      `docs/2026-08-18-exploracion-documental-catalogos-tecnicos.md` y
      `docs/2026-08-18-accion-unica-catalogos-tecnicos.md` y
      `docs/2026-08-18-catalogos-y-especificaciones-tecnicas.md` y
      `docs/2026-08-18-biblioteca-tecnica-sin-filtros.md`).
- [x] Jerarquía v2 sin entidad Categoría, catálogos globales de colores,
      vidrios, accesorios y tipos de apertura, altas rápidas, matriz de variantes
      Medida × Color × Vidrio y mano de apertura (ver
      `docs/2026-08-07-catalogo-global-insumos-jerarquia-v2.md`,
      `docs/2026-08-07-catalogo-tipos-apertura.md` y
      `docs/2026-08-07-variantes-propiedades-cartesianas.md`).
- [x] Productos simples sin variantes: precio e inventario a nivel producto,
      formulario reordenado y soporte en catálogo/carrito (ver
      `docs/2026-08-10-productos-simples-sin-variantes.md`).
- [x] Variantes sin imágenes propias y con visibilidad individual; heredan la
      galería del producto (ver
      `docs/2026-08-10-visibilidad-e-imagenes-de-variantes.md`).
- [x] Visibilidad de variantes alineada con el producto padre: Visible, No
      listado y Oculto (ver
      `docs/2026-08-10-estados-visibilidad-de-variantes.md`).
- [x] Productos con descripción breve y descripción extensa enriquecidas en la
      ficha pública (ver
      `docs/2026-08-10-descripciones-breve-extensa-productos.md`).
- [x] Descuentos 2.0: una promoción global por producto aplicada a
      combinaciones exactas, con representación coherente en Home, ficha,
      carrito y checkout (ver
      `docs/2026-08-10-descuentos-2-por-combinacion.md`).
- [x] ProductDetailPage compacta: configuración unificada, medida/vidrio en
      desplegables, promociones exactas, accesorios plegables y galería fija
      en escritorio (ver
      `docs/2026-08-10-product-detail-configurador-compacto.md`).
- [x] Productos relacionados manuales y ordenados desde ProductForm, con
      recomendación automática por línea/tipología cuando no hay selección
      (ver
      `docs/2026-08-10-productos-relacionados-manuales.md`).
- [x] Home administrable desde `/admin/inicio`: banners responsive enlazables,
      encabezado de beneficios, sección institucional y buscador público de
      productos en la Navbar (ver
      `docs/2026-08-10-home-administrable-y-buscador-navbar.md` y
      `docs/2026-08-18-cierre-institucional-home.md` y
      `docs/2026-08-18-cierre-institucional-contenido-dinamico.md` y
      `docs/2026-08-18-cierre-institucional-texto-remoto-y-sedes-fijas.md` y
      `docs/2026-08-18-resumen-institucional-home.md` y
      `docs/2026-08-18-cta-contacto-home-destacado.md` y
      `docs/2026-08-18-texto-institucional-home-completo.md`).
- [x] Nuestras obras limitada a tres proyectos, con selección exclusiva de la
      obra principal y representación destacada en la Home (ver
      `docs/2026-08-10-obras-home-seleccion-principal.md` y
      `docs/2026-08-18-card-obras-destacadas-home.md`).
- [x] Catálogos completos de la Home generados desde todas las líneas del
      store, con conteos públicos y grilla adaptable a su cantidad (ver
      `docs/2026-08-10-home-catalogos-dinamicos.md` y simplificación posterior
      en `docs/2026-08-18-home-lineas-sin-conteos.md`).
- [x] Revisión visual de Catálogos completos como bloque negro simple y
      destacado, sin perder su grilla dinámica (ver
      `docs/2026-08-10-home-catalogos-bloque-negro.md`).
- [x] Por qué elegirnos como bloque negro simple y dinámico según la cantidad
      de beneficios administrados (ver
      `docs/2026-08-10-home-beneficios-dinamicos-bloque-negro.md` y
      `docs/2026-08-18-beneficios-home-compactos.md` y
      `docs/2026-08-18-beneficios-home-composicion-uno-dos.md` y
      `docs/2026-08-18-beneficios-home-composicion-dos-uno.md`).
- [x] Composición centrada de Por qué elegirnos, incluyendo filas incompletas
      centradas mediante flex-wrap (ver
      `docs/2026-08-10-home-beneficios-centrados.md`).
- [x] Configuración pública administrable: orden y visibilidad de Home, textos de
      catálogo por línea y biblioteca técnica, bloques de confianza, checkout
      configurable y carrito reconciliado con el catálogo vigente (ver
      `docs/2026-08-11-configuracion-experiencia-publica.md`). Microcopy
      comercial y de flujo también administrable (ver
      `docs/2026-08-11-microcopy-publica-administrable.md`).
- [x] Administrador rediseñado como sistema responsive: navegación agrupada,
      páginas y acciones consistentes, tarjetas móviles de productos, validaciones
      compartidas e invariantes de integridad en el store (ver
      `docs/2026-08-11-redisenio-integral-administrador.md`).
- [x] Ordenamiento drag-and-drop en listas pequeñas del administrador con `@dnd-kit/react`, handles dedicados, IDs estables y persistencia compatible con borradores locales y Zustand (ver `docs/2026-08-11-ordenamiento-dnd-kit-admin.md`).
- [x] Base de infraestructura para Supabase, TanStack Query y Cloudinary: cliente público, Auth con perfil administrador, esquema híbrido con RLS, importación inicial y subidas firmadas (ver `docs/2026-08-11-infraestructura-supabase-tanstack-cloudinary.md`).
- [x] Autenticación administrativa migrada completamente a Supabase Auth y TanStack Query, sin fallback hardcodeado ni estado Zustand; historial canónico de migraciones en `src/sql` sincronizado con Supabase CLI (ver `docs/2026-08-11-autenticacion-supabase-y-registro-sql.md`).
- [x] CRUD y lectura de productos preparados para migración gradual a Supabase mediante repositorio, hooks TanStack Query, selector por recurso, caché sensible a sesión y eliminación relacional transaccional (ver `docs/2026-08-11-migracion-gradual-productos-supabase.md`).
- [x] Líneas, tipologías y tipos de apertura preparados como bloque estructural para lectura y CRUD gradual en Supabase, con integridad de eliminación en PostgreSQL y control de conteos en el dashboard (ver `docs/2026-08-11-migracion-catalogos-estructurales-supabase.md`).
- [x] Unicidad de catálogos corregida al ámbito `tipo + línea padre + slug`, permitiendo tipologías homónimas en líneas diferentes (ver `docs/2026-08-11-unicidad-catalogos-por-linea-supabase.md`).
- [x] Colores, vidrios y accesorios preparados para lectura y CRUD gradual en Supabase, con propagación transaccional a payloads de productos, integridad de referencias y consumo unificado en configurador y carrito (ver `docs/2026-08-11-migracion-catalogos-insumos-supabase.md`).
- [x] Obras y beneficios preparados como colecciones Home remotas y ordenadas, con máximo de tres obras y selección principal garantizados en PostgreSQL (ver `docs/2026-08-11-migracion-obras-beneficios-supabase.md`).
- [x] Documentos `sitio`, `inicio` y `experiencia` migrados mediante el feature compartido `site-content`; todas las fuentes de contenido quedaron activadas en Supabase (ver `docs/2026-08-11-documentos-sitio-supabase.md`).
- [x] Contenido operativo migrado por completo a Supabase: se retiraron el store, la importación local y la persistencia lebaux-content; el carrito conserva su almacenamiento propio (ver docs/2026-08-11-cierre-migracion-contenido-y-medios-cloudinary.md).
- [x] Zustand reducido al único store persistente del carrito (`lebaux-cart`); la UI de carrito/checkout usa Context de React y se limpian las claves heredadas `lebaux-content` y `lebaux-admin-auth` (ver `docs/2026-08-12-store-unico-carrito.md`).
- [x] Pantallas reutilizables movidas a `src/screens` para evitar la detección errónea de Pages Router por Next.js App Router (ver `docs/2026-08-14-correccion-rutas-next-y-validaciones.md`).
- [x] Consultar precio extendido a variantes en la tienda pública: override global, decisión individual, ficha sin importes, promociones coherentes y protección del carrito (ver `docs/2026-08-15-consultar-precio-variantes-tienda-publica.md`).
- [x] Página experimental de obras con contenido mock, imágenes locales, animación progresiva y acceso desde Home/Footer (ver `docs/2026-08-18-pagina-publica-nuestras-obras.md`).
- [x] Prototipo de obras extendido con categorías dinámicas desde JSON, relato individual, remodelaciones antes/después, sedes y eslogan final (ver `docs/2026-08-18-categorias-remodelaciones-y-sedes-obras.md`).
- [x] Nuestras obras sin banner fotográfico inicial y con doce casos mock reutilizando la serie visual existente (ver `docs/2026-08-18-obras-sin-banner-y-galeria-ampliada.md`).
- [x] Fichas individuales mock de obras con galería, desafío, solución,
      materiales, testimonio, CTA contextual y animaciones editoriales variadas
      (ver `docs/2026-08-18-fichas-individuales-y-animacion-obras.md`).
- [x] Componentes y contratos públicos de Obras organizados como capacidad en
      `features/works`, desacoplados del JSON mock (ver
      `docs/2026-08-18-feature-works.md`).
- [x] Obras destacadas de la Home con composición editorial 1+2, carrusel mobile
      y CTA único hacia el portfolio (ver
      `docs/2026-08-18-home-obras-editorial.md`).
- [x] Obras incorporada a la navegación principal y mobile, con el grupo de
      enlaces centrado respecto al Navbar completo (ver
      `docs/2026-08-18-navbar-obras-centrado.md`).
- [x] Galería inmersiva responsive en las fichas de obras, con Dialog, carrusel,
      navegación gestual/teclado y zoom desplazable (ver
      `docs/2026-08-18-galeria-inmersiva-obras.md` y corrección de ancho/galería
      en `docs/2026-08-18-correccion-lightbox-obras.md`; composición responsive
      final en `docs/2026-08-18-composicion-responsive-galeria-obras.md`).
- [ ] Desplegar `cloudinary-signature` y `cloudinary-cleanup`, configurar sus secretos del lado de Supabase y completar la prueba operativa de medios. El frontend no usa una bandera Vite adicional.

Cuando se complete un ítem o se agregue uno nuevo, actualizar esta lista y sumar
un archivo en `docs/` si la decisión lo amerita.
