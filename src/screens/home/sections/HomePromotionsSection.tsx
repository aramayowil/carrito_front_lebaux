import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PromotionProductCard } from "@/features/products/components/PromotionProductCard";
import { resumirPromocionProducto } from "@/features/products/lib/discounts";
import type { LineaProducto, Producto } from "@/types";

/** Promociones activas de la Home, separadas de la navegación por líneas. */
export function HomePromotionsSection({
  products,
  lines,
}: {
  products: Producto[];
  lines: LineaProducto[];
}) {
  const promotions = products.filter(
    (product) =>
      product.visibilidad === "visible" && resumirPromocionProducto(product),
  );

  if (promotions.length === 0) return null;

  return (
    <section
      aria-labelledby="promotions-title"
      className="border-y border-border/60 bg-muted/30 py-14 sm:py-16"
    >
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Oportunidades</p>
            <h2
              id="promotions-title"
              className="section-title section-title-left"
            >
              Precios especiales
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
            Productos seleccionados con beneficios vigentes en configuraciones
            específicas.
          </p>
        </div>

        <div className="relative px-1 sm:px-8">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {promotions.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <PromotionProductCard
                    product={product}
                    lineLabel={
                      lines.find((line) => line.slug === product.linea)?.nombre
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {promotions.length > 1 && (
              <>
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
