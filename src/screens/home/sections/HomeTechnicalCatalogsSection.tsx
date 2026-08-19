import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { normalizarUrlCatalogoTecnico } from "@/features/products/lib/technical-catalog";
import type { LineaProducto } from "@/types";

/** Franja compacta que conecta la Home con la documentación profesional. */
export function HomeTechnicalCatalogsSection({
  lines,
}: {
  lines: LineaProducto[];
}) {
  const tieneDocumentos = lines.some(
    (line) =>
      normalizarUrlCatalogoTecnico(line.catalogoTecnicoUrl) ||
      normalizarUrlCatalogoTecnico(line.especificacionesTecnicasUrl),
  );

  if (!tieneDocumentos) return null;

  return (
    <section
      aria-labelledby="technical-catalogs-title"
      className="border-y border-white/10 bg-brand-black py-8 text-white sm:py-10"
    >
      <div className="container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-3xl items-start gap-4">
          <span className="mt-1 hidden size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary sm:flex">
            <FileText className="size-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Documentación profesional
            </p>
            <h2
              id="technical-catalogs-title"
              className="mt-2 text-xl font-bold tracking-tight text-balance sm:text-2xl lg:text-3xl"
            >
              Catálogos y especificaciones de cada línea
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              Consultá los documentos comerciales y técnicos disponibles para
              conocer mejor cada sistema Lebaux.
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="h-12 w-full shrink-0 px-7 text-base font-semibold transition-transform hover:-translate-y-0.5 sm:w-auto"
          render={<Link href="/catalogos-tecnicos" />}
        >
          Ver documentación
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  );
}
