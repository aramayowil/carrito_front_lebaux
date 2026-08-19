import {
  BadgeDollarSign,
  MessageCircle,
  Ruler,
  SlidersHorizontal,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  Beneficio,
  EncabezadoBeneficiosInicio,
  IconoBeneficio,
} from "@/types";

const ICONOS: Record<IconoBeneficio, LucideIcon> = {
  Ruler,
  SlidersHorizontal,
  BadgeDollarSign,
  MessageCircle,
  Truck,
};

/** Razones administrables en una franja de marca simple y centrada. */
export function Benefits({
  beneficios,
  encabezado,
}: {
  beneficios: Beneficio[];
  encabezado: EncabezadoBeneficiosInicio;
}) {
  if (beneficios.length === 0) return null;

  const beneficiosPrincipales = beneficios.slice(0, 4);

  return (
    <section
      id="como-comprar"
      className="scroll-mt-navbar border-y border-white/10 bg-brand-black py-10 text-white sm:py-12 lg:py-14"
      aria-labelledby="benefits-title"
    >
      <div className="container grid gap-8 lg:grid-cols-5 lg:items-start lg:gap-12">
        <div className="max-w-xl lg:col-span-2">
          <p className="eyebrow mb-2">Por qué Lebaux</p>
          <h2
            id="benefits-title"
            className="text-2xl font-bold uppercase tracking-tight sm:text-3xl"
          >
            {encabezado.titulo}
          </h2>
          {encabezado.descripcion && (
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">
              {encabezado.descripcion}
            </p>
          )}
        </div>

        <div className="grid gap-x-8 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-2 lg:col-span-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          {beneficiosPrincipales.map((beneficio, index) => {
            const Icon = ICONOS[beneficio.icono];

            return (
              <article
                key={beneficio.id}
                className={cn(
                  "flex max-w-sm items-start gap-3",
                  beneficiosPrincipales.length === 3 &&
                    index === 2 &&
                    "sm:col-span-2 sm:justify-self-center",
                )}
              >
                <span className="mt-0.5 shrink-0 text-primary">
                  <Icon
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-white sm:text-base">
                    {beneficio.titulo}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-white/55">
                    {beneficio.descripcion}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
