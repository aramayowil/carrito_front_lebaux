import { ArrowRight, Download, FileText } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  formatearFechaCatalogoTecnico,
  normalizarUrlCatalogoTecnico,
} from "@/features/products/lib/technical-catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { LineaProducto } from "@/types";

interface CatalogoTecnicoVista {
  line: LineaProducto;
  url: string | null;
  fecha: string | null;
}

const TEXTOS_CATALOGOS_TECNICOS = {
  sobrelinea: "Biblioteca profesional",
  titulo: "Catálogos técnicos",
  descripcion:
    "Documentación para comparar sistemas, perfiles, vidrios y prestaciones antes de definir las aberturas de tu proyecto.",
  contenidoEtiqueta: "Todo en un solo lugar",
  contenidos: [
    "Documentación organizada por línea",
    "Versiones y fechas de actualización",
    "Acceso directo a cada catálogo",
  ],
  listadoSobrelinea: "Documentación por línea",
  listadoTitulo: "Elegí el sistema que necesitás consultar",
  listadoDescripcion:
    "Abrí cada documento para revisarlo, guardarlo o compartirlo con tu equipo.",
  estadoDisponible: "Disponible",
  estadoPendiente: "En preparación",
  etiquetaDocumento: "Documento técnico",
  descripcionFallback: "Información técnica y especificaciones de esta línea.",
  fechaPrefijo: "Actualizado en",
  preparacionTexto: "Estamos preparando la documentación de esta línea.",
  botonDescargar: "Abrir catálogo",
  botonPendiente: "Próximamente",
  vacioTitulo: "No hay líneas publicadas",
  vacioDescripcion:
    "La documentación aparecerá cuando se carguen líneas desde el panel.",
  ayudaTitulo: "¿Necesitás información técnica adicional?",
  ayudaDescripcion:
    "Contanos qué estás proyectando y te ayudamos a elegir el sistema adecuado.",
  ayudaBoton: "Consultar por WhatsApp",
  ayudaMensaje:
    "Hola! Estoy revisando los catálogos técnicos y necesito asesoramiento para mi proyecto.",
} as const;

function nombreCortoLinea(nombre: string): string {
  return nombre.replace(/^línea\s+/i, "");
}

