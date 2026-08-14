import {
  DynamicIcon,
  iconNames,
  type IconName,
} from "lucide-react/dynamic"

import { RichTextContent } from "@/components/content/RichTextContent"
import { ProductImage } from "@/components/media/ProductImage"
import { Card, CardContent } from "@/components/ui/card"
import {
  crearSrcSetCloudinary,
  crearUrlCloudinaryOptimizada,
} from "@/services/cloudinary/imagen-entrega"
import type { AcercaDeNosotrosInicio } from "@/types"

const ICONOS_LUCIDE = new Set<string>(iconNames)

function iconoSeguro(nombre: string): IconName {
  return ICONOS_LUCIDE.has(nombre) ? (nombre as IconName) : "sparkles"
}

/** Presentación institucional completamente administrable de la fábrica. */
export function AboutSection({
  contenido,
}: {
  contenido: AcercaDeNosotrosInicio
}) {
  const imagenOptimizada = crearUrlCloudinaryOptimizada(contenido.imagenUrl, {
    ancho: 1200,
    recorte: "limit",
  })
  const imagenSrcSet = crearSrcSetCloudinary(
    contenido.imagenUrl,
    [480, 640, 800, 960, 1200],
    { recorte: "limit" },
  )
  const fortalezasActivas = contenido.fortalezas.filter(
    (fortaleza) => fortaleza.activo,
  )

  return (
    <section
      id="nosotros"
      className="bg-background py-16 sm:py-20"
      aria-labelledby="about-title"
    >
      <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <ProductImage
            src={imagenOptimizada}
            srcSet={imagenSrcSet}
            sizes="(min-width: 1024px) 52vw, (min-width: 640px) 90vw, 100vw"
            alt={contenido.imagenAlt}
            className="corner-marks-static relative aspect-[4/3] w-full rounded-3xl bg-white shadow-xl"
            imgClassName="object-cover"
          />
        </div>

        <div>
          {contenido.antetitulo && (
            <p className="eyebrow mb-2">{contenido.antetitulo}</p>
          )}
          <h2
            id="about-title"
            className="section-title section-title-left mb-6"
          >
            {contenido.titulo}
          </h2>
          {contenido.textoDescriptivo && (
            <RichTextContent
              html={contenido.textoDescriptivo}
              className="text-base leading-7 text-muted-foreground"
            />
          )}

          {fortalezasActivas.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {fortalezasActivas.map((fortaleza) => (
                <Card
                  key={fortaleza.id}
                  size="sm"
                  className="gap-0 border border-border/70 py-0 shadow-none"
                >
                  <CardContent className="flex items-start gap-4 px-4 py-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <DynamicIcon
                        name={iconoSeguro(fortaleza.icono)}
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold">{fortaleza.titulo}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {fortaleza.descripcion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
