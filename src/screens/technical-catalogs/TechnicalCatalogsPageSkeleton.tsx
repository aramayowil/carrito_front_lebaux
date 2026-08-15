import { Skeleton } from "@/components/ui/skeleton"
import { TechnicalCatalogCardSkeleton } from "@/screens/technical-catalogs/components/TechnicalCatalogCardSkeleton"

/** Fallback estructural de la biblioteca técnica con hero, navegación sticky y cards reales. */
export function TechnicalCatalogsPageSkeleton() {
  return (
    <div className="bg-background">
      <section
        aria-hidden="true"
        className="relative isolate overflow-hidden bg-brand-black text-white"
      >
        <div className="container flex min-h-72 flex-col justify-between py-4 md:min-h-80 md:py-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded-full bg-white/15" />
            <Skeleton className="size-3 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-32 rounded-full bg-white/15" />
          </div>

          <div className="max-w-2xl pt-4 md:pt-3">
            <Skeleton className="h-4 w-36 rounded-full bg-white/15" />
            <Skeleton className="mt-3 h-11 w-full max-w-lg rounded-md bg-white/15 sm:h-14" />
            <Skeleton className="mt-4 h-5 w-full max-w-md rounded-md bg-white/15" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full max-w-xl rounded-md bg-white/10" />
              <Skeleton className="h-4 w-4/5 max-w-lg rounded-md bg-white/10" />
            </div>
            <Skeleton className="mt-7 h-11 w-48 rounded-xl bg-white/15" />
          </div>
        </div>
      </section>

      <div
        aria-hidden="true"
        className="sticky top-navbar z-30 border-y border-border/70 bg-background/95 backdrop-blur"
      >
        <div className="container flex min-w-0 items-center gap-3 py-3">
          <Skeleton className="hidden h-3 w-24 shrink-0 rounded-full sm:block" />
          <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <main aria-hidden="true" className="bg-muted/25 py-8 sm:py-10">
        <div className="container">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="mt-2 h-8 w-72 max-w-full rounded-md" />
            </div>
            <div className="w-full max-w-lg space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md sm:ml-auto" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <TechnicalCatalogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
