import {
  BadgeDollarSign,
  MessageCircle,
  Ruler,
  SlidersHorizontal,
  Truck,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type {
  Beneficio,
  EncabezadoBeneficiosInicio,
  IconoBeneficio,
} from "@/types"

const ICONOS: Record<IconoBeneficio, LucideIcon> = {
  Ruler,
  SlidersHorizontal,
  BadgeDollarSign,
  MessageCircle,
  Truck,
}

/** Razones administrables en una franja de marca simple y centrada. */
export function Benefits({
  beneficios,
  encabezado,
}: {
  beneficios: Beneficio[]
  encabezado: EncabezadoBeneficiosInicio
}) {
  if (beneficios.length === 0) return null

  return (
    <section
      id="como-comprar"
      className="scroll-mt-navbar border-y border-white/10 bg-brand-black py-14 text-white sm:py-16 lg:py-20"
      aria-labelledby="benefits-title"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 flex justify-center">Por qué Lebaux</p>
          <h2
            id="benefits-title"
            className="text-3xl font-bold uppercase tracking-tight sm:text-4xl"
          >
            {encabezado.titulo}
          </h2>
          {encabezado.descripcion && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              {encabezado.descripcion}
            </p>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-screen-2xl flex-wrap justify-center gap-y-10 border-t border-white/10 pt-9 sm:mt-12 sm:pt-10">
          {beneficios.map((beneficio) => {
            const Icon = ICONOS[beneficio.icono]

            return (
              <article
                key={beneficio.id}
                className={cn(
                  "flex basis-full flex-col items-center px-5 text-center sm:basis-1/2",
                  beneficios.length === 1 && "max-w-2xl",
                  beneficios.length === 3 && "lg:basis-1/3",
                  beneficios.length === 4 && "lg:basis-1/4",
                  beneficios.length >= 5 && "lg:basis-1/3 xl:basis-1/5",
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-white sm:text-lg">
                  {beneficio.titulo}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                  {beneficio.descripcion}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
