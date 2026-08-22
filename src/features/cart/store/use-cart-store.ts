import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  actualizarCantidadDesglose,
  buscarVariante,
  calcularPrecioProducto,
  debeConsultarPrecio,
} from "@/features/products/lib/pricing";
import { cantidadMaximaDeStock, hayStock } from "@/features/products/lib/stock";
import type {
  AccesorioLinea,
  ItemCarrito,
  Producto,
  SeleccionProducto,
} from "@/types";

export interface TotalesCarrito {
  cantidadItems: number;
  totalContadoOriginal: number;
  ahorroTotal: number;
  totalContado: number;
  totalTarjeta: number;
}

interface CartState {
  items: ItemCarrito[];
  agregarItem: (
    producto: Producto,
    seleccion: SeleccionProducto,
    cantidad: number,
    catalogoAccesorios: AccesorioLinea[],
  ) => void;
  actualizarCantidad: (itemId: string, cantidad: number) => void;
  eliminarItem: (itemId: string) => void;
  sincronizarConCatalogo: (
    productos: Producto[],
    catalogoAccesorios: AccesorioLinea[],
  ) => void;
  vaciar: () => void;
}

function mismaSeleccion(a: SeleccionProducto, b: SeleccionProducto): boolean {
  return (
    a.medidaId === b.medidaId &&
    a.colorSlug === b.colorSlug &&
    a.vidrioSlug === b.vidrioSlug &&
    a.manoApertura === b.manoApertura &&
    [...a.accesoriosSlug].sort().join("|") ===
      [...b.accesoriosSlug].sort().join("|")
  );
}

function crearItem(
  producto: Producto,
  seleccion: SeleccionProducto,
  cantidad: number,
  catalogoAccesorios: AccesorioLinea[],
): ItemCarrito {
  const medida = producto.medidasDisponibles.find(
    (item) => item.id === seleccion.medidaId,
  );
  const color = producto.coloresDisponibles.find(
    (item) => item.slug === seleccion.colorSlug,
  );
  const vidrio = producto.opcionesVidrio.find(
    (item) => item.slug === seleccion.vidrioSlug,
  );
  const accesorios = producto.llevaAccesorios
    ? catalogoAccesorios.filter((item) =>
        seleccion.accesoriosSlug.includes(item.slug),
      )
    : [];
  const imagen =
    producto.imagenes.find((item) => item.esPrincipal)?.url ??
    producto.imagenes[0]?.url ??
    "";

  // Tope de unidades "congelado" al momento de agregar, igual criterio que
  // el precio: si la variante no existe (no debería pasar, la UI ya la
  // valida) tratamos como sin tope en vez de bloquear el alta.
  const variante = buscarVariante(producto, seleccion);
  const cantidadMaxima = variante
    ? cantidadMaximaDeStock(variante.stock)
    : producto.variantes.length === 0
      ? cantidadMaximaDeStock(producto.stock)
      : null;
  const cantidadFinal =
    cantidadMaxima !== null
      ? Math.min(Math.max(1, cantidad), Math.max(cantidadMaxima, 1))
      : Math.max(1, cantidad);

  return {
    id: crypto.randomUUID(),
    producto: {
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      linea: producto.linea,
      tipologiaId: producto.tipologiaId,
      imagen,
    },
    seleccion,
    resumenSeleccion: {
      medidaEtiqueta: medida?.etiqueta ?? "A definir",
      colorEtiqueta: color?.etiqueta ?? "A definir",
      vidrioEtiqueta: vidrio?.etiqueta ?? null,
      accesoriosEtiqueta: accesorios.map((item) => item.etiqueta),
      manoAperturaEtiqueta: seleccion.manoApertura
        ? seleccion.manoApertura === "izquierda"
          ? "Izquierda"
          : "Derecha"
        : null,
    },
    cantidad: cantidadFinal,
    cantidadMaxima,
    precios: calcularPrecioProducto(
      producto,
      seleccion,
      cantidadFinal,
      catalogoAccesorios,
    ),
  };
}

function sincronizarItem(
  item: ItemCarrito,
  productos: Producto[],
  catalogoAccesorios: AccesorioLinea[],
): ItemCarrito | null {
  const producto = productos.find(
    (candidato) =>
      candidato.id === item.producto.id && candidato.visibilidad !== "oculto",
  );
  if (!producto) return null;

  const variante = buscarVariante(producto, item.seleccion);
  if (debeConsultarPrecio(producto, variante)) return null;
  if (
    producto.variantes.length > 0 &&
    (!variante || !hayStock(variante.stock))
  ) {
    return null;
  }
  if (producto.variantes.length === 0 && !hayStock(producto.stock)) return null;

  const accesoriosCatalogados = new Set(
    catalogoAccesorios.map((accesorio) => accesorio.slug),
  );
  const seleccion: SeleccionProducto = {
    ...item.seleccion,
    accesoriosSlug: producto.llevaAccesorios
      ? producto.accesorios
          .filter(
            (accesorio) =>
              accesoriosCatalogados.has(accesorio.slug) &&
              (accesorio.obligatorio ||
                item.seleccion.accesoriosSlug.includes(accesorio.slug)),
          )
          .map((accesorio) => accesorio.slug)
      : [],
  };
  const actualizado = crearItem(
    producto,
    seleccion,
    item.cantidad,
    catalogoAccesorios,
  );

  return { ...actualizado, id: item.id };
}

