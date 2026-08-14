"use client"

import { useContext } from "react"

import { ContextoUICarrito } from "@/features/cart/context/carrito-ui-context"

/** Expone únicamente estado efímero de interfaz del flujo carrito/checkout. */
export function useUICarrito() {
  const contexto = useContext(ContextoUICarrito)

  if (!contexto) {
    throw new Error("useUICarrito debe usarse dentro de ProveedorUICarrito")
  }

  return contexto
}
