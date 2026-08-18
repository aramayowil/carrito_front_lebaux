"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { WorkCard } from "@/features/site-content/components/WorkCard";
import type { CategoriaObraMock, ObraMock } from "@/data/mock/obras";

const TODAS_LAS_CATEGORIAS = "todas";

/** Filtra en cliente una colección de obras usando categorías administrables. */
export function WorksGallery({
  categorias,
  obras,
}: {
  categorias: CategoriaObraMock[];
  obras: ObraMock[];
}) {
  const [categoriaActiva, setCategoriaActiva] = useState(TODAS_LAS_CATEGORIAS);
  const obrasVisibles = useMemo(
    () =>
      categoriaActiva === TODAS_LAS_CATEGORIAS
        ? obras
        : obras.filter((obra) => obra.categoriaId === categoriaActiva),
    [categoriaActiva, obras],
  );

  return (
    <>
      <div
        className="works-category-scroll works-reveal-soft -mx-4 mb-6 flex snap-x snap-proximity gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mb-7 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        aria-label="Filtrar obras por categoría"
      >
        <Button
          size="sm"
          variant={
            categoriaActiva === TODAS_LAS_CATEGORIAS ? "default" : "outline"
          }
          className="h-8 shrink-0 snap-start rounded-full px-3 text-xs"
          aria-pressed={categoriaActiva === TODAS_LAS_CATEGORIAS}
          onClick={() => setCategoriaActiva(TODAS_LAS_CATEGORIAS)}
        >
          Todos
        </Button>

        {categorias.map((categoria) => {
          const activa = categoriaActiva === categoria.id;

          return (
            <Button
              key={categoria.id}
              size="sm"
              variant={activa ? "default" : "outline"}
              className="h-8 shrink-0 snap-start rounded-full px-3 text-xs"
              aria-pressed={activa}
              onClick={() => setCategoriaActiva(categoria.id)}
            >
              {categoria.nombre}
            </Button>
          );
        })}
      </div>

      {obrasVisibles.length > 0 ? (
        <div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          aria-live="polite"
        >
          {obrasVisibles.map((obra, index) => (
            <WorkCard
              key={obra.id}
              obra={obra}
              priority={index < 2}
              href={`/obras/${obra.slug}`}
              className="works-reveal-soft"
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed bg-background px-5 py-12 text-center text-sm text-muted-foreground">
          Todavía no hay obras publicadas en esta categoría.
        </p>
      )}
    </>
  );
}
