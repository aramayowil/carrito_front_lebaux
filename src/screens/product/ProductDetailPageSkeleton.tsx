import { Skeleton } from "@/components/ui/skeleton"

/** Aproximación visual de ProductDetailPage mientras se resuelve `cargarDatosProducto`. */
export function ProductDetailPageSkeleton() {
  return (
    <div className="bg-background pb-12 pt-5 sm:pb-16 sm:pt-8">
      <div className="container">
        <div className="mb-5 flex items-center gap-2 sm:mb-7">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-3 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-3 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:gap-x-10 lg:gap-y-5 xl:gap-x-14">
          <header className="order-1 min-w-0 lg:col-start-2 lg:row-start-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-10 w-full max-w-md rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full max-w-sm rounded-lg" />
            <Skeleton className="mt-2 h-4 w-full max-w-xs rounded-lg" />
          </header>

          <div className="order-2 min-w-0 lg:sticky lg:top-24 lg:row-span-2 lg:row-start-1">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="size-16 shrink-0 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="order-3 min-w-0 space-y-4 lg:col-start-2 lg:row-start-2">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>

        <section className="mt-10 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3 bg-card p-5">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-full rounded-lg" />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
