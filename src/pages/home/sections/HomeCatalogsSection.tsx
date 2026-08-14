import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { completarTextoPublico } from "@/lib/public-text"
import { cn } from "@/lib/utils"
import type { LineaProducto, Producto } from "@/types"

function etiquetaCantidadModelos(cantidad: number) {
  if (cantidad === 0) return "Catálogo en preparación"
  if (cantidad === 1) return "1 modelo publicado"
  return completarTextoPublico("{cantidad} modelos publicados", { cantidad })
}

function CatalogLineLink({
  line,
  productCount,
}: {
  line: LineaProducto
  productCount: number
}) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="group h-auto min-h-32 w-full flex-col items-stretch justify-between rounded-2xl border-border bg-catalog-line px-5 py-5 text-left whitespace-normal text-foreground shadow-none hover:border-muted-foreground/35 hover:bg-muted hover:text-foreground sm:min-h-36 dark:bg-catalog-line dark:hover:bg-muted"
      render={<Link href={`/${line.slug}`} />}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="text-base font-bold uppercase tracking-tight sm:text-lg">
          {line.nombre}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </span>
      <span className="mt-2 line-clamp-2 block flex-1 text-xs leading-5 font-normal text-muted-foreground">
        {line.subtitulo}
      </span>
      <span className="mt-4 flex items-center justify-between gap-3 border-t border-muted-foreground/20 pt-3 text-xs font-medium text-muted-foreground group-hover:border-muted-foreground/30">
        <span>{etiquetaCantidadModelos(productCount)}</span>
        <span className="shrink-0 font-semibold text-foreground/70 group-hover:text-foreground">
          Explorar
        </span>
      </span>
    </Button>
  )
}

/** Primera capa de navegación comercial: una entrada por línea administrable. */
export function HomeCatalogsSection({
  products,
  lines,
}: {
  products: Producto[]
  lines: LineaProducto[]
}) {
  if (lines.length === 0) return null

  const visibleProducts = products.filter(
    (product) => product.visibilidad === "visible",
  )
  const productCountByLine = new Map(
    lines.map((line) => [
      line.slug,
      visibleProducts.filter((product) => product.linea === line.slug).length,
    ]),
  )

  return (
    <section
      id="productos"
      aria-labelledby="catalog-lines-title"
      className="scroll-mt-navbar bg-background px-4 py-14 text-foreground sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3 flex justify-center text-base">
            Explorá el catálogo
          </p>
          <h2
            id="catalog-lines-title"
            className="text-2xl font-bold uppercase tracking-tight sm:text-3xl lg:text-4xl"
          >
            ¿Qué abertura estás buscando?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Elegí una línea para conocer sus modelos, medidas y configuraciones disponibles.
          </p>
        </div>

        <div
          className={cn(
            "mt-8 grid gap-3 border-t border-border/70 pt-7 sm:mt-10 sm:gap-4 sm:pt-8",
            lines.length === 1 && "mx-auto max-w-xl",
            lines.length === 2 && "md:grid-cols-2",
            lines.length >= 3 && "md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {lines.map((line) => (
            <CatalogLineLink
              key={line.id}
              line={line}
              productCount={productCountByLine.get(line.slug) ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
