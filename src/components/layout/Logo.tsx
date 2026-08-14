import Link from "next/link"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  variant?: "full" | "cropped"
  nombreSitio?: string
}

/** Logo de Lebaux enlazado al inicio. No depende de contexto cliente. */
export function Logo({
  className,
  variant = "full",
  nombreSitio = "Lebaux",
}: LogoProps) {
  const isCropped = variant === "cropped"

  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
      aria-label={nombreSitio}
    >
      <img
        src={isCropped ? "/logo_recortado.png" : "/logo.png"}
        alt={nombreSitio}
        className={cn(
          "w-auto object-contain",
          isCropped ? "h-12 sm:h-16 lg:h-20" : "h-8 md:h-9",
        )}
        loading="eager"
        decoding="async"
      />
    </Link>
  )
}
