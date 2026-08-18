"use client";

import { useMemo, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Tabs
        value={categoriaActiva}
        onValueChange={(value) => {
          if (value) setCategoriaActiva(String(value));
        }}
        className="works-reveal-soft mb-6 min-w-0 gap-0 sm:mb-7"
      >
        <div
          className="works-category-scroll -mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
          aria-label="Filtrar obras por categoría"
        >
          <TabsList
            variant="line"
            className="h-11 min-w-max justify-start gap-3 p-0 sm:gap-5"
          >
            <TabsTrigger
              value={TODAS_LAS_CATEGORIAS}
              className="h-11 flex-none rounded-none border-b-4 border-b-transparent! px-0 text-muted-foreground after:hidden data-active:border-b-primary! data-active:bg-transparent data-active:text-foreground sm:px-1"
            >
              Todas las obras
            </TabsTrigger>

            {categorias.map((categoria) => (
              <TabsTrigger
                key={categoria.id}
                value={categoria.id}
                className="h-11 flex-none rounded-none border-b-4 border-b-transparent! px-0 text-muted-foreground after:hidden data-active:border-b-primary! data-active:bg-transparent data-active:text-foreground sm:px-1"
              >
                {categoria.nombre}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {obrasVisibles.length > 0 ? (
        <div
          id="works-gallery-results"
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
