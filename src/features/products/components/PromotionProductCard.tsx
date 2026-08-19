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
import type { Producto } from "@/types";

const SIZES_IMAGEN_PROMOCION =
  "(max-width: 40rem) 20rem, (max-width: 64rem) calc((100vw - 4rem) / 2), (max-width: 96rem) 25vw, 20vw";

interface PromotionProductCardProps {
  product: Producto;
  lineLabel?: string;
}

/** Resume una promoción de la Home con la fotografía y el precio como protagonistas. */
export function PromotionProductCard({
  product,
  lineLabel = product.linea,
}: PromotionProductCardProps) {
  const primaryImage = getPrimaryProductImage(product);
  const promocion = resumirPromocionProducto(product);
  if (!promocion) return null;

  const href = `/producto/${product.slug}`;

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-xl! border border-border/80 bg-card py-0 shadow-none transition-colors duration-300 hover:border-foreground/30">
      <Link
        href={href}
        className="relative block overflow-hidden border-b border-border/70 bg-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        aria-label={`Ver ${product.nombre}`}
      >
        <ProductImage
          src={primaryImage?.url ?? ""}
          alt={primaryImage?.textoAlternativo ?? product.nombre}
          sizes={SIZES_IMAGEN_PROMOCION}
          className="aspect-square w-full"
          imgClassName="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
        />

        <Badge className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate px-2.5 py-1 text-xs shadow-none">
          {etiquetaPromocionCard(product)}
        </Badge>
      </Link>

      <CardHeader className="gap-1.5 px-4 pt-4">
        <p className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {lineLabel}
        </p>
        <CardTitle className="line-clamp-2 min-h-10 text-base font-bold uppercase leading-snug">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.nombre}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-3 flex-1 px-4">
        <div className="flex items-end justify-between gap-3 border-t border-border/70 pt-3">
          <div>
            <p className="text-xs text-muted-foreground">Ahora</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
              {formatProductPrice(promocion.final)}
            </p>
          </div>

          <div className="pb-0.5 text-right">
            <p className="text-xs text-muted-foreground">Antes</p>
            <p className="mt-0.5 text-sm text-muted-foreground line-through tabular-nums">
              {formatProductPrice(promocion.original)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pt-4 pb-4">
        <Button
          size="sm"
          className="h-10 w-full justify-between rounded-lg px-3 text-sm shadow-none"
          render={<Link href={href} />}
        >
          <span>Ver oferta</span>
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}
