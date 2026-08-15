import { Skeleton } from "@/components/ui/skeleton"

/** Replica la galería real, incluidas miniaturas laterales y alto de la imagen principal. */
export function ProductGallerySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid min-w-0 gap-3 md:grid-cols-[5rem_minmax(0,1fr)]"
    >
      <div className="order-2 flex gap-2 overflow-hidden pb-1 md:order-1 md:max-h-144 md:flex-col md:pr-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="size-18 shrink-0 rounded-2xl border border-border/70"
          />
        ))}
      </div>

      <div className="order-1 min-w-0 md:order-2">
        <Skeleton className="h-96 w-full rounded-3xl border border-border/70 bg-muted sm:h-128 lg:h-144" />
      </div>
    </div>
  )
}
