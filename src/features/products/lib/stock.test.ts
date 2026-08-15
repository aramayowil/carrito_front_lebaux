import { describe, expect, it } from "vitest"

import {
  cantidadMaximaDeStock,
  etiquetaStock,
  hayStock,
} from "@/features/products/lib/stock"

describe("hayStock", () => {
  it("siempre hay stock en modo infinito, sin importar cantidad", () => {
    expect(hayStock({ modo: "infinito" })).toBe(true)
    expect(hayStock({ modo: "infinito", cantidad: 0 })).toBe(true)
  })

  it("en modo limitado depende de que cantidad sea mayor a 0", () => {
    expect(hayStock({ modo: "limitado", cantidad: 5 })).toBe(true)
    expect(hayStock({ modo: "limitado", cantidad: 0 })).toBe(false)
    expect(hayStock({ modo: "limitado", cantidad: -1 })).toBe(false)
  })

  it("trata cantidad ausente como 0 en modo limitado", () => {
    expect(hayStock({ modo: "limitado" })).toBe(false)
  })
})

describe("etiquetaStock", () => {
  it("modo infinito siempre dice 'Infinito'", () => {
    expect(etiquetaStock({ modo: "infinito" })).toBe("Infinito")
  })

  it("sin unidades dice 'Sin stock'", () => {
    expect(etiquetaStock({ modo: "limitado", cantidad: 0 })).toBe("Sin stock")
  })

  it("pluraliza correctamente según la cantidad", () => {
    expect(etiquetaStock({ modo: "limitado", cantidad: 1 })).toBe(
      "1 unidad disponible",
    )
    expect(etiquetaStock({ modo: "limitado", cantidad: 3 })).toBe(
      "3 unidades disponibles",
    )
  })
})

describe("cantidadMaximaDeStock", () => {
  it("es null (sin tope) en modo infinito", () => {
    expect(cantidadMaximaDeStock({ modo: "infinito" })).toBeNull()
  })

  it("es la cantidad disponible en modo limitado", () => {
    expect(cantidadMaximaDeStock({ modo: "limitado", cantidad: 7 })).toBe(7)
  })

  it("nunca devuelve un número negativo", () => {
    expect(cantidadMaximaDeStock({ modo: "limitado", cantidad: -3 })).toBe(0)
  })
})
