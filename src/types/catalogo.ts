/**
 * Tipos del catálogo — CARRITO LEBAUX
 *
 * Jerarquía real del catálogo (v5, admin-gestionable):
 *
 * Línea        → sistema de aluminio (Herrero, Módena, A30, ...)
 * └── Tipología → agrupador comercial dentro de la línea (ej: "Ventanas")
 *     └── Producto → el artículo concreto, con sus variantes y un tipo de
 *         │          apertura referenciado desde el catálogo global
 *         └── Variante → una combinación exacta Medida + Color, con su
 *                         propio precio, stock e imágenes
 *
 * Por qué cambió (ver docs/2026-08-02-tipos-globales.md para la historia
 * completa de versiones anteriores):
 *
 * La v2 de estos tipos cerraba `Línea` y `Categoría` como *union types*
 * fijos a propósito, porque el catálogo lo curaba un desarrollador y no
 * hacía falta pagar el costo de mantener tablas intermedias (YAGNI). Esa
 * premisa cambió: ahora el admin necesita poder crear líneas nuevas (ej:
 * "A30") y organizar tipologías propias sin tocar código. Por eso `Línea` y
 * `Tipología` son entidades con CRUD (`id`, `slug`, `orden`).
 *
 * También cambia el modelo de variantes: antes `medidas` y `colores` eran
 * listas independientes con un adicional de precio cada una (no se podía
 * decir "el 120x100 en negro cuesta distinto que el 120x100 en blanco").
 * Ahora `Producto.variantes` es la fuente de verdad: cada combinación
 * Medida×Color×Vidrio es un objeto con su propio precio, stock e imágenes.
 * `medidasDisponibles`/`coloresDisponibles` son listas derivadas que se
 * mantienen en el producto solo para no iterar todo `variantes` en cada
 * render de un selector o filtro (denormalización deliberada, ver
 * `sincronizarListasDerivadas` en `features/admin/lib/producto-factory.ts`).
 *
 * `tipoApertura` guarda el slug estable de una entidad del catálogo global de
 * aperturas. Sigue siendo ortogonal a la tipología: indica CÓMO abre, mientras
 * la tipología indica QUÉ es.
 */

/** Única moneda soportada hoy. Unión de un solo miembro a propósito: deja
 *  documentado que el sistema asume ARS en todos lados (precios, carrito),
 *  y si mañana se suma otra moneda, el compilador señala cada lugar que
 *  hay que revisar en cuanto se agregue un segundo miembro. */
export type CodigoMoneda = "ARS"

/**
 * Slug de una línea (sistema de aluminio). Antes era una unión cerrada
 * (`"herrero" | "modena"`); ahora es `string` porque el admin puede crear
 * líneas nuevas desde el panel (ver `AdminLinesPage`). El nombre del alias
 * se mantiene para no tener que tocar cada sitio que lo importaba.
 */
export type SlugLineaProducto = string

/** Slug estable de un mecanismo de apertura administrable. */
export type TipoApertura = string

/** Cómo FUNCIONA un producto. Es un catálogo global administrable e
 * independiente de la tipología. */
export interface TipoAperturaProducto {
  id: string
  slug: TipoApertura
  nombre: string
  descripcion: string
  orden: number
}

export type SlugAccesorio = string

/** Identificador estable de un color del catálogo. Se genera desde el nombre al crear el color. */
export type SlugColorPerfil = string

export type SlugOpcionVidrio = string

/* --------------------------------------------------------------------------
 * Líneas
 * ------------------------------------------------------------------------ */

/** Nombre estable de cualquier ícono disponible en Lucide. */
export type IconoBeneficioCatalogoLinea = string

/** Argumento comercial administrable que distingue a una línea. */
export interface BeneficioCatalogoLinea {
  id: string
  titulo: string
  descripcion: string
  icono: IconoBeneficioCatalogoLinea
}

