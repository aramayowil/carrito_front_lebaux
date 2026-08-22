/**
 * Tipos del carrito — CARRITO LEBAUX
 *
 * Un `ItemCarrito` NO guarda una referencia viva al `Producto` completo:
 * guarda una "foto" liviana (`ResumenProductoCarrito`) tomada en el momento
 * en que el cliente lo agregó. Esto es intencional:
 *
 * - El carrito es la única persistencia local intencional y puede durar más
 *   que la sesión de catálogo. Si el producto cambia de nombre o imagen, el
 *   carrito no debe romperse ni mostrar datos inconsistentes a mitad de
 *   compra.
 * - Evita tener que hidratar cada ítem del carrito contra el catálogo
 *   completo solo para poder renderizarlo.
 *
 * Por la misma razón, `DesglosePrecio` guarda los montos ya calculados
 * (no fórmulas ni referencias a `PreciosProducto`): es el resultado
 * congelado de la calculadora de precios en el momento de agregar/editar
 * el ítem.
 */

import type {
  CodigoMoneda,
  DescuentoAplicado,
  SlugAccesorio,
  SlugColorPerfil,
  SlugLineaProducto,
  SlugOpcionVidrio,
  ManoApertura,
} from "./catalogo";

/* --------------------------------------------------------------------------
 * Selección del cliente
 * ------------------------------------------------------------------------ */

/**
 * Configuración elegida por el cliente para un producto puntual, antes de
 * calcular precios. `medidaId` referencia un `OpcionMedida.id` del producto
 * (no hay un catálogo global de medidas: cada producto define las suyas).
 *
 * @example
 * const seleccion: SeleccionProducto = {
 *   medidaId: "size-120x100",
 *   colorSlug: "negro",
 *   vidrioSlug: "comun-4mm",
 *   accesoriosSlug: ["mosquitero", "tapajunta"],
 * };
 *
 * @example // producto sin vidrio (ej: puerta ciega)
 * const seleccionSinVidrio: SeleccionProducto = {
 *   medidaId: "size-90x200",
 *   colorSlug: "blanco",
 *   vidrioSlug: null,
 *   accesoriosSlug: [],
 * };
 */
export interface SeleccionProducto {
  medidaId: string;
  colorSlug: SlugColorPerfil;

  /**
   * null cuando el producto no lleva vidrio,
   * por ejemplo una puerta completamente ciega.
   */
  vidrioSlug: SlugOpcionVidrio | null;

  /** Accesorios elegidos por el cliente. */
  accesoriosSlug: SlugAccesorio[];
  manoApertura: ManoApertura | null;
}

/** Etiquetas legibles congeladas junto al item para renderizar el carrito sin rehidratar el catálogo. */
export interface ResumenSeleccionCarrito {
  medidaEtiqueta: string;
  colorEtiqueta: string;
  vidrioEtiqueta: string | null;
  accesoriosEtiqueta: string[];
  manoAperturaEtiqueta: string | null;
}

/* --------------------------------------------------------------------------
 * Precios calculados
 * ------------------------------------------------------------------------ */

/**
 * Resultado congelado de la calculadora de precios para UN ítem del
 * carrito (ya con cantidad y opciones aplicadas). `precioVarianteContado`/
 * `precioVarianteTarjeta` son el precio ya resuelto de la variante
 * Medida×Color×Vidrio elegida (incluye su propio descuento si tiene uno); los
 * `adicionalX` restantes son la diferencia que aportan vidrio/accesorios
 * sobre esa variante.
 *
 * @example
 * const precios: DesglosePrecio = {
 *   moneda: "ARS",
 *   precioVarianteContado: 110000,
 *   precioVarianteTarjeta: 142900,
 *   adicionalVidrio: 0,
 *   adicionalAccesorios: 23000,
 *   porcentajeDescuento: 0,
 *   precioUnitarioContado: 133000,
 *   precioUnitarioTarjeta: 165900,
 *   totalContado: 133000,
 *   totalTarjeta: 165900,
 * };
 */
export interface DesglosePrecio {
  moneda: CodigoMoneda;

  /** Precio de la variante elegida después de aplicar la promoción global, si participa. */
  precioVarianteContado: number;
  precioVarianteTarjeta: number;

  adicionalVidrio: number;
  adicionalAccesorios: number;

  porcentajeDescuento: number;
  descuentoAplicado: DescuentoAplicado | null;

  /** Precio de contado antes de la promoción, con accesorios incluidos. */
  precioUnitarioContadoOriginal: number;
  ahorroUnitario: number;
  ahorroTotal: number;

  precioUnitarioContado: number;
  precioUnitarioTarjeta: number;

  /** precioUnitarioContado * cantidad */
  totalContado: number;
  /** precioUnitarioTarjeta * cantidad */
  totalTarjeta: number;
  /** precioUnitarioContadoOriginal * cantidad */
  totalContadoOriginal: number;
}

/* --------------------------------------------------------------------------
 * "Foto" del producto dentro del carrito
 * ------------------------------------------------------------------------ */

/**
 * Subconjunto de `Producto` que el carrito necesita para renderizarse sin
 * volver a consultar el catálogo. Ver nota de diseño al inicio del archivo.
 *
 * @example
 * const resumen: ResumenProductoCarrito = {
 *   id: "herrero-01",
 *   slug: "ventana-corrediza-herrero",
 *   nombre: "Ventana Corrediza Línea Herrero",
 *   linea: "herrero",
 *   tipologiaId: "tip-herrero-ventanas",
 *   imagen: "/img/v-corrediza-herrero-01.jpg",
 * };
 */
export interface ResumenProductoCarrito {
  id: string;
  slug: string;
  nombre: string;
  linea: SlugLineaProducto;
  tipologiaId: string;
  imagen: string;
}

/* --------------------------------------------------------------------------
 * Ítem de carrito
 * ------------------------------------------------------------------------ */

/**
 * Una línea del carrito: un producto configurado (`seleccion`) más su
 * cantidad y el desglose de precio ya calculado (`precios`).
 *
 * @example
 * const item: ItemCarrito = {
 *   id: "item-001",
 *   producto: {
 *     id: "herrero-01",
 *     slug: "ventana-corrediza-herrero",
 *     nombre: "Ventana Corrediza Línea Herrero",
 *     linea: "herrero",
 *     tipologiaId: "tip-herrero-ventanas",
 *     imagen: "/img/v_entero_H.jpg",
 *   },
 *   seleccion: {
 *     medidaId: "size-120x100",
 *     colorSlug: "negro",
 *     vidrioSlug: "comun-4mm",
 *     accesoriosSlug: ["mosquitero", "tapajunta"],
 *   },
 *   cantidad: 1,
 *   cantidadMaxima: null,
 *   precios: {
 *     moneda: "ARS",
 *     precioVarianteContado: 110000,
 *     precioVarianteTarjeta: 142900,
 *     adicionalVidrio: 0,
 *     adicionalAccesorios: 23000,
 *     porcentajeDescuento: 0,
 *     precioUnitarioContado: 133000,
 *     precioUnitarioTarjeta: 165900,
 *     totalContado: 133000,
 *     totalTarjeta: 165900,
 *   },
 * };
 */
export interface ItemCarrito {
  id: string;
  producto: ResumenProductoCarrito;
  seleccion: SeleccionProducto;
  resumenSeleccion: ResumenSeleccionCarrito;
  cantidad: number;
  /** Tope de unidades al momento de agregar el ítem (foto del stock de la
   *  variante, igual que `precios`): null = infinito, sin tope. */
  cantidadMaxima: number | null;
  precios: DesglosePrecio;
}
