import { ArrowRight, Star } from "lucide-react"
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
  formatAvailableSizes,
  formatProductPrice,
  getPrimaryProductImage,
} from "@/features/products/lib/product-card-formatters"
import { descripcionProductoComoTexto } from "@/features/products/lib/product-description"
import { obtenerPrecioInicial } from "@/features/products/lib/pricing"
import type { Producto } from "@/types"

interface FeaturedProductCardProps {
  product: Producto
}

/** Presenta un producto destacado de la Home con imagen, precios y consulta directa. */
export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const primaryImage = getPrimaryProductImage(product)
  const startingPrice = obtenerPrecioInicial(product)
  const href = `/producto/${product.slug}`

  return (
    <Card className="group grid h-full gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:border-primary/45 hover:shadow-lg motion-safe:sm:hover:-translate-y-1 sm:rounded-3xl">
      <Link
        href={href}
        className="corner-marks relative border-b border-border/60 bg-white p-1.5 xs:p-2 sm:p-3"
        aria-label={`Ver ${product.nombre}`}
      >
        <Badge className="absolute top-2 left-2 z-10 gap-1 px-2 py-1 text-[0.625rem] uppercase tracking-wide shadow-sm sm:top-4 sm:left-4 sm:text-xs">
          <Star
            data-icon="inline-start"
            className="hidden fill-current sm:block"
          />
          {"Destacado"}
        </Badge>
        <ProductImage
          src={primaryImage?.url ?? ""}
          alt={primaryImage?.textoAlternativo ?? product.nombre}
          className="aspect-square w-full rounded-xl sm:rounded-2xl"
          imgClassName="transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-col py-3 sm:py-5">
        <CardHeader className="gap-1.5 px-3 sm:gap-2 sm:px-5">
          <CardTitle className="line-clamp-2 min-h-9 text-xs font-bold uppercase leading-snug xs:text-sm sm:min-h-11 sm:text-base">
            <Link href={href} className="transition-colors hover:text-primary">
              {product.nombre}
            </Link>
          </CardTitle>
          <CardDescription className="mt-1 hidden leading-6 lg:line-clamp-2">
            {descripcionProductoComoTexto(product.descripcion)}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-2 flex-1 px-3 sm:mt-4 sm:px-5">
          {startingPrice === null ? (
            <p className="text-sm font-semibold">{"Precio a consultar"}</p>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              <div>
                <span className="block text-[0.625rem] text-muted-foreground sm:text-xs">
                  {"Precio"}
                </span>
                <span className="mt-0.5 block text-base font-bold tracking-tight tabular-nums xs:text-lg sm:text-2xl">
                  {formatProductPrice(startingPrice.tarjeta)}
                </span>
              </div>

              {startingPrice.contado < startingPrice.tarjeta && (
                <div className="rounded-lg bg-success/10 px-2 py-1.5 sm:rounded-xl sm:px-3 sm:py-2">
                  <span className="block text-[0.5625rem] font-semibold uppercase tracking-wide text-success sm:text-xs">
                    {"contado"}
                  </span>
                  <span className="mt-0.5 block text-xs font-bold text-success tabular-nums xs:text-sm sm:text-lg">
                    {formatProductPrice(startingPrice.contado)}
                  </span>
                </div>
              )}
            </div>
          )}

          <Badge
            variant="outline"
            className="mt-3 hidden text-xs sm:inline-flex"
          >
            {formatAvailableSizes(product.medidasDisponibles.length)}
          </Badge>
        </CardContent>

        <CardFooter className="mt-3 px-3 sm:mt-4 sm:px-5">
          <Button
            size="sm"
            className="h-9 w-full rounded-xl px-2 text-xs sm:h-10 sm:px-4 sm:text-sm"
            render={<Link href={href} />}
          >
            <span className="xs:hidden sm:inline">{"Ver opciones"}</span>
            <span className="hidden xs:inline sm:hidden">{"Ver"}</span>
            <ArrowRight className="hidden sm:block" data-icon="inline-end" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
