import { describe, expect, it } from "vitest"

import {
  actualizarCantidadDesglose,
  buscarVariante,
  calcularPrecioProducto,
  obtenerPrecioInicial,
} from "@/features/products/lib/pricing"
import {
  crearDescuento,
  crearProductoConVariantes,
  crearProductoSimple,
  crearVariante,
  stockLimitado,
} from "@/features/products/lib/test-fixtures"
import type { AccesorioLinea } from "@/types"

describe("buscarVariante", () => {
  it("encuentra la variante que matchea medida + color + vidrio exactos", () => {
    const objetivo = crearVariante({
      id: "var-objetivo",
      medidaId: "size-a",
      colorSlug: "blanco",
      vidrioSlug: "dvh",
    })
    const otra = crearVariante({
      id: "var-otra",
      medidaId: "size-a",
      colorSlug: "negro",
      vidrioSlug: "dvh",
    })
    const producto = crearProductoConVariantes([objetivo, otra])

    const resultado = buscarVariante(producto, {
      medidaId: "size-a",
      colorSlug: "blanco",
      vidrioSlug: "dvh",
      accesoriosSlug: [],
      manoApertura: null,
    })

    expect(resultado?.id).toBe("var-objetivo")
  })

  it("no devuelve variantes ocultas aunque matcheen", () => {
    const oculta = crearVariante({
      id: "var-oculta",
      medidaId: "size-a",
      colorSlug: "blanco",
      vidrioSlug: null,
      visibilidad: "oculto",
    })
    const producto = crearProductoConVariantes([oculta])

    const resultado = buscarVariante(producto, {
      medidaId: "size-a",
      colorSlug: "blanco",
      vidrioSlug: null,
      accesoriosSlug: [],
      manoApertura: null,
    })

    expect(resultado).toBeUndefined()
  })

  it("undefined si no hay ninguna combinación que matchee", () => {
    const producto = crearProductoConVariantes([crearVariante()])
    const resultado = buscarVariante(producto, {
      medidaId: "size-inexistente",
      colorSlug: "blanco",
      vidrioSlug: null,
      accesoriosSlug: [],
      manoApertura: null,
    })
    expect(resultado).toBeUndefined()
  })
})

