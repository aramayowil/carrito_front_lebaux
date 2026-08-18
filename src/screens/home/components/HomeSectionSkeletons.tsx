import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";

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
      className="bg-background px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="mx-auto max-w-2xl text-center">
          <Skeleton className="mx-auto h-4 w-36 rounded-full" />
          <Skeleton className="mx-auto mt-3 h-8 w-full max-w-lg rounded-md sm:h-9" />
          <Skeleton className="mx-auto mt-3 h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="mx-auto mt-2 h-4 w-4/5 max-w-lg rounded-md" />
        </div>

        <div className="mt-8 grid gap-3 border-t border-border/70 pt-7 sm:mt-10 sm:gap-4 sm:pt-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-32 flex-col justify-between rounded-2xl border border-border bg-catalog-line px-5 py-5 sm:min-h-36"
            >
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-5 w-28 rounded-md sm:w-36" />
                <Skeleton className="size-9 shrink-0 rounded-full" />
              </div>
              <div className="mt-2 space-y-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-4/5 rounded-md" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-muted-foreground/20 pt-3">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-3 w-12 rounded-full" />
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
      className="border-y border-white/10 bg-brand-black py-6 text-white sm:py-7 lg:py-8"
    >
      <div className="container grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-center">
        <div>
          <Skeleton className="h-3 w-28 rounded-full bg-white/15" />
          <Skeleton className="mt-2 h-7 w-full max-w-xl rounded-md bg-white/15 lg:h-8" />
          <Skeleton className="mt-2 h-4 w-full max-w-2xl rounded-md bg-white/10" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-xl rounded-md bg-white/10" />
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="hidden gap-2 xl:flex">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-6 w-20 rounded-full bg-white/10"
              />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl bg-white/15 sm:w-52" />
        </div>
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
          ? "border-y border-border/60 bg-muted/30 py-14 sm:py-16"
          : "py-14 sm:py-16"
      }
    >
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
                  className="min-w-0 shrink-0 basis-full pl-4 xs:basis-1/2 md:basis-1/3 xl:basis-1/4"
                >
                  <ProductCardSkeleton variante="promocion" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} variante="destacado" />
            ))}
          </div>
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
      className="border-y border-white/10 bg-brand-black py-14 text-white sm:py-16 lg:py-20"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto h-4 w-28 rounded-full bg-white/15" />
          <Skeleton className="mx-auto mt-3 h-9 w-full max-w-xl rounded-md bg-white/15" />
          <Skeleton className="mx-auto mt-4 h-4 w-full max-w-2xl rounded-md bg-white/10" />
          <Skeleton className="mx-auto mt-2 h-4 w-4/5 max-w-xl rounded-md bg-white/10" />
        </div>

        <div className="mx-auto mt-10 flex max-w-screen-2xl flex-wrap justify-center gap-y-10 border-t border-white/10 pt-9 sm:mt-12 sm:pt-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex basis-full flex-col items-center px-5 text-center sm:basis-1/2 lg:basis-1/3 xl:basis-1/5"
            >
              <Skeleton className="size-11 rounded-xl bg-white/15" />
              <Skeleton className="mt-4 h-5 w-32 rounded-md bg-white/15" />
              <Skeleton className="mt-2 h-4 w-full max-w-48 rounded-md bg-white/10" />
              <Skeleton className="mt-2 h-4 w-4/5 max-w-40 rounded-md bg-white/10" />
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
    <section aria-hidden="true" className="bg-muted/40 py-14 sm:py-16 lg:py-20">
      <div className="container">
        <div className="mb-8 grid items-end gap-5 sm:mb-10 md:grid-cols-[1fr_0.75fr]">
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

/** Replica la composición 4:3 + contenido institucional de la sección Nosotros. */
export function HomeAboutSectionSkeleton() {
  return (
    <section aria-hidden="true" className="bg-background py-16 sm:py-20">
      <div className="container grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="w-full lg:max-w-155">
          <Skeleton className="aspect-4/3 w-full rounded-2xl shadow-lg" />
        </div>

        <div className="min-w-0">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="mt-2 h-9 w-full max-w-md rounded-md" />
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card
                key={index}
                size="sm"
                className="gap-0 border border-border/70 py-0 shadow-none"
              >
                <CardContent className="flex items-start gap-4 px-4 py-4">
                  <Skeleton className="size-10 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-36 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
