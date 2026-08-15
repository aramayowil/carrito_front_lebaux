import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { ProductImage } from "@/components/media/ProductImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  etiquetaPromocionCard,
  resumirPromocionProducto,
} from "@/features/products/lib/discounts"
import {
  formatAvailableSizes,
  formatProductPrice,
  getPrimaryProductImage,
} from "@/features/products/lib/product-card-formatters"
import { obtenerPrecioInicial } from "@/features/products/lib/pricing"
import { completarTextoPublico } from "@/lib/public-text"
import type { Producto } from "@/types"

interface CatalogProductCardProps {
  product: Producto
  tipologiaNombre?: string
  aperturaNombre?: string
  /** Marca la imagen como prioritaria (LCP) para las primeras cards visibles sin scroll. */
  priority?: boolean
}

/** Card de catálogo optimizada para comparar precio, opciones y promociones. */
export function CatalogProductCard({
  product,
  tipologiaNombre,
  aperturaNombre,
  priority = false,
}: CatalogProductCardProps) {
  const primaryImage = getPrimaryProductImage(product)
  const startingPrice = obtenerPrecioInicial(product)
  const promotion = resumirPromocionProducto(product)
  const href = "/producto/" + product.slug
  const visibleColors = product.coloresDisponibles.slice(0, 4)
  const remainingColors = Math.max(
    0,
    product.coloresDisponibles.length - visibleColors.length,
  )

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:border-primary/45 hover:shadow-lg motion-safe:sm:hover:-translate-y-1 sm:rounded-3xl">
      <Link
        href={href}
        aria-label={`Ver ${product.nombre}`}
        className="relative block border-b border-border/60 bg-white p-1.5 xs:p-2 sm:p-3"
      >
        <ProductImage
          src={primaryImage?.url ?? ""}
          alt={primaryImage?.textoAlternativo ?? product.nombre}
          className="aspect-square w-full rounded-xl sm:rounded-2xl"
          imgClassName="transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          priority={priority}
        />
        {promotion && (
          <Badge className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate bg-success px-2 py-1 text-[0.625rem] text-success-foreground shadow-sm sm:top-4 sm:left-4 sm:max-w-[calc(100%-2rem)] sm:text-xs">
            {etiquetaPromocionCard(product)}
          </Badge>
        )}
        {product.destacado && !promotion && (
          <Badge className="absolute top-2 left-2 px-2 py-1 text-[0.625rem] shadow-sm sm:top-4 sm:left-4 sm:text-xs">
            {"Destacado"}
          </Badge>
        )}
      </Link>

      <CardHeader className="gap-1.5 px-3 pt-3 sm:gap-2 sm:px-5 sm:pt-5">
        <p className="line-clamp-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.12em]">
          {[tipologiaNombre, aperturaNombre].filter(Boolean).join(" · ") || "Abertura"}
        </p>
        <CardTitle className="line-clamp-2 min-h-9 text-xs font-bold uppercase leading-snug xs:text-sm sm:min-h-11 sm:text-base">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.nombre}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-2 flex-1 space-y-3 px-3 sm:mt-3 sm:space-y-4 sm:px-5">
        {startingPrice === null ? (
          <div>
            <p className="text-sm font-semibold">{"Precio a consultar"}</p>
            <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
              {"Te cotizamos según la configuración."}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[0.625rem] text-muted-foreground sm:text-xs">
              {"Desde"}
            </p>
            <p className="mt-0.5 text-base font-bold tracking-tight tabular-nums xs:text-lg sm:text-2xl">
              {formatProductPrice(startingPrice.tarjeta)}
            </p>
            {startingPrice.contado < startingPrice.tarjeta && (
              <p className="mt-1 text-[0.625rem] font-semibold text-success sm:text-sm">
                <span className="block tabular-nums sm:inline">
                  {formatProductPrice(startingPrice.contado)}
                </span>{" "}
                contado
              </p>
            )}
          </div>
        )}

        <div className="flex min-h-7 flex-wrap items-center gap-2 border-t border-border/70 pt-3 sm:justify-between sm:gap-3">
          <div
            className="flex min-w-0 items-center gap-1"
            aria-label="Colores disponibles"
          >
            {visibleColors.map((color) => (
              <span
                key={color.slug}
                title={color.etiqueta}
                className="size-3.5 shrink-0 rounded-full border border-foreground/15 ring-1 ring-background sm:size-4"
                style={{ backgroundColor: color.hexadecimal }}
              />
            ))}
            {remainingColors > 0 && (
              <span className="text-[0.625rem] font-medium text-muted-foreground sm:text-xs">
                +{remainingColors}
              </span>
            )}
          </div>
          <Badge
            variant="secondary"
            className="h-5 shrink-0 px-1.5 text-[0.5625rem] sm:h-auto sm:px-2.5 sm:text-xs"
          >
            {formatAvailableSizes(product.medidasDisponibles.length)}
          </Badge>
        </div>

        {promotion && (
          <p className="line-clamp-2 text-[0.625rem] leading-4 text-success sm:text-xs sm:leading-5">
            {promotion.cantidadVariantes === 1
              ? "Promoción en una configuración seleccionada"
              : completarTextoPublico("Promoción en {cantidad} configuraciones", {
                  cantidad: promotion.cantidadVariantes,
                })}
          </p>
        )}
      </CardContent>

      <CardFooter className="px-3 pt-3 pb-3 sm:px-5 sm:pt-4 sm:pb-5">
        <Button
          size="sm"
          className="h-9 w-full rounded-xl px-2 text-xs sm:h-10 sm:px-4 sm:text-sm"
          render={<Link href={href} />}
        >
          <span className="xs:hidden sm:inline">{"Ver producto"}</span>
          <span className="hidden xs:inline sm:hidden">{"Ver"}</span>
          <ArrowRight className="hidden sm:block" data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
