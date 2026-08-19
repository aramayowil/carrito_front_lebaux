"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { ProductImage } from "@/components/media/ProductImage";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Obra } from "@/types";

/** Selector compacto que presenta una sola comparación antes/después por vez. */
export function WorksRemodelations({ obras }: { obras: Obra[] }) {
  const [remodelacionId, setRemodelacionId] = useState(obras[0]?.id ?? "");
  const obra = obras.find((item) => item.id === remodelacionId) ?? obras[0];
  const remodelacion = obra?.antesYDespues;

  if (!obra || !remodelacion?.activo) return null;

  return (
    <Tabs
      value={obra.id}
      onValueChange={(value) => {
        if (value) setRemodelacionId(String(value));
      }}
      className="gap-0"
    >
      {obras.length > 1 && (
        <div className="mb-6 overflow-x-auto pb-1">
          <TabsList
            variant="line"
            className="h-11 min-w-max justify-start gap-5 p-0"
            aria-label="Elegir remodelación"
          >
            {obras.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="h-11 flex-none rounded-none border-b-4 border-b-transparent! px-0 text-muted-foreground after:hidden data-active:border-b-primary! data-active:bg-transparent data-active:text-foreground"
              >
                {item.titulo}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      )}

      <article key={obra.id} className="works-reveal">
        <div className="grid gap-6 md:grid-cols-2 md:gap-4">
          <figure>
            <div className="overflow-hidden rounded-xl bg-muted">
              <ProductImage
                src={remodelacion.imagenAntes}
                alt={`Antes de ${obra.titulo}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-4/3 w-full"
                imgClassName="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Antes
            </figcaption>
          </figure>

          <figure>
            <div className="overflow-hidden rounded-xl bg-muted">
              <ProductImage
                src={remodelacion.imagenDespues}
                alt={`Después de ${obra.titulo}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-4/3 w-full"
                imgClassName="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Después
            </figcaption>
          </figure>
        </div>

        <div className="mt-7 grid gap-5 border-t border-border pt-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {obra.ubicacion}
            </p>
          </div>

          <div>
            <p className="leading-7 text-muted-foreground">
              {remodelacion.descripcion}
            </p>
          </div>
        </div>
      </article>
    </Tabs>
  );
}
