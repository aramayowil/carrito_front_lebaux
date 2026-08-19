"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { X, ZoomIn } from "lucide-react"
import Image from "next/image"

import { ProductImage } from "@/components/media/ProductImage"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ImagenProducto } from "@/types"

interface ProductGalleryProps {
  images: ImagenProducto[]
  productName: string
}

const MAX_MINIATURAS_DESKTOP = 6
const MINIATURAS_SIN_RESUMEN = MAX_MINIATURAS_DESKTOP - 1
const ZOOM_AMPLIADO = 2.25

/** Galería de producto: selector estático desktop, carrusel mobile y visor inmersivo. */
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
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const zoomViewportRef = useRef<HTMLDivElement>(null)
  const lastTouchRef = useRef(0)

  const hasMultiple = orderedImages.length > 1
  const hasThumbnailOverflow = orderedImages.length > MAX_MINIATURAS_DESKTOP
  const desktopThumbnails = orderedImages.slice(0, MAX_MINIATURAS_DESKTOP)
  const remainingImages = Math.max(
    0,
    orderedImages.length - MINIATURAS_SIN_RESUMEN,
  )
  const selectedImage = orderedImages[selectedIndex]

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

  useEffect(() => {
    if (!lightboxOpen || !lightboxApi) return
    lightboxApi.scrollTo(selectedIndex, true)
  }, [lightboxApi, lightboxOpen, selectedIndex])

  useEffect(() => {
    if (!lightboxApi) return

    const updateSelection = () => {
      setSelectedIndex(lightboxApi.selectedScrollSnap())
      setZoom(1)
    }

    lightboxApi.on("select", updateSelection)
    return () => {
      lightboxApi.off("select", updateSelection)
    }
  }, [lightboxApi])

  useEffect(() => {
    if (zoom === 1) return

    const frame = requestAnimationFrame(() => {
      const viewport = zoomViewportRef.current
      if (!viewport) return
      viewport.scrollTo({
        left: (viewport.scrollWidth - viewport.clientWidth) / 2,
        top: (viewport.scrollHeight - viewport.clientHeight) / 2,
        behavior: "smooth",
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [zoom])

  function openAt(index: number) {
    setSelectedIndex(index)
    setZoom(1)
    setLightboxOpen(true)
  }

  function toggleZoom() {
    setZoom((current) => (current === 1 ? ZOOM_AMPLIADO : 1))
  }

  function handleTouchEnd() {
    const now = Date.now()
    if (now - lastTouchRef.current < 300) toggleZoom()
    lastTouchRef.current = now
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
              const selected = selectedIndex === index && !isOverflowTrigger

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
          onClick={() => openAt(selectedIndex)}
          className={cn(
            "relative aspect-square min-w-0 cursor-zoom-in overflow-hidden rounded-2xl border border-border/70 bg-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
            !hasMultiple && "lg:col-span-2",
          )}
          aria-label={`Ampliar ${productName}, imagen ${selectedIndex + 1}`}
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
                mobileIndex === index ? "w-6 bg-primary" : "bg-border",
              )}
              aria-label={`Ir a la imagen ${index + 1}`}
              aria-current={mobileIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      )}

      <Dialog
        open={lightboxOpen}
        onOpenChange={(open) => {
          setLightboxOpen(open)
          if (!open) setZoom(1)
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 left-0 top-0 h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-brand-black/90 p-0 text-white shadow-none ring-0 supports-backdrop-filter:backdrop-blur-sm sm:max-w-none sm:rounded-none"
        >
          <DialogTitle className="sr-only">
            Galería de {productName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Navegá entre las imágenes y ampliá la fotografía seleccionada.
          </DialogDescription>

          <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
            <p className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
              {selectedIndex + 1} / {orderedImages.length}
            </p>

            <DialogClose
              render={
                <button
                  type="button"
                  className="inline-flex size-10 touch-manipulation items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/50"
                />
              }
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Cerrar galería</span>
            </DialogClose>
          </div>

          <Carousel
            setApi={setLightboxApi}
            opts={{ loop: false, watchDrag: zoom === 1 }}
            className="flex h-dvh w-full items-center"
          >
            <CarouselContent className="ml-0 h-dvh w-full">
              {orderedImages.map((image, index) => (
                <CarouselItem
                  key={`${image.url}-lightbox-${index}`}
                  className="h-dvh w-full pl-0"
                >
                  <div
                    ref={index === selectedIndex ? zoomViewportRef : undefined}
                    onDoubleClick={toggleZoom}
                    onTouchMove={() => {
                      lastTouchRef.current = 0
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
                        src={image.url}
                        alt={image.textoAlternativo || productName}
                        width={1400}
                        height={1400}
                        sizes="(max-width: 64rem) 100vw, 60vw"
                        priority={index === selectedIndex}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {hasMultiple && (
              <>
                <CarouselPrevious className="left-4 hidden size-11 border-white/10 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 sm:flex" />
                <CarouselNext className="right-4 hidden size-11 border-white/10 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 sm:flex" />
              </>
            )}
          </Carousel>

          <p className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 text-center text-xs text-white/50 sm:bottom-6">
            {zoom === 1
              ? "Deslizá para recorrer · Doble toque para ampliar"
              : "Desplazá la imagen para explorar sus detalles"}
          </p>

          {hasMultiple && (
            <div
              className="absolute bottom-10 left-4 right-4 z-20 flex items-center justify-center gap-2 sm:bottom-12"
              aria-label="Seleccionar imagen ampliada"
            >
              {orderedImages.map((_, index) => (
                <button
                  key={`lightbox-indicator-${index}`}
                  type="button"
                  onClick={() => lightboxApi?.scrollTo(index)}
                  className={cn(
                    "size-2 rounded-full transition-[width,background-color] duration-300 outline-none focus-visible:ring-3 focus-visible:ring-primary/50",
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
  )
}
