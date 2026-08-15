import { Skeleton } from "@/components/ui/skeleton"

/** Aproximación visual de TechnicalCatalogsPage mientras se resuelve `cargarDatosCatalogosTecnicos`. */
export function TechnicalCatalogsPageSkeleton() {
  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-brand-black">
        <div className="container flex min-h-72 flex-col justify-end gap-3 py-4 md:min-h-80 md:py-5">
          <Skeleton className="h-4 w-40 rounded-full bg-white/15" />
          <Skeleton className="mt-2 h-12 w-full max-w-lg rounded-lg bg-white/15" />
          <Skeleton className="h-5 w-full max-w-md rounded-lg bg-white/15" />
          <Skeleton className="h-10 w-48 rounded-full bg-white/15" />
        </div>
      </section>

      <main className="bg-muted/25 py-8 sm:py-10">
        <div className="container">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-8 w-64 rounded-lg" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-3xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
