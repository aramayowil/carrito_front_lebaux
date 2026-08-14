import { FeaturedProductCard } from "@/features/products/components/FeaturedProductCard"
import { resumirPromocionProducto } from "@/features/products/lib/discounts"
import type { Producto } from "@/types"

/** Selección curada de productos destacados de la portada. */
export function HomeFeaturedProductsSection({
  products,
}: {
  products: Producto[]
}) {
  const featured = products.filter(
    (product) =>
      product.visibilidad === "visible" &&
      product.destacado &&
      !resumirPromocionProducto(product),
  )

  if (featured.length === 0) return null

  return (
    <section aria-labelledby="featured-title" className="py-14 sm:py-16">
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
