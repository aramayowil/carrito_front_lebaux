import { formatProductPrice } from "@/features/products/lib/product-card-formatters"
import { etiquetaDescuento } from "@/features/products/lib/discounts"
import type {
  AccesorioLinea,
  DesglosePrecio,
  Producto,
  SeleccionProducto,
} from "@/types"

export function buildConfiguredProductMessage(
  producto: Producto,
  seleccion: SeleccionProducto,
  cantidad: number,
  desglose: DesglosePrecio,
  catalogoAccesorios: AccesorioLinea[] = [],
): string {
  const medida = producto.medidasDisponibles.find(
    (item) => item.id === seleccion.medidaId,
  )
  const color = producto.coloresDisponibles.find(
    (item) => item.slug === seleccion.colorSlug,
  )
  const vidrio = producto.opcionesVidrio.find(
    (item) => item.slug === seleccion.vidrioSlug,
  )
  const accesorios = producto.llevaAccesorios
    ? catalogoAccesorios.filter((item) =>
        seleccion.accesoriosSlug.includes(item.slug),
      )
    : []

  return [
    "Hola Lebaux! Quiero consultar por esta abertura:",
    "",
    `Producto: ${producto.nombre}`,
    `Línea: ${producto.linea.toUpperCase()}`,
    `Medida: ${medida?.etiqueta ?? "A definir"}`,
    `Color: ${color?.etiqueta ?? "A definir"}`,
    `Vidrio: ${vidrio?.etiqueta ?? "No aplica"}`,
    `Accesorios: ${accesorios.length ? accesorios.map((item) => item.etiqueta).join(", ") : "Ninguno"}`,
    ...(seleccion.manoApertura
      ? [`Mano de apertura: ${seleccion.manoApertura}`]
      : []),
    `Cantidad: ${cantidad}`,
    ...(desglose.descuentoAplicado
      ? [
          `Promoción: ${etiquetaDescuento(desglose.descuentoAplicado)}`,
          `Ahorro: ${formatProductPrice(desglose.ahorroTotal)}`,
        ]
      : []),
    `Estimado contado: ${formatProductPrice(desglose.totalContado)}`,
    `Estimado tarjeta: ${formatProductPrice(desglose.totalTarjeta)}`,
  ].join("\n")
}
