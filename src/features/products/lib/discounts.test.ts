import { describe, expect, it } from "vitest"

import {
  calcularPrecioPromocional,
  descuentoProductoActivo,
  etiquetaDescuento,
  etiquetaPromocionCard,
  obtenerVariantesPromocion,
  participaDelDescuento,
  resumirPromocionProducto,
} from "@/features/products/lib/discounts"
import {
  crearDescuento,
  crearProductoConVariantes,
  crearProductoSimple,
  crearVariante,
  stockLimitado,
} from "@/features/products/lib/test-fixtures"

describe("descuentoProductoActivo", () => {
  it("false si el descuento no está activo", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ activo: false }),
    })
    expect(descuentoProductoActivo(producto)).toBe(false)
  })

  it("false si está activo pero el valor es 0", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ activo: true, valor: 0 }),
    })
    expect(descuentoProductoActivo(producto)).toBe(false)
  })

  it("true si está activo y el valor es mayor a 0", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ activo: true, valor: 15 }),
    })
    expect(descuentoProductoActivo(producto)).toBe(true)
  })
})

describe("participaDelDescuento", () => {
  it("un producto simple (sin variantes) participa completo si el descuento está activo", () => {
    const producto = crearProductoSimple({ descuento: crearDescuento() })
    expect(participaDelDescuento(producto)).toBe(true)
  })

  it("un producto con variantes solo participa si la variante lo tiene marcado", () => {
    const conDescuento = crearVariante({ aplicaDescuento: true })
    const sinDescuento = crearVariante({ id: "var-2", aplicaDescuento: false })
    const producto = crearProductoConVariantes([conDescuento, sinDescuento], {
      descuento: crearDescuento(),
    })

    expect(participaDelDescuento(producto, conDescuento)).toBe(true)
    expect(participaDelDescuento(producto, sinDescuento)).toBe(false)
  })

  it("false si el descuento del producto no está activo, aunque la variante lo tenga marcado", () => {
    const variante = crearVariante({ aplicaDescuento: true })
    const producto = crearProductoConVariantes([variante], {
      descuento: crearDescuento({ activo: false }),
    })
    expect(participaDelDescuento(producto, variante)).toBe(false)
  })
})

describe("calcularPrecioPromocional", () => {
  it("aplica un descuento porcentual y redondea al peso", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }),
    })
    const resultado = calcularPrecioPromocional(producto, undefined, 100_333)

    expect(resultado).not.toBeNull()
    expect(resultado?.ahorro).toBe(10_033) // Math.round(100333 * 0.10)
    expect(resultado?.final).toBe(100_333 - 10_033)
    expect(resultado?.original).toBe(100_333)
  })

  it("aplica un descuento de monto fijo", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "monto_fijo", valor: 15_000 }),
    })
    const resultado = calcularPrecioPromocional(producto, undefined, 100_000)

    expect(resultado?.ahorro).toBe(15_000)
    expect(resultado?.final).toBe(85_000)
  })

  it("nunca deja el ahorro superar el precio original (monto fijo mayor al precio)", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "monto_fijo", valor: 999_999 }),
    })
    const resultado = calcularPrecioPromocional(producto, undefined, 50_000)

    expect(resultado?.ahorro).toBe(50_000)
    expect(resultado?.final).toBe(0)
  })

  it("un porcentaje mayor a 100 se recorta a 100%", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "porcentaje", valor: 250 }),
    })
    const resultado = calcularPrecioPromocional(producto, undefined, 40_000)

    expect(resultado?.ahorro).toBe(40_000)
    expect(resultado?.final).toBe(0)
  })

  it("un porcentaje o monto negativo se trata como 0 (no rompe, no aplica)", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "monto_fijo", valor: -5000 }),
    })
    expect(calcularPrecioPromocional(producto, undefined, 40_000)).toBeNull()
  })

  it("null si el producto no participa del descuento", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ activo: false }),
    })
    expect(calcularPrecioPromocional(producto, undefined, 40_000)).toBeNull()
  })

  it("null si el precio original es 0 o negativo", () => {
    const producto = crearProductoSimple({ descuento: crearDescuento() })
    expect(calcularPrecioPromocional(producto, undefined, 0)).toBeNull()
    expect(calcularPrecioPromocional(producto, undefined, -100)).toBeNull()
  })

  it("el descuento aplicado conserva la etiqueta personalizada y calcula el porcentaje equivalente", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({
        tipo: "monto_fijo",
        valor: 25_000,
        etiqueta: "Oferta de lanzamiento",
      }),
    })
    const resultado = calcularPrecioPromocional(producto, undefined, 100_000)

    expect(resultado?.descuento.etiqueta).toBe("Oferta de lanzamiento")
    expect(resultado?.descuento.origen).toBe("producto")
    expect(resultado?.descuento.porcentajeEquivalente).toBe(25)
  })
})

