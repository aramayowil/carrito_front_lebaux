import { Skeleton } from "@/components/ui/skeleton"

/** Replica la galería real, incluidas miniaturas laterales y alto de la imagen principal. */
export function ProductGallerySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid min-w-0 gap-3 md:grid-cols-[5rem_minmax(0,1fr)]"
    >
      <div className="hidden gap-2 overflow-hidden md:flex md:max-h-144 md:flex-col md:pr-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="size-18 shrink-0 rounded-xl border border-border/70"
          />
        ))}
      </div>

      <div className="min-w-0">
        <Skeleton className="aspect-square w-full rounded-2xl border border-border/70 bg-muted" />
      </div>
    </div>
  )
}
