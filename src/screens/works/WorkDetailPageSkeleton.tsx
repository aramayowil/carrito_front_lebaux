import { Skeleton } from '@/components/ui/skeleton'

/** Skeleton alineado con la ficha simple de obra, su galería 4:3 y el cierre claro. */
export function WorkDetailPageSkeleton() {
  return (
    <main className="overflow-x-clip bg-background" aria-busy="true">
      <section className="border-b border-border/70 bg-muted/30 py-8 sm:py-10 lg:py-12">
        <div className="container">
          <Skeleton className="mb-7 h-8 w-32 rounded-lg" />

          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-px w-6" />
              <Skeleton className="h-3 w-36 rounded-full" />
            </div>

            <div className="mt-4 space-y-3">
              <Skeleton className="h-11 w-full max-w-3xl rounded-xl sm:h-14 lg:h-16" />
              <Skeleton className="h-11 w-3/4 max-w-2xl rounded-xl sm:h-14 lg:h-16" />
            </div>

            <div className="mt-5 max-w-2xl space-y-2.5">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-4/5 rounded-md" />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-12 lg:py-16"
        aria-label="Cargando galería"
      >
        <div className="container">
          <div className="mx-auto max-w-7xl">
            <div className="lg:hidden">
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <div className="mt-4 flex justify-center gap-2">
                <Skeleton className="h-2 w-6 rounded-full" />
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="size-2 rounded-full" />
              </div>
            </div>

            <div className="hidden grid-cols-3 gap-4 lg:grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-4/3 w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/35 py-12 sm:py-14 lg:py-16">
        <div className="container">
          <div className="grid items-center gap-9 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <div className="hidden border-l-2 border-primary pl-5 sm:pl-7 md:block">
              <div className="max-w-lg space-y-3">
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-4/5 rounded-md" />
              </div>
            </div>

            <div className="border-t border-border pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <Skeleton className="mb-3 h-3 w-44 rounded-full" />
              <div className="space-y-2.5">
                <Skeleton className="h-8 w-full max-w-md rounded-lg" />
                <Skeleton className="h-8 w-4/5 max-w-sm rounded-lg" />
              </div>
              <div className="mt-4 max-w-lg space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
              <Skeleton className="mt-6 h-11 w-full rounded-md sm:w-56" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
