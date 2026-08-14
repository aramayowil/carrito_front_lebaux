import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PromotionProductCard } from "@/features/products/components/PromotionProductCard"
import { resumirPromocionProducto } from "@/features/products/lib/discounts"
import type { LineaProducto, Producto, TipologiaProducto } from "@/types"

/** Promociones activas de la Home, separadas de la navegación por líneas. */
export function HomePromotionsSection({
  products,
  lines,
  tipologias,
}: {
  products: Producto[]
  lines: LineaProducto[]
  tipologias: TipologiaProducto[]
}) {
  const promotions = products.filter(
    (product) =>
      product.visibilidad === "visible" && resumirPromocionProducto(product),
  )

  if (promotions.length === 0) return null

  return (
    <section
      aria-labelledby="promotions-title"
      className="border-y border-border/60 bg-muted/30 py-14 sm:py-16"
    >
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Ofertas especiales</p>
            <h2
              id="promotions-title"
              className="section-title section-title-left"
            >
              Productos con descuento
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
            Oportunidades vigentes en combinaciones seleccionadas de nuestro catálogo.
          </p>
        </div>

        <div className="relative px-1 sm:px-8">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {promotions.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full xs:basis-1/2 md:basis-1/3 xl:basis-1/4"
                >
                  <PromotionProductCard
                    product={product}
                    lineLabel={lines.find((line) => line.slug === product.linea)?.nombre}
                    tipologiaLabel={tipologias.find((item) => item.id === product.tipologiaId)?.nombre}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex" />
            <CarouselNext className="hidden sm:inline-flex" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
