"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";

import { Toaster } from "@/components/ui/sonner";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { useSyncCartCatalog } from "@/features/cart/hooks/use-sync-cart-catalog";
import { ProveedorUICarrito } from "@/features/cart/providers/ProveedorUICarrito";
import { CheckoutDialog } from "@/features/checkout/components/CheckoutDialog";
import { OrderSuccessDialog } from "@/features/checkout/components/OrderSuccessDialog";
import type { ConfiguracionCheckoutPublica } from "@/types";

// El FAB se monta después de la hidratación. Los Dialog/Sheet de Base UI
// agregan `inert` y `aria-hidden` a sus hermanos mientras están abiertos; si
// una galería se abre durante la hidratación selectiva, esos atributos no deben
// modificar HTML del servidor que React todavía esté intentando hidratar.
const CartButton = dynamic(
  () =>
    import("@/features/cart/components/CartButton").then(
      (module) => module.CartButton,
    ),
  { ssr: false },
);

/**
 * Única frontera cliente global del carrito. Los `children` pueden seguir
 * siendo Server Components, pero comparten el contexto efímero del carrito.
 */
export function CarritoGlobal({
  checkout,
  telefonoWhatsapp,
  children,
}: {
  checkout: ConfiguracionCheckoutPublica;
  telefonoWhatsapp: string;
  children: ReactNode;
}) {
  useSyncCartCatalog();

  return (
    <ProveedorUICarrito>
      {children}
      <CartButton />
      <CartDrawer />
      <CheckoutDialog
        configuracion={checkout}
        telefonoWhatsapp={telefonoWhatsapp}
      />
      <OrderSuccessDialog />
      <Toaster richColors closeButton />
    </ProveedorUICarrito>
  );
}
