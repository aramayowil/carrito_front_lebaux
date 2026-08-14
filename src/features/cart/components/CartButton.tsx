"use client"

import { ShoppingCart } from "lucide-react"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/features/cart/store/use-cart-store"
import { useUICarrito } from "@/features/cart/hooks/use-ui-carrito"
import { cn } from "@/lib/utils"

/** FAB del carrito: respeta el área segura y se eleva sobre la compra móvil. */
export function CartButton() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.cantidad, 0),
  )
  const { abrirCarrito } = useUICarrito()
  const pathname = usePathname()
  const withBottomBar = pathname.startsWith("/producto/")

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 mx-auto flex max-w-screen-2xl justify-end px-4 sm:px-6 lg:px-8",
        withBottomBar
          ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))]"
          : "bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))]",
      )}
    >
      <Button
        size="icon-lg"
        onClick={abrirCarrito}
        aria-label={
          count > 0 ? `Abrir carrito, ${count} unidades` : "Abrir carrito"
        }
        className="fab-inicio-animado pointer-events-auto relative size-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
      >
        <ShoppingCart className="relative z-10 size-6" />
        {count > 0 && (
          <Badge
            key={count}
            className="absolute -right-1.5 -top-1.5 min-w-6 justify-center bg-foreground text-background shadow-sm animate-in zoom-in-50 duration-200"
          >
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </Button>
    </div>
  )
}
