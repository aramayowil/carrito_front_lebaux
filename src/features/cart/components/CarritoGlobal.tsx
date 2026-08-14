"use client"

import type { ReactNode } from "react"

import { Toaster } from "@/components/ui/sonner"
import { CartButton } from "@/features/cart/components/CartButton"
import { CartDrawer } from "@/features/cart/components/CartDrawer"
import { useSyncCartCatalog } from "@/features/cart/hooks/use-sync-cart-catalog"
import { ProveedorUICarrito } from "@/features/cart/providers/ProveedorUICarrito"
import { CheckoutDialog } from "@/features/checkout/components/CheckoutDialog"
import { OrderSuccessDialog } from "@/features/checkout/components/OrderSuccessDialog"
import type { ConfiguracionCheckoutPublica } from "@/types"

/**
 * Única frontera cliente global del carrito. Los `children` pueden seguir
 * siendo Server Components, pero comparten el contexto efímero del carrito.
 */
export function CarritoGlobal({
  checkout,
  telefonoWhatsapp,
  children,
}: {
  checkout: ConfiguracionCheckoutPublica
  telefonoWhatsapp: string
  children: ReactNode
}) {
  useSyncCartCatalog()

  return (
    <ProveedorUICarrito>
      {children}
      <CartButton />
      <CartDrawer />
      <CheckoutDialog configuracion={checkout} telefonoWhatsapp={telefonoWhatsapp} />
      <OrderSuccessDialog />
      <Toaster richColors closeButton />
    </ProveedorUICarrito>
  )
}
