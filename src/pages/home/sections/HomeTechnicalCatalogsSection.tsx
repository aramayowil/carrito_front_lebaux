import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LineaProducto } from "@/types"

/** Franja compacta que conecta la Home con la biblioteca profesional. */
export function HomeTechnicalCatalogsSection({
  lines,
}: {
  lines: LineaProducto[]
}) {
  if (lines.length === 0) return null

  return (
    <section
      aria-labelledby="technical-catalogs-title"
      className="border-y border-white/10 bg-brand-black py-6 text-white sm:py-7 lg:py-8"
    >
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Catálogo técnico
            </p>
            <h2
              id="technical-catalogs-title"
              className="mt-2 text-xl font-bold tracking-tight text-balance sm:text-2xl lg:text-3xl"
            >
              Información técnica para profesionales
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              Consultá perfiles, vidrios, prestaciones y especificaciones de cada línea para definir mejor tu proyecto.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div
              className="hidden flex-wrap gap-2 xl:flex"
              aria-label="Líneas con catálogo técnico"
            >
              {lines.map((line) => (
                <Badge
                  key={line.id}
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white"
                >
                  {line.nombre}
                </Badge>
              ))}
            </div>
            <Button
              className="w-full rounded-xl sm:w-auto"
              render={<Link href="/catalogos-tecnicos" />}
            >
              Ver catálogos técnicos
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
