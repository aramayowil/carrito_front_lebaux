import { Skeleton } from "@/components/ui/skeleton";
import { TechnicalCatalogCardSkeleton } from "@/screens/technical-catalogs/components/TechnicalCatalogCardSkeleton";

/** Fallback estructural de la biblioteca técnica compacta. */
export function TechnicalCatalogsPageSkeleton() {
  return (
    <div className="bg-background">
      <header
        aria-hidden="true"
        className="border-b border-white/10 bg-brand-black"
      >
        <div className="container py-10 sm:py-12 lg:py-14">
          <div className="max-w-3xl">
            <Skeleton className="h-4 w-36 rounded-full bg-white/15" />
            <Skeleton className="mt-4 h-11 w-full max-w-lg rounded-md bg-white/15 sm:h-14" />
            <div className="mt-5 max-w-2xl space-y-2">
              <Skeleton className="h-5 w-full rounded-md bg-white/10" />
              <Skeleton className="h-5 w-4/5 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </header>

      <main aria-hidden="true" className="bg-muted/20 py-10 sm:py-14">
        <div className="container">
          <div className="mb-8 flex justify-center">
            <Skeleton className="h-12 w-full max-w-md rounded-xl" />
          </div>

          <div className="mb-7 max-w-2xl sm:mb-9">
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="mt-3 h-8 w-full max-w-md rounded-md" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <TechnicalCatalogCardSkeleton key={index} />
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
            <div className="mb-6 flex flex-col items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-64 max-w-full" />
            </div>
            <div className="overflow-hidden rounded-2xl border">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b p-4 last:border-b-0"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="size-4 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 rounded-xl bg-brand-black px-5 py-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="w-full max-w-xl space-y-2">
              <Skeleton className="h-5 w-72 max-w-full bg-white/15" />
              <Skeleton className="h-4 w-full bg-white/10" />
            </div>
            <Skeleton className="h-11 w-full shrink-0 bg-white/15 sm:w-52" />
          </div>
        </div>
      </main>
    </div>
  );
}
