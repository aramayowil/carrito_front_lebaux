import { Quote } from "lucide-react"

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { ProductImage } from "@/components/media/ProductImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import type { Obra } from "@/types"

interface ObrasSectionProps {
  obras: Obra[]
  mensajeWhatsapp: string
  telefonoWhatsapp: string
}

/** Galería editorial de proyectos realizados con testimonios siempre visibles. */
export function ObrasSection({
  obras,
  mensajeWhatsapp,
  telefonoWhatsapp,
}: ObrasSectionProps) {
  if (obras.length === 0) return null

  const obraPrincipal = obras.find((obra) => obra.esPrincipal) ?? obras[0]
  const obrasSecundarias = obras
    .filter((obra) => obra.id !== obraPrincipal.id)
    .slice(0, 2)
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
            Conocé algunos proyectos realizados por Lebaux y la experiencia de quienes nos eligieron para transformar sus espacios.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <article>
            <Card className="group h-full gap-0 border border-border/70 py-0 shadow-lg">
              <ProductImage
                src={obraPrincipal.imagen}
                alt={obraPrincipal.titulo}
                className="aspect-[16/10] w-full border-b bg-white"
                imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <CardContent className="flex flex-1 flex-col px-6 py-6 sm:px-8 sm:py-7">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{obraPrincipal.tipo}</Badge>
                  <Badge variant="outline">
                    {obraPrincipal.especificacion}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {obraPrincipal.titulo}
                </h3>
                <Quote
                  className="mt-6 size-7 text-primary"
                  aria-hidden="true"
                />
                <blockquote className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
                  “{obraPrincipal.testimonio}”
                </blockquote>
                <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-foreground">
                  — {obraPrincipal.autor}
                </p>
              </CardContent>
            </Card>
          </article>

          <div className="grid gap-5">
            {obrasSecundarias.slice(0, 2).map((obra) => (
              <article key={obra.id}>
                <Card className="group h-full gap-0 border border-border/70 py-0 sm:grid sm:grid-cols-[0.8fr_1.2fr]">
                  <ProductImage
                    src={obra.imagen}
                    alt={obra.titulo}
                    className="h-56 w-full border-b bg-white sm:h-full sm:min-h-72 sm:border-b-0 sm:border-r"
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <CardContent className="flex min-w-0 flex-col px-5 py-5 sm:py-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge variant="secondary">{obra.tipo}</Badge>
                      <Badge variant="outline">{obra.especificacion}</Badge>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {obra.titulo}
                    </h3>
                    <blockquote className="mt-3 line-clamp-4 leading-6 text-muted-foreground">
                      “{obra.testimonio}”
                    </blockquote>
                    <p className="mt-auto pt-4 text-xs font-semibold uppercase tracking-widest text-foreground">
                      — {obra.autor}
                    </p>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>

        <Card className="mt-8 gap-0 border border-primary/20 bg-brand-graphite py-0 text-white shadow-lg ring-0">
          <CardContent className="flex flex-col items-start justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-lg font-bold">¿Tenés un proyecto en mente?</p>
              <p className="mt-1 text-sm leading-6 text-white/65">
                Contanos qué necesitás y te ayudamos a elegir la abertura adecuada.
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
