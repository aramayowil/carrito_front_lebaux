import { ArrowRight, BadgeCheck, MapPin, Ruler, Settings2 } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ProductImage } from "@/components/media/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CATEGORIAS_OBRAS_MOCK,
  ESLOGAN_FINAL_OBRAS_MOCK,
  OBRAS_MOCK,
  REMODELACIONES_OBRAS_MOCK,
  SEDES_OBRAS_MOCK,
} from "@/data/mock/obras";
import { WorksGallery } from "@/features/works/components/WorksGallery";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WorksRemodelations } from "@/screens/works/components/WorksRemodelations";

const PASOS = [
  {
    icono: Ruler,
    momento: "Primero",
    titulo: "Conversamos y relevamos",
    descripcion:
      "Escuchamos tu idea y analizamos medidas, uso, orientación y necesidades reales del espacio.",
  },
  {
    icono: Settings2,
    momento: "Después",
    titulo: "Diseñamos y fabricamos",
    descripcion:
      "Definimos la solución adecuada y fabricamos cada abertura a medida con precisión.",
  },
  {
    icono: BadgeCheck,
    momento: "Finalmente",
    titulo: "Coordinamos y acompañamos",
    descripcion:
      "Organizamos cada detalle y seguimos el proyecto para que el resultado responda a lo acordado.",
  },
] as const;

