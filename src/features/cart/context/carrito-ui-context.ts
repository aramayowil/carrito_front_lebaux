"use client"

import { createContext } from "react"

export interface ContextoUICarritoValor {
  carritoAbierto: boolean
  checkoutAbierto: boolean
  exitoAbierto: boolean
  setCarritoAbierto: (abierto: boolean) => void
  setCheckoutAbierto: (abierto: boolean) => void
  setExitoAbierto: (abierto: boolean) => void
  abrirCarrito: () => void
  abrirCheckout: () => void
}

export const ContextoUICarrito = createContext<ContextoUICarritoValor | null>(
  null,
)
