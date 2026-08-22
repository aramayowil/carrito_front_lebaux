import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** Reproduce la geometría de WorkCard mientras se cargan las obras. */
export function WorkCardSkeleton() {
  return (
    <Card
      aria-hidden="true"
      className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border-border/80 py-0 shadow-none"
    >
      <Skeleton className="aspect-4/3 w-full rounded-none" />

      <CardContent className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>

        <Skeleton className="mt-3 h-6 w-4/5 rounded-md" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-3.5 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
