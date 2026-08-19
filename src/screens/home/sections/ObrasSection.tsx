import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeWorksShowcase } from "@/features/works/components/HomeWorksShowcase";
import type { Obra } from "@/types";

interface ObrasSectionProps {
  obras: Obra[];
}

const SLUGS_OBRAS_DESTACADAS_MOCK = [
  "casa-abierta-al-jardin",
  "luz-natural-corazon-hogar",
  "identidad-renovada-fachada-clasica",
] as const;

/** Selección editorial de tres obras destacadas y acceso al portfolio completo. */
export function ObrasSection({ obras }: ObrasSectionProps) {
  if (obras.length === 0) return null;

  // Adaptación temporal: el administrador todavía no entrega el slug público.
  const obrasPrincipales = obras.slice(0, 3).map((obra, index) => ({
    ...obra,
    href: `/obras/${SLUGS_OBRAS_DESTACADAS_MOCK[index] ?? SLUGS_OBRAS_DESTACADAS_MOCK[0]}`,
  }));

  return (
    <section
      id="obras"
      className="bg-muted/40 py-12 sm:py-16 lg:py-20"
      aria-labelledby="works-title"
    >
      <div className="container">
        <div className="mb-7 grid items-end gap-5 sm:mb-10 md:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="eyebrow mb-2">Nuestras obras</p>
            <h2
              id="works-title"
              className="section-title section-title-left max-w-2xl"
            >
              Proyectos que hablan por nosotros
            </h2>
          </div>

          <p className="max-w-xl leading-7 text-muted-foreground md:justify-self-end">
            Una selección de espacios donde el diseño, la precisión y una
            solución a medida transformaron la forma de habitarlos.
          </p>
        </div>

        <HomeWorksShowcase obras={obrasPrincipales} />

        <Card className="mt-6 gap-0 border-0 bg-brand-graphite py-0 text-white shadow-none ring-0 sm:mt-8">
          <CardContent className="flex flex-col items-start justify-between gap-6 px-6 py-7 sm:flex-row sm:items-stretch sm:px-8 lg:px-10">
            <div className="flex flex-col justify-center">
              <p className="text-xl font-bold tracking-tight sm:text-2xl">
                Cada proyecto empieza con una necesidad diferente.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Descubrí más soluciones creadas para casas, locales y espacios
                únicos.
              </p>
            </div>

            <Button
              variant="default"
              size="lg"
              className="h-auto min-h-20 w-full shrink-0 justify-between rounded-xl px-6 py-4 text-left shadow-none sm:w-80"
              render={<Link href="/obras" />}
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-widest opacity-65">
                  Más proyectos
                </span>
                <span className="mt-1 block text-base font-bold">
                  Explorar todas las obras
                </span>
              </span>
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover/button:translate-x-1"
                data-icon="inline-end"
                aria-hidden="true"
              />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
