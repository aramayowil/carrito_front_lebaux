import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder de una fila de sección genérica: título + grilla de cards. */
function SectionSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <section className="container py-10 sm:py-14">
      <Skeleton className="h-4 w-32 rounded-full" />
      <Skeleton className="mt-3 h-8 w-full max-w-md rounded-lg" />
      <Skeleton className="mt-2 h-4 w-full max-w-lg rounded-lg" />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-2xl sm:h-72" />
        ))}
      </div>
    </section>
  )
}

/** Aproximación visual de HomePage mientras se resuelve `cargarDatosHome`. */
export function HomePageSkeleton() {
  return (
    <div className="overflow-x-clip">
      <div className="bg-brand-black">
        <Skeleton className="aspect-4/5 max-h-[70vh] w-full rounded-none md:aspect-21/9" />
      </div>

      <SectionSkeleton cards={4} />
      <SectionSkeleton cards={3} />
      <SectionSkeleton cards={4} />
    </div>
  )
}
