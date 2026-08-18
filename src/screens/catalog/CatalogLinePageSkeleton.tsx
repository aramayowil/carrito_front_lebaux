import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogFiltersSkeleton } from "@/features/products/components/CatalogFiltersSkeleton";
import { ProductGrid } from "@/features/products/components/ProductGrid";

/** Aproximación visual de CatalogLinePage mientras se resuelve `cargarDatosCatalogoLinea`. */
export function CatalogLinePageSkeleton() {
  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-muted/30 py-8 sm:py-10 lg:py-12">
        <div className="container grid items-end gap-7 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
          <div className="max-w-2xl">
            <Skeleton className="h-3 w-36 rounded-full" />
            <Skeleton className="mt-4 h-12 w-full max-w-md rounded-lg sm:h-14" />
            <Skeleton className="mt-4 h-5 w-full max-w-sm rounded-lg" />
          </div>

          <div className="max-w-xl border-l-2 border-primary pl-5 sm:pl-6 lg:justify-self-end">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-xl rounded-lg" />
              <Skeleton className="h-4 w-4/5 max-w-xl rounded-lg" />
            </div>
            <Skeleton className="mt-6 h-10 w-52 rounded-2xl" />
          </div>
        </div>
      </section>

      <div className="sticky top-navbar z-30 border-b border-border/70 bg-background/95">
        <div className="container">
          <div className="flex items-center gap-3 py-2">
            <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-24 shrink-0 rounded-lg"
                />
              ))}
            </div>
            <Skeleton className="hidden h-9 w-24 shrink-0 rounded-2xl sm:block lg:hidden" />
            <Skeleton className="hidden h-9 w-40 shrink-0 rounded-2xl sm:block" />
          </div>
          <div className="flex gap-2 border-t border-border/60 py-2 sm:hidden">
            <Skeleton className="h-8 flex-1 rounded-2xl" />
            <Skeleton className="h-8 flex-1 rounded-2xl" />
          </div>
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
  );
}
