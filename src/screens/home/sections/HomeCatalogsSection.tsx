import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LineaProducto } from "@/types";

function CatalogLineLink({ line }: { line: LineaProducto }) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="group relative h-auto min-h-32 w-full flex-col items-stretch justify-between overflow-hidden rounded-xl border-border bg-catalog-line px-5 py-6 text-left whitespace-normal text-foreground shadow-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-primary transition-colors hover:border-primary/60 hover:bg-muted hover:text-foreground sm:min-h-36 sm:px-6"
      render={<Link href={`/${line.slug}`} />}
    >
      <span>
        <span className="block text-lg font-bold uppercase tracking-tight sm:text-xl">
          {line.nombre}
        </span>
        <span className="mt-2 line-clamp-2 block text-sm leading-6 font-normal text-muted-foreground">
          {line.subtitulo}
        </span>
      </span>

      <span className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-sm font-semibold text-foreground">
        <span>Ver productos</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </span>
    </Button>
  );
}

/** Primera capa de navegación comercial: una entrada por línea administrable. */
export function HomeCatalogsSection({ lines }: { lines: LineaProducto[] }) {
  if (lines.length === 0) return null;

  return (
    <section
      id="productos"
      aria-labelledby="catalog-lines-title"
      className="scroll-mt-navbar bg-background px-4 py-14 text-foreground sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3 justify-center text-base">
            Nuestras líneas
          </p>
          <h2
            id="catalog-lines-title"
            className="text-2xl font-bold uppercase tracking-tight text-balance sm:text-3xl lg:text-4xl"
          >
            Encontrá la abertura para tu proyecto
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explorá nuestros sistemas y elegí la solución que mejor se adapta a
            tu espacio.
          </p>
        </div>

        <div
          className={cn(
            "mt-8 grid gap-4 border-t border-border/70 pt-7 sm:mt-10 sm:pt-8",
            lines.length === 1 && "mx-auto max-w-xl",
            lines.length === 2 && "mx-auto max-w-4xl md:grid-cols-2",
            lines.length >= 3 &&
              "mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {lines.map((line) => (
            <CatalogLineLink key={line.id} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}
