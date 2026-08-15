import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CatalogFiltersSkeleton } from "@/features/products/components/CatalogFiltersSkeleton"
import { ProductGrid } from "@/features/products/components/ProductGrid"

/** Aproximación visual de CatalogLinePage mientras se resuelve `cargarDatosCatalogoLinea`. */
export function CatalogLinePageSkeleton() {
  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div className="container flex min-h-128 flex-col justify-between py-6 md:min-h-112 md:py-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded-full bg-white/15" />
            <Skeleton className="size-3 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-24 rounded-full bg-white/15" />
          </div>

          <div className="max-w-2xl pb-2 pt-16 md:pb-4 md:pt-12">
            <Skeleton className="h-3 w-36 rounded-full bg-white/15" />
            <Skeleton className="mt-4 h-12 w-full max-w-md rounded-lg bg-white/15 sm:h-14" />
            <Skeleton className="mt-4 h-5 w-full max-w-sm rounded-lg bg-white/15" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full max-w-xl rounded-lg bg-white/10" />
              <Skeleton className="h-4 w-4/5 max-w-xl rounded-lg bg-white/10" />
            </div>
            <div className="mt-7 flex gap-3">
              <Skeleton className="h-9 w-36 rounded-2xl bg-white/15" />
              <Skeleton className="h-9 w-48 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-navbar z-30 border-y border-border/70 bg-background/95">
        <div className="container flex items-center gap-3 py-3">
          <Skeleton className="h-10 w-24 shrink-0 rounded-2xl lg:hidden" />
          <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-9 w-24 shrink-0 rounded-xl"
              />
            ))}
          </div>
          <Skeleton className="hidden h-10 w-40 shrink-0 rounded-2xl sm:block" />
        </div>
      </div>

      <main className="bg-muted/25 py-8 sm:py-10">
        <div className="container">
          <div className="mb-7">
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="mt-2 h-8 w-64 max-w-full rounded-lg" />
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            <aside className="hidden lg:block">
              <Card className="sticky top-36 max-h-[calc(100dvh-10rem)] gap-0 overflow-hidden py-0">
                <CardHeader className="shrink-0 border-b py-5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-hidden py-5">
                  <CatalogFiltersSkeleton />
                </CardContent>
              </Card>
            </aside>

            <div className="min-w-0 lg:col-span-3">
              <ProductGrid
                products={[]}
                loading
                className="md:grid-cols-2 xl:grid-cols-3"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