/**
 * Sistema o familia de perfiles de aluminio. Es el primer nivel de la
 * jerarquía y ahora tiene CRUD completo desde `/admin/lineas`.
 *
 * @example
 * const lineaHerrero: LineaProducto = {
 *   id: "linea-herrero",
 *   slug: "herrero",
 *   nombre: "Línea Herrero",
 *   subtitulo: "Robustez para grandes vanos",
 *   descripcion: "Perfil reforzado pensado para aberturas de gran tamaño.",
 *   imagenBannerEscritorio: "/img/lineas/herrero-banner.jpg",
 *   imagenBannerMovil: "/img/lineas/herrero-banner-movil.jpg",
 *   textoAlternativoBanner: "Abertura de aluminio de la línea Herrero",
 * };
 */
export interface LineaProducto {
  id: string
  slug: SlugLineaProducto
  nombre: string
  subtitulo: string

  /** Descripción ingresada por el usuario administrador. */
  descripcion: string

  /** Imagen panorámica del encabezado del catálogo en tablet y escritorio. */
  imagenBannerEscritorio: string

  /** Versión vertical del mismo banner, encuadrada específicamente para móvil. */
  imagenBannerMovil: string

  /** Descripción accesible de las imágenes del banner. */
  textoAlternativoBanner: string

  /** Beneficios editoriales mostrados al final del catálogo de la línea. */
  beneficiosCatalogo: BeneficioCatalogoLinea[]

  /** Usos o proyectos recomendados para comparar esta línea con las demás. */
  idealPara: string[]

  /** Enlace HTTPS externo al PDF o visor del catálogo técnico de la línea. */
  catalogoTecnicoUrl: string

  /** Identificador editorial opcional, por ejemplo "Edición 2026". */
  catalogoTecnicoVersion: string

  /** Fecha ISO (AAAA-MM-DD) de la última actualización publicada. */
  catalogoTecnicoActualizadoEn: string

  /** PDF o visor externo con especificaciones técnicas de la línea. */
  especificacionesTecnicasUrl?: string

  /** Identificador editorial opcional del documento de especificaciones. */
  especificacionesTecnicasVersion?: string

  /** Fecha ISO (AAAA-MM-DD) de actualización de las especificaciones. */
  especificacionesTecnicasActualizadoEn?: string
}

/* --------------------------------------------------------------------------
 * Tipologías (jerarquía dentro de una línea)
 * ------------------------------------------------------------------------ */

/**
 * Agrupador comercial dentro de una línea (ej: "Ventanas", "Puertas",
 * "Complementos"). Pertenece a UNA línea (`lineaSlug`), jerarquía estricta:
 * no se comparte entre líneas aunque el nombre se repita.
 *
 * @example
 * const tipologiaVentanas: TipologiaProducto = {
 *   id: "tip-herrero-ventanas",
 *   slug: "ventanas",
 *   lineaSlug: "herrero",
 *   nombre: "Ventanas",
 *   orden: 0,
 * };
 */
export interface TipologiaProducto {
  id: string
  slug: string
  lineaSlug: SlugLineaProducto
  nombre: string
  descripcion?: string
  orden: number
}

/* --------------------------------------------------------------------------
 * Imágenes
 * ------------------------------------------------------------------------ */

/**
 * @example
 * const imagen: ImagenProducto = {
 *   url: "/img/productos/ventana-corrediza-herrero-01.jpg",
 *   textoAlternativo: "Ventana corrediza línea Herrero, dos hojas, color negro",
 *   esPrincipal: true,
 * };
 */
export interface ImagenProducto {
  url: string
  textoAlternativo: string
  esPrincipal?: boolean
}

/* --------------------------------------------------------------------------
 * Precios
 * ------------------------------------------------------------------------ */

