import type { AccesorioLinea, MedidaAccesorio, OpcionMedida } from "@/types"

/**
 * Resultado de emparejar la medida de una variante de producto con la tabla
 * de medidas de un accesorio (mosquitero, premarco, etc).
 *
 * - `"exacta"`: existe una medida del accesorio con exactamente el mismo
 *   ancho y alto que la variante.
 * - `"cercana"`: no hay medida exacta, pero se tomó la de área más próxima
 *   (por diferencia absoluta de área, en cm²).
 * - `"sin-medidas"`: el accesorio no tiene ninguna medida cargada.
 * - `"ambigua"`: dos o más medidas quedaron empatadas en la distancia de
 *   área más cercana; no se autoselecciona ninguna para evitar adivinar.
 */
export type ResultadoEmparejeAccesorio =
  | { estado: "exacta" | "cercana"; medida: MedidaAccesorio }
  | { estado: "sin-medidas" | "ambigua"; medida: null }

function areaCm2(anchoCm: number, altoCm: number): number {
  return anchoCm * altoCm
}

/**
 * Busca, dentro de las medidas de un accesorio, la que mejor le cabe a una
 * medida de producto (variante), por área más cercana en cm².
 *
 * @example
 * const resultado = emparejarAccesorioConVariante(mosquiteroHerrero, {
 *   id: "size-100x100", etiqueta: "100 x 100", anchoCm: 100, altoCm: 100,
 * });
 * // { estado: "exacta", medida: { id: "med-1", anchoCm: 100, altoCm: 100, precio: 15000 } }
 */
export function emparejarAccesorioConVariante(
  accesorio: AccesorioLinea,
  medidaProducto: Pick<OpcionMedida, "anchoCm" | "altoCm">,
): ResultadoEmparejeAccesorio {
  if (accesorio.medidas.length === 0) {
    return { estado: "sin-medidas", medida: null }
  }

  const areaObjetivo = areaCm2(medidaProducto.anchoCm, medidaProducto.altoCm)

  const exacta = accesorio.medidas.find(
    (medida) =>
      medida.anchoCm === medidaProducto.anchoCm &&
      medida.altoCm === medidaProducto.altoCm,
  )
  if (exacta) return { estado: "exacta", medida: exacta }

  let mejorDistancia = Infinity
  let candidatas: MedidaAccesorio[] = []

  for (const medida of accesorio.medidas) {
    const distancia = Math.abs(
      areaCm2(medida.anchoCm, medida.altoCm) - areaObjetivo,
    )
    if (distancia < mejorDistancia) {
      mejorDistancia = distancia
      candidatas = [medida]
    } else if (distancia === mejorDistancia) {
      candidatas.push(medida)
    }
  }

  if (candidatas.length > 1) {
    return { estado: "ambigua", medida: null }
  }

  return { estado: "cercana", medida: candidatas[0] }
}

/** Precio resuelto de un accesorio para una medida de producto puntual, o
 *  null si no se pudo emparejar (sin medidas cargadas o empate ambiguo). */
export function precioAccesorioParaMedida(
  accesorio: AccesorioLinea,
  medidaProducto: Pick<OpcionMedida, "anchoCm" | "altoCm">,
): number | null {
  const resultado = emparejarAccesorioConVariante(accesorio, medidaProducto)
  return resultado.medida?.precio ?? null
}
