"use client"

import { useState } from "react"
import { ShoppingCart, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CartItemRow } from "@/features/cart/components/CartItemRow"
import {
  calcularTotalesCarrito,
  useCartStore,
} from "@/features/cart/store/use-cart-store"
import { useUICarrito } from "@/features/cart/hooks/use-ui-carrito"
import { formatProductPrice } from "@/features/products/lib/product-card-formatters"
import { completarTextoPublico } from "@/lib/public-text"

/** Drawer principal del carrito con edición, totales y confirmación para vaciar. */
export function CartDrawer() {
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const {
    carritoAbierto: open,
    setCarritoAbierto: setOpen,
    abrirCheckout,
  } = useUICarrito()
  const items = useCartStore((state) => state.items)
  const vaciar = useCartStore((state) => state.vaciar)
  const totals = calcularTotalesCarrito(items)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full max-w-full gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-4 py-3 pr-24 sm:pl-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <SheetTitle className="text-base uppercase tracking-wide">
                {"Tu pedido"}
              </SheetTitle>
              <SheetDescription className="mt-0.5 text-xs">
                {totals.cantidadItems === 0
                  ? "Todavía no agregaste productos."
                  : completarTextoPublico("{cantidad} unidades configuradas", {
                      cantidad: totals.cantidadItems,
                    })}
              </SheetDescription>
            </div>

            {items.length > 0 && (
              <AlertDialog
                open={clearDialogOpen}
                onOpenChange={setClearDialogOpen}
              >
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground"
                    />
                  }
                >
                  <Trash2 data-icon="inline-start" /> {"Vaciar"}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{"¿Vaciar todo el carrito?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {"Se eliminarán todas las configuraciones guardadas en este pedido."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{"Cancelar"}</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => {
                        vaciar()
                        setClearDialogOpen(false)
                      }}
                    >
                      {"Vaciar carrito"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-10 text-center text-muted-foreground">
            <span className="mb-1 rounded-2xl bg-primary/10 p-3 text-primary">
              <ShoppingCart className="size-7" />
            </span>
            <p className="text-sm font-semibold text-foreground">
              {"Tu carrito está vacío"}
            </p>
            <p className="max-w-64 text-xs leading-5">
              {"Elegí una abertura, configurá sus opciones y agregala para empezar el pedido."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t bg-muted/30 p-3 sm:p-4">
              <div className="space-y-2">
                {totals.ahorroTotal > 0 && (
                  <>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {"Contado antes de promociones"}
                      </span>
                      <span className="tabular-nums text-muted-foreground line-through">
                        {formatProductPrice(totals.totalContadoOriginal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm text-success">
                      <span>{"Ahorro en promociones"}</span>
                      <span className="font-semibold tabular-nums">
                        - {formatProductPrice(totals.ahorroTotal)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {"Total contado"}
                  </span>
                  <span className="font-bold tabular-nums text-success">
                    {formatProductPrice(totals.totalContado)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {"Total tarjeta"}
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatProductPrice(totals.totalTarjeta)}
                  </span>
                </div>
              </div>
              <Separator className="my-3" />
              <Button
                size="lg"
                className="w-full rounded-xl"
                onClick={abrirCheckout}
              >
                {"Continuar pedido"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
