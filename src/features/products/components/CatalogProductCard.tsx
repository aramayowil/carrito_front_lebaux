import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/media/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  etiquetaPromocionCard,
  resumirPromocionProducto,
} from "@/features/products/lib/discounts";
import {
  formatProductPrice,
  getPrimaryProductImage,
} from "@/features/products/lib/product-card-formatters";
import { obtenerPrecioInicial } from "@/features/products/lib/pricing";
import type { Producto } from "@/types";

const SIZES_IMAGEN_CATALOGO =
  "(max-width: 22.5rem) calc(100vw - 2rem), (max-width: 64rem) calc((100vw - 4rem) / 2), 22vw";

interface CatalogProductCardProps {
  product: Producto;
  tipologiaNombre?: string;
  aperturaNombre?: string;
  /** Marca la imagen como prioritaria (LCP) para las primeras cards visibles sin scroll. */
  priority?: boolean;
}

/** Card de catálogo optimizada para comparar precio, opciones y promociones. */
export function CatalogProductCard({
  product,
  tipologiaNombre,
  aperturaNombre,
  priority = false,
}: CatalogProductCardProps) {
  const primaryImage = getPrimaryProductImage(product);
  const startingPrice = obtenerPrecioInicial(product);
  const promotion = resumirPromocionProducto(product);
  const href = "/producto/" + product.slug;
  const visibleColors = product.coloresDisponibles.slice(0, 4);
  const remainingColors = Math.max(
    0,
    product.coloresDisponibles.length - visibleColors.length,
  );
  const cantidadMedidas = product.medidasDisponibles.length;
  const etiquetaMedidas = `${cantidadMedidas} ${cantidadMedidas === 1 ? "medida" : "medidas"}`;

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-xl! border border-border/80 bg-card py-0 shadow-none ring-0 transition-colors duration-300 hover:border-foreground/30">
      <Link
        href={href}
        aria-label={`Ver ${product.nombre}`}
        className="relative block overflow-hidden border-b border-border/70 bg-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <ProductImage
          src={primaryImage?.url ?? ""}
          alt={primaryImage?.textoAlternativo ?? product.nombre}
          sizes={SIZES_IMAGEN_CATALOGO}
          className="aspect-square w-full"
          imgClassName="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
          priority={priority}
        />
        {promotion && (
          <Badge className="absolute top-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate bg-success px-2 py-1 text-[0.625rem] text-success-foreground shadow-none sm:top-3 sm:left-3 sm:max-w-[calc(100%-1.5rem)] sm:text-xs">
            {etiquetaPromocionCard(product)}
          </Badge>
        )}
        {product.destacado && !promotion && (
          <Badge className="absolute top-2.5 left-2.5 px-2 py-1 text-[0.625rem] shadow-none sm:top-3 sm:left-3 sm:text-xs">
            {"Destacado"}
          </Badge>
        )}
      </Link>

      <CardHeader className="gap-1.5 px-3 pt-3 sm:px-4 sm:pt-4">
        <p className="line-clamp-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.12em]">
          {[tipologiaNombre, aperturaNombre].filter(Boolean).join(" · ") ||
            "Abertura"}
        </p>
        <CardTitle className="line-clamp-2 min-h-9 text-sm font-bold uppercase leading-snug sm:min-h-10 sm:text-base">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.nombre}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-2 flex-1 space-y-3 px-3 sm:px-4">
        {startingPrice === null ? (
          <div>
            <p className="text-base font-bold">{"Precio a consultar"}</p>
            <p className="mt-1 hidden text-xs text-muted-foreground md:block">
              {"Te cotizamos según la configuración."}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[0.625rem] text-muted-foreground sm:text-xs">
              {"Desde"}
            </p>
            <p className="mt-0.5 text-lg font-bold tracking-tight tabular-nums sm:text-2xl">
              {formatProductPrice(startingPrice.tarjeta)}
            </p>
            {startingPrice.contado < startingPrice.tarjeta && (
              <p className="mt-1 text-[0.6875rem] font-semibold text-success sm:text-sm">
                <span className="tabular-nums">
                  {formatProductPrice(startingPrice.contado)}
                </span>{" "}
                contado
              </p>
            )}
          </div>
        )}

        <div className="flex min-h-7 items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div
            className="flex min-w-0 items-center gap-1"
            aria-label="Colores disponibles"
          >
            {visibleColors.map((color) => (
              <span
                key={color.slug}
                title={color.etiqueta}
                className="size-3.5 shrink-0 rounded-full border border-foreground/20 ring-1 ring-background sm:size-4"
                style={{ backgroundColor: color.hexadecimal }}
              />
            ))}
            {remainingColors > 0 && (
              <span className="text-[0.625rem] font-medium text-muted-foreground sm:text-xs">
                +{remainingColors}
              </span>
            )}
          </div>
          <span className="shrink-0 text-[0.625rem] font-medium text-muted-foreground sm:text-xs">
            {etiquetaMedidas}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4">
        <Button
          size="sm"
          className="h-9 w-full justify-between rounded-lg px-3 text-xs shadow-none sm:h-10 sm:text-sm"
          render={<Link href={href} />}
        >
          <span>{"Ver producto"}</span>
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}
