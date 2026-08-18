import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/media/ProductImage";
import { cn } from "@/lib/utils";
import type { Obra } from "@/types";

export type HomeFeaturedWork = Obra & { href: string };

const SIZES_CARD_VERTICAL =
  "(max-width: 40rem) calc(100vw - 2rem), (max-width: 48rem) 37rem, (max-width: 64rem) 45rem, 0px";

interface FeaturedWorkCardProps {
  obra: HomeFeaturedWork;
  variant: "vertical" | "overlay";
  featured?: boolean;
  priority?: boolean;
  className?: string;
}

/** Card editorial para representar una obra destacada dentro de la Home. */
export function FeaturedWorkCard({
  obra,
  variant,
  featured = false,
  priority = false,
  className,
}: FeaturedWorkCardProps) {
  const esVertical = variant === "vertical";

  return (
    <Link
      href={obra.href}
      className={cn(
        "group relative block h-full min-h-0 overflow-hidden rounded-xl bg-brand-black outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
      aria-label={`Ver obra: ${obra.titulo}`}
    >
      <ProductImage
        src={obra.imagen}
        alt={obra.titulo}
        priority={priority}
        sizes={esVertical ? SIZES_CARD_VERTICAL : featured ? "62vw" : "30vw"}
        className={cn(
          "w-full",
          esVertical ? "aspect-4/3" : "h-full min-h-full",
        )}
        imgClassName="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
      />

      <div
        className={cn(
          "text-white",
          esVertical
            ? "border-t border-white/10 bg-brand-black px-5 py-5 sm:px-6"
            : "absolute inset-x-0 bottom-0 bg-brand-black/85 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {obra.tipo}
        </p>
        <h3
          className={cn(
            "mt-1.5 font-bold tracking-tight text-balance",
            esVertical
              ? "text-xl sm:text-2xl"
              : featured
                ? "text-3xl"
                : "text-lg xl:text-xl",
          )}
        >
          {obra.titulo}
        </h3>

        {esVertical ? (
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
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
        ) : (
          <p className="mt-1.5 line-clamp-1 text-xs text-white/60">
            {obra.especificacion}
          </p>
        )}
      </div>
    </Link>
  );
}
