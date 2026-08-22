"use client";

import { useEffect, useRef } from "react";

import { useCartStore } from "@/features/cart/store/use-cart-store";
import type { AccesorioLinea, Producto } from "@/types";

/**
 * Hidrata `lebaux-cart` en cliente. Solo si hay ítems consulta el endpoint
 * liviano de sincronización, evitando enviar todo el catálogo en el HTML inicial.
 */
export function useSyncCartCatalog() {
  const sincronizar = useCartStore((state) => state.sincronizarConCatalogo);
  const ejecutado = useRef(false);

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;
    let activo = true;

    async function hidratarYSincronizar() {
      await useCartStore.persist.rehydrate();
      if (!activo) return;

      const items = useCartStore.getState().items;
      if (items.length === 0) return;

      const respuesta = await fetch("/api/carrito/sincronizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: items.map((item) => item.producto.id) }),
        cache: "no-store",
      });
      if (!respuesta.ok || !activo) return;
      const datos = (await respuesta.json()) as {
        productos: Producto[];
        accesorios: AccesorioLinea[];
      };
      sincronizar(datos.productos, datos.accesorios);
    }

    void hidratarYSincronizar();
    return () => {
      activo = false;
    };
  }, [sincronizar]);
}
