import { Check } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { normalizarNombreIconoLucide } from '@/components/ui/icons/lucide-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { LineaProducto } from '@/types'

const TEXTOS_CONTENIDO_LINEA = {
  beneficiosSobrelinea: 'Por qué elegir esta línea',
  beneficiosTitulo: 'Lo que distingue a {linea}',
  asesoramientoTitulo: '¿Necesitás ayuda para elegir?',
  asesoramientoDescripcion: 'Contanos las medidas y dónde querés instalarla.',
  asesoramientoBoton: 'Consultar por WhatsApp',
  comparacionSobrelinea: 'Compará alternativas',
  comparacionTitulo: 'Encontrá la línea para tu proyecto',
  comparacionDescripcion:
    'Cambian las prestaciones y terminaciones, la fabricación Lebaux se mantiene en todas.',
  comparacionEtiqueta: 'Línea de aluminio',
  comparacionActual: 'Línea actual',
  comparacionDisponible: 'Disponible',
  comparacionBoton: 'Ver {linea}',
} as const

function conNombreLinea(texto: string, nombre: string) {
  return texto.replaceAll('{linea}', nombre)
}

function obtenerClasesGrid(cantidad: number) {
  if (cantidad <= 1) {
    return 'mx-auto max-w-xl grid-cols-1'
  }

  if (cantidad === 2) {
    return 'mx-auto max-w-4xl grid-cols-1 sm:grid-cols-2'
  }

  return 'mx-auto max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
}

/** Argumentos de compra, comparación breve y asesoramiento para una línea. */
export function CatalogLineMoreContent({
  lineInfo,
  lines,
  mensajeWhatsapp,
  telefonoWhatsapp,
}: {
  lineInfo: LineaProducto
  lines: LineaProducto[]
  mensajeWhatsapp: string
  telefonoWhatsapp: string
}) {
  const line = lineInfo.slug

  const beneficios = lineInfo.beneficiosCatalogo
    .filter(
      (beneficio) => beneficio.titulo.trim() && beneficio.descripcion.trim(),
    )
    .slice(0, 3)

  const whatsappHref = buildWhatsAppUrl(
    conNombreLinea(mensajeWhatsapp, lineInfo.nombre),
    telefonoWhatsapp,
  )

  return (
    <div className="mt-14 space-y-14 border-t border-border/70 pt-10 sm:mt-20 sm:space-y-20 sm:pt-16">
      {/* BENEFICIOS */}
      {beneficios.length > 0 && (
        <section
          aria-labelledby="line-benefits-title"
          className="overflow-hidden rounded-3xl bg-brand-black px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3 justify-center">
              {TEXTOS_CONTENIDO_LINEA.beneficiosSobrelinea}
            </p>

            <h2
              id="line-benefits-title"
              className="text-2xl font-bold uppercase tracking-tight sm:text-3xl"
            >
              {conNombreLinea(
                TEXTOS_CONTENIDO_LINEA.beneficiosTitulo,
                lineInfo.nombre,
              )}
            </h2>
          </div>

          <div
            className={cn(
              'mt-9 grid gap-8 border-t border-white/10 pt-9',
              beneficios.length === 1 && 'mx-auto max-w-lg grid-cols-1',
              beneficios.length === 2 &&
                'mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2',
              beneficios.length >= 3 &&
                'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
            )}
          >
            {beneficios.slice(0, 3).map((beneficio) => {
              const icono = normalizarNombreIconoLucide(beneficio.icono)

              return (
                <article
                  key={beneficio.id}
                  className="text-center md:text-left"
                >
                  <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary md:mx-0">
                    <DynamicIcon
                      name={icono}
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <h3 className="mt-4 font-bold">{beneficio.titulo}</h3>

                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {beneficio.descripcion}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-semibold">
                {TEXTOS_CONTENIDO_LINEA.asesoramientoTitulo}
              </p>

              <p className="mt-1 text-sm text-white/55">
                {TEXTOS_CONTENIDO_LINEA.asesoramientoDescripcion}
              </p>
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              className="w-full shrink-0 sm:w-auto"
              render={
                <a href={whatsappHref} target="_blank" rel="noreferrer" />
              }
            >
              <WhatsAppIcon data-icon="inline-start" />
              {TEXTOS_CONTENIDO_LINEA.asesoramientoBoton}
            </Button>
          </div>
        </section>
      )}

      {/* COMPARACIÓN DE LÍNEAS */}
      {lines.length > 0 && (
        <section aria-labelledby="line-comparison-title">
          <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-10">
            <p className="eyebrow mb-3 justify-center">
              {TEXTOS_CONTENIDO_LINEA.comparacionSobrelinea}
            </p>

            <h2
              id="line-comparison-title"
              className="text-2xl font-bold uppercase tracking-tight sm:text-3xl"
            >
              {TEXTOS_CONTENIDO_LINEA.comparacionTitulo}
            </h2>

            {lines.length > 1 && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                {TEXTOS_CONTENIDO_LINEA.comparacionDescripcion}
              </p>
            )}
          </div>

          <div
            className={cn(
              'grid gap-4 sm:gap-5',
              obtenerClasesGrid(lines.length),
            )}
          >
            {lines.map((item) => {
              const current = item.slug === line

              const usosRecomendados = item.idealPara
                .filter((uso) => uso.trim())
                .slice(0, 3)

              return (
                <Card
                  key={item.slug}
                  className={cn(
                    'group h-full gap-0 overflow-hidden rounded-2xl border py-0 shadow-none',
                    'transition-[border-color,background-color,box-shadow,transform] duration-200',
                    current
                      ? 'border-primary/70 bg-primary/6 ring-1 ring-primary/20'
                      : 'border-border bg-catalog-line hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-background hover:shadow-sm',
                  )}
                >
                  <CardContent className="flex h-full flex-col p-5 sm:p-6">
                    {/* CABECERA */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {TEXTOS_CONTENIDO_LINEA.comparacionEtiqueta}
                        </p>

                        <h3 className="mt-1 truncate text-xl font-bold sm:text-2xl">
                          {item.nombre}
                        </h3>
                      </div>

                      <Badge
                        variant={current ? 'default' : 'secondary'}
                        className={cn(
                          'shrink-0',
                          !current && 'text-muted-foreground',
                        )}
                      >
                        {current
                          ? TEXTOS_CONTENIDO_LINEA.comparacionActual
                          : TEXTOS_CONTENIDO_LINEA.comparacionDisponible}
                      </Badge>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {item.subtitulo}
                    </p>

                    {/* USOS */}
                    {usosRecomendados.length > 0 && (
                      <ul className="mt-5 space-y-3 border-t border-border/70 pt-5 text-sm">
                        {usosRecomendados.map((uso) => (
                          <li key={uso} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                              <Check
                                className="size-3.5 text-success"
                                aria-hidden="true"
                              />
                            </span>

                            <span className="leading-5">{uso}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* ACCIÓN */}
                    <div className="mt-auto pt-6">
                      {current ? (
                        <div className="flex min-h-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/6 px-4 text-center text-sm font-medium text-primary">
                          Estás viendo esta línea
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full bg-background transition-colors group-hover:border-foreground/30"
                          render={<Link href={`/${item.slug}`} />}
                        >
                          {conNombreLinea(
                            TEXTOS_CONTENIDO_LINEA.comparacionBoton,
                            item.nombre,
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
