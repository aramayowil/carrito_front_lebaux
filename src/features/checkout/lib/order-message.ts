import type { DatosCheckout } from "@/features/checkout/types/checkout"
import { formatProductPrice } from "@/features/products/lib/product-card-formatters"
import { etiquetaDescuento } from "@/features/products/lib/discounts"
import { completarTextoPublico } from "@/lib/public-text"
import type { ItemCarrito } from "@/types"

export function buildOrderMessage(
  items: ItemCarrito[],
  customer: DatosCheckout,
): string {
  const paymentLabel = customer.formaPagoEtiqueta
  const lines = [
    customer.saludoWhatsapp,
    "",
    ...customer.campos
      .filter((campo) => campo.valor)
      .map((campo) => campo.etiqueta + ": " + campo.valor),
    completarTextoPublico("Forma de pago: {forma}", { forma: paymentLabel }),
    "",
    completarTextoPublico("--- Pedido ({cantidad} {productos}) ---", {
      cantidad: items.length,
      productos: items.length === 1 ? "producto" : "productos",
    }),
  ]

  items.forEach((item, index) => {
    const mano = item.resumenSeleccion.manoAperturaEtiqueta
      ? " | " +
        completarTextoPublico("Mano: {mano}", {
          mano: item.resumenSeleccion.manoAperturaEtiqueta,
        })
      : ""
    const accesorios = item.resumenSeleccion.accesoriosEtiqueta.length
      ? " | " +
        completarTextoPublico("Accesorios: {accesorios}", {
          accesorios: item.resumenSeleccion.accesoriosEtiqueta.join(", "),
        })
      : ""
    const total =
      customer.formaPago === "contado"
        ? item.precios.totalContado
        : item.precios.totalTarjeta
    lines.push(
      `${index + 1}. ${item.producto.nombre} × ${item.cantidad}`,
      `   ${item.resumenSeleccion.medidaEtiqueta} | ${item.resumenSeleccion.colorEtiqueta} | ${item.resumenSeleccion.vidrioEtiqueta ?? "Sin vidrio"}${accesorios}${mano}`,
      "   " +
        completarTextoPublico("Subtotal: {monto}", {
          monto: formatProductPrice(total),
        }),
    )
    if (customer.formaPago === "contado" && item.precios.descuentoAplicado) {
      lines.push(
        "   " +
          completarTextoPublico("Promoción: {promocion}", {
            promocion: etiquetaDescuento(item.precios.descuentoAplicado),
          }),
        "   " +
          completarTextoPublico("Ahorro: {monto}", {
            monto: formatProductPrice(item.precios.ahorroTotal),
          }),
      )
    }
  })

  const total = items.reduce(
    (sum, item) =>
      sum +
      (customer.formaPago === "contado"
        ? item.precios.totalContado
        : item.precios.totalTarjeta),
    0,
  )
  const ahorro =
    customer.formaPago === "contado"
      ? items.reduce((sum, item) => sum + item.precios.ahorroTotal, 0)
      : 0
  lines.push("")
  if (ahorro > 0) {
    lines.push(
      completarTextoPublico("Ahorro total en promociones: {monto}", {
        monto: formatProductPrice(ahorro),
      }),
    )
  }
  lines.push(
    completarTextoPublico("Total estimado ({forma}): {monto}", {
      forma: paymentLabel,
      monto: formatProductPrice(total),
    }),
  )

  return lines.join("\n")
}
