'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { ImageOff, X, ZoomIn, ZoomOut } from 'lucide-react'

import { ProductImage } from '@/components/media/ProductImage'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const ZOOM_AMPLIADO = 2.25
const ZOOM_MAXIMO = 4
const ZOOM_ASENTADO = 1.05
const SPRING_CONFIG = { tension: 300, friction: 30 }

const SIZES_PREVIEW_MOBILE = '(max-width: 1023px) 100vw, 50vw'
const SIZES_PREVIEW_DESKTOP_PRINCIPAL = '(max-width: 1023px) 100vw, 60vw'
const SIZES_PREVIEW_DESKTOP_SECUNDARIA = '(max-width: 1023px) 100vw, 30vw'
const SIZES_LIGHTBOX = '(max-width: 767px) 100vw, 90vw'

function limitarValor(valor: number, min: number, max: number) {
  return Math.min(max, Math.max(min, valor))
}

/**
 * Cuánto se le permite desplazar (paneo) a la imagen ampliada en cada eje
 * antes de que el rubber-band de use-gesture empiece a frenarla. Con la
 * imagen centrada, el margen disponible es la mitad del sobrante que deja
 * el zoom respecto del contenedor.
 */
function calcularLimitesDePaneo(escala: number, el: HTMLDivElement | null) {
  if (!el || escala <= 1) return { x: 0, y: 0 }
  const { width, height } = el.getBoundingClientRect()
  return {
    x: (width * (escala - 1)) / 2,
    y: (height * (escala - 1)) / 2,
  }
}

