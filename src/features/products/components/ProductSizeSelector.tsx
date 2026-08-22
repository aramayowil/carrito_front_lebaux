"use client";

import { useMemo, useState } from "react";
import { Ruler, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completarTextoPublico } from "@/lib/public-text";
import type { OpcionMedida } from "@/types";

interface ProductSizeSelectorProps {
  productId: string;
  medidas: OpcionMedida[];
  medidaId: string;
  onChange: (medidaId: string) => void;
  isAvailable?: (medidaId: string) => boolean;
}

function normalizarMedida(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/×/g, "x")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Selector híbrido: medidas frecuentes visibles y listado completo cuando abundan. */
export function ProductSizeSelector({
  productId,
  medidas,
  medidaId,
  onChange,
  isAvailable,
}: ProductSizeSelectorProps) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const selectedMeasure = medidas.find((medida) => medida.id === medidaId);
  const hasMore = medidas.length > 6;
  const firstMeasures = hasMore ? medidas.slice(0, 4) : medidas;
  const quickMeasures =
    hasMore &&
    selectedMeasure &&
    !firstMeasures.some((medida) => medida.id === selectedMeasure.id)
      ? [...firstMeasures, selectedMeasure]
      : hasMore
        ? medidas.slice(0, 5)
        : firstMeasures;
  const busquedaNormalizada = normalizarMedida(busqueda);
  const medidasFiltradas = useMemo(
    () =>
      busquedaNormalizada
        ? medidas.filter((medida) =>
            normalizarMedida(medida.etiqueta).includes(busquedaNormalizada),
          )
        : medidas,
    [busquedaNormalizada, medidas],
  );

  function seleccionarMedida(id: string) {
    onChange(id);
    setModalAbierto(false);
    setBusqueda("");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label id={"medida-label-" + productId}>{"Medida"}</Label>
        <span className="text-xs text-muted-foreground">
          {completarTextoPublico("{cantidad} opciones", {
            cantidad: medidas.length,
          })}
        </span>
      </div>

      <div
        className="flex flex-wrap gap-2"
        aria-labelledby={`medida-label-${productId}`}
      >
        {quickMeasures.map((medida) => {
          const selected = medida.id === medidaId;
          const available = isAvailable?.(medida.id) ?? true;
          return (
            <Button
              key={medida.id}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              className="rounded-xl"
              aria-pressed={selected}
              disabled={!available}
              onClick={() => onChange(medida.id)}
            >
              {medida.etiqueta}
            </Button>
          );
        })}

        {hasMore && (
          <Dialog
            open={modalAbierto}
            onOpenChange={(open) => {
              setModalAbierto(open);
              if (!open) setBusqueda("");
            }}
          >
            <DialogTrigger
              render={
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  aria-label="Ver y buscar todas las medidas"
                />
              }
            >
              <Ruler className="size-4 text-muted-foreground" />
              Ver todas
            </DialogTrigger>

            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
              <DialogHeader className="border-b px-5 py-5 pr-14">
                <DialogTitle>{"Elegí una medida"}</DialogTitle>
                <DialogDescription>
                  {
                    "Buscá entre todas las opciones disponibles para este producto."
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="border-b p-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    autoFocus
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="Ej.: 120 x 100"
                    className="h-11 border-border bg-background pl-10"
                    aria-label="Buscar una medida"
                  />
                </div>
              </div>

              <div className="max-h-[min(60svh,30rem)] overflow-y-auto p-4">
                {medidasFiltradas.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {medidasFiltradas.map((medida) => {
                      const selected = medida.id === medidaId;
                      const available = isAvailable?.(medida.id) ?? true;

                      return (
                        <Button
                          key={medida.id}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          className="h-11 justify-start rounded-xl px-3"
                          aria-pressed={selected}
                          disabled={!available}
                          onClick={() => seleccionarMedida(medida.id)}
                        >
                          <Ruler className="size-4" aria-hidden="true" />
                          <span className="truncate">{medida.etiqueta}</span>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-36 flex-col items-center justify-center px-6 text-center">
                    <Search className="size-5 text-muted-foreground" />
                    <p className="mt-3 font-medium">
                      {"No encontramos esa medida"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {"Probá escribiéndola con otro formato."}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
