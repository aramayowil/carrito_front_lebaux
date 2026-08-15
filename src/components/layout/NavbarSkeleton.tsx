import { Skeleton } from "@/components/ui/skeleton"

/** Reserva la geometría exacta del Navbar mientras hidrata la navegación cliente. */
export function NavbarSkeleton({ cantidadLineas = 3 }: { cantidadLineas?: number }) {
  const items = Math.min(Math.max(cantidadLineas, 2), 4)

  return (
    <header
      aria-hidden="true"
      className="sticky top-0 z-50 h-navbar shrink-0 border-b border-white/10 bg-brand-black/95 shadow-md backdrop-blur supports-backdrop-filter:bg-brand-black/90"
    >
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-3 px-4 sm:px-6">
        <Skeleton className="h-8 w-28 shrink-0 rounded-md bg-white/15 md:h-9 md:w-32" />

        <div className="hidden min-w-0 flex-1 items-center gap-2 lg:flex xl:gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full bg-white/10 xl:w-48 2xl:w-56" />

          <nav className="flex min-w-0 flex-1 items-center justify-center gap-1 xl:gap-2">
            {Array.from({ length: items }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-9 w-20 rounded-full bg-white/10 xl:w-24 2xl:w-28"
              />
            ))}
            <Skeleton className="hidden h-9 w-28 shrink-0 rounded-full bg-white/10 lg:block 2xl:w-32" />
          </nav>

          <Skeleton className="size-11 shrink-0 rounded-full bg-white/15 xl:w-32" />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Skeleton className="size-11 rounded-xl bg-white/10" />
          <Skeleton className="size-11 rounded-xl bg-white/15 sm:w-36" />
          <Skeleton className="size-11 rounded-xl bg-white/10" />
        </div>
      </div>
    </header>
  )
}
