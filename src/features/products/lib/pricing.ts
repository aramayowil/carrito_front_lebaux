import { emparejarAccesorioConVariante } from "@/features/products/lib/accesorios";
import { calcularPrecioPromocional } from "@/features/products/lib/discounts";
import { hayStock } from "@/features/products/lib/stock";
import type {
  AccesorioLinea,
  DesglosePrecio,
  OpcionMedida,
  Producto,
  SeleccionProducto,
} from "@/types";

export interface PrecioInicialProducto {
  tarjeta: number;
  contado: number;
}

/** Resuelve la regla efectiva de publicación de precio. El flag del producto
 *  actúa como override global; el de la variante permite ocultar solo una
 *  combinación puntual. */
export function debeConsultarPrecio(
  producto: Producto,
  variante?: Producto["variantes"][number],
): boolean {
  return producto.precios.consultarPrecio || variante?.consultarPrecio === true;
}

/** Busca la variante (Medida × Color × Vidrio) exacta elegida. */
export function buscarVariante(
  producto: Producto,
  seleccion: SeleccionProducto,
) {
  return producto.variantes.find(
    (variante) =>
      variante.visibilidad !== "oculto" &&
      variante.medidaId === seleccion.medidaId &&
      variante.colorSlug === seleccion.colorSlug &&
      variante.vidrioSlug === seleccion.vidrioSlug,
  );
}

/** Precio del accesorio para la medida de la variante, emparejando por área
 *  más cercana contra la tabla de medidas del accesorio. 0 si no matchea. */
function calcularAdicionalAccesorio(
  accesorio: AccesorioLinea | undefined,
  medida: OpcionMedida | undefined,
): number {
  if (!accesorio || !medida) return 0;
  const resultado = emparejarAccesorioConVariante(accesorio, medida);
  return resultado.medida?.precio ?? 0;
}

export function calcularPrecioProducto(
  producto: Producto,
  seleccion: SeleccionProducto,
  cantidad = 1,
  catalogoAccesorios: AccesorioLinea[] = [],
): DesglosePrecio {
  const variante = buscarVariante(producto, seleccion);
  const medida = producto.medidasDisponibles.find(
    (item) => item.id === seleccion.medidaId,
  );
  const accesoriosActivados = producto.llevaAccesorios
    ? producto.accesorios.filter((item) =>
        seleccion.accesoriosSlug.includes(item.slug),
      )
    : [];
  const accesoriosCatalogo = accesoriosActivados
    .map((activado) =>
      catalogoAccesorios.find((item) => item.slug === activado.slug),
    )
    .filter((item): item is AccesorioLinea => Boolean(item));

  const esProductoSimple = producto.variantes.length === 0;
  const precioVarianteContado =
    variante?.precioContado ??
    (esProductoSimple ? (producto.precios.precioContado ?? 0) : 0);
  const precioVarianteTarjeta =
    variante?.precioTarjeta ??
    (esProductoSimple ? (producto.precios.precioTarjeta ?? 0) : 0);
  const adicionalAccesorios = accesoriosCatalogo.reduce(
    (total, accesorio) => total + calcularAdicionalAccesorio(accesorio, medida),
    0,
  );
  const cantidadNormalizada = Math.max(1, cantidad);

  const promocion = calcularPrecioPromocional(
    producto,
    variante,
    precioVarianteContado,
  );
  const precioVarianteContadoFinal = promocion?.final ?? precioVarianteContado;
  const precioUnitarioContadoOriginal =
    precioVarianteContado + adicionalAccesorios;
  const precioUnitarioContado =
    precioVarianteContadoFinal + adicionalAccesorios;
  const precioUnitarioTarjeta = precioVarianteTarjeta + adicionalAccesorios;

  return {
    moneda: producto.precios.moneda,
    precioVarianteContado: precioVarianteContadoFinal,
    precioVarianteTarjeta,
    adicionalVidrio: 0,
    adicionalAccesorios,
    porcentajeDescuento: promocion?.descuento.porcentajeEquivalente ?? 0,
    descuentoAplicado: promocion?.descuento ?? null,
    precioUnitarioContadoOriginal,
    ahorroUnitario: promocion?.ahorro ?? 0,
    ahorroTotal: (promocion?.ahorro ?? 0) * cantidadNormalizada,
    precioUnitarioContado,
    precioUnitarioTarjeta,
    totalContado: precioUnitarioContado * cantidadNormalizada,
    totalTarjeta: precioUnitarioTarjeta * cantidadNormalizada,
    totalContadoOriginal: precioUnitarioContadoOriginal * cantidadNormalizada,
  };
}

/** Precio "desde": la variante EN STOCK más barata, con el primer color y
 *  vidrio disponibles (para no mostrar un producto sin poder comprarlo). */
export function obtenerPrecioInicial(
  producto: Producto,
): PrecioInicialProducto | null {
  if (debeConsultarPrecio(producto)) return null;

  if (producto.variantes.length === 0) {
    if (!hayStock(producto.stock)) return null;
    const tarjeta = producto.precios.precioTarjeta;
    if (tarjeta === null) return null;
    const contadoOriginal = producto.precios.precioContado ?? tarjeta;
    const promocion = calcularPrecioPromocional(
      producto,
      undefined,
      contadoOriginal,
    );

    return {
      tarjeta,
      contado: promocion?.final ?? contadoOriginal,
    };
  }

  const variantesDisponibles = producto.variantes.filter(
    (variante) =>
      variante.visibilidad !== "oculto" &&
      !debeConsultarPrecio(producto, variante) &&
      hayStock(variante.stock),
  );
  if (variantesDisponibles.length === 0) return null;

  const menor = variantesDisponibles.reduce((actual, variante) => {
    const precioActual =
      calcularPrecioPromocional(producto, actual, actual.precioContado)
        ?.final ?? actual.precioContado;
    const precioAlternativo =
      calcularPrecioPromocional(producto, variante, variante.precioContado)
        ?.final ?? variante.precioContado;
    return precioAlternativo < precioActual ? variante : actual;
  });

  const desglose = calcularPrecioProducto(
    producto,
    {
      medidaId: menor.medidaId,
      colorSlug: menor.colorSlug,
      vidrioSlug: menor.vidrioSlug,
      accesoriosSlug: [],
      manoApertura: null,
    },
    1,
  );

  return {
    tarjeta: desglose.precioUnitarioTarjeta,
    contado: desglose.precioUnitarioContado,
  };
}

export function actualizarCantidadDesglose(
  desglose: DesglosePrecio,
  cantidad: number,
): DesglosePrecio {
  const cantidadNormalizada = Math.max(1, cantidad);
  return {
    ...desglose,
    totalContadoOriginal:
      desglose.precioUnitarioContadoOriginal * cantidadNormalizada,
    ahorroTotal: desglose.ahorroUnitario * cantidadNormalizada,
    totalContado: desglose.precioUnitarioContado * cantidadNormalizada,
    totalTarjeta: desglose.precioUnitarioTarjeta * cantidadNormalizada,
  };
}
