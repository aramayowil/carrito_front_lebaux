import { Check } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import Link from "next/link"

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { normalizarNombreIconoLucide } from "@/components/ui/icons/lucide-icons"
import type { LineaProducto } from "@/types"

const TEXTOS_CONTENIDO_LINEA = {
  beneficiosSobrelinea: "Por qué elegir esta línea",
  beneficiosTitulo: "Lo que distingue a {linea}",
  asesoramientoTitulo: "¿Necesitás ayuda para elegir?",
  asesoramientoDescripcion: "Contanos las medidas y dónde querés instalarla.",
  asesoramientoBoton: "Consultar por WhatsApp",
  comparacionSobrelinea: "Compará alternativas",
  comparacionTitulo: "Encontrá la línea para tu proyecto",
  comparacionDescripcion:
    "Cambian las prestaciones y terminaciones, la fabricación Lebaux se mantiene en todas.",
  comparacionEtiqueta: "Línea de aluminio",
  comparacionActual: "Línea actual",
  comparacionDisponible: "Disponible",
  comparacionBoton: "Ver {linea}",
} as const
function conNombreLinea(texto: string, nombre: string) {
  return texto.replaceAll("{linea}", nombre)
}

/** Argumentos de compra, comparación breve y asesoramiento para una línea. */
export function CatalogLineMoreContent({
  lineInfo,
  lines,
  mensajeWhatsapp,
  telefonoWhatsapp,
}: {
  lineInfo: LineaProducto
  lines: LineaProducto[]
  mensajeWhatsapp: string
  telefonoWhatsapp: string
}) {
  const line = lineInfo.slug
  const beneficios = lineInfo.beneficiosCatalogo.filter(
    (beneficio) => beneficio.titulo.trim() && beneficio.descripcion.trim(),
  )
  const whatsappHref = buildWhatsAppUrl(
    conNombreLinea(mensajeWhatsapp, lineInfo.nombre),
    telefonoWhatsapp,
  )

  return (
    <div className="mt-16 space-y-16 border-t border-border/70 pt-12 sm:mt-20 sm:pt-16">
      {beneficios.length > 0 && (
        <section
          aria-labelledby="line-benefits-title"
          className="overflow-hidden rounded-3xl bg-brand-black px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3 justify-center">
              {TEXTOS_CONTENIDO_LINEA.beneficiosSobrelinea}
            </p>
            <h2
              id="line-benefits-title"
              className="text-2xl font-bold uppercase tracking-tight sm:text-3xl"
            >
              {conNombreLinea(TEXTOS_CONTENIDO_LINEA.beneficiosTitulo, lineInfo.nombre)}
            </h2>
          </div>

          <div className="mt-9 grid gap-8 border-t border-white/10 pt-9 md:grid-cols-3">
            {beneficios.slice(0, 3).map((beneficio) => {
              const icono = normalizarNombreIconoLucide(beneficio.icono)
              return (
                <article
                  key={beneficio.id}
                  className="text-center md:text-left"
                >
                  <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary md:mx-0">
                    <DynamicIcon name={icono} className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-bold">{beneficio.titulo}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {beneficio.descripcion}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-semibold">{TEXTOS_CONTENIDO_LINEA.asesoramientoTitulo}</p>
              <p className="mt-1 text-sm text-white/55">
                {TEXTOS_CONTENIDO_LINEA.asesoramientoDescripcion}
              </p>
            </div>
            <Button
              variant="whatsapp"
              size="lg"
              className="shrink-0"
              render={
                <a href={whatsappHref} target="_blank" rel="noreferrer" />
              }
            >
              <WhatsAppIcon data-icon="inline-start" />
              {TEXTOS_CONTENIDO_LINEA.asesoramientoBoton}
            </Button>
          </div>
        </section>
      )}

      <section aria-labelledby="line-comparison-title">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="eyebrow mb-3 justify-center">
            {TEXTOS_CONTENIDO_LINEA.comparacionSobrelinea}
          </p>
          <h2
            id="line-comparison-title"
            className="text-2xl font-bold uppercase tracking-tight sm:text-3xl"
          >
            {TEXTOS_CONTENIDO_LINEA.comparacionTitulo}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {TEXTOS_CONTENIDO_LINEA.comparacionDescripcion}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lines.map((item) => {
            const current = item.slug === line
            const usosRecomendados = item.idealPara
              .filter((uso) => uso.trim())
              .slice(0, 2)

            return (
              <Card
                key={item.slug}
                className={cn(
                  "h-full gap-0 rounded-2xl border py-0 shadow-none transition-colors",
                  current
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border bg-catalog-line hover:border-foreground/30 hover:bg-background",
                )}
              >
                <CardContent className="flex h-full flex-col px-5 py-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {TEXTOS_CONTENIDO_LINEA.comparacionEtiqueta}
                      </p>
                      <h3 className="mt-1 text-xl font-bold">{item.nombre}</h3>
                    </div>
                    {current ? (
                      <Badge className="shrink-0">
                        {TEXTOS_CONTENIDO_LINEA.comparacionActual}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-muted-foreground"
                      >
                        {TEXTOS_CONTENIDO_LINEA.comparacionDisponible}
                      </Badge>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.subtitulo}
                  </p>

                  {usosRecomendados.length > 0 && (
                    <ul className="mt-5 space-y-2.5 border-t border-border/70 pt-4 text-sm">
                      {usosRecomendados.map((uso) => (
                        <li key={uso} className="flex items-start gap-2">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-success"
                            aria-hidden="true"
                          />
                          <span>{uso}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {!current && (
                    <Button
                      variant="outline"
                      className="mt-6 w-full bg-background"
                      render={<Link href={`/${item.slug}`} />}
                    >
                      {conNombreLinea(TEXTOS_CONTENIDO_LINEA.comparacionBoton, item.nombre)}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
