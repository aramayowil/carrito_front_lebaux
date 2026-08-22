import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton de la ficha de obra alineado con su galería responsive real. */
export function WorkDetailPageSkeleton() {
  return (
    <main className="overflow-x-clip bg-background" aria-busy="true">
      <section className="border-b border-border/70 bg-muted/30 py-8 sm:py-10 lg:py-12">
        <div className="container">
          <Skeleton className="mb-7 h-8 w-32 rounded-lg" />
          <div className="max-w-4xl space-y-5">
            <Skeleton className="h-4 w-56 rounded-full" />
            <Skeleton className="h-12 w-full max-w-2xl rounded-xl sm:h-14 lg:h-16" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
              <Skeleton className="h-5 w-4/5 max-w-xl rounded-lg" />
            </div>
            <Skeleton className="h-4 w-44 rounded-full" />
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 lg:py-16" aria-label="Cargando galería">
        <div className="container">
          <div className="lg:hidden">
            <Skeleton className="aspect-4/3 w-full rounded-xl" />
            <div className="mt-4 flex justify-center gap-2">
              <Skeleton className="h-2 w-6 rounded-full" />
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="size-2 rounded-full" />
            </div>
          </div>

          <div className="hidden aspect-[16/7] grid-cols-[1.35fr_0.65fr] grid-rows-2 gap-4 lg:grid">
            <Skeleton className="row-span-2 h-full w-full rounded-xl" />
            <Skeleton className="h-full w-full rounded-xl" />
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-14 lg:pb-20">
        <div className="container grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div className="space-y-7">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-8 w-full max-w-lg rounded-lg" />
            </div>
            <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-3 border-t border-border pt-5">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t-2 border-primary/40 pt-5">
            <Skeleton className="h-3 w-36 rounded-full" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