/** Galería responsive con lightbox, carrusel y zoom sobre la imagen activa. */
export function WorkGalleryLightbox({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const galleryImages = useMemo(() => {
    const unicas = new Set<string>()
    for (const image of Array.isArray(images) ? images : []) {
      if (typeof image !== 'string') continue
      const fuente = image.trim()
      if (fuente) unicas.add(fuente)
    }
    return [...unicas]
  }, [images])

  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState(0)
  // Índices "seguros": si la galería encoge (p. ej. cambia `images` desde
  // afuera) el estado puede quedar apuntando a una posición que ya no
  // existe. En vez de sincronizarlo con un efecto (setState en el cuerpo
  // de un efecto dispara un render en cascada), lo derivamos acá mismo.
  const maxIndex = Math.max(galleryImages.length - 1, 0)
  const selectedIndexSeguro = Math.min(selectedIndex, maxIndex)
  const previewIndexSeguro = Math.min(previewIndex, maxIndex)
  const [previewApi, setPreviewApi] = useState<CarouselApi>()
  const [api, setApi] = useState<CarouselApi>()
  const [zoomed, setZoomed] = useState(false)
  const zoomViewportRef = useRef<HTMLDivElement>(null)

  // Posición y escala de la imagen ampliada. Un solo spring para la imagen
  // seleccionada: use-gesture escribe acá durante el gesto (pellizco/paneo)
  // y react-spring anima los saltos discretos (reset, toggle de zoom).
  const [{ x, y, scale }, springApi] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: SPRING_CONFIG,
  }))

  function resetearZoom(inmediato = true) {
    springApi.start({ x: 0, y: 0, scale: 1, immediate: inmediato })
    setZoomed(false)
  }

  useEffect(() => {
    if (!previewApi) return

    const updatePreviewSelection = () => {
      setPreviewIndex(previewApi.selectedScrollSnap())
    }

    updatePreviewSelection()
    previewApi.on('select', updatePreviewSelection)
    previewApi.on('reInit', updatePreviewSelection)

    return () => {
      previewApi.off('select', updatePreviewSelection)
      previewApi.off('reInit', updatePreviewSelection)
    }
  }, [previewApi])

  useEffect(() => {
    if (!open || !api || galleryImages.length === 0) return
    api.scrollTo(selectedIndexSeguro, true)
  }, [api, galleryImages.length, open, selectedIndexSeguro])

  useEffect(() => {
    if (!api) return

    const updateSelection = () => {
      setSelectedIndex(api.selectedScrollSnap())
      resetearZoom()
    }

    api.on('select', updateSelection)
    return () => {
      api.off('select', updateSelection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetearZoom es estable en la práctica (solo usa springApi/setZoomed)
  }, [api])

  function openAt(index: number) {
    if (!galleryImages[index]) return
    setSelectedIndex(index)
    resetearZoom()
    setOpen(true)
  }

  function toggleZoom() {
    if (zoomed) {
      resetearZoom(false)
      return
    }
    springApi.start({ x: 0, y: 0, scale: ZOOM_AMPLIADO })
    setZoomed(true)
  }

  const bind = useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [ox, oy] }) => {
        if (pinching) return cancel()
        springApi.start({ x: ox, y: oy, immediate: true })
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [escalaRelativa],
        offset: [escalaAbsoluta],
        memo,
      }) => {
        if (first) {
          const rect = zoomViewportRef.current?.getBoundingClientRect()
          const centroX = rect ? rect.x + rect.width / 2 : ox
          const centroY = rect ? rect.y + rect.height / 2 : oy
          memo = {
            xInicial: x.get(),
            yInicial: y.get(),
            distanciaAlCentroX: ox - centroX,
            distanciaAlCentroY: oy - centroY,
          }
        }

        const nuevaEscala = limitarValor(escalaAbsoluta, 1, ZOOM_MAXIMO)
        springApi.start({
          scale: nuevaEscala,
          x: memo.xInicial - (escalaRelativa - 1) * memo.distanciaAlCentroX,
          y: memo.yInicial - (escalaRelativa - 1) * memo.distanciaAlCentroY,
          immediate: true,
        })
        setZoomed(nuevaEscala > ZOOM_ASENTADO)

        return memo
      },
      onPinchEnd: ({ offset: [escalaAbsoluta] }) => {
        const seAsienta = escalaAbsoluta <= ZOOM_ASENTADO
        const escalaFinal = seAsienta ? 1 : escalaAbsoluta
        const limites = calcularLimitesDePaneo(
          escalaFinal,
          zoomViewportRef.current,
        )

        springApi.start({
          scale: escalaFinal,
          x: limitarValor(x.get(), -limites.x, limites.x),
          y: limitarValor(y.get(), -limites.y, limites.y),
        })
        setZoomed(!seAsienta)
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: () => {
          const limites = calcularLimitesDePaneo(
            scale.get(),
            zoomViewportRef.current,
          )
          return {
            left: -limites.x,
            right: limites.x,
            top: -limites.y,
            bottom: limites.y,
          }
        },
        rubberband: true,
        decay: true,
        enabled: zoomed,
      },
      pinch: {
        scaleBounds: { min: 1, max: ZOOM_MAXIMO },
        rubberband: true,
      },
    },
  )

  if (galleryImages.length === 0) {
    return (
      <div className="works-reveal-media flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-xl bg-muted text-muted-foreground">
        <ImageOff className="size-9" aria-hidden="true" />
        <p className="px-4 text-center text-sm">
          No hay imágenes disponibles para esta obra.
        </p>
      </div>
    )
  }

  return (
    <>
      <Carousel
        opts={{ align: 'start', loop: galleryImages.length > 1 }}
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
                'size-2 rounded-full transition-[width,background-color] duration-300 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
                previewIndexSeguro === index ? 'w-6 bg-primary' : 'bg-border',
              )}
              aria-label={`Ir a la imagen ${index + 1}`}
              aria-current={previewIndexSeguro === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'hidden gap-4 lg:grid',
          galleryImages.length === 1
            ? 'lg:aspect-video lg:grid-cols-1 lg:grid-rows-1'
            : 'lg:aspect-[16/7] lg:grid-cols-[1.35fr_0.65fr] lg:grid-rows-2',
        )}
      >
        {galleryImages.slice(0, 3).map((image, index) => (
          <button
            key={`${image}-preview-desktop-${index}`}
            type="button"
            onClick={() => openAt(index)}
            className={cn(
              'group relative h-full w-full overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
              index === 0 && galleryImages.length > 1 && 'row-span-2',
              index === 1 && galleryImages.length === 2 && 'row-span-2',
              index === 0 ? 'works-reveal-media' : 'works-reveal-soft',
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

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) resetearZoom()
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 top-0 left-0 h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 gap-0 overscroll-none rounded-none border-0 bg-brand-black/90 p-0 text-white shadow-none ring-0 supports-backdrop-filter:backdrop-blur-sm sm:max-w-none sm:rounded-none"
        >
          <DialogTitle className="sr-only">Galería de {title}</DialogTitle>
          <DialogDescription className="sr-only">
            Navegá entre las imágenes y ampliá la fotografía seleccionada.
          </DialogDescription>

          <div className="absolute top-4 right-4 left-4 z-20 flex items-center justify-between gap-3 sm:top-6 sm:right-6 sm:left-6">
            <p className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
              {selectedIndexSeguro + 1} / {galleryImages.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleZoom}
                className="inline-flex size-10 touch-manipulation items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:outline-none"
                aria-label={zoomed ? 'Reducir imagen' : 'Ampliar imagen'}
              >
                {!zoomed ? (
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
            opts={{
              loop: false,
              watchDrag: !zoomed,
            }}
            className="h-dvh w-full"
          >
            <CarouselContent className="ml-0 h-dvh w-full">
              {galleryImages.map((image, index) => (
                <CarouselItem
                  key={`${image}-modal-${index}`}
                  className="h-dvh w-full pl-0"
                >
                  <div
                    ref={
                      index === selectedIndexSeguro
                        ? zoomViewportRef
                        : undefined
                    }
                    onDoubleClick={toggleZoom}
                    {...(index === selectedIndexSeguro ? bind() : {})}
                    className={cn(
                      'h-full w-full touch-none overscroll-contain select-none',
                      zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in',
                    )}
                  >
                    <animated.div
                      className="h-full w-full"
                      style={
                        index === selectedIndexSeguro
                          ? { x, y, scale }
                          : undefined
                      }
                    >
                      <ProductImage
                        src={image}
                        alt={`${title}, imagen ampliada ${index + 1}`}
                        sizes={SIZES_LIGHTBOX}
                        className="pointer-events-none h-full w-full select-none"
                        imgClassName="object-contain"
                      />
                    </animated.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {galleryImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4 hidden size-11 border-white/10 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 sm:flex" />
                <CarouselNext className="right-4 hidden size-11 border-white/10 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 sm:flex" />
              </>
            )}
          </Carousel>

          <p className="pointer-events-none absolute right-4 bottom-4 left-4 z-20 text-center text-xs text-white/50 sm:bottom-6">
            {!zoomed
              ? 'Deslizá para recorrer · Usá dos dedos o doble toque para ampliar'
              : 'Desplazá la imagen para explorar sus detalles'}
          </p>

          {galleryImages.length > 1 && (
            <div
              className="absolute right-4 bottom-10 left-4 z-20 flex items-center justify-center gap-2 sm:bottom-12"
              aria-label="Seleccionar imagen ampliada"
            >
              {galleryImages.map((_, index) => (
                <button
                  key={`modal-indicator-${index}`}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    'size-2 rounded-full transition-[width,background-color] duration-300 focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:outline-none',
                    selectedIndexSeguro === index
                      ? 'w-6 bg-primary'
                      : 'bg-white/35',
                  )}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  aria-current={
                    selectedIndexSeguro === index ? 'true' : undefined
                  }
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
