import { Skeleton } from "@/components/ui/skeleton"

/** Replica la galería real, incluidas miniaturas laterales y alto de la imagen principal. */
export function ProductGallerySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid min-w-0 gap-3 lg:grid-cols-[4.5rem_minmax(0,1fr)]"
    >
      <div className="hidden gap-2 overflow-hidden lg:flex lg:flex-col lg:pr-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-square w-full shrink-0 rounded-xl border border-border/70"
          />
        ))}
      </div>

      <div className="min-w-0">
        <Skeleton className="aspect-square w-full rounded-2xl border border-border/70 bg-muted" />
      </div>
    </div>
  )
}
