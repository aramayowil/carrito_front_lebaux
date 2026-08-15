import { Quote } from 'lucide-react'

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { ProductImage } from '@/components/media/ProductImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { Obra } from '@/types'

interface ObrasSectionProps {
  obras: Obra[]
  mensajeWhatsapp: string
  telefonoWhatsapp: string
}

/** Galería editorial de proyectos realizados con imágenes uniformes en relación 4:3. */
export function ObrasSection({
  obras,
  mensajeWhatsapp,
  telefonoWhatsapp,
}: ObrasSectionProps) {
  if (obras.length === 0) return null

  const whatsappHref = buildWhatsAppUrl(mensajeWhatsapp, telefonoWhatsapp)

  return (
    <section
      id="obras"
      className="bg-muted/40 py-16 sm:py-20"
      aria-labelledby="works-title"
    >
      <div className="container">
        <div className="mb-8 grid items-end gap-5 sm:mb-10 md:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="eyebrow mb-2">Proyectos reales</p>
            <h2
              id="works-title"
              className="section-title section-title-left max-w-2xl"
            >
              Aberturas que ya son parte de otros hogares
            </h2>
          </div>

          <p className="max-w-xl leading-7 text-muted-foreground md:justify-self-end">
            Conocé algunos proyectos realizados por Lebaux y la experiencia de
            quienes nos eligieron para transformar sus espacios.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {obras.map((obra) => (
            <article key={obra.id} className="min-w-0">
              <Card className="group flex h-full flex-col rounded-lg gap-0 overflow-hidden border border-border/70 py-0 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <ProductImage
                  src={obra.imagen}
                  alt={obra.titulo}
                  className="aspect-4/3 w-full border-b bg-white"
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <CardContent className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{obra.tipo}</Badge>
                    <Badge variant="outline">{obra.especificacion}</Badge>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight">
                    {obra.titulo}
                  </h3>

                  <Quote
                    className="mt-5 size-6 text-primary"
                    aria-hidden="true"
                  />

                  <blockquote className="mt-3 line-clamp-4 leading-6 text-muted-foreground">
                    “{obra.testimonio}”
                  </blockquote>

                  <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-widest text-foreground">
                    — {obra.autor}
                  </p>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>

        <Card className="mt-8 gap-0 border border-primary/20 bg-brand-graphite py-0 text-white shadow-lg ring-0">
          <CardContent className="flex flex-col items-start justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-lg font-bold">¿Tenés un proyecto en mente?</p>
              <p className="mt-1 text-sm leading-6 text-white/65">
                Contanos qué necesitás y te ayudamos a elegir la abertura
                adecuada.
              </p>
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              className="w-full sm:w-auto"
              render={
                <a href={whatsappHref} target="_blank" rel="noreferrer" />
              }
            >
              <WhatsAppIcon data-icon="inline-start" />
              Quiero asesoramiento
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
