"use client";

import { ArrowRight, ExternalLink, FileText, ListChecks } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatearFechaCatalogoTecnico,
  normalizarUrlCatalogoTecnico,
} from "@/features/products/lib/technical-catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { LineaProducto } from "@/types";

interface DocumentoTecnicoVista {
  tipo: "catalogo" | "especificaciones";
  line: LineaProducto;
  url: string | null;
  version: string | null;
  fecha: string | null;
}

const TEXTOS_CATALOGOS_TECNICOS = {
  sobrelinea: "Documentación profesional",
  titulo: "Catálogos y especificaciones",
  descripcion:
    "Encontrá los catálogos de cada línea y sus especificaciones técnicas en PDF, reunidos en un solo lugar.",
  listadoSobrelinea: "Documentación por línea",
  listadoTitulo: "Elegí el sistema que necesitás consultar",
  listadoDescripcion:
    "Abrí cada documento para revisarlo, guardarlo o compartirlo con tu equipo.",
  descripcionFallback: "Información técnica y especificaciones de esta línea.",
  fechaPrefijo: "Actualizado en",
  vacioTitulo: "Todavía no hay documentos publicados",
  vacioDescripcion:
    "Los documentos aparecerán aquí cuando sean incorporados a las líneas.",
  ayudaTitulo: "¿Necesitás información técnica adicional?",
  ayudaDescripcion:
    "Contanos qué estás proyectando y te ayudamos a elegir el sistema adecuado.",
  ayudaBoton: "Consultar por WhatsApp",
  ayudaMensaje:
    "Hola! Estoy revisando los catálogos técnicos y necesito asesoramiento para mi proyecto.",
  preguntasSobrelinea: "Ayuda rápida",
  preguntasTitulo: "Preguntas frecuentes",
  preguntas: [
    {
      pregunta: "¿Qué diferencia hay entre ambos documentos?",
      respuesta:
        "Los catálogos presentan cada línea de manera general; las especificaciones reúnen información técnica más detallada.",
    },
    {
      pregunta: "¿Cómo puedo guardar o compartir un PDF?",
      respuesta:
        "Abrí el documento y utilizá las opciones de descarga o compartir disponibles en tu navegador o visor.",
    },
    {
      pregunta: "¿Puedo consultar información adicional?",
      respuesta:
        "Sí. Escribinos por WhatsApp con los datos de tu proyecto y nuestro equipo podrá orientarte.",
    },
  ],
} as const;

function nombreCortoLinea(nombre: string): string {
  return nombre.replace(/^línea\s+/i, "");
}

