"use client"

import { useEffect, useMemo, useState } from "react"
import { ZoomIn } from "lucide-react"

import { Lightbox } from "@/components/media/Lightbox"
import { ProductImage } from "@/components/media/ProductImage"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { ImagenProducto } from "@/types"

interface ProductGalleryProps {
  images: ImagenProducto[]
  productName: string
}

const MAX_MINIATURAS_DESKTOP = 6
const MINIATURAS_SIN_RESUMEN = MAX_MINIATURAS_DESKTOP - 1

/** Galería de producto: selector estático desktop, carrusel mobile y visor inmersivo compartido. */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const orderedImages = useMemo(
    () =>
      [...images].sort(
        (a, b) =>
          Number(Boolean(b.esPrincipal)) - Number(Boolean(a.esPrincipal)),
      ),
    [images],
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [mobileApi, setMobileApi] = useState<CarouselApi>()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const maxIndex = Math.max(orderedImages.length - 1, 0)
  const selectedIndexSeguro = Math.min(selectedIndex, maxIndex)
  const mobileIndexSeguro = Math.min(mobileIndex, maxIndex)

  const hasMultiple = orderedImages.length > 1
  const hasThumbnailOverflow = orderedImages.length > MAX_MINIATURAS_DESKTOP
  const desktopThumbnails = orderedImages.slice(0, MAX_MINIATURAS_DESKTOP)
  const remainingImages = Math.max(
    0,
    orderedImages.length - MINIATURAS_SIN_RESUMEN,
  )
  const selectedImage = orderedImages[selectedIndexSeguro]

  useEffect(() => {
    if (!mobileApi) return

    const updateSelection = () => {
      setMobileIndex(mobileApi.selectedScrollSnap())
    }

    updateSelection()
    mobileApi.on("select", updateSelection)
    mobileApi.on("reInit", updateSelection)

    return () => {
      mobileApi.off("select", updateSelection)
      mobileApi.off("reInit", updateSelection)
    }
  }, [mobileApi])

  function openAt(index: number) {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  if (orderedImages.length === 0) {
    return (
      <div className="corner-marks relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-white">
        <ProductImage src="" alt={productName} className="h-full w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="hidden min-w-0 gap-3 lg:grid lg:grid-cols-[4.5rem_minmax(0,1fr)]">
        {hasMultiple && (
          <div className="flex max-h-full flex-col gap-2 overflow-y-auto pr-1">
            {desktopThumbnails.map((image, index) => {
              const isOverflowTrigger =
                hasThumbnailOverflow && index === MAX_MINIATURAS_DESKTOP - 1
              const selected = selectedIndexSeguro === index && !isOverflowTrigger

              return (
                <button
                  key={`${image.url}-thumbnail-${index}`}
                  type="button"
                  onClick={() =>
                    isOverflowTrigger ? openAt(index) : setSelectedIndex(index)
                  }
                  className={cn(
                    "relative aspect-square w-full shrink-0 touch-manipulation overflow-hidden rounded-xl border bg-white p-1 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                    selected
                      ? "border-primary ring-2 ring-primary/25"
                      : "border-border/70 hover:border-primary/50",
                  )}
                  aria-label={
                    isOverflowTrigger
                      ? `Ver ${remainingImages} imágenes más`
                      : `Mostrar imagen ${index + 1} de ${productName}`
                  }
                  aria-pressed={selected}
                >
                  <ProductImage
                    src={image.url}
                    alt={image.textoAlternativo || productName}
                    className="h-full w-full rounded-lg bg-white"
                    imgClassName="object-cover"
                    sizes="4.5rem"
                  />

                  {isOverflowTrigger && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-brand-black/60 text-lg font-semibold text-white backdrop-blur-[0.0625rem]">
                      +{remainingImages}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => openAt(selectedIndexSeguro)}
          className={cn(
            "relative aspect-square min-w-0 cursor-zoom-in overflow-hidden rounded-2xl border border-border/70 bg-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
            !hasMultiple && "lg:col-span-2",
          )}
          aria-label={`Ampliar ${productName}, imagen ${selectedIndexSeguro + 1}`}
        >
          <ProductImage
            src={selectedImage.url}
            alt={selectedImage.textoAlternativo || productName}
            className="h-full w-full"
            sizes="50vw"
            priority
          />
        </button>
      </div>

      <Carousel
        opts={{ align: "start", loop: false }}
        setApi={setMobileApi}
        className="w-full lg:hidden"
        aria-label={`Imágenes de ${productName}`}
      >
        <CarouselContent>
          {orderedImages.map((image, index) => (
            <CarouselItem key={`${image.url}-mobile-${index}`}>
              <button
                type="button"
                onClick={() => openAt(index)}
                className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border/70 bg-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                aria-label={`Ampliar ${productName}, imagen ${index + 1}`}
              >
                <ProductImage
                  src={image.url}
                  alt={image.textoAlternativo || productName}
                  className="h-full w-full"
                  sizes="(max-width: 64rem) calc(100vw - 2rem), 50vw"
                  priority={index === 0}
                />
                <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-brand-black/75 text-white backdrop-blur-sm">
                  <ZoomIn className="size-4" aria-hidden="true" />
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {hasMultiple && (
        <div
          className="mt-4 flex items-center justify-center gap-2 lg:hidden"
          aria-label="Seleccionar imagen"
        >
          {orderedImages.map((_, index) => (
            <button
              key={`mobile-indicator-${index}`}
              type="button"
              onClick={() => mobileApi?.scrollTo(index)}
              className={cn(
                "size-2 rounded-full transition-[width,background-color] duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                mobileIndexSeguro === index ? "w-6 bg-primary" : "bg-border",
              )}
              aria-label={`Ir a la imagen ${index + 1}`}
              aria-current={mobileIndexSeguro === index ? "true" : undefined}
            />
          ))}
        </div>
      )}

      <Lightbox
        images={orderedImages.map((image) => image.url)}
        alts={orderedImages.map((image) => image.textoAlternativo || productName)}
        title={productName}
        open={lightboxOpen}
        initialIndex={selectedIndexSeguro}
        onOpenChange={setLightboxOpen}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}
