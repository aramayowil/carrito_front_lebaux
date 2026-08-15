"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { ProductImage } from "@/components/media/ProductImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ImagenProducto } from "@/types"

interface ProductGalleryProps {
  images: ImagenProducto[]
  productName: string
}

/** Galería responsive con miniaturas laterales y visor ampliado deslizable. */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>()
  const orderedImages = [...images].sort(
    (a, b) => Number(Boolean(b.esPrincipal)) - Number(Boolean(a.esPrincipal)),
  )
  const currentIndex =
    orderedImages.length === 0
      ? 0
      : Math.min(activeIndex, orderedImages.length - 1)
  const activeImage = orderedImages[currentIndex] ?? orderedImages[0]
  const hasMultiple = orderedImages.length > 1
  const isFirstImage = currentIndex === 0
  const isLastImage = currentIndex === orderedImages.length - 1

  const goTo = useCallback(
    (index: number) => {
      if (orderedImages.length === 0) return
      setActiveIndex(Math.max(0, Math.min(index, orderedImages.length - 1)))
    },
    [orderedImages.length],
  )

  const goToLightbox = useCallback(
    (index: number) => {
      if (orderedImages.length === 0) return
      const nextIndex = Math.max(
        0,
        Math.min(index, orderedImages.length - 1),
      )
      setActiveIndex(nextIndex)
      lightboxApi?.scrollTo(nextIndex)
    },
    [lightboxApi, orderedImages.length],
  )

  useEffect(() => {
    if (!lightboxApi) return

    const syncSelectedImage = () => {
      setActiveIndex(lightboxApi.selectedScrollSnap())
    }

    syncSelectedImage()
    lightboxApi.on("select", syncSelectedImage)
    lightboxApi.on("reInit", syncSelectedImage)

    return () => {
      lightboxApi.off("select", syncSelectedImage)
      lightboxApi.off("reInit", syncSelectedImage)
    }
  }, [lightboxApi])

  useEffect(() => {
    if (!lightboxOpen || !lightboxApi) return
    lightboxApi.scrollTo(currentIndex, true)
  }, [currentIndex, lightboxApi, lightboxOpen])

  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-[5rem_minmax(0,1fr)]">
      {hasMultiple && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:max-h-144 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pr-1">
          {orderedImages.map((image, index) => (
            <Button
              key={`${image.url}-${index}`}
              type="button"
              variant="outline"
              onClick={() => goTo(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-pressed={index === currentIndex}
              className={cn(
                "size-18 shrink-0 overflow-hidden rounded-2xl bg-white p-1",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border/70 hover:border-primary/50",
              )}
            >
              <ProductImage
                src={image.url}
                alt={image.textoAlternativo}
                className="h-full w-full rounded-xl bg-white"
                imgClassName="object-cover"
              />
            </Button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "order-1 min-w-0 md:order-2",
          !hasMultiple && "md:col-span-2",
        )}
      >
        <div className="corner-marks relative overflow-hidden rounded-3xl border border-border/70 bg-white">
          <ProductImage
            src={activeImage?.url ?? ""}
            alt={activeImage?.textoAlternativo ?? productName}
            className="h-96 w-full sm:h-128 lg:h-144"
            priority={currentIndex === 0}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 z-20 touch-manipulation rounded-full bg-brand-black/85 px-3 text-xs font-medium text-white shadow-sm backdrop-blur-sm hover:bg-brand-black"
            aria-label="Ampliar imagen del producto"
          >
            <Expand className="size-4" />
            Ampliar
          </Button>

          {hasMultiple && (
            <>
              <Badge
                variant="secondary"
                className="absolute left-4 top-4 z-10 bg-background/90 backdrop-blur-sm"
              >
                {currentIndex + 1} / {orderedImages.length}
              </Badge>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                onClick={() => goTo(currentIndex - 1)}
                disabled={isFirstImage}
                aria-label="Ver foto anterior"
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 touch-manipulation rounded-full bg-background/90 shadow-sm backdrop-blur-sm disabled:opacity-40"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                onClick={() => goTo(currentIndex + 1)}
                disabled={isLastImage}
                aria-label="Ver foto siguiente"
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 touch-manipulation rounded-full bg-background/90 shadow-sm backdrop-blur-sm disabled:opacity-40"
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton
          className="flex h-[94dvh] max-h-[94dvh] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-3xl bg-brand-black p-0 text-white sm:max-w-[min(96vw,90rem)] [&_[data-slot=dialog-close]]:z-40 [&_[data-slot=dialog-close]]:bg-white/90 [&_[data-slot=dialog-close]]:text-brand-black [&_[data-slot=dialog-close]]:hover:bg-white"
        >
          <DialogTitle className="sr-only">
            Galería ampliada de {productName}
          </DialogTitle>

          <div className="flex min-h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 pr-16 sm:px-6 sm:pr-20">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {productName}
              </p>
              {hasMultiple && (
                <p className="mt-0.5 text-xs text-white/55">
                  Deslizá horizontalmente para ver las demás fotos
                </p>
              )}
            </div>
            {hasMultiple && (
              <Badge className="shrink-0 border-white/10 bg-white/10 text-white">
                {currentIndex + 1} / {orderedImages.length}
              </Badge>
            )}
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <Carousel
              opts={{
                align: "start",
                containScroll: "trimSnaps",
                dragFree: false,
                loop: false,
                startIndex: currentIndex,
              }}
              setApi={setLightboxApi}
              className="h-full [&_[data-slot=carousel-content]]:h-full [&_[data-slot=carousel-content]>div]:h-full"
            >
              <CarouselContent className="h-full -ml-0">
                {orderedImages.map((image, index) => (
                  <CarouselItem
                    key={`ampliada-${image.url}-${index}`}
                    className="h-full pl-0"
                  >
                    <div className="flex h-full min-h-0 items-center justify-center p-2 sm:p-5">
                      <ProductImage
                        src={image.url}
                        alt={image.textoAlternativo || productName}
                        className="h-full w-full select-none rounded-2xl bg-white/5"
                        sizes="96vw"
                        priority={index === currentIndex}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {hasMultiple && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => goToLightbox(currentIndex - 1)}
                  disabled={isFirstImage}
                  aria-label="Imagen anterior"
                  className="absolute left-3 top-1/2 z-30 -translate-y-1/2 touch-manipulation rounded-full bg-white/90 text-brand-black shadow-md hover:bg-white disabled:opacity-30 sm:left-5"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => goToLightbox(currentIndex + 1)}
                  disabled={isLastImage}
                  aria-label="Imagen siguiente"
                  className="absolute right-3 top-1/2 z-30 -translate-y-1/2 touch-manipulation rounded-full bg-white/90 text-brand-black shadow-md hover:bg-white disabled:opacity-30 sm:right-5"
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>

          {hasMultiple && (
            <div className="shrink-0 border-t border-white/10 px-3 py-3 sm:px-5">
              <div className="flex snap-x gap-2 overflow-x-auto pb-1">
                {orderedImages.map((image, index) => (
                  <Button
                    key={`miniatura-ampliada-${image.url}-${index}`}
                    type="button"
                    variant="ghost"
                    onClick={() => goToLightbox(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                    aria-pressed={index === currentIndex}
                    className={cn(
                      "size-14 shrink-0 snap-start overflow-hidden rounded-xl border p-1 sm:size-16",
                      index === currentIndex
                        ? "border-white bg-white/15 ring-2 ring-white/25"
                        : "border-white/15 bg-white/5 hover:bg-white/10",
                    )}
                  >
                    <ProductImage
                      src={image.url}
                      alt={image.textoAlternativo || productName}
                      className="h-full w-full rounded-lg bg-white"
                      imgClassName="object-cover"
                      sizes="64px"
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