function TechnicalCatalogCard({ catalog }: { catalog: CatalogoTecnicoVista }) {
  const { line, url, fecha } = catalog;
  const nombreLinea = nombreCortoLinea(line.nombre);

  return (
    <Card
      className={cn(
        "h-full gap-0 rounded-xl border-border/80 bg-background py-0 shadow-none transition-colors hover:border-foreground/20",
        !url && "bg-muted/25",
      )}
    >
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              url
                ? "bg-primary/12 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <FileText className="size-5" aria-hidden="true" />
          </span>

          <Badge
            variant={url ? "default" : "secondary"}
            className={cn(!url && "text-muted-foreground")}
          >
            {url
              ? TEXTOS_CATALOGOS_TECNICOS.estadoDisponible
              : TEXTOS_CATALOGOS_TECNICOS.estadoPendiente}
          </Badge>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {TEXTOS_CATALOGOS_TECNICOS.etiquetaDocumento}
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight">
          Catálogo {nombreLinea}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {line.subtitulo || TEXTOS_CATALOGOS_TECNICOS.descripcionFallback}
        </p>

        <div className="mt-5 flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          {line.catalogoTecnicoVersion && (
            <span>{line.catalogoTecnicoVersion}</span>
          )}
          {fecha && (
            <span>
              {TEXTOS_CATALOGOS_TECNICOS.fechaPrefijo} {fecha}
            </span>
          )}
          {!url && !line.catalogoTecnicoVersion && !fecha && (
            <span>{TEXTOS_CATALOGOS_TECNICOS.preparacionTexto}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-1 px-5 pb-5 sm:px-6 sm:pb-6">
        {url ? (
          <Button
            size="lg"
            className="w-full"
            render={
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir catálogo técnico ${line.nombre} en una pestaña nueva`}
              />
            }
          >
            <Download data-icon="inline-start" />
            {TEXTOS_CATALOGOS_TECNICOS.botonDescargar}
          </Button>
        ) : (
          <Button size="lg" variant="outline" className="w-full" disabled>
            {TEXTOS_CATALOGOS_TECNICOS.botonPendiente}
          </Button>
        )}

        <Button
          variant="link"
          className="w-full text-muted-foreground"
          render={<Link href={`/${line.slug}`} />}
        >
          Ver productos de {nombreLinea}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/** Biblioteca pública de documentación técnica organizada por línea. */
export function TechnicalCatalogsPage({
  lines,
  telefonoWhatsapp,
}: {
  lines: LineaProducto[];
  telefonoWhatsapp: string;
}) {
  const catalogs: CatalogoTecnicoVista[] = lines
    .map((line) => ({
      line,
      url: normalizarUrlCatalogoTecnico(line.catalogoTecnicoUrl),
      fecha: formatearFechaCatalogoTecnico(line.catalogoTecnicoActualizadoEn),
    }))
    .sort((a, b) => Number(Boolean(b.url)) - Number(Boolean(a.url)));

  const whatsappHref = buildWhatsAppUrl(
    TEXTOS_CATALOGOS_TECNICOS.ayudaMensaje,
    telefonoWhatsapp,
  );

  return (
    <div className="bg-background">
      <header className="border-b border-white/10 bg-brand-black text-white">
        <div className="container py-10 sm:py-12 lg:py-14">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center lg:gap-14">
            <div>
              <p className="eyebrow mb-4">
                {TEXTOS_CATALOGOS_TECNICOS.sobrelinea}
              </p>
              <h1 className="text-4xl font-bold uppercase tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {TEXTOS_CATALOGOS_TECNICOS.titulo}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                {TEXTOS_CATALOGOS_TECNICOS.descripcion}
              </p>
            </div>

            <div className="border-t border-white/12 pt-6 lg:border-t-0 lg:border-l lg:py-2 lg:pl-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {TEXTOS_CATALOGOS_TECNICOS.contenidoEtiqueta}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {TEXTOS_CATALOGOS_TECNICOS.contenidos.map((contenido) => (
                  <li
                    key={contenido}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                    {contenido}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-muted/20 py-10 sm:py-14">
        <div className="container">
          <div className="mb-7 max-w-2xl sm:mb-9">
            <p className="eyebrow mb-3">
              {TEXTOS_CATALOGOS_TECNICOS.listadoSobrelinea}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {TEXTOS_CATALOGOS_TECNICOS.listadoTitulo}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              {TEXTOS_CATALOGOS_TECNICOS.listadoDescripcion}
            </p>
          </div>

          {catalogs.length > 0 ? (
            <div
              className={cn(
                "grid gap-4 lg:gap-5",
                catalogs.length === 1 && "max-w-lg",
                catalogs.length === 2 && "mx-auto max-w-4xl md:grid-cols-2",
                catalogs.length >= 3 &&
                  "mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {catalogs.map((catalog) => (
                <TechnicalCatalogCard key={catalog.line.id} catalog={catalog} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-background shadow-none">
              <CardContent className="py-12 text-center">
                <p className="font-semibold">
                  {TEXTOS_CATALOGOS_TECNICOS.vacioTitulo}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {TEXTOS_CATALOGOS_TECNICOS.vacioDescripcion}
                </p>
              </CardContent>
            </Card>
          )}

          <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xl bg-brand-black px-5 py-6 text-white sm:mt-12 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">
                {TEXTOS_CATALOGOS_TECNICOS.ayudaTitulo}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/60">
                {TEXTOS_CATALOGOS_TECNICOS.ayudaDescripcion}
              </p>
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              className="w-full shrink-0 shadow-none sm:w-auto"
              render={
                <a href={whatsappHref} target="_blank" rel="noreferrer" />
              }
            >
              <WhatsAppIcon data-icon="inline-start" />
              {TEXTOS_CATALOGOS_TECNICOS.ayudaBoton}
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
