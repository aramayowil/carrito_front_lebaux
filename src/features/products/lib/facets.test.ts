import { describe, expect, it } from "vitest";

import {
  calcularFacetasPorTipologia,
  TIPOLOGIA_TODAS,
} from "@/features/products/lib/facets";
import { crearProductoSimple } from "@/features/products/lib/test-fixtures";

const vidrioComun = {
  id: "vidrio-comun",
  slug: "comun-4mm",
  etiqueta: "Vidrio común 4 mm",
  lineasPermitidas: [],
  tipologiasPermitidas: [],
};

const vidrioDvh = {
  id: "vidrio-dvh",
  slug: "dvh",
  etiqueta: "DVH",
  lineasPermitidas: [],
  tipologiasPermitidas: [],
};

describe("calcularFacetasPorTipologia", () => {
  it("calcula vidrios y totales desde todos los productos de cada grupo", () => {
    const productos = [
      crearProductoSimple({
        id: "ventana-1",
        tipologiaId: "ventanas",
        opcionesVidrio: [vidrioComun, vidrioDvh],
      }),
      crearProductoSimple({
        id: "ventana-2",
        tipologiaId: "ventanas",
        opcionesVidrio: [vidrioDvh],
      }),
      crearProductoSimple({
        id: "puerta-1",
        tipologiaId: "puertas",
        opcionesVidrio: [],
      }),
    ];

    const facetas = calcularFacetasPorTipologia(productos, []);

    expect(facetas[TIPOLOGIA_TODAS].totalProductos).toBe(3);
    expect(facetas[TIPOLOGIA_TODAS].glassOptions).toEqual([
      { value: "dvh", label: "DVH", count: 2 },
      { value: "comun-4mm", label: "Vidrio común 4 mm", count: 1 },
    ]);
    expect(facetas.ventanas.totalProductos).toBe(2);
    expect(facetas.ventanas.glassOptions).toHaveLength(2);
    expect(facetas.puertas.glassOptions).toEqual([]);
  });
});
