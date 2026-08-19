import { FeaturedProductCard } from "@/features/products/components/FeaturedProductCard";
import { resumirPromocionProducto } from "@/features/products/lib/discounts";
import type { Producto } from "@/types";

/** Selección curada de productos destacados de la portada. */
export function HomeFeaturedProductsSection({
  products,
}: {
  products: Producto[];
}) {
  const featured = products.filter(
    (product) =>
      product.visibilidad === "visible" &&
      product.destacado &&
      !resumirPromocionProducto(product),
  );

  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="featured-title" className="py-12 sm:py-16">
      <div className="container">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Selección Lebaux</p>
            <h2
              id="featured-title"
              className="section-title section-title-left"
            >
              Productos destacados
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
            Modelos elegidos por su versatilidad, terminación y demanda.
          </p>
        </div>

        <div className="px-1 sm:px-8">
          <div className="-ml-4 flex flex-wrap gap-y-4 sm:gap-y-5">
            {featured.map((product) => (
              <div
                key={product.id}
                className="min-w-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <FeaturedProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
