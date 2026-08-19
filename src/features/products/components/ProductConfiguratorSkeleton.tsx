import { Skeleton } from "@/components/ui/skeleton"

/** Replica las zonas del configurador para evitar saltos al hidratar la ficha de producto. */
export function ProductConfiguratorSkeleton() {
  return (
    <div aria-hidden="true" className="pb-24 sm:pb-0">
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="flex items-start justify-between gap-4 border-b p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <Skeleton className="size-9 shrink-0 rounded-xl" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3 w-52 max-w-full rounded-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>

        <div className="border-b border-border/70 bg-catalog-line p-4 sm:p-5">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="mt-2 h-9 w-40 rounded-md" />
          <Skeleton className="mt-2 h-4 w-28 rounded-md" />
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-border/70 bg-muted/20 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-full" />
            </div>
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
