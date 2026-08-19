'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Expand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { ProductImage } from '@/components/media/ProductImage'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ImagenProducto } from '@/types'

interface ProductGalleryProps {
  images: ImagenProducto[]
  productName: string
}

/**
 * Scroller horizontal con scroll-snap nativo del navegador: sin librería de
 * carrusel y sin manejo de gestos propio. El navegador ya sabe hacer drag,
 * inercia y touch mejor que cualquier JS que le pongamos encima, así que
 * dejamos que lo haga él — esto es lo que evita de raíz la clase de bug que
 * tuvimos (dos sistemas de pointer-events distintos compitiendo por el mismo
 * click). `selectedIndex` se deriva siempre del `scrollLeft` real, nunca al
 * revés, para que swipe, flechas y miniaturas queden consistentes entre sí.
 */
function useSnapCarousel(
  containerRef: React.RefObject<HTMLDivElement | null>,
  itemCount: number,
) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el || itemCount === 0) return

    let frame = 0
    const updateIndex = () => {
      const width = el.clientWidth
      if (!width) return
      const raw = Math.round(el.scrollLeft / width)
      const clamped = Math.min(Math.max(raw, 0), itemCount - 1)
      setSelectedIndex((prev) => (prev === clamped ? prev : clamped))
    }

    updateIndex()

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateIndex)
    }
    el.addEventListener('scroll', onScroll, { passive: true })

    // Si el contenedor cambia de tamaño (resize, cambio de orientación),
    // recalculamos el índice mostrado a partir del scroll real.
    const resizeObserver = new ResizeObserver(updateIndex)
    resizeObserver.observe(el)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      resizeObserver.disconnect()
    }
  }, [containerRef, itemCount])

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const el = containerRef.current
      if (!el || itemCount === 0) return
      const clamped = Math.min(Math.max(index, 0), itemCount - 1)
      el.scrollTo({ left: clamped * el.clientWidth, behavior })
    },
    [containerRef, itemCount],
  )

  return {
    selectedIndex,
    scrollToIndex,
    canScrollPrev: selectedIndex > 0,
    canScrollNext: selectedIndex < itemCount - 1,
  }
}

interface GalleryArrowButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
  ariaLabel: string
  className?: string
  iconClassName?: string
}

/**
 * <button> nativo a propósito, no el <Button> de @/components/ui/button: ver
 * la nota en AGENTS.md sobre controles que viven encima de una superficie
 * con scroll/drag propio.
 */
function GalleryArrowButton({
  direction,
  onClick,
  disabled,
  ariaLabel,
  className,
  iconClassName,
}: GalleryArrowButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'absolute inline-flex touch-manipulation items-center justify-center rounded-full transition-all disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
    >
      <Icon className={cn('size-4', iconClassName)} />
    </button>
  )
}

