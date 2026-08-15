import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton"
import { ProductConfiguratorSkeleton } from "@/features/products/components/ProductConfiguratorSkeleton"
import { ProductGallerySkeleton } from "@/features/products/components/ProductGallerySkeleton"

/** Fallback estructural de ProductDetailPage, alineado con galería, configurador y secciones reales. */
export function ProductDetailPageSkeleton() {
  return (
    <div className="bg-background pb-12 pt-5 sm:pb-16 sm:pt-8">
      <div className="container">
        <div aria-hidden="true" className="mb-5 flex items-center gap-2 sm:mb-7">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:gap-x-10 lg:gap-y-5 xl:gap-x-14">
          <header aria-hidden="true" className="order-1 min-w-0 lg:col-start-2 lg:row-start-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-9 w-full max-w-md rounded-md sm:h-10 lg:h-12" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full max-w-xl rounded-md" />
              <Skeleton className="h-4 w-5/6 max-w-lg rounded-md" />
            </div>
          </header>

          <div className="order-2 min-w-0 lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <ProductGallerySkeleton />
          </div>

          <div className="order-3 min-w-0 lg:col-start-2 lg:row-start-2">
            <ProductConfiguratorSkeleton />
          </div>
        </div>

        <section
          aria-hidden="true"
          className="mt-10 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="bg-card p-5">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="mt-3 h-4 w-3/4 rounded-md" />
              <Skeleton className="mt-2 h-3 w-full rounded-md" />
              <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
            </article>
          ))}
        </section>

        <section
          aria-hidden="true"
          className="mt-16 border-t border-border/70 pt-12 sm:mt-20 sm:pt-16"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-14">
            <div>
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="mt-2 h-8 w-56 rounded-md" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full max-w-sm rounded-md" />
                <Skeleton className="h-4 w-4/5 max-w-xs rounded-md" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7">
                <Skeleton className="h-3 w-32 rounded-full" />
                <Skeleton className="mt-2 h-6 w-2/3 rounded-md" />
                <div className="mt-5 space-y-2.5">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-hidden="true"
          className="mt-16 border-t border-border/70 pt-12 sm:mt-20 sm:pt-16"
        >
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="mt-2 h-7 w-56 rounded-md" />
            </div>
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
