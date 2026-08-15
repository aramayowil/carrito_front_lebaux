import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type VarianteProductCardSkeleton = "catalogo" | "destacado" | "promocion"

interface ProductCardSkeletonProps {
  variante?: VarianteProductCardSkeleton
  className?: string
}

/** Conserva la geometría de las cards comerciales mientras se cargan productos. */
export function ProductCardSkeleton({
  variante = "catalogo",
  className,
}: ProductCardSkeletonProps) {
  const esPromocion = variante === "promocion"
  const esDestacado = variante === "destacado"

  return (
    <Card
      aria-hidden="true"
      className={cn(
        "h-full gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card py-0 shadow-sm sm:rounded-3xl",
        className,
      )}
    >
      <div className="relative border-b border-border/60 bg-white p-1.5 xs:p-2 sm:p-3">
        <Skeleton className="aspect-square w-full rounded-xl sm:rounded-2xl" />
        {(esPromocion || esDestacado) && (
          <Skeleton className="absolute top-2 left-2 h-5 w-20 rounded-full sm:top-4 sm:left-4 sm:h-6 sm:w-24" />
        )}
      </div>

      <CardHeader className="gap-1.5 px-3 pt-3 sm:gap-2 sm:px-5 sm:pt-5">
        {variante !== "destacado" && (
          <Skeleton className="h-3 w-24 rounded-full sm:w-32" />
        )}
        <div className="min-h-9 space-y-1.5 sm:min-h-11">
          <Skeleton className="h-4 w-4/5 rounded-md sm:h-5" />
          <Skeleton className="h-4 w-3/5 rounded-md sm:h-5" />
        </div>
        {(esPromocion || esDestacado) && (
          <div className="hidden space-y-2 lg:block">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
          </div>
        )}
      </CardHeader>

      <CardContent className="mt-2 flex-1 space-y-3 px-3 sm:mt-3 sm:space-y-4 sm:px-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-md sm:h-8 sm:w-36" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>

        {variante === "catalogo" && (
          <div className="flex min-h-7 items-center justify-between gap-3 border-t border-border/70 pt-3">
            <div className="flex gap-1.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="size-3.5 rounded-full sm:size-4" />
              ))}
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        )}

        {esPromocion && <Skeleton className="h-3 w-4/5 rounded-md" />}
        {esDestacado && <Skeleton className="h-5 w-24 rounded-full" />}
      </CardContent>

      <CardFooter className="px-3 pt-3 pb-3 sm:px-5 sm:pt-4 sm:pb-5">
        <Skeleton className="h-9 w-full rounded-xl sm:h-10" />
      </CardFooter>
    </Card>
  )
}
