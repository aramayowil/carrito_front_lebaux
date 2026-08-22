"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

import {
  ContextoUICarrito,
  type ContextoUICarritoValor,
} from "@/features/cart/context/carrito-ui-context";

/** Mantiene el estado efímero de los paneles del carrito sin persistencia ni Zustand. */
export function ProveedorUICarrito({ children }: { children: ReactNode }) {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [exitoAbierto, setExitoAbierto] = useState(false);

  const abrirCarrito = useCallback(() => {
    setCarritoAbierto(true);
    setCheckoutAbierto(false);
  }, []);

  const abrirCheckout = useCallback(() => {
    setCarritoAbierto(false);
    setCheckoutAbierto(true);
  }, []);

  const valor = useMemo<ContextoUICarritoValor>(
    () => ({
      carritoAbierto,
      checkoutAbierto,
      exitoAbierto,
      setCarritoAbierto,
      setCheckoutAbierto,
      setExitoAbierto,
      abrirCarrito,
      abrirCheckout,
    }),
    [
      carritoAbierto,
      checkoutAbierto,
      exitoAbierto,
      abrirCarrito,
      abrirCheckout,
    ],
  );

  return (
    <ContextoUICarrito.Provider value={valor}>
      {children}
    </ContextoUICarrito.Provider>
  );
}
