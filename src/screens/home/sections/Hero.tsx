'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { BannerInicio } from '@/types'

function ImagenBanner({
  banner,
  prioridad = false,
}: {
  banner: BannerInicio
  prioridad?: boolean
}) {
  return (
    <picture className="block">
      <source media="(min-width: 48rem)" srcSet={banner.imagenEscritorioUrl} />
      <img
        src={banner.imagenMovilUrl}
        alt={banner.textoAlternativo}
        className="block aspect-4/5 max-h-[70vh] w-full object-cover md:aspect-21/9"
        loading={prioridad ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={prioridad ? 'high' : 'auto'}
      />
    </picture>
  )
}

function ContenidoBanner({
  banner,
  prioridad,
}: {
  banner: BannerInicio
  prioridad?: boolean
}) {
  const imagen = <ImagenBanner banner={banner} prioridad={prioridad} />

  if (!banner.enlace.trim()) return imagen

  return (
    <a
      href={banner.enlace.trim()}
      aria-label={`Ir a: ${banner.textoAlternativo}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
    >
      {imagen}
    </a>
  )
}

/** Carrusel administrable y compacto que no desplaza la navegación del catálogo. */
export function Hero({ banners }: { banners: BannerInicio[] }) {
  const activos = banners.filter(
    (banner) =>
      banner.activo &&
      banner.imagenEscritorioUrl.trim() &&
      banner.imagenMovilUrl.trim(),
  )
  const [api, setApi] = useState<CarouselApi>()
  const [seleccionado, setSeleccionado] = useState(0)

  useEffect(() => {
    if (!api) return

    const actualizarSeleccion = () => setSeleccionado(api.selectedScrollSnap())

    actualizarSeleccion()
    api.on('select', actualizarSeleccion)
    api.on('reInit', actualizarSeleccion)

    return () => {
      api.off('select', actualizarSeleccion)
      api.off('reInit', actualizarSeleccion)
    }
  }, [api])

  useEffect(() => {
    if (!api || activos.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const intervalo = window.setInterval(() => api.scrollNext(), 7000)
    return () => window.clearInterval(intervalo)
  }, [api, activos.length])

  if (activos.length === 0) return null

  if (activos.length === 1) {
    return (
      <section aria-label="Banner principal" className="bg-brand-black">
        <ContenidoBanner banner={activos[0]} prioridad />
      </section>
    )
  }

  return (
    <section aria-label="Banners destacados" className="bg-brand-black">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="group overflow-hidden"
      >
        <CarouselContent className="ml-0">
          {activos.map((banner, index) => (
            <CarouselItem key={banner.id} className="pl-0">
              <ContenidoBanner banner={banner} prioridad={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          size="icon-sm"
          className="left-3 border-white/20 bg-brand-black/55 text-white backdrop-blur-sm hover:bg-brand-black/75 hover:text-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        />
        <CarouselNext
          size="icon-sm"
          className="right-3 border-white/20 bg-brand-black/55 text-white backdrop-blur-sm hover:bg-brand-black/75 hover:text-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        />

        <div
          className="absolute inset-x-0 bottom-3 flex justify-center gap-2"
          aria-label="Elegir banner"
        >
          {activos.map((banner, index) => (
            <Button
              key={banner.id}
              type="button"
              variant="secondary"
              size="icon-xs"
              className={cn(
                'size-2 rounded-full border-0 p-0 shadow-sm transition-all',
                index === seleccionado
                  ? 'w-6 bg-primary hover:bg-primary'
                  : 'bg-white/65 hover:bg-white',
              )}
              aria-label={`Mostrar banner ${index + 1}`}
              aria-current={index === seleccionado ? 'true' : undefined}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
