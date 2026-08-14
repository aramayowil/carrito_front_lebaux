import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

import { ProductImage } from "@/components/media/ProductImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatProductPrice,
  getPrimaryProductImage,
} from "@/features/products/lib/product-card-formatters"
import { descripcionProductoComoTexto } from "@/features/products/lib/product-description"
import { completarTextoPublico } from "@/lib/public-text"
import {
  etiquetaPromocionCard,
  resumirPromocionProducto,
} from "@/features/products/lib/discounts"
import type { Producto } from "@/types"

interface PromotionProductCardProps {
  product: Producto
  lineLabel?: string
  tipologiaLabel?: string
}

/** Resume una promoción de la Home dentro del carrusel de ofertas. */
export function PromotionProductCard({
  product,
  lineLabel = product.linea,
  tipologiaLabel,
}: PromotionProductCardProps) {
  const primaryImage = getPrimaryProductImage(product)
  const { precios } = product
  const promocion = resumirPromocionProducto(product)
  if (!promocion) return null

  const href = `/producto/${product.slug}`

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-br from-card via-card to-accent/25 py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-lg motion-safe:sm:hover:-translate-y-1 sm:rounded-3xl">
      <Link
        href={href}
        className="corner-marks relative border-b border-border/60 bg-white p-1.5 xs:p-2 sm:p-3"
        aria-label={`Ver ${product.nombre}`}
      >
        <Badge className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] gap-1 truncate px-2 py-1 text-[0.625rem] uppercase tracking-wide shadow-sm sm:top-4 sm:left-4 sm:max-w-[calc(100%-2rem)] sm:text-xs">
          <Sparkles data-icon="inline-start" className="hidden sm:block" />
          {etiquetaPromocionCard(product)}
        </Badge>
        <ProductImage
          src={primaryImage?.url ?? ""}
          alt={primaryImage?.textoAlternativo ?? product.nombre}
          className="aspect-square w-full rounded-xl sm:rounded-2xl"
          imgClassName="transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
        />
      </Link>

      <CardHeader className="gap-1.5 px-3 pt-3 sm:gap-2 sm:px-5 sm:pt-5">
        <div className="flex min-w-0 items-center gap-2">
          <Badge
            variant="secondary"
            className="max-w-full truncate px-1.5 text-[0.5625rem] uppercase tracking-wide sm:px-2.5 sm:text-xs"
          >
            {lineLabel}
          </Badge>
          <span className="hidden truncate text-xs capitalize text-muted-foreground lg:inline">
            {tipologiaLabel ?? "Producto"}
          </span>
        </div>
        <CardTitle className="line-clamp-2 min-h-9 text-xs font-bold uppercase leading-snug xs:text-sm sm:min-h-11 sm:text-base">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.nombre}
          </Link>
        </CardTitle>
        <CardDescription className="mt-1 hidden leading-6 lg:line-clamp-2">
          {descripcionProductoComoTexto(product.descripcion)}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-2 flex-1 px-3 sm:mt-3 sm:px-5">
        {precios.consultarPrecio || precios.precioTarjeta === null ? (
          <p className="text-sm font-semibold">{"Precio a consultar"}</p>
        ) : (
          <div className="space-y-2">
            <div>
              <span className="block text-[0.625rem] text-muted-foreground sm:text-xs">
                {"Ahora"}
              </span>
              <span className="mt-0.5 block text-base font-bold tracking-tight tabular-nums xs:text-lg sm:text-2xl">
                {formatProductPrice(promocion.final)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[0.625rem] text-muted-foreground line-through tabular-nums sm:text-sm">
                {formatProductPrice(promocion.original)}
              </span>
              <Badge className="hidden bg-success/10 text-success sm:inline-flex">
                {"Ahorro asegurado"}
              </Badge>
            </div>
            <p className="line-clamp-2 text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              {product.variantes.length > 0
                ? completarTextoPublico("En {cantidad} combinación(es) exacta(s)", {
                    cantidad: promocion.cantidadVariantes,
                  })
                : "Disponible para todo el producto"}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-3 pt-3 pb-3 sm:px-5 sm:pt-4 sm:pb-5">
        <Button
          size="sm"
          className="h-9 w-full rounded-xl px-2 text-xs sm:h-10 sm:px-4 sm:text-sm"
          render={<Link href={href} />}
        >
          <span className="xs:hidden sm:inline">{"Ver oferta"}</span>
          <span className="hidden xs:inline sm:hidden">{"Ver"}</span>
          <ArrowRight className="hidden sm:block" data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
