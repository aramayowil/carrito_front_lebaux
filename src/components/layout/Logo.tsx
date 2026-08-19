import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "cropped";
  nombreSitio?: string;
}

/** Logo de Lebaux enlazado al inicio. No depende de contexto cliente. */
export function Logo({
  className,
  variant = "full",
  nombreSitio = "Lebaux",
}: LogoProps) {
  const isCropped = variant === "cropped";

  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
      aria-label={nombreSitio}
    >
      <Image
        src={isCropped ? "/logo_recortado.png" : "/logo.png"}
        alt={nombreSitio}
        width={isCropped ? 320 : 583}
        height={isCropped ? 226 : 150}
        sizes={isCropped ? "10rem" : "9rem"}
        priority={!isCropped}
        className={cn(
          "w-auto object-contain",
          isCropped ? "h-12 sm:h-16 lg:h-20" : "h-8 md:h-9",
        )}
      />
    </Link>
  );
}
