"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { ProductImage } from "@/components/media/ProductImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ImagenProducto } from "@/types"

interface ProductGalleryProps {
  images: ImagenProducto[]
  productName: string
}

/** Galería responsive con miniaturas laterales y ampliación accesible. */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const orderedImages = [...images].sort(
    (a, b) => Number(Boolean(b.esPrincipal)) - Number(Boolean(a.esPrincipal)),
  )
  const currentIndex =
    orderedImages.length === 0
      ? 0
      : Math.min(activeIndex, orderedImages.length - 1)
  const activeImage = orderedImages[currentIndex] ?? orderedImages[0]
  const hasMultiple = orderedImages.length > 1

  const goTo = (index: number) => {
    if (orderedImages.length === 0) return
    setActiveIndex(
      ((index % orderedImages.length) + orderedImages.length) %
        orderedImages.length,
    )
  }

  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-[5rem_minmax(0,1fr)]">
      {hasMultiple && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:max-h-144 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pr-1">
          {orderedImages.map((image, index) => (
            <Button
              key={`${image.url}-${index}`}
              variant="outline"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-pressed={index === activeIndex}
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
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setLightboxOpen(true)}
            className="corner-marks group relative h-auto w-full overflow-hidden rounded-3xl border border-border/70 bg-white p-0 hover:bg-white"
            aria-label="Ampliar imagen del producto"
          >
            <ProductImage
              src={activeImage?.url ?? ""}
              alt={activeImage?.textoAlternativo ?? productName}
              className="h-96 w-full sm:h-128 lg:h-144"
              priority={currentIndex === 0}
            />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-brand-black/80 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
              <Expand className="size-4" /> Ampliar
            </span>
          </Button>

          {hasMultiple && (
            <>
              <Badge
                variant="secondary"
                className="absolute left-4 top-4 bg-background/90 backdrop-blur-sm"
              >
                {currentIndex + 1} / {orderedImages.length}
              </Badge>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                onClick={() => goTo(currentIndex - 1)}
                aria-label="Ver foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 shadow-sm backdrop-blur-sm"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                onClick={() => goTo(currentIndex + 1)}
                aria-label="Ver foto siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 shadow-sm backdrop-blur-sm"
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
          className="flex h-[92dvh] max-h-[92dvh] max-w-[calc(100%-1rem)] flex-col gap-3 overflow-hidden bg-brand-black/95 p-3 sm:max-w-6xl sm:p-5"
        >
          <DialogTitle className="sr-only">
            Galería de {productName}
          </DialogTitle>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <ProductImage
              src={activeImage?.url ?? ""}
              alt={activeImage?.textoAlternativo ?? productName}
              className="h-full w-full rounded-2xl bg-white"
            />
            {hasMultiple && (
              <>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => goTo(currentIndex - 1)}
                  aria-label="Imagen anterior"
                  className="absolute left-2 rounded-full sm:left-4"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => goTo(currentIndex + 1)}
                  aria-label="Imagen siguiente"
                  className="absolute right-2 rounded-full sm:right-4"
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
          {hasMultiple && (
            <p className="text-center text-xs text-white/70">
              {currentIndex + 1} de {orderedImages.length}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