export function calcularTotalesCarrito(items: ItemCarrito[]): TotalesCarrito {
  return items.reduce<TotalesCarrito>(
    (totales, item) => ({
      cantidadItems: totales.cantidadItems + item.cantidad,
      totalContadoOriginal:
        totales.totalContadoOriginal + item.precios.totalContadoOriginal,
      ahorroTotal: totales.ahorroTotal + item.precios.ahorroTotal,
      totalContado: totales.totalContado + item.precios.totalContado,
      totalTarjeta: totales.totalTarjeta + item.precios.totalTarjeta,
    }),
    {
      cantidadItems: 0,
      totalContadoOriginal: 0,
      ahorroTotal: 0,
      totalContado: 0,
      totalTarjeta: 0,
    },
  );
}

function normalizarDescuentoDeItem(item: ItemCarrito): ItemCarrito {
  const precios = item.precios;
  const precioOriginal =
    precios.precioUnitarioContadoOriginal ?? precios.precioUnitarioContado;

  return {
    ...item,
    precios: {
      ...precios,
      descuentoAplicado: precios.descuentoAplicado ?? null,
      precioUnitarioContadoOriginal: precioOriginal,
      ahorroUnitario: precios.ahorroUnitario ?? 0,
      ahorroTotal: precios.ahorroTotal ?? 0,
      totalContadoOriginal:
        precios.totalContadoOriginal ?? precioOriginal * item.cantidad,
    },
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      agregarItem: (producto, seleccion, cantidad, catalogoAccesorios) =>
        set((state) => {
          const variante = buscarVariante(producto, seleccion);
          if (debeConsultarPrecio(producto, variante)) return state;

          const existingIndex = state.items.findIndex(
            (item) =>
              item.producto.id === producto.id &&
              mismaSeleccion(item.seleccion, seleccion),
          );

          if (existingIndex === -1) {
            return {
              items: [
                ...state.items,
                crearItem(producto, seleccion, cantidad, catalogoAccesorios),
              ],
            };
          }

          const items = [...state.items];
          const existing = items[existingIndex];
          const sumaSinTope = existing.cantidad + Math.max(1, cantidad);
          const nextQuantity =
            existing.cantidadMaxima !== null
              ? Math.min(sumaSinTope, Math.max(existing.cantidadMaxima, 1))
              : sumaSinTope;
          items[existingIndex] = {
            ...existing,
            cantidad: nextQuantity,
            precios: actualizarCantidadDesglose(existing.precios, nextQuantity),
          };
          return { items };
        }),
      actualizarCantidad: (itemId, cantidad) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            const cantidadFinal =
              item.cantidadMaxima !== null
                ? Math.min(
                    Math.max(1, cantidad),
                    Math.max(item.cantidadMaxima, 1),
                  )
                : Math.max(1, cantidad);
            return {
              ...item,
              cantidad: cantidadFinal,
              precios: actualizarCantidadDesglose(item.precios, cantidadFinal),
            };
          }),
        })),
      eliminarItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      sincronizarConCatalogo: (productos, catalogoAccesorios) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            const actualizado = sincronizarItem(
              item,
              productos,
              catalogoAccesorios,
            );
            return actualizado ? [actualizado] : [];
          }),
        })),
      vaciar: () => set({ items: [] }),
    }),
    {
      name: "lebaux-cart",
      version: 4,
      skipHydration: true,
      migrate: (persistedState, version) => {
        // v1 cambia la forma de `ItemCarrito` (variantes, precios). Un
        // carrito viejo no es dato de negocio que valga la pena migrar
        // campo a campo: se vacía y listo, es preferible a mostrar un
        // carrito con precios corridos o campos faltantes.
        if (version < 1) return { items: [] } as unknown as CartState;
        if (version < 2) {
          const previous = persistedState as CartState;
          return {
            items: previous.items.map((item) => ({
              ...item,
              precios: normalizarDescuentoDeItem(item).precios,
              seleccion: { ...item.seleccion, manoApertura: null },
              resumenSeleccion: {
                ...item.resumenSeleccion,
                manoAperturaEtiqueta: null,
              },
            })),
          } as CartState;
        }
        if (version < 3) {
          // v3 suma `cantidadMaxima` (tope de stock) a cada ítem. Los
          // carritos previos no tienen esa foto del stock original: los
          // dejamos sin tope (null) en vez de bloquear el checkout de un
          // carrito ya armado por datos que nunca se capturaron.
          const previous = persistedState as CartState;
          return {
            items: previous.items.map((item) => ({
              ...item,
              precios: normalizarDescuentoDeItem(item).precios,
              cantidadMaxima: null,
            })),
          } as CartState;
        }
        if (version < 4) {
          const previous = persistedState as CartState;
          return {
            items: previous.items.map(normalizarDescuentoDeItem),
          } as CartState;
        }
        return persistedState as CartState;
      },
    },
  ),
);
