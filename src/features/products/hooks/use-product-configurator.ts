"use client"

import { useMemo, useState } from "react"

import { calcularPrecioProducto } from "@/features/products/lib/pricing"
import { cantidadMaximaDeStock, hayStock } from "@/features/products/lib/stock"
import type {
  AccesorioLinea,
  Producto,
  SeleccionProducto,
  SlugAccesorio,
  SlugColorPerfil,
  VarianteProducto,
  SlugOpcionVidrio,
} from "@/types"

/** Arranca en la primera variante EN STOCK (si hay alguna) para no mostrar
 *  de entrada una combinación que no se puede comprar. */
function crearSeleccionInicial(producto: Producto): SeleccionProducto {
  const variantesVisibles = producto.variantes.filter(
    (variante) => variante.visibilidad !== "oculto",
  )
  const primeraVarianteConStock =
    variantesVisibles.find((variante) => hayStock(variante.stock)) ??
    variantesVisibles[0]

  const medidaId =
    primeraVarianteConStock?.medidaId ??
    producto.medidasDisponibles[0]?.id ??
    ""
  const colorSlug =
    primeraVarianteConStock?.colorSlug ??
    producto.coloresDisponibles[0]?.slug ??
    ("blanco" as SlugColorPerfil)

  return {
    medidaId,
    colorSlug,
    vidrioSlug: primeraVarianteConStock?.vidrioSlug ?? null,
    // Los accesorios obligatorios (definidos en el producto, no en el
    // catálogo) arrancan siempre seleccionados.
    accesoriosSlug: producto.accesorios
      .filter((accesorio) => accesorio.obligatorio)
      .map((accesorio) => accesorio.slug),
    manoApertura: null,
  }
}

export function useProductConfigurator(
  producto: Producto,
  catalogoAccesorios: AccesorioLinea[],
) {
  const [seleccion, setSeleccion] = useState<SeleccionProducto>(() =>
    crearSeleccionInicial(producto),
  )
  const [cantidadState, setCantidadState] = useState(1)

  const varianteActual = useMemo(
    () =>
      producto.variantes.find(
        (variante) =>
          variante.visibilidad !== "oculto" &&
          variante.medidaId === seleccion.medidaId &&
          variante.colorSlug === seleccion.colorSlug &&
          variante.vidrioSlug === seleccion.vidrioSlug,
      ),
    [
      producto.variantes,
      seleccion.colorSlug,
      seleccion.medidaId,
      seleccion.vidrioSlug,
    ],
  )

  /** Tope de unidades para la variante elegida: null = infinito (sin tope). */
  const esProductoSimple = producto.variantes.length === 0
  const cantidadMaxima = varianteActual
    ? cantidadMaximaDeStock(varianteActual.stock)
    : esProductoSimple
      ? cantidadMaximaDeStock(producto.stock)
      : null

  const disponible = varianteActual
    ? hayStock(varianteActual.stock)
    : esProductoSimple && hayStock(producto.stock)

  // Derivada del estado crudo en vez de sincronizada con un efecto: si la
  // variante elegida cambia (medida/color/vidrio) y el tope nuevo es menor
  // a la cantidad ya cargada, esto la baja automáticamente en el mismo
  // render sin pedir más cantidad de la que hay disponible.
  const cantidad =
    cantidadMaxima !== null
      ? Math.min(cantidadState, Math.max(cantidadMaxima, 1))
      : cantidadState

  const desglose = useMemo(
    () =>
      calcularPrecioProducto(producto, seleccion, cantidad, catalogoAccesorios),
    [cantidad, catalogoAccesorios, producto, seleccion],
  )

  const setCantidad = (value: number) => {
    const minimo = 1
    const tope =
      cantidadMaxima !== null ? Math.max(cantidadMaxima, minimo) : Infinity
    setCantidadState(Math.min(Math.max(minimo, value), tope))
  }
  const setMedida = (medidaId: string) =>
    setSeleccion((current) => ({ ...current, medidaId }))
  const setColor = (colorSlug: SlugColorPerfil) =>
    setSeleccion((current) => ({ ...current, colorSlug }))
  const setVidrio = (vidrioSlug: SlugOpcionVidrio | null) =>
    setSeleccion((current) => ({ ...current, vidrioSlug }))
  const setVariante = (variante: VarianteProducto) =>
    setSeleccion((current) => ({
      ...current,
      medidaId: variante.medidaId,
      colorSlug: variante.colorSlug,
      vidrioSlug: variante.vidrioSlug,
    }))
  const setManoApertura = (manoApertura: SeleccionProducto["manoApertura"]) =>
    setSeleccion((current) => ({ ...current, manoApertura }))
  const toggleAccesorio = (accesorioSlug: SlugAccesorio) =>
    setSeleccion((current) => {
      const esObligatorio = producto.accesorios.some(
        (item) => item.slug === accesorioSlug && item.obligatorio,
      )
      if (esObligatorio) return current
      return {
        ...current,
        accesoriosSlug: current.accesoriosSlug.includes(accesorioSlug)
          ? current.accesoriosSlug.filter((slug) => slug !== accesorioSlug)
          : [...current.accesoriosSlug, accesorioSlug],
      }
    })

  /** ¿Hay alguna variante en stock para esta medida, sea cual sea el color? Útil para no ofrecer medidas muertas en el selector. */
  const medidaTieneStock = (medidaId: string) =>
    producto.variantes.some(
      (variante) =>
        variante.visibilidad !== "oculto" &&
        variante.medidaId === medidaId &&
        hayStock(variante.stock),
    )

  /** Mismo criterio para colores dentro de la medida elegida actualmente. */
  const colorTieneStock = (colorSlug: SlugColorPerfil) =>
    producto.variantes.some(
      (variante) =>
        variante.medidaId === seleccion.medidaId &&
        variante.colorSlug === colorSlug &&
        variante.visibilidad !== "oculto" &&
        hayStock(variante.stock),
    )

  const vidrioTieneStock = (vidrioSlug: SlugOpcionVidrio) =>
    producto.variantes.some(
      (variante) =>
        variante.medidaId === seleccion.medidaId &&
        variante.colorSlug === seleccion.colorSlug &&
        variante.vidrioSlug === vidrioSlug &&
        variante.visibilidad !== "oculto" &&
        hayStock(variante.stock),
    )

  return {
    seleccion,
    cantidad,
    cantidadMaxima,
    desglose,
    varianteActual,
    disponible,
    setCantidad,
    setMedida,
    setColor,
    setVidrio,
    setVariante,
    toggleAccesorio,
    setManoApertura,
    medidaTieneStock,
    colorTieneStock,
    vidrioTieneStock,
  }
}
