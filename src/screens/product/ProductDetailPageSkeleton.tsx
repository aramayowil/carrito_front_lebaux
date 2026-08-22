import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";
import { ProductConfiguratorSkeleton } from "@/features/products/components/ProductConfiguratorSkeleton";
import { ProductGallerySkeleton } from "@/features/products/components/ProductGallerySkeleton";

/** Fallback estructural de ProductDetailPage, alineado con galería, configurador y secciones reales. */
export function ProductDetailPageSkeleton() {
  return (
    <div className="bg-background pb-12 pt-5 sm:pb-16 sm:pt-8">
      <div className="container">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.03fr)_minmax(24rem,0.97fr)] lg:gap-x-10 lg:gap-y-5 xl:gap-x-12">
          <header
            aria-hidden="true"
            className="order-1 min-w-0 lg:col-start-2 lg:row-start-1"
          >
            <Skeleton className="h-9 w-full max-w-md rounded-md sm:h-10 lg:h-12" />
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
          className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:mt-12 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="bg-card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="size-5 shrink-0 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="mt-2 h-3 w-full rounded-md" />
                  <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section
          aria-hidden="true"
          className="mt-14 border-t border-border/70 pt-10 sm:mt-16 sm:pt-12"
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
              <div className="border-l-2 border-primary pl-5 sm:pl-7">
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
          className="mt-14 border-t border-border/70 pt-10 sm:mt-16 sm:pt-12"
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
  );
}
