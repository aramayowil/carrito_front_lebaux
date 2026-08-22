'use client'

import { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

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

export interface LightboxProps {
  /** URLs de las imágenes, en el orden en que se navegan. */
  images: string[]
  /** Usado para el título accesible del diálogo y como alt por defecto. */
  title: string
  /** Alt por imagen; si falta alguno cae a `${title}, imagen ampliada N`. */
  alts?: string[]
  open: boolean
  /** Imagen desde la que arranca cada vez que se abre. */
  initialIndex?: number
  onOpenChange: (open: boolean) => void
  /** Se dispara cuando el usuario navega dentro del visor (swipe, flechas, puntos). */
  onIndexChange?: (index: number) => void
}

/**
 * Visor a pantalla completa: carrusel con topes (sin loop), zoom por
 * pellizco/doble toque y paneo. Es el mismo componente para cualquier
 * galería de la página (obras, productos, etc.) — cada galería solo arma
 * su propia vista previa y le delega a este el "hacer click y mostrar
 * el carrusel".
 */
export function Lightbox({
  images,
  title,
  alts,
  open,
  initialIndex = 0,
  onOpenChange,
  onIndexChange,
}: LightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [openPrevio, setOpenPrevio] = useState(open)
  const [api, setApi] = useState<CarouselApi>()
  const [zoomed, setZoomed] = useState(false)
  const zoomViewportRef = useRef<HTMLDivElement>(null)

  const maxIndex = Math.max(images.length - 1, 0)
  const selectedIndexSeguro = Math.min(selectedIndex, maxIndex)

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

  // Cada vez que se abre, arrancamos siempre desde la imagen que se clickeó.
  // El índice y el flag de zoom se ajustan acá, durante el render (no en un
  // efecto): es el patrón que React recomienda para "resetear estado cuando
  // cambia una prop", comparando contra el valor anterior guardado en
  // estado (no en un ref, que no puede leerse durante el render).
  if (open !== openPrevio) {
    setOpenPrevio(open)
    if (open) {
      setSelectedIndex(initialIndex)
      setZoomed(false)
    }
  }

  // El spring de react-spring es un sistema externo a React (no estado de
  // React), así que su reset imperativo sí vive en un efecto.
  useEffect(() => {
    if (!open) return
    springApi.start({ x: 0, y: 0, scale: 1, immediate: true })
  }, [open, springApi])

  useEffect(() => {
    if (!open || !api || images.length === 0) return
    api.scrollTo(selectedIndexSeguro, true)
  }, [api, images.length, open, selectedIndexSeguro])

  useEffect(() => {
    if (!api) return

    const updateSelection = () => {
      const index = api.selectedScrollSnap()
      setSelectedIndex(index)
      onIndexChange?.(index)
      resetearZoom()
    }

    api.on('select', updateSelection)
    return () => {
      api.off('select', updateSelection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetearZoom/onIndexChange son estables en la práctica
  }, [api])

  function toggleZoom() {
    if (zoomed) {
      resetearZoom(false)
      return
    }
    springApi.start({ x: 0, y: 0, scale: ZOOM_AMPLIADO })
    setZoomed(true)
  }

  // `target: zoomViewportRef` hace que use-gesture ate los listeners con
  // addEventListener nativo (passive: false) en vez de props sintéticas de
  // React. Sin esto, el wheel del pinch-zoom de trackpad queda pasivo: la
  // librería llama preventDefault() pero el navegador lo ignora y termina
  // zoomeando la página entera en lugar de la imagen (y tira el warning
  // "To properly support zoom on trackpads..." en consola). El ref cambia
  // de nodo en cada slide, pero el efecto interno de use-gesture reata en
  // cada render, así que sigue targeteando siempre a la imagen activa.
  useGesture(
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
      target: zoomViewportRef,
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

  if (images.length === 0) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
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
            {selectedIndexSeguro + 1} / {images.length}
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
            {images.map((image, index) => (
              <CarouselItem
                key={`${image}-lightbox-${index}`}
                className="h-dvh w-full pl-0"
              >
                <div
                  ref={
                    index === selectedIndexSeguro ? zoomViewportRef : undefined
                  }
                  onDoubleClick={toggleZoom}
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
                      alt={
                        alts?.[index] ??
                        `${title}, imagen ampliada ${index + 1}`
                      }
                      sizes={SIZES_LIGHTBOX}
                      className="pointer-events-none h-full w-full select-none"
                      imgClassName="object-contain"
                    />
                  </animated.div>
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
          {!zoomed
            ? 'Deslizá para recorrer · Usá dos dedos o doble toque para ampliar'
            : 'Desplazá la imagen para explorar sus detalles'}
        </p>

        {images.length > 1 && (
          <div
            className="absolute right-4 bottom-10 left-4 z-20 flex items-center justify-center gap-2 sm:bottom-12"
            aria-label="Seleccionar imagen ampliada"
          >
            {images.map((_, index) => (
              <button
                key={`lightbox-indicator-${index}`}
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
  )
}