function TechnicalDocumentCard({
  document,
}: {
  document: DocumentoTecnicoVista;
}) {
  const { line, url, version, fecha, tipo } = document;
  const nombreLinea = nombreCortoLinea(line.nombre);
  const esCatalogo = tipo === "catalogo";
  const nombreDocumento = esCatalogo ? "Catálogo" : "Especificaciones";
  const textoAccion = esCatalogo ? "Ver catálogo" : "Ver especificaciones";

  if (!url) return null;

  return (
    <Card className="h-full gap-0 rounded-xl border-border/80 bg-background py-0 shadow-none transition-colors hover:border-foreground/20">
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </span>

        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {esCatalogo ? "Catálogo técnico" : "Documento de especificaciones"}
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight">
          {nombreDocumento} {nombreLinea}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {line.subtitulo || TEXTOS_CATALOGOS_TECNICOS.descripcionFallback}
        </p>

        {(version || fecha) && (
          <div className="mt-5 flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/70 pt-4 text-xs text-muted-foreground">
            {version && <span>{version}</span>}
            {fecha && (
              <span>
                {TEXTOS_CATALOGOS_TECNICOS.fechaPrefijo} {fecha}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-1 px-5 pb-5 sm:px-6 sm:pb-6">
        <Button
          size="lg"
          className="w-full"
          render={
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${textoAccion} de ${line.nombre} en una pestaña nueva`}
            />
          }
        >
          {textoAccion}
          <ExternalLink data-icon="inline-end" />
        </Button>

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

function TechnicalDocumentsPanel({
  documents,
  sobrelinea,
  title,
  description,
}: {
  documents: DocumentoTecnicoVista[];
  sobrelinea: string;
  title: string;
  description: string;
}) {
  const documentosPublicados = documents.filter((document) => document.url);

  return (
    <>
      <div className="mb-7 max-w-2xl sm:mb-9">
        <p className="eyebrow mb-3">{sobrelinea}</p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      {documentosPublicados.length > 0 ? (
        <div
          className={cn(
            "grid gap-4 lg:gap-5",
            documentosPublicados.length === 1 && "max-w-lg",
            documentosPublicados.length === 2 &&
              "mx-auto max-w-4xl md:grid-cols-2",
            documentosPublicados.length >= 3 &&
              "mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {documentosPublicados.map((document) => (
            <TechnicalDocumentCard
              key={`${document.tipo}-${document.line.id}`}
              document={document}
            />
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
    </>
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
  const catalogs: DocumentoTecnicoVista[] = lines
    .map((line) => ({
      tipo: "catalogo" as const,
      line,
      url: normalizarUrlCatalogoTecnico(line.catalogoTecnicoUrl),
      version: line.catalogoTecnicoVersion || null,
      fecha: formatearFechaCatalogoTecnico(line.catalogoTecnicoActualizadoEn),
    }))
    .sort((a, b) => Number(Boolean(b.url)) - Number(Boolean(a.url)));

  const specifications: DocumentoTecnicoVista[] = lines
    .map((line) => ({
      tipo: "especificaciones" as const,
      line,
      url: normalizarUrlCatalogoTecnico(line.especificacionesTecnicasUrl),
      version: line.especificacionesTecnicasVersion || null,
      fecha: formatearFechaCatalogoTecnico(
        line.especificacionesTecnicasActualizadoEn,
      ),
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
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">
              {TEXTOS_CATALOGOS_TECNICOS.sobrelinea}
            </p>
            <h1 className="text-4xl font-bold uppercase tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {TEXTOS_CATALOGOS_TECNICOS.titulo}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              {TEXTOS_CATALOGOS_TECNICOS.descripcion}
            </p>
          </div>
        </div>
      </header>

      <main className="bg-muted/20 py-10 sm:py-14">
        <div className="container">
          <Tabs defaultValue="catalogos" className="gap-8">
            <div className="flex justify-center">
              <TabsList className="h-12! w-full max-w-md gap-1 rounded-xl border border-border/80 bg-background p-1">
                <TabsTrigger
                  value="catalogos"
                  className="h-full rounded-lg px-4 text-sm font-semibold data-active:bg-primary data-active:text-primary-foreground sm:text-base"
                >
                  <FileText aria-hidden="true" />
                  Catálogos
                </TabsTrigger>
                <TabsTrigger
                  value="especificaciones"
                  className="h-full rounded-lg px-4 text-sm font-semibold data-active:bg-primary data-active:text-primary-foreground sm:text-base"
                >
                  <ListChecks aria-hidden="true" />
                  Especificaciones
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="catalogos">
              <TechnicalDocumentsPanel
                documents={catalogs}
                sobrelinea="Documentación por línea"
                title="Elegí el catálogo que necesitás consultar"
                description="Abrí cada documento para revisarlo, guardarlo o compartirlo con tu equipo."
              />
            </TabsContent>

            <TabsContent value="especificaciones">
              <TechnicalDocumentsPanel
                documents={specifications}
                sobrelinea="Información técnica por línea"
                title="Elegí las especificaciones que necesitás consultar"
                description="Consultá resistencia, tolerancias, dimensiones y demás información técnica publicada para cada sistema."
              />
            </TabsContent>
          </Tabs>

          <section
            aria-labelledby="technical-catalogs-faq-title"
            className="mx-auto mt-12 max-w-3xl sm:mt-16"
          >
            <div className="mb-6 text-center">
              <p className="eyebrow mb-3 justify-center">
                {TEXTOS_CATALOGOS_TECNICOS.preguntasSobrelinea}
              </p>
              <h2
                id="technical-catalogs-faq-title"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                {TEXTOS_CATALOGOS_TECNICOS.preguntasTitulo}
              </h2>
            </div>

            <Accordion>
              {TEXTOS_CATALOGOS_TECNICOS.preguntas.map((item, index) => (
                <AccordionItem key={item.pregunta} value={`pregunta-${index}`}>
                  <AccordionTrigger>{item.pregunta}</AccordionTrigger>
                  <AccordionContent className="leading-6 text-muted-foreground">
                    {item.respuesta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

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
