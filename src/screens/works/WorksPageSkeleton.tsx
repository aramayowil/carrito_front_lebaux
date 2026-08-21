import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkCardSkeleton } from "@/features/works/components/WorkCardSkeleton";

/** Fallback estructural de Obras, alineado con las secciones reales de WorksPage. */
export function WorksPageSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-x-clip bg-background">
      <section className="border-b border-border/70 bg-muted/30 py-5 sm:py-7 lg:py-8">
        <div className="container">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.72fr] lg:gap-12">
            <div>
              <Skeleton className="h-4 w-48 rounded-full" />
              <div className="mt-3 max-w-4xl space-y-2">
                <Skeleton className="h-9 w-full max-w-2xl rounded-md sm:h-11 lg:h-12" />
                <Skeleton className="h-9 w-3/5 max-w-md rounded-md sm:h-11 lg:h-12" />
              </div>
              <div className="mt-4 max-w-2xl space-y-2">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-5/6 rounded-md" />
              </div>
            </div>

            <div className="border-l-2 border-primary/30 pl-5 sm:pl-6">
              <Skeleton className="h-3 w-36 rounded-full" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-11/12 rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-9 sm:py-11 lg:py-14">
        <div className="container">
          <div className="mb-6">
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="mt-2 h-8 w-full max-w-lg rounded-md sm:h-9" />
          </div>

          <div className="grid items-center gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <Skeleton className="aspect-4/3 w-full rounded-xl" />

            <div className="lg:py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-px w-6 rounded-none" />
                <Skeleton className="h-3 w-28 rounded-full" />
              </div>

              <Skeleton className="mt-4 h-9 w-full max-w-md rounded-md sm:h-10" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-full" />
              </div>

              <div className="mt-8 border-l-2 border-primary/30 pl-5 sm:pl-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full rounded-md" />
                  <Skeleton className="h-5 w-5/6 rounded-md" />
                </div>
                <Skeleton className="mt-4 h-3 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-10 sm:py-12 lg:py-16">
        <div className="container">
          <div className="mb-5 grid items-end gap-4 sm:mb-6 md:grid-cols-[1fr_0.8fr]">
            <div>
              <Skeleton className="h-4 w-36 rounded-full" />
              <Skeleton className="mt-2 h-8 w-full max-w-md rounded-md sm:h-9" />
            </div>
            <div className="space-y-2 md:justify-self-end md:w-full md:max-w-xl">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
          </div>

          <div className="mb-4 flex h-11 items-end gap-5 overflow-hidden border-b border-border/60 sm:mb-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="mb-3 h-4 w-24 shrink-0 rounded-full"
              />
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <WorkCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 lg:py-16">
        <div className="container">
          <div className="mb-6 max-w-3xl">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="mt-2 h-8 w-52 rounded-md sm:h-9" />
            <div className="mt-4 max-w-2xl space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="aspect-4/3 w-full rounded-xl" />
                <Skeleton className="mt-3 h-3 w-16 rounded-full" />
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-5 border-t border-border pt-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-12 text-white sm:py-14 lg:py-18">
        <div className="container grid items-start gap-10 lg:grid-cols-[0.75fr_1fr] lg:gap-14">
          <div>
            <Skeleton className="h-4 w-28 rounded-full bg-white/15" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-9 w-full max-w-lg rounded-md bg-white/15 sm:h-10 lg:h-12" />
              <Skeleton className="h-9 w-4/5 max-w-md rounded-md bg-white/15 sm:h-10 lg:h-12" />
            </div>
            <div className="mt-5 max-w-xl space-y-2">
              <Skeleton className="h-4 w-full rounded-md bg-white/10" />
              <Skeleton className="h-4 w-5/6 rounded-md bg-white/10" />
            </div>
            <div className="mt-7 max-w-lg border-t border-white/10 pt-6">
              <Skeleton className="h-4 w-full rounded-md bg-white/10" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-md bg-white/10" />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="gap-0 border-white/10 bg-brand-graphite py-0 text-white shadow-md"
              >
                <CardContent className="flex items-start gap-4 px-5 py-6 sm:gap-5 sm:px-7 sm:py-7">
                  <Skeleton className="size-11 shrink-0 rounded-xl bg-white/15 sm:size-12" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-20 rounded-full bg-white/10" />
                    <Skeleton className="mt-2 h-6 w-3/5 rounded-md bg-white/15" />
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-4 w-full rounded-md bg-white/10" />
                      <Skeleton className="h-4 w-5/6 rounded-md bg-white/10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-primary bg-brand-graphite py-10 text-white sm:py-12 lg:py-14">
        <div className="container grid items-center gap-8 lg:grid-cols-[1fr_0.7fr] lg:gap-12">
          <div>
            <Skeleton className="h-4 w-52 rounded-full bg-white/15" />
            <div className="mt-3 max-w-3xl space-y-2">
              <Skeleton className="h-9 w-full max-w-xl rounded-md bg-white/15 sm:h-10 lg:h-12" />
              <Skeleton className="h-9 w-4/5 max-w-lg rounded-md bg-white/15 sm:h-10 lg:h-12" />
            </div>
          </div>

          <div className="border-t border-white/10 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md bg-white/10" />
              <Skeleton className="h-4 w-5/6 rounded-md bg-white/10" />
            </div>
            <Skeleton className="mt-5 h-3 w-20 rounded-full bg-white/10" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-6 w-24 rounded-lg bg-white/10" />
              <Skeleton className="h-6 w-28 rounded-lg bg-white/10" />
            </div>
            <Skeleton className="mt-6 h-12 w-full rounded-xl bg-white/15" />
          </div>
        </div>
      </section>
    </div>
  );
}