/** Experiencia editorial mock para explorar los proyectos realizados. */
export function WorksPage({ telefonoWhatsapp }: { telefonoWhatsapp: string }) {
  const [obraDestacada] = OBRAS_MOCK;
  const whatsappHref = buildWhatsAppUrl(
    "Hola! Vi la galería de obras y quiero asesoramiento para mi proyecto.",
    telefonoWhatsapp,
  );

  return (
    <div className="overflow-x-clip bg-background">
      <section
        aria-labelledby="works-page-title"
        className="border-b border-border/70 bg-muted/30 py-5 sm:py-7 lg:py-8"
      >
        <div className="container">
          <div className="works-intro grid items-end gap-6 lg:grid-cols-[1fr_0.72fr] lg:gap-12">
            <div className="works-intro-main">
              <p className="eyebrow mb-3">Obras que hablan por nosotros</p>
              <h1
                id="works-page-title"
                className="max-w-4xl text-3xl font-bold uppercase tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                Proyectos que transforman espacios
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Casas, locales, cerramientos y soluciones especiales donde el
                diseño a medida convierte una necesidad concreta en una mejor
                experiencia del espacio.
              </p>
            </div>

            <div className="works-intro-note border-l-2 border-primary pl-5 sm:pl-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Cada proyecto es único
              </p>
              <p className="mt-3 text-lg font-medium leading-8 text-foreground sm:text-xl">
                No se trata sólo de cerrar un ambiente, sino de decidir cómo
                entra la luz, cómo circulamos y qué paisaje queremos mirar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="obra-destacada"
        className="scroll-mt-24 py-9 sm:py-11 lg:py-14"
      >
        <div className="container">
          <div className="works-reveal-soft mb-6">
            <div>
              <p className="eyebrow mb-2">Historia destacada</p>
              <h2 className="section-title section-title-left max-w-2xl">
                Cuando adentro y afuera se encuentran
              </h2>
            </div>
          </div>

          <article className="works-reveal-media grid items-center gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div className="overflow-hidden rounded-xl bg-muted">
              <ProductImage
                src={obraDestacada.imagen}
                alt={obraDestacada.titulo}
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-4/3 w-full"
                imgClassName="object-cover"
              />
            </div>

            <div className="lg:py-4">
              <div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  {obraDestacada.tipo}
                  <span className="h-px w-6 bg-primary/50" aria-hidden="true" />
                  <span className="text-muted-foreground">
                    {obraDestacada.especificacion}
                  </span>
                </p>
                <h3 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                  {obraDestacada.titulo}
                </h3>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {obraDestacada.detalleEspecial}
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  {obraDestacada.ubicacion}
                </p>
              </div>

              <figure className="mt-8 border-l-2 border-primary pl-5 sm:pl-6">
                <blockquote className="text-lg leading-8 text-foreground/85">
                  “{obraDestacada.testimonio}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  — {obraDestacada.autor}
                </figcaption>
              </figure>
            </div>
          </article>
        </div>
      </section>

      <section
        id="proyectos"
        className="bg-muted/35 py-10 sm:py-12 lg:py-16"
        aria-labelledby="more-works-title"
      >
        <div className="container">
          <div className="works-reveal-soft mb-5 grid items-end gap-4 sm:mb-6 md:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="eyebrow mb-2">Explorá por categoría</p>
              <h2
                id="more-works-title"
                className="section-title section-title-left max-w-xl"
              >
                Cada proyecto, una respuesta diferente
              </h2>
            </div>
            <p className="max-w-xl leading-7 text-muted-foreground md:justify-self-end">
              Cada obra propone un desafío distinto. La respuesta nace de
              escuchar, medir y encontrar el sistema que mejor acompaña su
              arquitectura.
            </p>
          </div>

          <WorksGallery categorias={CATEGORIAS_OBRAS_MOCK} obras={OBRAS_MOCK} />
        </div>
      </section>

      <section
        className="py-10 sm:py-12 lg:py-16"
        aria-labelledby="remodelaciones-title"
      >
        <div className="container">
          <div className="works-reveal-soft mb-6 max-w-3xl">
            <p className="eyebrow mb-2">Remodelaciones</p>
            <h2
              id="remodelaciones-title"
              className="section-title section-title-left"
            >
              Antes y después
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Renovamos cada espacio respetando su identidad y mejorando la
              forma de habitarlo.
            </p>
          </div>

          <WorksRemodelations remodelaciones={REMODELACIONES_OBRAS_MOCK} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-brand-black py-12 text-white sm:py-14 lg:py-18">
        <div className="container grid items-start gap-10 lg:grid-cols-[0.75fr_1fr] lg:gap-14">
          <div className="works-reveal-soft lg:sticky lg:top-28">
            <p className="eyebrow mb-3">Cómo trabajamos</p>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              De la primera idea a la abertura terminada
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-white/60">
              Un recorrido claro, con decisiones acompañadas y un mismo equipo
              atento a cada etapa del proyecto.
            </p>
            <p className="mt-7 max-w-lg border-t border-white/10 pt-6 text-sm leading-6 text-white/45">
              Cada obra es diferente. El proceso se adapta sin perder orden,
              comunicación ni atención por los detalles.
            </p>
          </div>

          <div className="space-y-4">
            {PASOS.map(({ icono: Icono, momento, titulo, descripcion }) => (
              <Card
                key={momento}
                className="works-reveal-soft gap-0 border-white/10 bg-brand-graphite py-0 text-white shadow-md transition-[border-color,transform,box-shadow] duration-300 hover:border-primary/40 hover:shadow-xl motion-safe:sm:hover:translate-x-1"
              >
                <CardContent className="flex items-start gap-4 px-5 py-6 sm:gap-5 sm:px-7 sm:py-7">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:size-12">
                    <Icono className="size-5 sm:size-6" aria-hidden="true" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {momento}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
                      {titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
                      {descripcion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-primary bg-brand-graphite py-10 text-white sm:py-12 lg:py-14">
        <div className="container works-reveal-soft grid items-center gap-8 lg:grid-cols-[1fr_0.7fr] lg:gap-12">
          <div>
            <p className="eyebrow mb-3">
              El próximo proyecto puede ser el tuyo
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {ESLOGAN_FINAL_OBRAS_MOCK}
            </h2>
          </div>

          <div className="border-t border-white/10 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <p className="max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
              Te acompañamos desde la primera conversación hasta el último
              detalle, creando soluciones a medida para tu espacio.
            </p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-white/45">
              Estamos en
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEDES_OBRAS_MOCK.map((sede) => (
                <Badge
                  key={sede.id}
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white/75"
                >
                  <MapPin aria-hidden="true" />
                  {sede.nombre}
                </Badge>
              ))}
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              className="mt-6 h-12 w-full justify-center rounded-xl px-6 text-base font-bold"
              render={
                <a href={whatsappHref} target="_blank" rel="noreferrer" />
              }
            >
              <WhatsAppIcon data-icon="inline-start" />
              Empecemos tu proyecto
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
