import { ProductGrid } from "@/features/products/components/ProductGrid"
import { Skeleton } from "@/components/ui/skeleton"

/** Aproximación visual de CatalogLinePage mientras se resuelve `cargarDatosCatalogoLinea`. */
export function CatalogLinePageSkeleton() {
  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-brand-black">
        <Skeleton className="h-[38vh] min-h-[16rem] w-full rounded-none bg-white/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="container space-y-3 pb-8">
            <Skeleton className="h-4 w-40 rounded-full bg-white/15" />
            <Skeleton className="h-10 w-full max-w-md rounded-lg bg-white/15" />
            <Skeleton className="h-4 w-full max-w-lg rounded-lg bg-white/15" />
          </div>
        </div>
      </section>

      <div className="container py-8">
        <Skeleton className="h-4 w-56 rounded-full" />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-full max-w-sm rounded-xl sm:w-64" />
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>

        <div className="mt-8">
          <ProductGrid products={[]} loading />
        </div>
      </div>
    </div>
  )
}
