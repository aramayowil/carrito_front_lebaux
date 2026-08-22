import { ImageOff } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
}

const SIZES_POR_DEFECTO =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

function esImagenOptimizablePorNext(src: string) {
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

/**
 * Imagen pública con dimensiones estables. Las imágenes locales y Cloudinary
 * usan next/image; otros hosts conservan un <img> nativo como compatibilidad.
 */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  sizes = SIZES_POR_DEFECTO,
  srcSet,
  priority = false,
}: ProductImageProps) {
  const fuente = src.trim();

  if (!fuente) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="h-8 w-8" />
        <span className="px-3 text-center text-xs">{alt}</span>
      </div>
    );
  }

  if (!esImagenOptimizablePorNext(fuente)) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <img
          src={fuente}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={cn("h-full w-full object-contain", imgClassName)}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={fuente}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain", imgClassName)}
      />
    </div>
  );
}
