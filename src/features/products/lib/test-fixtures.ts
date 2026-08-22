import type {
  ColorPerfil,
  Descuento,
  OpcionMedida,
  Producto,
  StockVariante,
  VarianteProducto,
} from "@/types";

/** Producto "simple", sin variantes: usa `precios`/`stock` directo. */
export function crearProductoSimple(
  overrides: Partial<Producto> = {},
): Producto {
  return {
    id: "prod-simple",
    slug: "puerta-simple",
    nombre: "Puerta simple",
    linea: "herrero",
    tipologiaId: "tip-herrero-puertas",
    tipoApertura: "batiente",
    descripcion: "Puerta de prueba",
    descripcionExtensa: "",
    descuento: { activo: false, tipo: "porcentaje", valor: 0 },
    imagenes: [],
    precios: {
      precioBase: 100_000,
      precioTarjeta: 130_000,
      precioContado: 100_000,
      porcentajeDescuento: 0,
      moneda: "ARS",
      consultarPrecio: false,
    },
    stock: { modo: "infinito" },
    medidasDisponibles: [],
    coloresDisponibles: [],
    variantes: [],
    opcionesVidrio: [],
    llevaAccesorios: false,
    accesorios: [],
    productosRelacionadosIds: [],
    etiquetas: [],
    destacado: false,
    visibilidad: "visible",
    creadoEn: "2026-01-01T00:00:00.000Z",
    actualizadoEn: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function crearVariante(
  overrides: Partial<VarianteProducto> = {},
): VarianteProducto {
  return {
    id: "var-1",
    medidaId: "size-120x100",
    colorSlug: "negro",
    vidrioSlug: null,
    precioContado: 100_000,
    precioTarjeta: 130_000,
    consultarPrecio: false,
    aplicaDescuento: false,
    stock: { modo: "infinito" },
    visibilidad: "visible",
    ...overrides,
  };
}

export function crearMedida(
  overrides: Partial<OpcionMedida> = {},
): OpcionMedida {
  return {
    id: "size-120x100",
    etiqueta: "120 x 100 cm",
    anchoCm: 120,
    altoCm: 100,
    ...overrides,
  };
}

export function crearColor(overrides: Partial<ColorPerfil> = {}): ColorPerfil {
  return {
    id: "color-negro",
    slug: "negro",
    etiqueta: "Negro",
    hexadecimal: "#1C1C1C",
    lineasPermitidas: [],
    ...overrides,
  };
}

/** Producto con variantes (Medida × Color), la forma más común en catálogo. */
export function crearProductoConVariantes(
  variantes: VarianteProducto[],
  overrides: Partial<Producto> = {},
): Producto {
  return crearProductoSimple({
    id: "prod-variantes",
    slug: "ventana-con-variantes",
    variantes,
    medidasDisponibles: [crearMedida()],
    coloresDisponibles: [crearColor()],
    ...overrides,
  });
}

export function crearDescuento(overrides: Partial<Descuento> = {}): Descuento {
  return { activo: true, tipo: "porcentaje", valor: 10, ...overrides };
}

export function stockLimitado(
  cantidad: number,
  motivo?: string,
): StockVariante {
  return { modo: "limitado", cantidad, motivo };
}
