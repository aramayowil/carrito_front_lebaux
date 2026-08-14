/**
 * Ejemplo ejecutable de un `ItemCarrito` completo.
 *
 * No es un tipo: es una constante real que satisface la interfaz, útil
 * para tests, Storybook, o como fixture rápido mientras no hay backend
 * (ver también `src/data/mock`). Si `ItemCarrito` cambia de forma, este
 * archivo deja de compilar y avisa que hay que actualizar el ejemplo.
 */

import type { ItemCarrito } from "./carrito"

export const ejemploItemCarrito: ItemCarrito = {
  id: "item-001",
  producto: {
    id: "herrero-01",
    slug: "ventana-corrediza-herrero",
    nombre: "Ventana Corrediza Línea Herrero",
    linea: "herrero",
    tipologiaId: "tip-herrero-ventanas",
    imagen: "/img/v_entero_H.jpg",
  },
  seleccion: {
    medidaId: "size-120x100",
    colorSlug: "negro",
    vidrioSlug: "comun-4mm",
    accesoriosSlug: ["mosquitero", "tapajunta"],
    manoApertura: null,
  },
  resumenSeleccion: {
    medidaEtiqueta: "120 x 100 cm",
    colorEtiqueta: "Negro",
    vidrioEtiqueta: "Vidrio común 4 mm",
    accesoriosEtiqueta: ["Mosquitero", "Tapajunta"],
    manoAperturaEtiqueta: null,
  },
  cantidad: 1,
  cantidadMaxima: null,
  precios: {
    moneda: "ARS",
    precioVarianteContado: 110000,
    precioVarianteTarjeta: 142900,
    adicionalVidrio: 0,
    adicionalAccesorios: 23000,
    porcentajeDescuento: 0,
    descuentoAplicado: null,
    precioUnitarioContadoOriginal: 133000,
    ahorroUnitario: 0,
    ahorroTotal: 0,
    totalContadoOriginal: 133000,
    precioUnitarioContado: 133000,
    precioUnitarioTarjeta: 165900,
    totalContado: 133000,
    totalTarjeta: 165900,
  },
}