describe("calcularPrecioProducto", () => {
  it("producto simple sin accesorios ni promoción: usa el precio base tal cual", () => {
    const producto = crearProductoSimple({
      precios: {
        precioBase: 100_000,
        precioTarjeta: 130_000,
        precioContado: 100_000,
        porcentajeDescuento: 0,
        moneda: "ARS",
        consultarPrecio: false,
      },
    })

    const desglose = calcularPrecioProducto(
      producto,
      { medidaId: "", colorSlug: "", vidrioSlug: null, accesoriosSlug: [], manoApertura: null },
      1,
    )

    expect(desglose.precioUnitarioContado).toBe(100_000)
    expect(desglose.precioUnitarioTarjeta).toBe(130_000)
    expect(desglose.totalContado).toBe(100_000)
    expect(desglose.ahorroUnitario).toBe(0)
    expect(desglose.descuentoAplicado).toBeNull()
  })

  it("multiplica correctamente por cantidad", () => {
    const producto = crearProductoSimple()
    const desglose = calcularPrecioProducto(
      producto,
      { medidaId: "", colorSlug: "", vidrioSlug: null, accesoriosSlug: [], manoApertura: null },
      3,
    )
    expect(desglose.totalContado).toBe(desglose.precioUnitarioContado * 3)
    expect(desglose.totalTarjeta).toBe(desglose.precioUnitarioTarjeta * 3)
  })

  it("una cantidad de 0 o negativa se normaliza a 1", () => {
    const producto = crearProductoSimple()
    const conCero = calcularPrecioProducto(
      producto,
      { medidaId: "", colorSlug: "", vidrioSlug: null, accesoriosSlug: [], manoApertura: null },
      0,
    )
    expect(conCero.totalContado).toBe(conCero.precioUnitarioContado)
  })

  it("aplica la promoción del producto al precio de contado de la variante", () => {
    const variante = crearVariante({
      precioContado: 100_000,
      precioTarjeta: 130_000,
      aplicaDescuento: true,
    })
    const producto = crearProductoConVariantes([variante], {
      descuento: crearDescuento({ tipo: "porcentaje", valor: 10 }),
    })

    const desglose = calcularPrecioProducto(
      producto,
      {
        medidaId: variante.medidaId,
        colorSlug: variante.colorSlug,
        vidrioSlug: null,
        accesoriosSlug: [],
        manoApertura: null,
      },
      1,
    )

    expect(desglose.precioUnitarioContadoOriginal).toBe(100_000)
    expect(desglose.precioUnitarioContado).toBe(90_000)
    expect(desglose.ahorroUnitario).toBe(10_000)
    expect(desglose.precioUnitarioTarjeta).toBe(130_000) // la tarjeta no lleva promo
  })

  it("suma el adicional de accesorios activados, emparejando por área más cercana", () => {
    const variante = crearVariante({
      medidaId: "size-100x100",
      precioContado: 100_000,
      precioTarjeta: 130_000,
    })
    const mosquitero: AccesorioLinea = {
      id: "acc-mosquitero",
      slug: "mosquitero",
      etiqueta: "Mosquitero",
      lineaSlug: "herrero",
      medidas: [
        { id: "m1", anchoCm: 100, altoCm: 100, precio: 15_000 },
        { id: "m2", anchoCm: 150, altoCm: 150, precio: 22_000 },
      ],
      incluidoPorDefecto: false,
    }
    const producto = crearProductoConVariantes([variante], {
      medidasDisponibles: [
        { id: "size-100x100", etiqueta: "100 x 100", anchoCm: 100, altoCm: 100 },
      ],
      llevaAccesorios: true,
      accesorios: [{ slug: "mosquitero", obligatorio: false }],
    })

    const desglose = calcularPrecioProducto(
      producto,
      {
        medidaId: "size-100x100",
        colorSlug: variante.colorSlug,
        vidrioSlug: null,
        accesoriosSlug: ["mosquitero"],
        manoApertura: null,
      },
      1,
      [mosquitero],
    )

    expect(desglose.adicionalAccesorios).toBe(15_000)
    expect(desglose.precioUnitarioContado).toBe(115_000)
    expect(desglose.precioUnitarioTarjeta).toBe(145_000)
  })

  it("no suma accesorios que no fueron seleccionados por el cliente", () => {
    const variante = crearVariante({ medidaId: "size-100x100" })
    const mosquitero: AccesorioLinea = {
      id: "acc-mosquitero",
      slug: "mosquitero",
      etiqueta: "Mosquitero",
      lineaSlug: "herrero",
      medidas: [{ id: "m1", anchoCm: 100, altoCm: 100, precio: 15_000 }],
      incluidoPorDefecto: false,
    }
    const producto = crearProductoConVariantes([variante], {
      medidasDisponibles: [
        { id: "size-100x100", etiqueta: "100 x 100", anchoCm: 100, altoCm: 100 },
      ],
      llevaAccesorios: true,
      accesorios: [{ slug: "mosquitero", obligatorio: false }],
    })

    const desglose = calcularPrecioProducto(
      producto,
      {
        medidaId: "size-100x100",
        colorSlug: variante.colorSlug,
        vidrioSlug: null,
        accesoriosSlug: [],
        manoApertura: null,
      },
      1,
      [mosquitero],
    )

    expect(desglose.adicionalAccesorios).toBe(0)
  })

  it("ignora accesorios seleccionados si el producto no lleva accesorios", () => {
    const variante = crearVariante({ medidaId: "size-100x100" })
    const mosquitero: AccesorioLinea = {
      id: "acc-mosquitero",
      slug: "mosquitero",
      etiqueta: "Mosquitero",
      lineaSlug: "herrero",
      medidas: [{ id: "m1", anchoCm: 100, altoCm: 100, precio: 15_000 }],
      incluidoPorDefecto: false,
    }
    const producto = crearProductoConVariantes([variante], {
      medidasDisponibles: [
        { id: "size-100x100", etiqueta: "100 x 100", anchoCm: 100, altoCm: 100 },
      ],
      llevaAccesorios: false,
      accesorios: [{ slug: "mosquitero", obligatorio: false }],
    })

    const desglose = calcularPrecioProducto(
      producto,
      {
        medidaId: "size-100x100",
        colorSlug: variante.colorSlug,
        vidrioSlug: null,
        accesoriosSlug: ["mosquitero"],
        manoApertura: null,
      },
      1,
      [mosquitero],
    )

    expect(desglose.adicionalAccesorios).toBe(0)
  })
})

