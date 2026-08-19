"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  FeaturedWorkCard,
  type HomeFeaturedWork,
} from "@/features/works/components/FeaturedWorkCard";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY = 5500;

/** Selección editorial de obras: carrusel mobile y composición 1+2 desktop. */
export function HomeWorksShowcase({ obras }: { obras: HomeFeaturedWork[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!api) return;

    const updateSelection = () => setSelectedIndex(api.selectedScrollSnap());
    updateSelection();
    api.on("select", updateSelection);
    api.on("reInit", updateSelection);

    return () => {
      api.off("select", updateSelection);
      api.off("reInit", updateSelection);
    };
  }, [api]);

  useEffect(() => {
    if (!api || obras.length <= 1 || isInteracting || prefersReducedMotion) {
      return;
    }

    const timeout = window.setTimeout(() => api.scrollNext(), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timeout);
  }, [api, isInteracting, obras.length, prefersReducedMotion, selectedIndex]);

  return (
    <>
      <div className="lg:hidden">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: obras.length > 1 }}
          className="w-full"
          aria-label="Obras destacadas"
          onPointerDownCapture={() => setIsInteracting(true)}
          onPointerUpCapture={() => setIsInteracting(false)}
          onPointerCancelCapture={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={() => setIsInteracting(false)}
        >
          <CarouselContent>
            {obras.map((obra, index) => (
              <CarouselItem key={obra.id} className="basis-full">
                <FeaturedWorkCard obra={obra} priority={index === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {obras.length > 1 && (
          <div
            className="mt-4 flex items-center justify-center gap-2"
            aria-label="Seleccionar obra destacada"
          >
            {obras.map((obra, index) => (
              <button
                key={obra.id}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "size-2 rounded-full transition-[width,background-color] duration-300 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                  selectedIndex === index ? "w-6 bg-primary" : "bg-border",
                )}
                aria-label={`Ir a ${obra.titulo}`}
                aria-current={selectedIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          "hidden gap-4 lg:grid",
          obras.length === 1 && "mx-auto max-w-2xl grid-cols-1",
          obras.length === 2 && "mx-auto max-w-5xl grid-cols-2",
          obras.length >= 3 && "grid-cols-3",
        )}
      >
        {obras.map((obra, index) => (
          <FeaturedWorkCard key={obra.id} obra={obra} priority={index === 0} />
        ))}
      </div>
    </>
  );
}