/**
 * Precios de la configuración BASE de un producto (sin variante elegida
 * todavía — se muestra en tarjetas de catálogo como "desde"). El precio
 * real de cada combinación Medida×Color×Vidrio vive en `VarianteProducto`.
 *
 * @example
 * const precios: PreciosProducto = {
 *   precioBase: 110000,
 *   precioTarjeta: 142900,
 *   precioContado: 110000,
 *   porcentajeDescuento: 0,
 *   moneda: "ARS",
 *   consultarPrecio: false,
 * };
 *
 * @example // producto sin precio publicado (se pide presupuesto)
 * const preciosAConsultar: PreciosProducto = {
 *   precioBase: null,
 *   precioTarjeta: null,
 *   precioContado: null,
 *   porcentajeDescuento: 0,
 *   moneda: "ARS",
 *   consultarPrecio: true,
 * };
 */
export interface PreciosProducto {
  /** Precio inicial, antes de elegir una variante puntual. */
  precioBase: number | null

  /** Precio de lista o tarjeta para la configuración base. */
  precioTarjeta: number | null

  /** Precio de contado para la configuración base. */
  precioContado: number | null

  /** @deprecated Fuente legacy; Descuentos 2.0 usa `Producto.descuento`. */
  porcentajeDescuento: number
  moneda: CodigoMoneda

  /** Si es true, la UI debe mostrar "Consultar precio" en vez de un número,
   *  aunque `precioBase` tenga un valor cargado (ej: precio en revisión). */
  consultarPrecio: boolean
}

/* --------------------------------------------------------------------------
 * Descuentos
 * ------------------------------------------------------------------------ */

export type TipoDescuento = "porcentaje" | "monto_fijo"

/**
 * @example
 * const promocionProducto: Descuento = {
 *   activo: true,
 *   tipo: "porcentaje",
 *   valor: 10,
 *   etiqueta: "10% por transferencia",
 * };
 */
export interface Descuento {
  activo: boolean
  tipo: TipoDescuento
  valor: number
  etiqueta?: string
}

/* --------------------------------------------------------------------------
 * Opciones configurables (medida, vidrio, color, accesorios)
 * ------------------------------------------------------------------------ */

/**
 * Medida disponible para un producto puntual. Ya NO tiene precio propio:
 * el precio de una medida concreta depende también del color elegido, y
 * vive en `VarianteProducto` (ver más abajo). `OpcionMedida` solo describe
 * la medida en sí (para dibujar el selector).
 *
 * @example
 * const medida120x100: OpcionMedida = {
 *   id: "size-120x100",
 *   etiqueta: "120 x 100 cm",
 *   anchoCm: 120,
 *   altoCm: 100,
 * };
 */
export interface OpcionMedida {
  id: string
  etiqueta: string
  anchoCm: number
  altoCm: number
}

/**
 * @example
 * const vidrioDVH: OpcionVidrio = {
 *   id: "vidrio-dvh",
 *   slug: "dvh",
 *   etiqueta: "DVH (doble vidriado hermético)",
 *   lineasPermitidas: [],
 *   tipologiasPermitidas: [],
 * };
 */
export interface OpcionVidrio {
  id: string
  slug: SlugOpcionVidrio
  etiqueta: string
  /** Vacío = disponible para todas las líneas. */
  lineasPermitidas: SlugLineaProducto[]
  /** Vacío = disponible para todas las tipologías de las líneas permitidas. */
  tipologiasPermitidas: string[]
}

/**
 * Color de perfil disponible para un producto puntual. Ya NO tiene
 * `precioAdicional` propio (ver nota de `OpcionMedida`): el adicional de
 * un color depende de la medida combinada, y vive en `VarianteProducto`.
 *
 * @example
 * const colorNegro: ColorPerfil = {
 *   slug: "negro",
 *   etiqueta: "Negro",
 *   hexadecimal: "#1C1C1C",
 * };
 */
export interface ColorPerfil {
  id: string
  slug: SlugColorPerfil
  etiqueta: string
  hexadecimal: string
  lineasPermitidas: SlugLineaProducto[]
}

