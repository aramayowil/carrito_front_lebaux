import { CalendarDays, Clock, ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'

import { BackToTopButton } from '@/components/layout/BackToTopButton'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/button'
import { obtenerUrlGoogleMaps, obtenerUrlMapaEmbebido } from '@/lib/google-maps'
import {
  IconoRedSocial,
  obtenerDatosRedSocial,
} from '@/components/ui/icons/social-icons'
import type {
  ConfiguracionSitio,
  LineaProducto,
  TipologiaProducto,
} from '@/types'

const COPYRIGHT_YEAR = '2026'

/** Pie global renderizado en servidor. Solo el botón de volver arriba hidrata JS. */
export function Footer({
  sitio,
  lineas,
  tipologias,
}: {
  sitio: ConfiguracionSitio
  lineas: LineaProducto[]
  tipologias: TipologiaProducto[]
}) {
  const { contacto } = sitio
  const urlMapaEmbebido = obtenerUrlMapaEmbebido({
    urlConfigurada: contacto.urlMapaEmbebido,
    direccion: contacto.direccion,
    ciudad: contacto.ciudad,
  })
  const urlGoogleMaps = obtenerUrlGoogleMaps({
    urlConfigurada: contacto.urlMapaEmbebido,
    direccion: contacto.direccion,
    ciudad: contacto.ciudad,
  })
  const tipologiasUnicas = Array.from(
    tipologias
      .reduce((mapa, tipologia) => {
        if (!mapa.has(tipologia.nombre)) mapa.set(tipologia.nombre, tipologia)
        return mapa
      }, new Map<string, TipologiaProducto>())
      .values(),
  )

  return (
    <footer className="bg-brand-black text-white">
      <div className="container grid grid-cols-2 gap-x-6 gap-y-9 py-10 sm:gap-x-8 sm:gap-y-10 sm:py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-14">
        <div className="col-span-2 md:col-span-1">
          <Logo
            variant="cropped"
            nombreSitio={sitio.nombre}
            className="mb-4 sm:mb-5"
          />
          <p className="mb-5 max-w-md text-sm leading-6 text-white/60 sm:leading-7">
            {sitio.descripcion}
          </p>
          <div className="flex gap-3">
            {contacto.redesSociales
              .filter((social) => social.url.trim())
              .map((social) => {
                const datos = obtenerDatosRedSocial(social.plataforma)
                return (
                  <Button
                    key={social.plataforma}
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full border-white/15 bg-transparent text-white hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    render={
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visitar ${social.etiqueta || datos.etiqueta}`}
                      />
                    }
                  >
                    <IconoRedSocial
                      plataforma={social.plataforma}
                      aria-hidden="true"
                    />
                  </Button>
                )
              })}
          </div>
        </div>

        <nav aria-label="Líneas del catálogo" className="min-w-0">
          <h2 className="eyebrow mb-3 sm:mb-4">Líneas</h2>
          <ul className="space-y-1.5 text-sm text-white/70 sm:space-y-2.5">
            {lineas.map((linea) => (
              <li key={linea.slug}>
                <Link
                  href={`/${linea.slug}`}
                  className="inline-block py-1 hover:text-primary"
                >
                  {linea.nombre}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-white/10 pt-3">
              <Link
                href="/obras"
                className="inline-block py-1 font-semibold text-primary hover:text-primary/80"
              >
                Nuestras obras
              </Link>
            </li>
            <li>
              <Link
                href="/catalogos-tecnicos"
                className="inline-block py-1 font-semibold text-primary hover:text-primary/80"
              >
                Catálogos técnicos
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Tipologías del catálogo" className="min-w-0">
          <h2 className="eyebrow mb-3 sm:mb-4">Tipologías</h2>
          <ul className="grid gap-x-4 gap-y-1.5 text-sm text-white/70 sm:grid-cols-2 sm:gap-y-2.5 lg:grid-cols-1">
            {tipologiasUnicas.map((tipologia) => (
              <li key={tipologia.id}>
                <Link
                  href={`/${tipologia.lineaSlug}?tipologia=${encodeURIComponent(tipologia.id)}`}
                  className="inline-block py-1 hover:text-primary"
                >
                  {tipologia.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-1">
          <h2 className="eyebrow mb-3 sm:mb-4">Contacto</h2>
          <p className="mb-3 flex items-start gap-3 text-sm text-white/80">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {contacto.direccion}, {contacto.ciudad}
          </p>
          {contacto.horarios.map((horario, index) => (
            <p
              key={`${horario.etiqueta}-${index}`}
              className="mb-3 flex items-start gap-3 text-sm text-white/80"
            >
              {index === 0 ? (
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
              )}
              {horario.etiqueta}: {horario.valor}
            </p>
          ))}
          {urlMapaEmbebido && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <iframe
                src={urlMapaEmbebido}
                title={`Ubicación de ${sitio.nombre}`}
                className="h-40 w-full border-0 sm:h-48"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <Button
                variant="ghost"
                className="h-10 w-full rounded-none border-t border-white/10 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                render={
                  <a
                    href={urlGoogleMaps}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ubicación de ${sitio.nombre} en Google Maps`}
                  />
                }
              >
                Ver en Google Maps
                <ExternalLink data-icon="inline-end" className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 sm:py-5">
        <div className="container flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-center text-xs uppercase tracking-wide text-white/40 sm:text-left">
            © {COPYRIGHT_YEAR} {sitio.nombreLegal}. Todos los derechos
            reservados.{' '}
          </p>
          <BackToTopButton />
        </div>
      </div>
    </footer>
  )
}
