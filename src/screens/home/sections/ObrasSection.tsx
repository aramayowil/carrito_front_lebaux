import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkCard } from "@/features/works/components/WorkCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Obra } from "@/types";

interface ObrasSectionProps {
  obras: Obra[];
  mensajeWhatsapp: string;
  telefonoWhatsapp: string;
}

/** Galería editorial de proyectos realizados con imágenes uniformes en relación 4:3. */
export function ObrasSection({
  obras,
  mensajeWhatsapp,
  telefonoWhatsapp,
}: ObrasSectionProps) {
  if (obras.length === 0) return null;

  const whatsappHref = buildWhatsAppUrl(mensajeWhatsapp, telefonoWhatsapp);
  const obrasPrincipales = obras.slice(0, 3);

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
          {obrasPrincipales.map((obra) => (
            <WorkCard key={obra.id} obra={obra} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            render={<Link href="/obras" />}
          >
            Explorar más obras
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>

        <Card className="mt-6 gap-0 border border-primary/20 bg-brand-graphite py-0 text-white shadow-lg ring-0 sm:mt-8">
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
  );
}
