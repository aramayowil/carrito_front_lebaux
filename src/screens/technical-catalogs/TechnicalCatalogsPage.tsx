import { Check, Download, FileText } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatearFechaCatalogoTecnico,
  normalizarUrlCatalogoTecnico,
} from "@/features/products/lib/technical-catalog"
import { cn } from "@/lib/utils"
import type { ConfiguracionCatalogosTecnicosPublica, LineaProducto } from "@/types"

interface CatalogoTecnicoVista {
  line: LineaProducto
  url: string | null
  fecha: string | null
}

const TEXTOS_CATALOGOS_TECNICOS = {
  metaTitulo: "Catálogos técnicos",
  metaDescripcion:
    "Documentación técnica de las líneas de aberturas Lebaux para arquitectos, instaladores y profesionales.",
  sobrelineaHero: "Biblioteca profesional",
  tituloHero: "Catálogos técnicos",
  subtituloHero: "Información para especificar cada proyecto",
  descripcionHero:
    "Compará sistemas, perfiles, vidrios y prestaciones antes de definir las aberturas de tu obra.",
  botonHero: "Explorar documentación",
  navegacionEtiqueta: "Elegí una línea",
  listadoTitulo: "Elegí una línea de fabricación",
  listadoDescripcion:
    "Cada descarga abre el documento externo en una pestaña nueva para que puedas guardarlo o compartirlo.",
  estadoDisponible: "PDF disponible",
  estadoPendiente: "En preparación",
  etiquetaSistema: "Sistema de aberturas",
  descripcionFallback: "Información técnica y especificaciones de esta línea.",
  contenidoTitulo: "Contenido del documento",
  contenidosDocumento: [
    "Perfiles y secciones del sistema",
    "Opciones de vidrio y configuraciones",
    "Prestaciones y referencias de instalación",
  ],
  fechaPrefijo: "Actualizado en",
  preparacionTexto: "Documento en preparación",
  botonDescargar: "Descargar catálogo",
  botonPendiente: "Documento próximamente",
  vacioTitulo: "No hay líneas publicadas",
  vacioDescripcion:
    "La documentación aparecerá cuando se carguen líneas desde el panel.",
} as const

function nombreCortoLinea(nombre: string): string {
  return nombre.replace(/^línea\s+/i, "")
}