/**
 * Una medida puntual disponible para un accesorio, con su propio precio.
 * El accesorio no tiene un precio único: cada tamaño cotiza distinto (un
 * mosquitero de 200x200 no cuesta lo mismo que uno de 60x60), por eso vive
 * como una tabla de medidas dentro del accesorio en vez de un solo
 * `precioAdicional` global.
 *
 * @example
 * const medidaMosquitero: MedidaAccesorio = {
 *   id: "med-acc-100x100",
 *   anchoCm: 100,
 *   altoCm: 100,
 *   precio: 15000,
 * };
 */
export interface MedidaAccesorio {
  id: string
  anchoCm: number
  altoCm: number
  precio: number
}

/**
 * Accesorio que puede sumarse a un producto (mosquitero, premarco,
 * tapajunta, etc). Pertenece a UNA línea (no es global ni se comparte entre
 * líneas) y su precio depende de la medida elegida: `medidas` es la fuente
 * de verdad, ordenable por área para el auto-match con la variante del
 * producto (ver `emparejarAccesorioConVariante` en
 * `features/products/lib/accesorios.ts`).
 *
 * @example
 * const mosquiteroHerrero: AccesorioLinea = {
 *   id: "accesorio-mosquitero-herrero",
 *   slug: "mosquitero",
 *   etiqueta: "Mosquitero",
 *   lineaSlug: "herrero",
 *   medidas: [
 *     { id: "med-1", anchoCm: 100, altoCm: 100, precio: 15000 },
 *     { id: "med-2", anchoCm: 150, altoCm: 150, precio: 22000 },
 *   ],
 *   incluidoPorDefecto: false,
 * };
 */
export interface AccesorioLinea {
  id: string
  slug: SlugAccesorio
  etiqueta: string
  lineaSlug: SlugLineaProducto
  medidas: MedidaAccesorio[]
  incluidoPorDefecto: boolean
}

/** Alias retro-compatible: en todo el código nuevo usar `AccesorioLinea`. */
export type Accesorio = AccesorioLinea

export type ManoApertura = "izquierda" | "derecha"

export interface ConfigManoApertura {
  opciones: ManoApertura[]
}

/* --------------------------------------------------------------------------
 * Variante (Medida × Color × Vidrio): fuente de verdad de precio y stock
 * ------------------------------------------------------------------------ */

export type ModoStock = "infinito" | "limitado"

/**
 * Estado de stock de una variante puntual. En modo "infinito" la variante
 * siempre se puede comprar (no se cuentan unidades). En modo "limitado"
 * hay una cantidad concreta de unidades disponibles, con un motivo
 * opcional para explicar la limitación (ej. "Últimas unidades en depósito").
 *
 * @example
 * const stockInfinito: StockVariante = { modo: "infinito" };
 *
 * @example
 * const stockLimitado: StockVariante = {
 *   modo: "limitado",
 *   cantidad: 4,
 *   motivo: "Últimas unidades en depósito",
 * };
 */
export interface StockVariante {
  modo: ModoStock
  /** Cantidad de unidades disponibles. Solo aplica con `modo: "limitado"`. */
  cantidad?: number
  /** Motivo opcional de la limitación. Solo aplica con `modo: "limitado"`. */
  motivo?: string
}

/** Controla si una combinación puntual puede ofrecerse en la tienda. */
export type VisibilidadVariante = VisibilidadProducto

