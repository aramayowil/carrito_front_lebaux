import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";
import { cn } from "@/lib/utils";

/** Mantiene exactamente la relación de aspecto del banner real de Home. */
export function HomeHeroSkeleton() {
  return (
    <section aria-hidden="true" className="bg-brand-black">
      <Skeleton className="aspect-4/5 max-h-[70vh] w-full rounded-none bg-white/10 md:aspect-21/9" />
    </section>
  );
}

/** Replica el bloque de navegación por líneas de fabricación. */
export function HomeCatalogsSectionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="bg-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="mx-auto max-w-2xl text-center">
          <Skeleton className="mx-auto h-4 w-36 rounded-full" />
          <Skeleton className="mx-auto mt-3 h-8 w-full max-w-lg rounded-md sm:h-9" />
          <Skeleton className="mx-auto mt-3 h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="mx-auto mt-2 h-4 w-4/5 max-w-lg rounded-md" />
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 border-t border-border/70 pt-7 sm:mt-10 sm:pt-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative flex min-h-32 flex-col justify-between overflow-hidden rounded-xl border border-border bg-catalog-line px-5 py-6 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-primary/30 sm:min-h-36 sm:px-6"
            >
              <div>
                <Skeleton className="h-6 w-28 rounded-md sm:w-36" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-4/5 rounded-md" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Replica la franja oscura que enlaza con la biblioteca técnica. */
export function HomeTechnicalCatalogsSectionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="border-y border-white/10 bg-brand-black py-8 text-white sm:py-10"
    >
      <div className="container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-3xl items-start gap-4">
          <Skeleton className="mt-1 hidden size-10 shrink-0 rounded-lg bg-white/10 sm:block" />
          <div className="w-full">
            <Skeleton className="h-3 w-36 rounded-full bg-white/15" />
            <Skeleton className="mt-2 h-7 w-full max-w-xl rounded-md bg-white/15 lg:h-8" />
            <Skeleton className="mt-2 h-4 w-full max-w-2xl rounded-md bg-white/10" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-xl rounded-md bg-white/10" />
          </div>
        </div>
        <Skeleton className="h-12 w-full shrink-0 rounded-lg bg-white/15 sm:w-56" />
      </div>
    </section>
  );
}

/** Sección comercial de promociones o destacados con cards de producto reales en geometría. */
export function HomeProductsSectionSkeleton({
  variante = "destacado",
  muted = false,
}: {
  variante?: "destacado" | "promocion";
  muted?: boolean;
}) {
  return (
    <section
      aria-hidden="true"
      className={
        muted
          ? "border-y border-border/60 bg-muted/30 py-12 sm:py-16"
          : "py-12 sm:py-16"
      }
    >
      <div className="container">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-8 w-60 rounded-md sm:w-72" />
          </div>
          <div className="w-full max-w-xl space-y-2 sm:text-right">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md sm:ml-auto" />
          </div>
        </div>

        {variante === "promocion" ? (
          <div className="relative overflow-hidden px-1 sm:px-8">
            <div className="-ml-4 flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="min-w-0 shrink-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCardSkeleton variante="promocion" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="px-1 sm:hidden">
              <ProductCardSkeleton variante="destacado" />
              <div className="mt-5 flex justify-center gap-2">
                <Skeleton className="h-2 w-6 rounded-full" />
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="size-2 rounded-full" />
                ))}
              </div>
            </div>

            <div className="hidden px-1 sm:block sm:px-8">
              <div className="-ml-4 flex flex-wrap gap-y-4 sm:gap-y-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-w-0 basis-1/2 pl-4 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ProductCardSkeleton variante="destacado" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** Replica la sección negra de beneficios con distribución centrada. */
export function HomeBenefitsSectionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="border-y border-white/10 bg-brand-black py-9 text-white sm:py-12 lg:py-14"
    >
      <div className="container grid gap-8 lg:grid-cols-5 lg:items-start lg:gap-12">
        <div className="max-w-xl lg:col-span-2">
          <Skeleton className="h-4 w-28 rounded-full bg-white/15" />
          <Skeleton className="mt-2 h-8 w-full max-w-sm rounded-md bg-white/15" />
          <Skeleton className="mt-3 h-4 w-full max-w-lg rounded-md bg-white/10" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-md rounded-md bg-white/10" />
        </div>

        <div className="grid gap-x-8 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-2 lg:col-span-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex max-w-sm items-start gap-3",
                index === 2 && "sm:col-span-2 sm:justify-self-center",
              )}
            >
              <Skeleton className="mt-0.5 size-5 shrink-0 rounded-md bg-white/15" />
              <div className="w-full">
                <Skeleton className="h-5 w-32 rounded-md bg-white/15" />
                <Skeleton className="mt-2 h-4 w-full max-w-52 rounded-md bg-white/10" />
                <Skeleton className="mt-1.5 h-4 w-4/5 max-w-44 rounded-md bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Replica la composición editorial 1+2 de obras y su CTA inferior. */
export function HomeWorksSectionSkeleton() {
  return (
    <section aria-hidden="true" className="bg-muted/40 py-12 sm:py-16 lg:py-20">
      <div className="container">
        <div className="mb-7 grid items-end gap-5 sm:mb-10 md:grid-cols-[1fr_0.75fr]">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-8 w-full max-w-xl rounded-md" />
            <Skeleton className="h-8 w-4/5 max-w-lg rounded-md" />
          </div>
          <div className="space-y-2 md:justify-self-end">
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
            <Skeleton className="h-4 w-4/5 max-w-lg rounded-md" />
          </div>
        </div>

        <div className="lg:hidden">
          <Skeleton className="aspect-4/3 w-full rounded-xl" />
          <div className="mt-4 flex justify-center gap-2">
            <Skeleton className="h-2 w-6 rounded-full" />
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="size-2 rounded-full" />
          </div>
        </div>

        <div className="hidden aspect-[16/7] grid-cols-[1.35fr_0.65fr] grid-rows-2 gap-4 lg:grid">
          <Skeleton className="row-span-2 rounded-xl" />
          <Skeleton className="rounded-xl" />
          <Skeleton className="rounded-xl" />
        </div>

        <Card className="mt-6 gap-0 border-0 bg-brand-graphite py-0 text-white shadow-none sm:mt-8">
          <CardContent className="flex flex-col items-start justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center sm:px-8 lg:px-10">
            <div className="w-full max-w-xl space-y-2">
              <Skeleton className="h-6 w-4/5 rounded-md bg-white/15" />
              <Skeleton className="h-4 w-full rounded-md bg-white/10 sm:w-3/4" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl bg-primary/50 sm:w-80" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/** Replica la composición visual compacta de la sección Nosotros. */
export function HomeAboutSectionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="border-t border-border bg-background py-10 sm:py-14"
    >
      <div className="container grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="w-full lg:col-span-3">
          <Skeleton className="aspect-4/3 w-full rounded-xl lg:aspect-video" />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="mt-2 h-9 w-full max-w-md rounded-md" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 border-y border-border/70 py-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-40 rounded-md" />
            ))}
          </div>
          <Skeleton className="mt-6 h-12 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
