"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageOff, ZoomIn } from "lucide-react";

import { Lightbox } from "@/components/media/Lightbox";
import { ProductImage } from "@/components/media/ProductImage";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const SIZES_PREVIEW_MOBILE = "(max-width: 1023px) 100vw, 50vw";
const SIZES_PREVIEW_DESKTOP_PRINCIPAL = "(max-width: 1023px) 100vw, 60vw";
const SIZES_PREVIEW_DESKTOP_SECUNDARIA = "(max-width: 1023px) 100vw, 30vw";

/** Cada cuánto avanza sola la vista previa mobile (ms). A propósito lento:
 *  es un acompañamiento de fondo, no debe apurar al usuario. */
const AUTOPLAY_INTERVAL_MS = 5000;

/** Galería responsive: vista previa (grilla en desktop, carrusel en mobile) que abre el visor compartido. */
export function WorkGalleryLightbox({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const galleryImages = useMemo(() => {
    const unicas = new Set<string>();
    for (const image of Array.isArray(images) ? images : []) {
      if (typeof image !== "string") continue;
      const fuente = image.trim();
      if (fuente) unicas.add(fuente);
    }
    return [...unicas];
  }, [images]);

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewApi, setPreviewApi] = useState<CarouselApi>();

  const maxIndex = Math.max(galleryImages.length - 1, 0);
  const previewIndexSeguro = Math.min(previewIndex, maxIndex);

  useEffect(() => {
    if (!previewApi) return;

    const updatePreviewSelection = () => {
      setPreviewIndex(previewApi.selectedScrollSnap());
    };

    updatePreviewSelection();
    previewApi.on("select", updatePreviewSelection);
    previewApi.on("reInit", updatePreviewSelection);

    return () => {
      previewApi.off("select", updatePreviewSelection);
      previewApi.off("reInit", updatePreviewSelection);
    };
  }, [previewApi]);

  // Sin flechas, la única forma de recorrer la vista previa mobile es el
  // swipe o los puntos, así que avanza sola de fondo. Se frena apenas el
  // usuario la toca (no vuelve a arrancar hasta que la suelta) y respeta
  // "reducir movimiento" del sistema operativo.
  useEffect(() => {
    if (!previewApi || galleryImages.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const play = () => {
      intervalId = setInterval(() => {
        previewApi.scrollNext();
      }, AUTOPLAY_INTERVAL_MS);
    };

    const stop = () => {
      if (intervalId) clearInterval(intervalId);
    };

    play();
    previewApi.on("pointerDown", stop);
    previewApi.on("pointerUp", play);

    return () => {
      stop();
      previewApi.off("pointerDown", stop);
      previewApi.off("pointerUp", play);
    };
  }, [previewApi, galleryImages.length]);

  function openAt(index: number) {
    if (!galleryImages[index]) return;
    setSelectedIndex(index);
    setOpen(true);
  }

  if (galleryImages.length === 0) {
    return (
      <div className="works-reveal-media flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-xl bg-muted text-muted-foreground">
        <ImageOff className="size-9" aria-hidden="true" />
        <p className="px-4 text-center text-sm">
          No hay imágenes disponibles para esta obra.
        </p>
      </div>
    );
  }

  return (
    <>
      <Carousel
        opts={{ align: "start", loop: galleryImages.length > 1 }}
        setApi={setPreviewApi}
        className="works-reveal-media w-full lg:hidden"
        aria-label={`Vistas de ${title}`}
      >
        <CarouselContent>
          {galleryImages.map((image, index) => (
            <CarouselItem
              key={`${image}-preview-mobile-${index}`}
              className="basis-full"
            >
              <button
                type="button"
                onClick={() => openAt(index)}
                className="group relative w-full overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                aria-label={`Ampliar ${title}, vista ${index + 1}`}
              >
                <ProductImage
                  src={image}
                  alt={`${title}, vista ${index + 1}`}
                  sizes={SIZES_PREVIEW_MOBILE}
                  className="aspect-4/3 w-full"
                  imgClassName="object-cover"
                />
                <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-brand-black/75 text-white backdrop-blur-sm">
                  <ZoomIn className="size-4" aria-hidden="true" />
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {galleryImages.length > 1 && (
        <div
          className="mt-4 flex items-center justify-center gap-2 lg:hidden"
          aria-label="Seleccionar imagen"
        >
          {galleryImages.map((_, index) => (
            <button
              key={`preview-indicator-${index}`}
              type="button"
              onClick={() => previewApi?.scrollTo(index)}
              className={cn(
                "size-2 rounded-full transition-[width,background-color] duration-300 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                previewIndexSeguro === index ? "w-6 bg-primary" : "bg-border",
              )}
              aria-label={`Ir a la imagen ${index + 1}`}
              aria-current={previewIndexSeguro === index ? "true" : undefined}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          "hidden gap-4 lg:grid",
          galleryImages.length === 1
            ? "lg:aspect-video lg:grid-cols-1 lg:grid-rows-1"
            : "lg:aspect-16/7 lg:grid-cols-[1.35fr_0.65fr] lg:grid-rows-2",
        )}
      >
        {galleryImages.slice(0, 3).map((image, index) => (
          <button
            key={`${image}-preview-desktop-${index}`}
            type="button"
            onClick={() => openAt(index)}
            className={cn(
              "group relative h-full w-full overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              index === 0 && galleryImages.length > 1 && "row-span-2",
              index === 1 && galleryImages.length === 2 && "row-span-2",
              index === 0 ? "works-reveal-media" : "works-reveal-soft",
            )}
            aria-label={`Ampliar ${title}, vista ${index + 1}`}
          >
            <ProductImage
              src={image}
              alt={`${title}, vista ${index + 1}`}
              sizes={
                index === 0
                  ? SIZES_PREVIEW_DESKTOP_PRINCIPAL
                  : SIZES_PREVIEW_DESKTOP_SECUNDARIA
              }
              className="h-full min-h-full w-full"
              imgClassName="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
            />

            {index === 2 && galleryImages.length > 3 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-brand-black/55 text-3xl font-semibold text-white backdrop-blur-[0.0625rem]">
                +{galleryImages.length - 3}
              </span>
            ) : (
              <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-brand-black/75 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn className="size-4" aria-hidden="true" />
              </span>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        images={galleryImages}
        title={title}
        open={open}
        initialIndex={selectedIndex}
        onOpenChange={setOpen}
      />
    </>
  );
}
