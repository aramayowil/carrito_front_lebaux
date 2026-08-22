"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { ProductImage } from "@/components/media/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { formatProductPrice } from "@/features/products/lib/product-card-formatters";
import { etiquetaDescuento } from "@/features/products/lib/discounts";
import { completarTextoPublico } from "@/lib/public-text";
import type { ItemCarrito } from "@/types";

interface CartItemRowProps {
  item: ItemCarrito;
}

/** Fila editable de un producto configurado dentro del carrito. */
export function CartItemRow({ item }: CartItemRowProps) {
  const actualizarCantidad = useCartStore((state) => state.actualizarCantidad);
  const eliminarItem = useCartStore((state) => state.eliminarItem);

  return (
    <Card size="sm" className="gap-0 border border-border/70 py-0">
      <CardContent className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 p-3">
        <div className="flex flex-col gap-2">
          <ProductImage
            src={item.producto.imagen}
            alt={item.producto.nombre}
            className="aspect-square w-full rounded-xl border bg-white"
          />

          <div className="flex items-center justify-between rounded-full border bg-muted/30 p-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              aria-label="Restar cantidad"
            >
              <Minus />
            </Button>
            <span className="min-w-5 text-center text-sm font-bold">
              {item.cantidad}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
              aria-label="Sumar cantidad"
              disabled={
                item.cantidadMaxima !== null &&
                item.cantidad >= item.cantidadMaxima
              }
            >
              <Plus />
            </Button>
          </div>
          {item.cantidadMaxima !== null && (
            <p className="text-center text-[11px] text-muted-foreground">
              {item.cantidad >= item.cantidadMaxima
                ? "Sin más stock"
                : completarTextoPublico("Quedan {cantidad}", {
                    cantidad: item.cantidadMaxima - item.cantidad,
                  })}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase leading-snug">
              {item.producto.nombre}
            </h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => eliminarItem(item.id)}
              aria-label={"Eliminar " + item.producto.nombre}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>

          <p className="mt-1 text-xs leading-4 text-muted-foreground">
            {item.resumenSeleccion.medidaEtiqueta} ·{" "}
            {item.resumenSeleccion.colorEtiqueta} ·{" "}
            {item.resumenSeleccion.vidrioEtiqueta ?? "Sin vidrio"}
          </p>

          {item.precios.descuentoAplicado && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-success text-success-foreground">
                {etiquetaDescuento(item.precios.descuentoAplicado)}
              </Badge>
              <span className="text-xs font-medium text-success">
                {completarTextoPublico("Ahorrás {monto}", {
                  monto: formatProductPrice(item.precios.ahorroTotal),
                })}
              </span>
            </div>
          )}

          {item.resumenSeleccion.manoAperturaEtiqueta && (
            <Badge variant="outline" className="mt-1.5">
              {completarTextoPublico("Mano: {mano}", {
                mano: item.resumenSeleccion.manoAperturaEtiqueta,
              })}
            </Badge>
          )}

          {item.resumenSeleccion.accesoriosEtiqueta.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.resumenSeleccion.accesoriosEtiqueta.map((label) => (
                <Badge key={label} variant="secondary">
                  + {label}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2.5">
            <div>
              <p className="text-xs text-muted-foreground">
                {"Precio contado"}
              </p>
              {item.precios.descuentoAplicado && (
                <p className="text-xs tabular-nums text-muted-foreground line-through">
                  {formatProductPrice(item.precios.totalContadoOriginal)}
                </p>
              )}
              <p className="mt-0.5 text-sm font-bold leading-tight tabular-nums text-success">
                {formatProductPrice(item.precios.totalContado)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {"Precio tarjeta"}
              </p>
              <p className="mt-0.5 text-sm font-bold leading-tight tabular-nums">
                {formatProductPrice(item.precios.totalTarjeta)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
