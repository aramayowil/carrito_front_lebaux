import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'

import { RichTextContent } from '@/components/content/RichTextContent'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { WorkGalleryLightbox } from '@/screens/works/components/WorkGalleryLightbox'
import type { CategoriaObra, Obra } from '@/types'

/** Ficha editorial de una obra publicada desde Supabase. */
export function WorkDetailPage({
  obra,
  categoria,
  telefonoWhatsapp,
}: {
  obra: Obra
  categoria?: CategoriaObra
  telefonoWhatsapp: string
}) {
  const whatsappHref = buildWhatsAppUrl(
    `Hola! Vi la obra "${obra.titulo}" y quiero conversar sobre una solución similar para mi proyecto.`,
    telefonoWhatsapp,
  )

  return (
    <main className="overflow-x-clip bg-background">
      <section className="border-b border-border/70 bg-muted/30 py-8 sm:py-10 lg:py-12">
        <div className="container">
          <Button
            variant="ghost"
            size="sm"
            className="work-detail-intro -ml-3 mb-7"
            render={<Link href="/obras" />}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver a obras
          </Button>

          <div className="work-detail-intro max-w-4xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {categoria?.nombre ?? obra.tipo}
              <span className="h-px w-6 bg-primary/50" aria-hidden="true" />
              <span className="text-muted-foreground">
                {obra.especificacion}
              </span>
            </p>

            <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {obra.titulo}
            </h1>

            <RichTextContent
              html={obra.detalleEspecial}
              className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            />

            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {obra.ubicacion}
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-12 lg:py-16"
        aria-label={`Galería de ${obra.titulo}`}
      >
        <div className="container">
          <div className="mx-auto max-w-7xl">
            <WorkGalleryLightbox images={obra.galeria} title={obra.titulo} />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/35 py-12 sm:py-14 lg:py-16">
        <div className="container">
          <div className="grid items-center gap-9 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <div className="works-reveal-soft hidden border-l-2 border-primary pl-5 sm:pl-7 md:block">
              <p className="max-w-lg text-xl leading-9 text-foreground/80 sm:text-2xl sm:leading-10">
                Cada obra parte de una necesidad concreta. Relevamos el espacio,
                definimos la solución y fabricamos cada abertura pensando en el
                resultado final.
              </p>
            </div>

            <div className="works-reveal-soft border-t border-border pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="eyebrow mb-2">¿Tenés un proyecto en mente?</p>

              <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                Podemos ayudarte a encontrar la abertura adecuada.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                Contanos qué necesitás, las medidas o la idea que tenés para tu
                espacio. Te asesoramos para encontrar una solución que se adapte
                a tu proyecto.
              </p>

              <Button
                variant="whatsapp"
                size="lg"
                className="mt-6 w-full sm:w-auto"
                render={
                  <a href={whatsappHref} target="_blank" rel="noreferrer" />
                }
              >
                <WhatsAppIcon data-icon="inline-start" />
                Consultar por mi proyecto
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
