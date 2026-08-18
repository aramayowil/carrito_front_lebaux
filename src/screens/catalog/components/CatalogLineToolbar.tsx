"use client";

import type { ReactNode } from "react";
import { ArrowDownUp, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TipologiaProducto } from "@/types";

export type CatalogOrder = "relevancia" | "precio-asc" | "precio-desc";

const OPCIONES_ORDEN: Array<{ value: CatalogOrder; label: string }> = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
];

interface CatalogLineToolbarProps {
  allValue: string;
  activeTypologyId: string;
  typologies: TipologiaProducto[];
  order: CatalogOrder;
  activeFilterCount: number;
  visibleProductsCount: number;
  resultsPending: boolean;
  filtersOpen: boolean;
  filters: ReactNode;
  onFiltersOpenChange: (open: boolean) => void;
  onTypologyChange: (value: string | number) => void;
  onOrderChange: (value: CatalogOrder) => void;
}

function OrderSelect({
  order,
  onOrderChange,
  className,
}: Pick<CatalogLineToolbarProps, "order" | "onOrderChange"> & {
  className?: string;
}) {
  return (
    <Select
      items={OPCIONES_ORDEN}
      value={order}
      onValueChange={(value) => value && onOrderChange(value as CatalogOrder)}
    >
      <SelectTrigger className={className} aria-label="Ordenar productos">
        <ArrowDownUp className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {OPCIONES_ORDEN.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FiltersButton({
  activeFilterCount,
  onClick,
  className,
}: {
  activeFilterCount: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button variant="outline" size="sm" className={className} onClick={onClick}>
      <Filter data-icon="inline-start" />
      Filtrar
      {activeFilterCount > 0 && (
        <Badge className="ml-1 size-5 justify-center rounded-full p-0 text-[0.625rem]">
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
}

/** Navegación sticky de tipologías, filtros responsive y orden del catálogo. */
export function CatalogLineToolbar({
  allValue,
  activeTypologyId,
  typologies,
  order,
  activeFilterCount,
  visibleProductsCount,
  resultsPending,
  filtersOpen,
  filters,
  onFiltersOpenChange,
  onTypologyChange,
  onOrderChange,
}: CatalogLineToolbarProps) {
  return (
    <>
      <div className="sticky top-navbar z-30 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90">
        <div className="container">
          <div className="flex min-w-0 items-center gap-3 py-2">
            <Tabs
              value={activeTypologyId}
              onValueChange={onTypologyChange}
              className="min-w-0 flex-1"
            >
              <div className="overflow-x-auto overscroll-x-contain pb-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <TabsList variant="line" className="h-10 min-w-max gap-0">
                  <TabsTrigger
                    value={allValue}
                    className="px-3 after:h-1 after:rounded-full after:bg-primary"
                  >
                    Todas
                  </TabsTrigger>
                  {typologies.map((typology) => (
                    <TabsTrigger
                      key={typology.id}
                      value={typology.id}
                      className="px-3 after:h-1 after:rounded-full after:bg-primary"
                    >
                      {typology.nombre}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>

            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <FiltersButton
                activeFilterCount={activeFilterCount}
                onClick={() => onFiltersOpenChange(true)}
                className="lg:hidden"
              />
              <OrderSelect
                order={order}
                onOrderChange={onOrderChange}
                className="h-9 min-w-40 border-border bg-background"
              />
            </div>
          </div>

          <div className="flex gap-2 border-t border-border/60 py-2 sm:hidden">
            <FiltersButton
              activeFilterCount={activeFilterCount}
              onClick={() => onFiltersOpenChange(true)}
              className="flex-1"
            />
            <OrderSelect
              order={order}
              onOrderChange={onOrderChange}
              className="h-8 min-w-0 flex-1 border-border bg-background"
            />
          </div>
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={onFiltersOpenChange}>
        <SheetContent side="left" className="w-11/12 max-w-sm">
          <SheetHeader className="border-b">
            <SheetTitle>Filtrar productos</SheetTitle>
            <SheetDescription>
              Elegí las características de tu abertura.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {filters}
          </div>
          <SheetFooter className="border-t">
            <SheetClose render={<Button size="lg" className="w-full" />}>
              {resultsPending
                ? "Actualizando resultados…"
                : `Ver ${visibleProductsCount} productos`}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