describe("obtenerVariantesPromocion", () => {
  it("filtra variantes ocultas y sin stock, y las que no aplican descuento", () => {
    const promocionable = crearVariante({
      id: "var-ok",
      aplicaDescuento: true,
      stock: { modo: "infinito" },
      visibilidad: "visible",
    })
    const oculta = crearVariante({
      id: "var-oculta",
      aplicaDescuento: true,
      visibilidad: "oculto",
    })
    const sinStock = crearVariante({
      id: "var-sin-stock",
      aplicaDescuento: true,
      stock: stockLimitado(0),
    })
    const noParticipa = crearVariante({
      id: "var-no-participa",
      aplicaDescuento: false,
    })

    const producto = crearProductoConVariantes(
      [promocionable, oculta, sinStock, noParticipa],
      { descuento: crearDescuento() },
    )

    const resultado = obtenerVariantesPromocion(producto)
    expect(resultado.map((v) => v.id)).toEqual(["var-ok"])
  })

  it("vacío si el producto no tiene el descuento activo", () => {
    const variante = crearVariante({ aplicaDescuento: true })
    const producto = crearProductoConVariantes([variante], {
      descuento: crearDescuento({ activo: false }),
    })
    expect(obtenerVariantesPromocion(producto)).toEqual([])
  })

  it("vacío si consultar precio está activo de forma global", () => {
    const variante = crearVariante({ aplicaDescuento: true })
    const producto = crearProductoConVariantes([variante], {
      descuento: crearDescuento(),
      precios: {
        precioBase: null,
        precioTarjeta: null,
        precioContado: null,
        porcentajeDescuento: 0,
        moneda: "ARS",
        consultarPrecio: true,
      },
    })

    expect(obtenerVariantesPromocion(producto)).toEqual([])
  })

  it("excluye variantes que requieren consultar precio aunque tengan promoción", () => {
    const consultar = crearVariante({
      id: "var-consultar",
      aplicaDescuento: true,
      consultarPrecio: true,
    })
    const publicada = crearVariante({
      id: "var-publicada",
      aplicaDescuento: true,
    })
    const producto = crearProductoConVariantes([consultar, publicada], {
      descuento: crearDescuento(),
    })

    expect(obtenerVariantesPromocion(producto).map((variante) => variante.id)).toEqual([
      "var-publicada",
    ])
  })
})

describe("resumirPromocionProducto", () => {
  it("null si el producto tiene 'consultar precio'", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento(),
      precios: {
        precioBase: null,
        precioTarjeta: null,
        precioContado: null,
        porcentajeDescuento: 0,
        moneda: "ARS",
        consultarPrecio: true,
      },
    })
    expect(resumirPromocionProducto(producto)).toBeNull()
  })

  it("producto simple: usa precioContado y respeta el stock", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "monto_fijo", valor: 10_000 }),
      stock: { modo: "infinito" },
    })
    const resumen = resumirPromocionProducto(producto)

    expect(resumen).not.toBeNull()
    expect(resumen?.varianteId).toBeNull()
    expect(resumen?.cantidadVariantes).toBe(1)
    expect(resumen?.final).toBe(90_000)
  })

  it("producto simple sin stock no tiene promoción para mostrar", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento(),
      stock: stockLimitado(0),
    })
    expect(resumirPromocionProducto(producto)).toBeNull()
  })

  it("con variantes, usa la combinación promocionada de menor precio final", () => {
    const cara = crearVariante({
      id: "var-cara",
      aplicaDescuento: true,
      precioContado: 200_000,
    })
    const barata = crearVariante({
      id: "var-barata",
      aplicaDescuento: true,
      precioContado: 100_000,
    })
    const producto = crearProductoConVariantes([cara, barata], {
      descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }),
    })

    const resumen = resumirPromocionProducto(producto)
    expect(resumen?.varianteId).toBe("var-barata")
    expect(resumen?.final).toBe(90_000)
    expect(resumen?.cantidadVariantes).toBe(2)
  })
})

describe("etiquetaDescuento", () => {
  it("usa la etiqueta personalizada si existe", () => {
    expect(
      etiquetaDescuento(crearDescuento({ etiqueta: "3 cuotas sin interés" })),
    ).toBe("3 cuotas sin interés")
  })

  it("arma '<valor>% OFF' para descuentos porcentuales sin etiqueta", () => {
    expect(
      etiquetaDescuento(crearDescuento({ tipo: "porcentaje", valor: 20 })),
    ).toBe("20% OFF")
  })

  it("arma '$<valor> OFF' formateado en es-AR para monto fijo sin etiqueta", () => {
    expect(
      etiquetaDescuento(
        crearDescuento({ tipo: "monto_fijo", valor: 15_000 }),
      ),
    ).toBe("$15.000 OFF")
  })
})

describe("etiquetaPromocionCard", () => {
  it("producto simple: solo el valor del descuento", () => {
    const producto = crearProductoSimple({
      descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }),
    })
    expect(etiquetaPromocionCard(producto)).toBe("10% OFF")
  })

  it("todas las variantes vendibles con descuento: sin 'Hasta'", () => {
    const v1 = crearVariante({ id: "v1", aplicaDescuento: true })
    const v2 = crearVariante({ id: "v2", aplicaDescuento: true })
    const producto = crearProductoConVariantes([v1, v2], {
      descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }),
    })
    expect(etiquetaPromocionCard(producto)).toBe("10% OFF")
  })

  it("promoción parcial (alguna variante vendible sin descuento): antepone 'Hasta'", () => {
    const conDescuento = crearVariante({ id: "v1", aplicaDescuento: true })
    const sinDescuento = crearVariante({ id: "v2", aplicaDescuento: false })
    const producto = crearProductoConVariantes(
      [conDescuento, sinDescuento],
      { descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }) },
    )
    expect(etiquetaPromocionCard(producto)).toBe("Hasta 10% OFF")
  })

  it("ignora variantes ocultas o sin stock al decidir si la promo es parcial", () => {
    const conDescuento = crearVariante({ id: "v1", aplicaDescuento: true })
    const sinDescuentoPeroOculta = crearVariante({
      id: "v2",
      aplicaDescuento: false,
      visibilidad: "oculto",
    })
    const producto = crearProductoConVariantes(
      [conDescuento, sinDescuentoPeroOculta],
      { descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }) },
    )
    expect(etiquetaPromocionCard(producto)).toBe("10% OFF")
  })
})
