import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/media/ProductImage";
import { cn } from "@/lib/utils";
import type { Obra } from "@/types";

export type HomeFeaturedWork = Obra & { href: string };

const SIZES_CARD =
  "(max-width: 40rem) calc(100vw - 2rem), (max-width: 64rem) 45rem, 33vw";

interface FeaturedWorkCardProps {
  obra: HomeFeaturedWork;
  priority?: boolean;
  className?: string;
}

/** Card editorial para representar una obra destacada dentro de la Home. */
export function FeaturedWorkCard({
  obra,
  priority = false,
  className,
}: FeaturedWorkCardProps) {
  return (
    <Link
      href={obra.href}
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-brand-black outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
      aria-label={`Ver obra: ${obra.titulo}`}
    >
      <ProductImage
        src={obra.imagen}
        alt={obra.titulo}
        priority={priority}
        sizes={SIZES_CARD}
        className="aspect-4/3 w-full"
        imgClassName="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
      />

      <div className="flex flex-1 flex-col border-t border-white/10 bg-brand-black px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {obra.tipo}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-xl font-bold tracking-tight text-balance sm:text-2xl">
          {obra.titulo}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-3">
          <p className="line-clamp-1 min-w-0 text-sm text-white/60">
            {obra.especificacion}
          </p>
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
            Ver proyecto
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
