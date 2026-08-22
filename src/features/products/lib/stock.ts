import type { StockVariante } from "@/types";

/** ¿Se puede comprar esta variante? "Infinito" siempre puede; "limitado"
 *  necesita cantidad > 0. Centraliza el criterio para no repetir el
 *  chequeo de `modo`/`cantidad` en cada lugar que antes miraba `enStock`. */
export function hayStock(stock: StockVariante): boolean {
  return stock.modo === "infinito" || (stock.cantidad ?? 0) > 0;
}

/** Etiqueta puramente informativa para mostrar el estado de stock de una
 *  variante (tabla de AdminProductsPage, resumen en ProductForm, etc.):
 *  "Infinito", "3 unidades disponibles" o "Sin stock". */
export function etiquetaStock(stock: StockVariante): string {
  if (stock.modo === "infinito") return "Infinito";

  const cantidad = stock.cantidad ?? 0;
  if (cantidad <= 0) return "Sin stock";

  return `${cantidad} unidad${cantidad === 1 ? "" : "es"} disponible${
    cantidad === 1 ? "" : "s"
  }`;
}

/** Tope de unidades que se pueden pedir de esta variante: `null` cuando
 *  es infinito (sin tope), o la cantidad disponible cuando es limitado. */
export function cantidadMaximaDeStock(stock: StockVariante): number | null {
  if (stock.modo === "infinito") return null;
  return Math.max(0, stock.cantidad ?? 0);
}
