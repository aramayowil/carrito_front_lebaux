import { resumirPromocionProducto } from "@/features/products/lib/discounts";
import type { Producto, TipoAperturaProducto } from "@/types";

export interface OpcionFiltro {
  value: string;
  label: string;
  count: number;
}

export interface FacetasCatalogo {
  totalProductos: number;
  openingOptions: OpcionFiltro[];
  colorOptions: OpcionFiltro[];
  glassOptions: OpcionFiltro[];
  sizeOptions: OpcionFiltro[];
  tagOptions: OpcionFiltro[];
  promotionCount: number;
}

/** Clave usada para el grupo de facetas que agrega todas las tipologías. */
export const TIPOLOGIA_TODAS = "todas";

function buildOptions(values: Array<{ value: string; label: string }>) {
  const options = new Map<string, OpcionFiltro>();
  values.forEach(({ value, label }) => {
    if (!value) return;
    const current = options.get(value);
    options.set(value, { value, label, count: (current?.count ?? 0) + 1 });
  });
  return Array.from(options.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  );
}

function calcularFacetasDeGrupo(
  productos: Producto[],
  tiposApertura: TipoAperturaProducto[],
): FacetasCatalogo {
  return {
    totalProductos: productos.length,
    openingOptions: buildOptions(
      productos.flatMap((product) => {
        if (!product.tipoApertura) return [];
        const opening = tiposApertura.find(
          (item) => item.slug === product.tipoApertura,
        );
        return [
          {
            value: product.tipoApertura,
            label: opening?.nombre ?? product.tipoApertura,
          },
        ];
      }),
    ),
    colorOptions: buildOptions(
      productos.flatMap((product) =>
        product.coloresDisponibles.map((color) => ({
          value: color.slug,
          label: color.etiqueta,
        })),
      ),
    ),
    glassOptions: buildOptions(
      productos.flatMap((product) =>
        product.opcionesVidrio.map((glass) => ({
          value: glass.slug,
          label: glass.etiqueta,
        })),
      ),
    ),
    sizeOptions: buildOptions(
      productos.flatMap((product) =>
        product.medidasDisponibles.map((size) => ({
          value: size.etiqueta,
          label: size.etiqueta,
        })),
      ),
    ),
    tagOptions: buildOptions(
      productos.flatMap((product) =>
        product.etiquetas.map((tag) => ({ value: tag, label: tag })),
      ),
    ),
    promotionCount: productos.filter((product) =>
      resumirPromocionProducto(product),
    ).length,
  };
}

/**
 * Calcula las facetas (opciones de filtro con conteos) para el agregado de
 * la línea completa y para cada tipología presente, a partir del listado
 * completo de productos visibles de la línea. Pensado para correr en el
 * servidor sobre el dataset completo, de forma que el cliente reciba solo
 * las opciones ya resumidas y no todo el catálogo.
 */
export function calcularFacetasPorTipologia(
  productos: Producto[],
  tiposApertura: TipoAperturaProducto[],
): Record<string, FacetasCatalogo> {
  const porTipologia: Record<string, FacetasCatalogo> = {
    [TIPOLOGIA_TODAS]: calcularFacetasDeGrupo(productos, tiposApertura),
  };

  const tipologiaIds = new Set(productos.map((product) => product.tipologiaId));
  tipologiaIds.forEach((tipologiaId) => {
    if (!tipologiaId) return;
    porTipologia[tipologiaId] = calcularFacetasDeGrupo(
      productos.filter((product) => product.tipologiaId === tipologiaId),
      tiposApertura,
    );
  });

  return porTipologia;
}
