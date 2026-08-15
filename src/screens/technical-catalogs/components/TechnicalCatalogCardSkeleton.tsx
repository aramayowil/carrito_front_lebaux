import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/** Card placeholder con la misma composición que un catálogo técnico publicado. */
export function TechnicalCatalogCardSkeleton() {
  return (
    <Card
      aria-hidden="true"
      className="h-full gap-0 overflow-hidden rounded-md border border-border/80 bg-background py-0 shadow-sm sm:rounded-3xl"
    >
      <Skeleton className="h-1.5 w-full rounded-none" />

      <CardHeader className="gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="size-11 rounded-2xl" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-6 w-4/5 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="mt-5 flex-1 px-5 sm:px-6">
        <div className="rounded-2xl bg-muted/40 p-4">
          <Skeleton className="h-3 w-32 rounded-full" />
          <div className="mt-3 space-y-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex min-h-9 items-center gap-3 border-t border-border/70 pt-4">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-28 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 px-5 pt-5 pb-5 sm:px-6 sm:pb-6">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardFooter>
    </Card>
  )
}
