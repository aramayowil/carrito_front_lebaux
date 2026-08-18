import { MapPin } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/media/ProductImage";
import { Card, CardContent } from "@/components/ui/card";
import type { WorkCardData } from "@/features/works/types";
import { cn } from "@/lib/utils";

/** Presenta el resumen visual de una obra y permite enlazar a su ficha. */
export function WorkCard({
  obra,
  priority = false,
  className,
  href,
}: {
  obra: WorkCardData;
  priority?: boolean;
  className?: string;
  href?: string;
}) {
  const card = (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden rounded-xl border-border/80 py-0 shadow-none transition-[border-color,box-shadow] duration-500 hover:border-primary/35 hover:shadow-sm">
      <ProductImage
        src={obra.imagen}
        alt={obra.titulo}
        priority={priority}
        className="aspect-4/3 w-full bg-muted"
        imgClassName="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
      />

      <CardContent className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-widest text-primary">
          {obra.tipo}
          <span className="size-1 rounded-full bg-border" aria-hidden="true" />
          <span className="text-muted-foreground">{obra.especificacion}</span>
        </p>

        <h3 className="mt-3 text-xl font-bold tracking-tight">{obra.titulo}</h3>

        {obra.detalleEspecial && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {obra.detalleEspecial}
          </p>
        )}

        {obra.ubicacion && (
          <p className="mt-auto flex items-center gap-1.5 border-t border-border/70 pt-5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {obra.ubicacion}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <article className={cn("min-w-0", className)}>
      {href ? (
        <Link
          href={href}
          className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          aria-label={`Ver obra: ${obra.titulo}`}
        >
          {card}
        </Link>
      ) : (
        card
      )}
    </article>
  );
}
