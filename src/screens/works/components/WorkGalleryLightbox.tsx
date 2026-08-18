"use client";

import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";

import { ProductImage } from "@/components/media/ProductImage";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ZOOM_AMPLIADO = 2.25;

/** Galería responsive con lightbox, carrusel y zoom sobre la imagen activa. */
export function WorkGalleryLightbox({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewApi, setPreviewApi] = useState<CarouselApi>();
  const [api, setApi] = useState<CarouselApi>();
  const [zoom, setZoom] = useState(1);
  const zoomViewportRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef(0);

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

  useEffect(() => {
    if (!open || !api) return;
    api.scrollTo(selectedIndex, true);
  }, [api, open, selectedIndex]);

  useEffect(() => {
    if (!api) return;

    const updateSelection = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setZoom(1);
    };

    api.on("select", updateSelection);
    return () => {
      api.off("select", updateSelection);
    };
  }, [api]);

  useEffect(() => {
    if (zoom === 1) return;

    const frame = requestAnimationFrame(() => {
      const viewport = zoomViewportRef.current;
      if (!viewport) return;
      viewport.scrollTo({
        left: (viewport.scrollWidth - viewport.clientWidth) / 2,
        top: (viewport.scrollHeight - viewport.clientHeight) / 2,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [zoom]);

  function openAt(index: number) {
    setSelectedIndex(index);
    setZoom(1);
    setOpen(true);
  }

  function toggleZoom() {
    setZoom((current) => (current === 1 ? ZOOM_AMPLIADO : 1));
  }

  function handleTouchEnd() {
    const now = Date.now();
    if (now - lastTouchRef.current < 300) toggleZoom();
    lastTouchRef.current = now;
  }

  return (
    <>
      <Carousel
        opts={{ align: "start", loop: images.length > 1 }}
        setApi={setPreviewApi}
        className="works-reveal-media w-full lg:hidden"
        aria-label={`Vistas de ${title}`}
      >
        <CarouselContent>
          {images.map((image, index) => (
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
                  priority={index === 0}
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 100vw"
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

      {images.length > 1 && (
        <div
          className="mt-4 flex items-center justify-center gap-2 lg:hidden"
          aria-label="Seleccionar imagen"
        >
          {images.map((_, index) => (
            <button
              key={`preview-indicator-${index}`}
              type="button"
              onClick={() => previewApi?.scrollTo(index)}
              className={cn(
                "size-2 rounded-full transition-[width,background-color] duration-300 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                previewIndex === index ? "w-6 bg-primary" : "bg-border",
              )}
              aria-label={`Ir a la imagen ${index + 1}`}
              aria-current={previewIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          "hidden gap-4 lg:grid",
          images.length === 1
            ? "lg:aspect-video lg:grid-cols-1 lg:grid-rows-1"
            : "lg:aspect-[16/7] lg:grid-cols-[1.35fr_0.65fr] lg:grid-rows-2",
        )}
      >
        {images.slice(0, 3).map((image, index) => (
          <button
            key={`${image}-preview-desktop-${index}`}
            type="button"
            onClick={() => openAt(index)}
            className={cn(
              "group relative h-full w-full overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              index === 0 && images.length > 1 && "row-span-2",
              index === 1 && images.length === 2 && "row-span-2",
              index === 0 ? "works-reveal-media" : "works-reveal-soft",
            )}
            aria-label={`Ampliar ${title}, vista ${index + 1}`}
          >
            <ProductImage
              src={image}
              alt={`${title}, vista ${index + 1}`}
              priority={index === 0}
              sizes={index === 0 ? "68vw" : "32vw"}
              className="h-full min-h-full w-full"
              imgClassName="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
            />

            {index === 2 && images.length > 3 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-brand-black/55 text-3xl font-semibold text-white backdrop-blur-[0.0625rem]">
                +{images.length - 3}
              </span>
            ) : (
              <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-brand-black/75 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn className="size-4" aria-hidden="true" />
              </span>
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setZoom(1);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 top-0 left-0 h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-brand-black/90 p-0 text-white shadow-none ring-0 supports-backdrop-filter:backdrop-blur-sm sm:max-w-none sm:rounded-none"
        >
          <DialogTitle className="sr-only">Galería de {title}</DialogTitle>
          <DialogDescription className="sr-only">
            Navegá entre las imágenes y ampliá la fotografía seleccionada.
          </DialogDescription>

          <div className="absolute top-4 right-4 left-4 z-20 flex items-center justify-between gap-3 sm:top-6 sm:right-6 sm:left-6">
            <p className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleZoom}
                className="inline-flex size-10 touch-manipulation items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:outline-none"
                aria-label={zoom === 1 ? "Ampliar imagen" : "Reducir imagen"}
              >
                {zoom === 1 ? (
                  <ZoomIn className="size-5" aria-hidden="true" />
                ) : (
                  <ZoomOut className="size-5" aria-hidden="true" />
                )}
              </button>

              <DialogClose
                render={
                  <button
                    type="button"
                    className="inline-flex size-10 touch-manipulation items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:outline-none"
                  />
                }
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Cerrar galería</span>
              </DialogClose>
            </div>
          </div>

          <Carousel
            setApi={setApi}
            opts={{ loop: images.length > 1, watchDrag: zoom === 1 }}
            className="flex h-dvh w-full items-center"
          >
            <CarouselContent className="ml-0 h-dvh w-full">
              {images.map((image, index) => (
                <CarouselItem
                  key={`${image}-modal-${index}`}
                  className="h-dvh w-full pl-0"
                >
                  <div
                    ref={index === selectedIndex ? zoomViewportRef : undefined}
                    onDoubleClick={toggleZoom}
                    onTouchMove={() => {
                      lastTouchRef.current = 0;
                    }}
                    onTouchEnd={handleTouchEnd}
                    className={cn(
                      "h-full w-full",
                      zoom === 1
                        ? "cursor-zoom-in overflow-hidden"
                        : "cursor-zoom-out touch-auto overflow-auto",
                    )}
                  >
                    <div
                      className="transition-[width,height] duration-300 ease-out"
                      style={{
                        width:
                          index === selectedIndex ? `${zoom * 100}%` : "100%",
                        height:
                          index === selectedIndex ? `${zoom * 100}%` : "100%",
                      }}
                    >
                      <Image
                        src={image}
                        alt={`${title}, imagen ampliada ${index + 1}`}
                        width={1448}
                        height={1086}
                        priority={index === selectedIndex}
                        sizes="100vw"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4 hidden size-11 border-white/10 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 sm:flex" />
                <CarouselNext className="right-4 hidden size-11 border-white/10 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 sm:flex" />
              </>
            )}
          </Carousel>

          <p className="pointer-events-none absolute right-4 bottom-4 left-4 z-20 text-center text-xs text-white/50 sm:bottom-6">
            {zoom === 1
              ? "Deslizá para recorrer · Doble toque para ampliar"
              : "Desplazá la imagen para explorar sus detalles"}
          </p>

          {images.length > 1 && (
            <div
              className="absolute right-4 bottom-10 left-4 z-20 flex items-center justify-center gap-2 sm:bottom-12"
              aria-label="Seleccionar imagen ampliada"
            >
              {images.map((_, index) => (
                <button
                  key={`modal-indicator-${index}`}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "size-2 rounded-full transition-[width,background-color] duration-300 focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:outline-none",
                    selectedIndex === index ? "w-6 bg-primary" : "bg-white/35",
                  )}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