describe("obtenerPrecioInicial", () => {
  it("null si el producto tiene 'consultar precio'", () => {
    const producto = crearProductoSimple({
      precios: {
        precioBase: null,
        precioTarjeta: null,
        precioContado: null,
        porcentajeDescuento: 0,
        moneda: "ARS",
        consultarPrecio: true,
      },
    })
    expect(obtenerPrecioInicial(producto)).toBeNull()
  })

  it("producto simple sin stock: null (no se puede mostrar 'desde' sin poder comprarlo)", () => {
    const producto = crearProductoSimple({ stock: stockLimitado(0) })
    expect(obtenerPrecioInicial(producto)).toBeNull()
  })

  it("producto simple con stock: usa precioContado/precioTarjeta directo", () => {
    const producto = crearProductoSimple()
    const resultado = obtenerPrecioInicial(producto)
    expect(resultado).toEqual({ tarjeta: 130_000, contado: 100_000 })
  })

  it("con variantes, elige la más barata entre las que tienen stock", () => {
    const cara = crearVariante({
      id: "var-cara",
      medidaId: "size-a",
      precioContado: 200_000,
      precioTarjeta: 260_000,
    })
    const barataSinStock = crearVariante({
      id: "var-barata-sin-stock",
      medidaId: "size-b",
      precioContado: 50_000,
      precioTarjeta: 65_000,
      stock: stockLimitado(0),
    })
    const barataConStock = crearVariante({
      id: "var-barata-con-stock",
      medidaId: "size-c",
      precioContado: 90_000,
      precioTarjeta: 117_000,
    })

    const producto = crearProductoConVariantes([
      cara,
      barataSinStock,
      barataConStock,
    ])

    const resultado = obtenerPrecioInicial(producto)
    expect(resultado?.contado).toBe(90_000)
    expect(resultado?.tarjeta).toBe(117_000)
  })

  it("ignora variantes marcadas como 'consultar precio' al calcular el precio desde", () => {
    const consultar = crearVariante({
      id: "var-consultar",
      medidaId: "size-a",
      precioContado: 50_000,
      precioTarjeta: 65_000,
      consultarPrecio: true,
    })
    const publicada = crearVariante({
      id: "var-publicada",
      medidaId: "size-b",
      precioContado: 120_000,
      precioTarjeta: 156_000,
    })

    const resultado = obtenerPrecioInicial(
      crearProductoConVariantes([consultar, publicada]),
    )

    expect(resultado).toEqual({ tarjeta: 156_000, contado: 120_000 })
  })

  it("null si todas las variantes disponibles requieren consultar precio", () => {
    const producto = crearProductoConVariantes([
      crearVariante({ consultarPrecio: true }),
    ])

    expect(obtenerPrecioInicial(producto)).toBeNull()
  })

  it("null si ninguna variante tiene stock", () => {
    const producto = crearProductoConVariantes([
      crearVariante({ stock: stockLimitado(0) }),
    ])
    expect(obtenerPrecioInicial(producto)).toBeNull()
  })

  it("considera la promoción activa al elegir la variante más barata", () => {
    // Sin promo la "cara" es más cara, pero con 50% off queda más barata que la otra.
    const conPromo = crearVariante({
      id: "var-promo",
      medidaId: "size-a",
      precioContado: 100_000,
      precioTarjeta: 130_000,
      aplicaDescuento: true,
    })
    const sinPromo = crearVariante({
      id: "var-sin-promo",
      medidaId: "size-b",
      precioContado: 60_000,
      precioTarjeta: 78_000,
      aplicaDescuento: false,
    })
    const producto = crearProductoConVariantes([conPromo, sinPromo], {
      descuento: crearDescuento({ tipo: "porcentaje", valor: 50 }),
    })

    const resultado = obtenerPrecioInicial(producto)
    expect(resultado?.contado).toBe(50_000) // 100_000 - 50%
  })
})

describe("actualizarCantidadDesglose", () => {
  it("recalcula todos los totales para la nueva cantidad sin tocar los unitarios", () => {
    const producto = crearProductoSimple()
    const base = calcularPrecioProducto(
      producto,
      { medidaId: "", colorSlug: "", vidrioSlug: null, accesoriosSlug: [], manoApertura: null },
      1,
    )

    const actualizado = actualizarCantidadDesglose(base, 4)

    expect(actualizado.precioUnitarioContado).toBe(base.precioUnitarioContado)
    expect(actualizado.totalContado).toBe(base.precioUnitarioContado * 4)
    expect(actualizado.totalTarjeta).toBe(base.precioUnitarioTarjeta * 4)
    expect(actualizado.totalContadoOriginal).toBe(
      base.precioUnitarioContadoOriginal * 4,
    )
    expect(actualizado.ahorroTotal).toBe(base.ahorroUnitario * 4)
  })

  it("una cantidad de 0 se normaliza a 1", () => {
    const producto = crearProductoSimple()
    const base = calcularPrecioProducto(
      producto,
      { medidaId: "", colorSlug: "", vidrioSlug: null, accesoriosSlug: [], manoApertura: null },
      1,
    )
    const actualizado = actualizarCantidadDesglose(base, 0)
    expect(actualizado.totalContado).toBe(base.precioUnitarioContado)
  })
})
