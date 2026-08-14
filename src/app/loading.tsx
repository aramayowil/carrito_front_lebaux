import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-muted/30">
        <div className="container space-y-5 py-10 sm:py-14">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-10 w-full max-w-xl rounded-xl" />
          <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
        </div>
      </section>

      <div className="container grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border/70 bg-card"
          >
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
