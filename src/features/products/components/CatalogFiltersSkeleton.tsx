import { Skeleton } from "@/components/ui/skeleton"

function PillsSkeleton({ count }: { count: number }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={index % 2 === 0 ? "h-8 w-20 rounded-full" : "h-8 w-24 rounded-full"}
        />
      ))}
    </div>
  )
}

/** Replica la densidad del panel de filtros del catálogo durante la carga. */
export function CatalogFiltersSkeleton() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="mt-2 h-3 w-44 rounded-md" />
      </div>

      <div className="border-t border-border/70 pt-5">
        <Skeleton className="h-4 w-28 rounded-md" />
        <PillsSkeleton count={3} />
      </div>

      <div className="border-t border-border/70 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="mt-2 h-3 w-32 rounded-md" />
          </div>
        </div>
        <Skeleton className="mt-3 h-9 w-full rounded-xl" />
        <div className="mt-2 space-y-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex h-9 items-center gap-2 px-2.5">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-3 flex-1 rounded-md" />
              <Skeleton className="h-3 w-5 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/70 pt-5">
        <Skeleton className="h-4 w-12 rounded-md" />
        <PillsSkeleton count={3} />
      </div>
    </div>
  )
}
