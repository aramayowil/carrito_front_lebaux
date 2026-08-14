import { hayStock } from "@/features/products/lib/stock"
import type {
  Descuento,
  DescuentoAplicado,
  Producto,
  VarianteProducto,
} from "@/types"

export interface PrecioPromocional {
  original: number
  final: number
  ahorro: number
  descuento: DescuentoAplicado
}

export interface ResumenPromocionProducto extends PrecioPromocional {
  varianteId: string | null
  cantidadVariantes: number
}

/** Indica si la promoción global está completa y puede aplicarse. */
export function descuentoProductoActivo(producto: Producto): boolean {
  return producto.descuento.activo && producto.descuento.valor > 0
}

/** Determina la participación exacta; un producto simple participa completo. */
export function participaDelDescuento(
  producto: Producto,
  variante?: VarianteProducto,
): boolean {
  if (!descuentoProductoActivo(producto)) return false
  if (producto.variantes.length === 0) return true
  return variante?.aplicaDescuento === true
}

/** Aplica la promoción solo al precio de contado, antes de los accesorios. */
export function calcularPrecioPromocional(
  producto: Producto,
  variante: VarianteProducto | undefined,
  precioOriginal: number,
): PrecioPromocional | null {
  if (!participaDelDescuento(producto, variante) || precioOriginal <= 0) {
    return null
  }

  const configuracion = producto.descuento
  const montoSinLimitar =
    configuracion.tipo === "porcentaje"
      ? Math.round(
          (precioOriginal * Math.min(100, Math.max(0, configuracion.valor))) /
            100,
        )
      : Math.max(0, configuracion.valor)
  const ahorro = Math.min(precioOriginal, montoSinLimitar)
  if (ahorro <= 0) return null

  return {
    original: precioOriginal,
    final: precioOriginal - ahorro,
    ahorro,
    descuento: {
      ...configuracion,
      origen: "producto",
      montoUnitario: ahorro,
      porcentajeEquivalente: Math.round((ahorro / precioOriginal) * 100),
    },
  }
}

/** Variantes vendibles que participan de la promoción, sin generalizar atributos. */
export function obtenerVariantesPromocion(
  producto: Producto,
): VarianteProducto[] {
  if (!descuentoProductoActivo(producto)) return []

  return producto.variantes.filter(
    (variante) =>
      variante.aplicaDescuento &&
      variante.visibilidad !== "oculto" &&
      hayStock(variante.stock),
  )
}

/** Resumen para cards: usa la combinación promocionada con menor precio final. */
export function resumirPromocionProducto(
  producto: Producto,
): ResumenPromocionProducto | null {
  if (producto.precios.consultarPrecio || !descuentoProductoActivo(producto)) {
    return null
  }

  if (producto.variantes.length === 0) {
    if (!hayStock(producto.stock)) return null
    const original =
      producto.precios.precioContado ?? producto.precios.precioTarjeta
    if (original === null) return null
    const promocion = calcularPrecioPromocional(producto, undefined, original)
    return promocion
      ? { ...promocion, varianteId: null, cantidadVariantes: 1 }
      : null
  }

  const candidatas = obtenerVariantesPromocion(producto)
    .map((variante) => ({
      variante,
      promocion: calcularPrecioPromocional(
        producto,
        variante,
        variante.precioContado,
      ),
    }))
    .filter(
      (
        item,
      ): item is {
        variante: VarianteProducto
        promocion: PrecioPromocional
      } => item.promocion !== null,
    )

  if (candidatas.length === 0) return null
  const menor = candidatas.reduce((actual, candidata) =>
    candidata.promocion.final < actual.promocion.final ? candidata : actual,
  )

  return {
    ...menor.promocion,
    varianteId: menor.variante.id,
    cantidadVariantes: candidatas.length,
  }
}

/** Texto corto uniforme para badges y resúmenes. */
export function etiquetaDescuento(descuento: Descuento): string {
  const personalizada = descuento.etiqueta?.trim()
  if (personalizada) return personalizada
  return descuento.tipo === "porcentaje"
    ? String(descuento.valor) + "% OFF"
    : "$" + descuento.valor.toLocaleString("es-AR") + " OFF"
}

/**
 * Etiqueta breve para cards. Conserva el texto personalizado en superficies
 * amplias, pero evita que un badge compacto se desborde.
 */
export function etiquetaPromocionCard(producto: Producto): string {
  const descuento = producto.descuento
  const valor =
    descuento.tipo === "porcentaje"
      ? String(descuento.valor) + "% OFF"
      : "$" + descuento.valor.toLocaleString("es-AR") + " OFF"

  if (producto.variantes.length === 0) return valor

  const variantesVendibles = producto.variantes.filter(
    (variante) => variante.visibilidad !== "oculto" && hayStock(variante.stock),
  )
  const promocionParcial = variantesVendibles.some(
    (variante) => !variante.aplicaDescuento,
  )

  return promocionParcial ? "Hasta " + valor : valor
}