/**
 * Una combinación exacta de Medida + Color + Vidrio de un producto. Acá
 * vive el precio real, el stock y su visibilidad. Las imágenes siempre se
 * heredan del producto padre.
 *
 * @example
 * const variante: VarianteProducto = {
 *   id: "var-120x100-negro",
 *   medidaId: "size-120x100",
 *   colorSlug: "negro",
 *   precioContado: 133000,
 *   precioTarjeta: 172900,
 *   consultarPrecio: false,
 *   stock: { modo: "infinito" },
 * };
 *   visibilidad: "visible",
 *
 * @example // combinación puntual con stock limitado y oculta en la tienda
 * const varianteLimitada: VarianteProducto = {
 *   id: "var-150x150-blanco",
 *   medidaId: "size-150x150",
 *   colorSlug: "blanco",
 *   precioContado: 250000,
 *   precioTarjeta: 310000,
 *   consultarPrecio: true,
 *   stock: { modo: "limitado", cantidad: 0 },
 *   visibilidad: "oculto",
 * };
 */
export interface VarianteProducto {
  id: string
  medidaId: string
  colorSlug: SlugColorPerfil
  /** null en productos que no llevan vidrio. */
  vidrioSlug: SlugOpcionVidrio | null

  precioContado: number
  precioTarjeta: number
  /** Si es true, esta combinación puntual no publica precio y deriva la consulta
   *  a WhatsApp. `Producto.precios.consultarPrecio` funciona como override global
   *  para todas las variantes. */
  consultarPrecio: boolean
  /** Indica si esta combinación participa del descuento global del producto. */
  aplicaDescuento: boolean

  stock: StockVariante
  /** Sigue los mismos estados de visibilidad que el producto padre. */
  visibilidad: VisibilidadVariante
}

/* --------------------------------------------------------------------------
 * Accesorios activados en un producto (auto-match por área con la variante)
 * ------------------------------------------------------------------------ */

/**
 * Referencia a un `AccesorioLinea` activado dentro de un producto puntual.
 * El producto no copia el precio ni las medidas: solo guarda qué accesorio
 * (por slug) está habilitado. El precio real de cada variante se resuelve
 * en tiempo de cálculo emparejando el área de la variante con la medida de
 * área más cercana del accesorio (ver `emparejarAccesorioConVariante`).
 *
 * @example
 * const mosquiteroActivado: AccesorioProducto = {
 *   slug: "mosquitero",
 *   obligatorio: false,
 * };
 */
export interface AccesorioProducto {
  slug: SlugAccesorio
  /** Si es true, se suma siempre (no es una opción que elige el cliente). */
  obligatorio: boolean
}

/* --------------------------------------------------------------------------
 * Producto
 * ------------------------------------------------------------------------ */

/**
 * Producto concreto disponible en el catálogo. Pertenece a una línea y a
 * una tipología dentro de esa misma línea. El precio y el stock reales de cada combinación viven en
 * `variantes`; `medidasDisponibles`/`coloresDisponibles` son listas
 * derivadas de `variantes`, mantenidas junto al producto para no iterar
 * todas las variantes en cada render de un selector.
 *
 * @example
 * const ventanaCorredizaHerrero: Producto = {
 *   id: "herrero-01",
 *   slug: "ventana-corrediza-herrero",
 *   nombre: "Ventana Corrediza Línea Herrero",
 *
 *   linea: "herrero",
 *   tipologiaId: "tip-herrero-ventanas",
 *   tipoApertura: "corrediza",
 *
 *   descripcion: "Ventana corrediza de dos hojas, ideal para grandes vanos.",
 *   descripcionExtensa: "<p>Fabricada a medida con perfiles de aluminio...</p>",
 *   imagenes: [
 *     { url: "/img/v-corrediza-herrero-01.jpg", textoAlternativo: "Ventana corrediza Herrero", esPrincipal: true },
 *   ],
 *   precios: {
 *     precioBase: 110000,
 *     precioTarjeta: 142900,
 *     precioContado: 110000,
 *     porcentajeDescuento: 0,
 *     moneda: "ARS",
 *     consultarPrecio: false,
 *   },
 *
 *   medidasDisponibles: [
 *     { id: "size-120x100", etiqueta: "120 x 100 cm", anchoCm: 120, altoCm: 100 },
 *   ],
 *   coloresDisponibles: [
 *     { slug: "negro", etiqueta: "Negro", hexadecimal: "#1C1C1C" },
 *   ],
 *   variantes: [
 *     { id: "var-120x100-negro", medidaId: "size-120x100", colorSlug: "negro", precioContado: 110000, precioTarjeta: 142900, stock: { modo: "infinito" } },
 *   ],
 *   opcionesVidrio: [
 *     { id: "vidrio-comun", slug: "comun-4mm", etiqueta: "Vidrio común 4mm", lineasPermitidas: [], tipologiasPermitidas: [] },
 *   ],
 *   accesorios: [
 *     { id: "accesorio-mosquitero", slug: "mosquitero", etiqueta: "Mosquitero", precioAdicional: 15000, incluidoPorDefecto: false },
 *   ],
 *
 *   etiquetas: ["nuevo"],
 *   destacado: true,
 *   visibilidad: "visible",
 *
 *   creadoEn: "2026-08-02T00:00:00.000Z",
 *   actualizadoEn: "2026-08-02T00:00:00.000Z",
 * };
 */

