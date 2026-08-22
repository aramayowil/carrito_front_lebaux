import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WorkGalleryLightbox } from "@/screens/works/components/WorkGalleryLightbox";
import type { CategoriaObra, Obra } from "@/types";

/** Ficha editorial de una obra publicada desde Supabase. */
export function WorkDetailPage({
  obra,
  categoria,
  telefonoWhatsapp,
}: {
  obra: Obra;
  categoria?: CategoriaObra;
  telefonoWhatsapp: string;
}) {
  const whatsappHref = buildWhatsAppUrl(
    `Hola! Vi la obra "${obra.titulo}" y quiero conversar sobre una solución similar para mi proyecto.`,
    telefonoWhatsapp,
  );

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
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {obra.detalleEspecial}
            </p>
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
          <WorkGalleryLightbox images={obra.galeria} title={obra.titulo} />
        </div>
      </section>

      <section
        className="pb-12 sm:pb-14 lg:pb-20"
        aria-labelledby="project-title"
      >
        <div className="container grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-2">El proyecto</p>
            <h2 id="project-title" className="section-title section-title-left">
              Una respuesta pensada para el espacio
            </h2>

            <div className="mt-8 grid gap-7 sm:grid-cols-2 sm:gap-8">
              <article className="works-reveal-soft border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  El desafío
                </p>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {obra.desafio}
                </p>
              </article>

              <article className="works-reveal-soft border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  La solución
                </p>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {obra.solucion}
                </p>
              </article>
            </div>
          </div>

          <aside className="works-reveal-soft border-t-2 border-primary pt-5 lg:mt-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Materiales y sistemas
            </p>
            <ul className="mt-5 divide-y divide-border">
              {obra.materiales.map((material) => (
                <li
                  key={material}
                  className="flex items-center gap-3 py-4 first:pt-0"
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium leading-6">
                    {material}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-brand-black py-12 text-white sm:py-14 lg:py-16">
        <div className="container grid items-center gap-10 lg:grid-cols-[1fr_0.75fr] lg:gap-16">
          <figure className="works-reveal-soft border-l-2 border-primary pl-5 sm:pl-7">
            <blockquote className="max-w-3xl text-xl leading-9 text-white/85 sm:text-2xl sm:leading-10">
              “{obra.testimonio}”
            </blockquote>
            <figcaption className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
              — {obra.autor}
            </figcaption>
          </figure>

          <div className="works-reveal-soft border-t border-white/10 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <p className="eyebrow mb-2">Tu espacio puede ser el próximo</p>
            <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              ¿Imaginás una solución similar para tu proyecto?
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Contanos qué necesitás y pensemos juntos una respuesta a medida.
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
              Consultar por una solución similar
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