/** Galería responsive con miniaturas laterales y visor ampliado deslizable. */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null)

  const orderedImages = useMemo(
    () =>
      [...images].sort(
        (a, b) =>
          Number(Boolean(b.esPrincipal)) - Number(Boolean(a.esPrincipal)),
      ),
    [images],
  )
  const hasMultiple = orderedImages.length > 1
  const itemCount = orderedImages.length

  // Estilo Mercado Libre: hasta 7 miniaturas normales; si hay más, aparece
  // un 8vo casillero mostrando esa imagen oscurecida con "+N" (las que
  // quedan más allá de esas 8). Con exactamente 8 no tiene sentido mostrar
  // "+0", así que ahí se muestran las 8 normales.
  const MAX_VISIBLE_THUMBNAILS = 7
  const thumbnailsToRender =
    orderedImages.length > MAX_VISIBLE_THUMBNAILS
      ? orderedImages.slice(0, MAX_VISIBLE_THUMBNAILS + 1)
      : orderedImages
  const overflowCount =
    orderedImages.length > MAX_VISIBLE_THUMBNAILS + 1
      ? orderedImages.length - (MAX_VISIBLE_THUMBNAILS + 1)
      : 0

  const mainContainerRef = useRef<HTMLDivElement>(null)
  const lightboxContainerRef = useRef<HTMLDivElement>(null)
  const main = useSnapCarousel(mainContainerRef, itemCount)
  const lightbox = useSnapCarousel(lightboxContainerRef, itemCount)

  // Mientras el lightbox está abierto es el único con el que el usuario
  // puede interactuar (el diálogo bloquea el resto de la página), así que el
  // índice que se muestra en las miniaturas y en el badge es siempre el del
  // carrusel activo en cada momento.
  const currentIndex = lightboxOpen
    ? lightbox.selectedIndex
    : main.selectedIndex

  // Índice al que hay que saltar apenas el contenedor del lightbox exista en
  // el DOM (se abre recién cuando el <Dialog> monta su contenido). No usamos
  // `main.selectedIndex` directamente para esto: si el usuario abrió desde
  // el casillero "+N" de miniaturas, la vista principal puede seguir
  // mostrando otra imagen, y necesitamos el índice exacto que se pidió. Es
  // una ref (no estado) porque solo se lee/escribe fuera del render —en un
  // handler de click y dentro de un efecto— y no debe disparar un re-render
  // por sí sola.
  const pendingLightboxIndexRef = useRef<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    pendingLightboxIndexRef.current = index
    setZoomedImageIndex(null)
    setLightboxOpen(true)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const index = pendingLightboxIndexRef.current
    if (index === null) return
    lightbox.scrollToIndex(index, 'instant')
    pendingLightboxIndexRef.current = null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen])

  // Al cerrar el lightbox, llevamos la vista principal a donde haya quedado
  // el usuario navegando adentro, para que no "salte" para atrás.
  useEffect(() => {
    if (lightboxOpen) return
    main.scrollToIndex(lightbox.selectedIndex, 'instant')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen])

  const goToThumbnail = useCallback(
    (index: number) => {
      if (lightboxOpen) {
        lightbox.scrollToIndex(index)
      } else {
        main.scrollToIndex(index)
      }
    },
    [lightboxOpen, lightbox, main],
  )

  const handleKeyDown = useCallback(
    (
      carousel: Pick<
        ReturnType<typeof useSnapCarousel>,
        'selectedIndex' | 'scrollToIndex'
      >,
    ) =>
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          carousel.scrollToIndex(carousel.selectedIndex - 1)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          carousel.scrollToIndex(carousel.selectedIndex + 1)
        }
      },
    [],
  )

  if (orderedImages.length === 0) {
    return (
      <div className="corner-marks relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-white">
        <ProductImage src="" alt={productName} className="h-full w-full" />
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-[5rem_minmax(0,1fr)]">
      {hasMultiple && (
        <div className="hidden md:flex md:max-h-144 md:flex-col md:gap-2 md:overflow-y-auto md:pr-1">
          {thumbnailsToRender.map((image, index) => {
            const isOverflowSlot =
              overflowCount > 0 && index === MAX_VISIBLE_THUMBNAILS

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() =>
                  isOverflowSlot ? openLightbox(index) : goToThumbnail(index)
                }
                aria-label={
                  isOverflowSlot
                    ? `Ver ${overflowCount} fotos más`
                    : `Ver imagen ${index + 1}`
                }
                aria-pressed={!isOverflowSlot && index === currentIndex}
                className={cn(
                  'relative size-18 shrink-0 touch-manipulation overflow-hidden rounded-xl border bg-white p-1 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30',
                  !isOverflowSlot && index === currentIndex
                    ? 'border-primary ring-2 ring-primary/25'
                    : 'border-border/70 hover:border-primary/50',
                )}
              >
                <ProductImage
                  src={image.url}
                  alt={image.textoAlternativo}
                  className="h-full w-full rounded-xl bg-white"
                  imgClassName="object-cover"
                />
                {isOverflowSlot && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 text-sm font-semibold text-white">
                    +{overflowCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div
        className={cn(
          'order-1 min-w-0 md:order-2',
          !hasMultiple && 'md:col-span-2',
        )}
      >
        <div
          className="corner-marks relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-white"
          onKeyDownCapture={handleKeyDown(main)}
        >
          <div
            ref={mainContainerRef}
            role="region"
            aria-roledescription="carousel"
            className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {orderedImages.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                role="group"
                aria-roledescription="slide"
                className="w-full shrink-0 snap-start"
              >
                <ProductImage
                  src={image.url}
                  alt={image.textoAlternativo ?? productName}
                  className="h-full w-full"
                  // Fijo a index 0, no al índice reactivo: `priority` le dice
                  // a Next qué imagen pintar como `loading="eager"` en la
                  // carga inicial de la página (LCP). Solo el primer slide es
                  // candidato real a LCP.
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {hasMultiple && (
            <>
              <GalleryArrowButton
                direction="prev"
                onClick={() => main.scrollToIndex(main.selectedIndex - 1)}
                disabled={!main.canScrollPrev}
                ariaLabel="Ver foto anterior"
                className="left-3 top-1/2 z-20 hidden size-7 -translate-y-1/2 bg-background/90 shadow-sm backdrop-blur-sm hover:bg-muted md:inline-flex"
              />
              <GalleryArrowButton
                direction="next"
                onClick={() => main.scrollToIndex(main.selectedIndex + 1)}
                disabled={!main.canScrollNext}
                ariaLabel="Ver foto siguiente"
                className="right-3 top-1/2 z-20 hidden size-7 -translate-y-1/2 bg-background/90 shadow-sm backdrop-blur-sm hover:bg-muted md:inline-flex"
              />
            </>
          )}

          <button
            type="button"
            onClick={() => openLightbox(main.selectedIndex)}
            className="absolute bottom-4 right-4 z-20 inline-flex h-9 touch-manipulation items-center justify-center gap-1.5 rounded-full border border-white/10 bg-brand-black/85 px-3 text-xs font-medium text-white shadow-sm outline-none backdrop-blur-sm transition-colors hover:bg-brand-black focus-visible:ring-3 focus-visible:ring-ring/40"
            aria-label="Ampliar imagen del producto"
          >
            <Expand className="size-4" />
            Ampliar
          </button>

          {hasMultiple && (
            <Badge
              variant="secondary"
              className="absolute left-4 top-4 z-10 bg-background/90 backdrop-blur-sm"
            >
              {main.selectedIndex + 1} / {orderedImages.length}
            </Badge>
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
                {lightbox.selectedIndex + 1} / {orderedImages.length}
              </Badge>
            )}
          </div>

          <div
            className="relative min-h-0 flex-1 overflow-hidden"
            onKeyDownCapture={handleKeyDown(lightbox)}
          >
            <div
              ref={lightboxContainerRef}
              role="region"
              aria-roledescription="carousel"
              className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {orderedImages.map((image, index) => (
                <div
                  key={`ampliada-${image.url}-${index}`}
                  role="group"
                  aria-roledescription="slide"
                  className="h-full w-full shrink-0 snap-start"
                >
                  <div className="h-full min-h-0 overflow-auto">
                    <div
                      className={cn(
                        'flex min-h-full min-w-full items-center justify-center p-2 transition-[width,height] duration-200 sm:p-5',
                        zoomedImageIndex === index
                          ? 'h-[160%] w-[160%]'
                          : 'h-full w-full',
                      )}
                    >
                      <ProductImage
                        src={image.url}
                        alt={image.textoAlternativo || productName}
                        className="h-full w-full select-none rounded-2xl bg-white/5"
                        sizes="96vw"
                        priority={index === lightbox.selectedIndex}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setZoomedImageIndex((current) =>
                  current === lightbox.selectedIndex
                    ? null
                    : lightbox.selectedIndex,
                )
              }
              className="absolute bottom-3 right-3 z-30 inline-flex h-9 touch-manipulation items-center justify-center gap-1.5 rounded-full border border-white/15 bg-brand-black/80 px-3 text-xs font-medium text-white outline-none backdrop-blur-sm transition-colors hover:bg-brand-black focus-visible:ring-3 focus-visible:ring-white/30 sm:bottom-5 sm:right-5"
              aria-label={
                zoomedImageIndex === lightbox.selectedIndex
                  ? 'Alejar imagen'
                  : 'Acercar imagen'
              }
              aria-pressed={zoomedImageIndex === lightbox.selectedIndex}
            >
              {zoomedImageIndex === lightbox.selectedIndex ? (
                <ZoomOut className="size-4" />
              ) : (
                <ZoomIn className="size-4" />
              )}
              {zoomedImageIndex === lightbox.selectedIndex ? 'Alejar' : 'Zoom'}
            </button>

            {hasMultiple && (
              <>
                <GalleryArrowButton
                  direction="prev"
                  onClick={() =>
                    lightbox.scrollToIndex(lightbox.selectedIndex - 1)
                  }
                  disabled={!lightbox.canScrollPrev}
                  ariaLabel="Imagen anterior"
                  iconClassName="size-5"
                  className="left-3 top-1/2 z-30 hidden size-9 -translate-y-1/2 bg-white/90 text-brand-black shadow-md hover:bg-white disabled:opacity-30 sm:left-5 md:inline-flex"
                />
                <GalleryArrowButton
                  direction="next"
                  onClick={() =>
                    lightbox.scrollToIndex(lightbox.selectedIndex + 1)
                  }
                  disabled={!lightbox.canScrollNext}
                  ariaLabel="Imagen siguiente"
                  iconClassName="size-5"
                  className="right-3 top-1/2 z-30 hidden size-9 -translate-y-1/2 bg-white/90 text-brand-black shadow-md hover:bg-white disabled:opacity-30 sm:right-5 md:inline-flex"
                />
              </>
            )}
          </div>

          {hasMultiple && (
            <div className="hidden shrink-0 border-t border-white/10 px-3 py-3 sm:px-5 md:block">
              <div className="flex snap-x gap-2 overflow-x-auto pb-1">
                {orderedImages.map((image, index) => (
                  <button
                    key={`miniatura-ampliada-${image.url}-${index}`}
                    type="button"
                    onClick={() => lightbox.scrollToIndex(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                    aria-pressed={index === lightbox.selectedIndex}
                    className={cn(
                      'size-14 shrink-0 snap-start touch-manipulation overflow-hidden rounded-xl border p-1 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-white/30 sm:size-16',
                      index === lightbox.selectedIndex
                        ? 'border-white bg-white/15 ring-2 ring-white/25'
                        : 'border-white/15 bg-white/5 hover:bg-white/10',
                    )}
                  >
                    <ProductImage
                      src={image.url}
                      alt={image.textoAlternativo || productName}
                      className="h-full w-full rounded-lg bg-white"
                      imgClassName="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