function TechnicalCatalogCard({ catalog }: { catalog: CatalogoTecnicoVista }) {
  const { line, url, fecha } = catalog
  const nombreLinea = nombreCortoLinea(line.nombre)

  return (
    <Card
      id={`catalogo-${line.slug}`}
      className="group h-full scroll-mt-36 gap-0 overflow-hidden rounded-md border border-border/80 bg-background py-0 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:border-primary/45 hover:shadow-lg motion-safe:sm:hover:-translate-y-1 sm:rounded-3xl"
    >
      <div className={cn("h-1.5", url ? "bg-primary" : "bg-muted")} />

      <CardHeader className="gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <Badge variant={url ? "default" : "secondary"}>
            {url
              ? TEXTOS_CATALOGOS_TECNICOS.estadoDisponible
              : TEXTOS_CATALOGOS_TECNICOS.estadoPendiente}
          </Badge>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {TEXTOS_CATALOGOS_TECNICOS.etiquetaSistema}
          </p>
          <CardTitle className="mt-2 text-xl font-bold tracking-tight">
            Catálogo técnico {nombreLinea}
          </CardTitle>
          <CardDescription className="mt-2 line-clamp-2 leading-6">
            {line.subtitulo || TEXTOS_CATALOGOS_TECNICOS.descripcionFallback}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="mt-5 flex-1 px-5 sm:px-6">
        <div className="rounded-2xl bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {TEXTOS_CATALOGOS_TECNICOS.contenidoTitulo}
          </p>
          <ul className="mt-3 space-y-2.5">
            {TEXTOS_CATALOGOS_TECNICOS.contenidosDocumento.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs leading-5 sm:text-sm"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          {line.catalogoTecnicoVersion && <span>{line.catalogoTecnicoVersion}</span>}
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

      <CardFooter className="flex-col gap-2 px-5 pt-5 pb-5 sm:px-6 sm:pb-6">
        {url ? (
          <Button
            size="lg"
            className="w-full rounded-xl"
            render={
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Descargar catálogo técnico ${line.nombre} (abre en una pestaña nueva)`}
              />
            }
          >
            <Download data-icon="inline-start" />
            {TEXTOS_CATALOGOS_TECNICOS.botonDescargar}
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-xl"
            disabled
          >
            {TEXTOS_CATALOGOS_TECNICOS.botonPendiente}
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full rounded-xl"
          render={<Link href={`/${line.slug}`} />}
        >
          Explorar productos de {line.nombre}
        </Button>
      </CardFooter>
    </Card>
  )
}

/** Biblioteca pública de documentación técnica organizada por línea. */
export function TechnicalCatalogsPage({
  lines,
  banner,
}: {
  lines: LineaProducto[]
  banner: ConfiguracionCatalogosTecnicosPublica
}) {
  const catalogs: CatalogoTecnicoVista[] = lines
    .map((line) => ({
      line,
      url: normalizarUrlCatalogoTecnico(line.catalogoTecnicoUrl),
      fecha: formatearFechaCatalogoTecnico(line.catalogoTecnicoActualizadoEn),
    }))
    .sort((a, b) => Number(Boolean(b.url)) - Number(Boolean(a.url)))
  const disponibles = catalogs.filter((catalog) => catalog.url).length
  const imagenHeroEscritorio = banner.imagenBannerEscritorio
  const imagenHeroMovil = banner.imagenBannerMovil || banner.imagenBannerEscritorio

  return (
    <div className="bg-background">
      <section
        aria-labelledby="technical-catalogs-title"
        className="relative isolate overflow-hidden bg-brand-black text-white"
      >
        {imagenHeroMovil && (
          <picture className="absolute inset-0 -z-20">
            <source media="(min-width: 48rem)" srcSet={imagenHeroEscritorio} />
            <img
              src={imagenHeroMovil}
              alt={banner.textoAlternativoBanner?.trim() || ""}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-black via-brand-black/85 to-brand-black/20" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-brand-black/75 via-transparent to-brand-black/20 md:hidden" />

        <div className="container flex min-h-72 flex-col justify-between py-4 md:min-h-80 md:py-5">
          <Breadcrumb>
            <BreadcrumbList className="text-white/65">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/" />}
                  className="hover:text-white"
                >
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white/90">
                  {TEXTOS_CATALOGOS_TECNICOS.tituloHero}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-2xl pt-4 md:pt-3">
            <p className="eyebrow mb-3">
              {TEXTOS_CATALOGOS_TECNICOS.sobrelineaHero}
            </p>
            <h1
              id="technical-catalogs-title"
              className="text-4xl font-bold uppercase tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              {TEXTOS_CATALOGOS_TECNICOS.tituloHero}
            </h1>
            <p className="mt-4 text-lg font-medium text-white/85 sm:text-xl">
              {TEXTOS_CATALOGOS_TECNICOS.subtituloHero}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              {TEXTOS_CATALOGOS_TECNICOS.descripcionHero}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<a href="#catalogos-tecnicos" />}>
                {TEXTOS_CATALOGOS_TECNICOS.botonHero}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {catalogs.length > 0 && (
        <div className="sticky top-navbar z-30 border-y border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90">
          <div className="container flex min-w-0 items-center gap-3 py-3">
            <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block">
              {TEXTOS_CATALOGOS_TECNICOS.navegacionEtiqueta}
            </span>
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
              {catalogs.map(({ line }) => (
                <Button
                  key={line.id}
                  size="sm"
                  variant="ghost"
                  className="shrink-0 rounded-full"
                  render={<a href={`#catalogo-${line.slug}`} />}
                >
                  {nombreCortoLinea(line.nombre)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main
        id="catalogos-tecnicos"
        className="scroll-mt-36 bg-muted/25 py-8 sm:py-10"
      >
        <div className="container">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {disponibles} de {catalogs.length} documentos disponibles
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {TEXTOS_CATALOGOS_TECNICOS.listadoTitulo}
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-right">
              {TEXTOS_CATALOGOS_TECNICOS.listadoDescripcion}
            </p>
          </div>

          {catalogs.length > 0 ? (
            <div
              className={cn(
                "grid gap-5",
                catalogs.length === 1 && "max-w-xl",
                catalogs.length === 2 && "md:grid-cols-2",
                catalogs.length >= 3 && "md:grid-cols-2 xl:grid-cols-3",
              )}
            >
              {catalogs.map((catalog) => (
                <TechnicalCatalogCard key={catalog.line.id} catalog={catalog} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-background">
              <CardContent className="py-14 text-center">
                <p className="font-semibold">
                  {TEXTOS_CATALOGOS_TECNICOS.vacioTitulo}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {TEXTOS_CATALOGOS_TECNICOS.vacioDescripcion}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