/**
 * Cómo aparece el producto en el sitio (reemplaza al viejo `disponible:
 * boolean`, ver `docs/2026-08-06-plan-admin-patron-tienda-nube.md` §6):
 * - `visible`: aparece en la tienda, en buscadores y en listados.
 * - `no-listado`: no aparece en listados/búsqueda, pero es accesible por
 *   link directo (`/producto/:slug`).
 * - `oculto`: no aparece en ningún lado, ni siquiera por link directo.
 */
export type VisibilidadProducto = "visible" | "no-listado" | "oculto"

export interface Producto {
  id: string
  slug: string
  nombre: string

  linea: SlugLineaProducto
  tipologiaId: string

  /**
   * La tipología indica qué producto es.
   * El tipo de apertura indica cómo funciona.
   */
  tipoApertura?: TipoApertura

  /** Resumen breve visible junto al nombre, en tarjetas y metadatos. */
  descripcion: string

  /**
   * Contenido enriquecido con el detalle completo de la abertura. Se muestra
   * en una sección inferior de la ficha pública del producto.
   */
  descripcionExtensa: string

  /** Promoción global; en productos con variantes solo aplica a las marcadas. */
  descuento: Descuento
  imagenes: ImagenProducto[]
  precios: PreciosProducto

  /** Stock del producto simple. Solo se usa cuando `variantes` está vacío. */
  stock: StockVariante

  /** Listas derivadas de `variantes`, para dibujar selectores sin iterarlas. */
  medidasDisponibles: OpcionMedida[]
  coloresDisponibles: ColorPerfil[]
  /** Fuente de verdad de precio/stock: una entrada por cada combinación Medida×Color×Vidrio habilitada. */
  variantes: VarianteProducto[]

  opcionesVidrio: OpcionVidrio[]

  /** Si es false, el producto no ofrece accesorios y `accesorios` se ignora. */
  llevaAccesorios: boolean
  /** Accesorios (mosquitero, premarco, ...) habilitados para este producto,
   *  restringidos a los de la misma línea. El precio de cada uno se resuelve
   *  por variante emparejando áreas, no se guarda acá. */
  accesorios: AccesorioProducto[]

  manoApertura?: ConfigManoApertura

  /** IDs elegidos manualmente y en el orden de aparición en la ficha.
   *  Si queda vacío, la tienda usa la recomendación automática por línea y
   *  tipología. */
  productosRelacionadosIds: string[]

  etiquetas: string[]
  destacado: boolean
  visibilidad: VisibilidadProducto

  creadoEn: string
  actualizadoEn: string
}

/** Resultado congelable de aplicar la promoción global a un precio puntual. */
export interface DescuentoAplicado extends Descuento {
  origen: "producto"
  montoUnitario: number
  porcentajeEquivalente: number
}
