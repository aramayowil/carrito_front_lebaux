"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FeaturedProductCard } from "@/features/products/components/FeaturedProductCard";
import { cn } from "@/lib/utils";
import type { Producto } from "@/types";

/** Carrusel manual de destacados exclusivo de teléfonos. */
export function HomeFeaturedProductsMobileCarousel({
  products,
}: {
  products: Producto[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [seleccionado, setSeleccionado] = useState(0);

  useEffect(() => {
    if (!api) return;

    const actualizarSeleccion = () => setSeleccionado(api.selectedScrollSnap());

    actualizarSeleccion();
    api.on("select", actualizarSeleccion);
    api.on("reInit", actualizarSeleccion);

    return () => {
      api.off("select", actualizarSeleccion);
      api.off("reInit", actualizarSeleccion);
    };
  }, [api]);

  return (
    <div className="px-1 sm:hidden">
      <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-full">
              <FeaturedProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {products.length > 1 && (
          <div
            className="mt-5 flex justify-center gap-2"
            aria-label="Elegir producto destacado"
          >
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                className={cn(
                  "size-2 touch-manipulation rounded-full border-0 bg-muted-foreground/25 p-0 outline-none transition-[width,background-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  index === seleccionado && "w-6 bg-primary",
                )}
                aria-label={`Mostrar producto destacado ${index + 1}`}
                aria-current={index === seleccionado ? "true" : undefined}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}
