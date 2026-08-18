"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CatalogFilterOptionList } from "@/features/products/components/CatalogFilterOptionList";
import type { OpcionFiltro } from "@/features/products/lib/facets";

const LIMITE_MEDIDAS_VISIBLES = 5;

function normalizarBusqueda(valor: string) {
  return valor
    .toLocaleLowerCase("es")
    .replaceAll("×", "x")
    .replace(/\s+/g, "")
    .trim();
}

interface CatalogSizeFilterProps {
  title: string;
  options: OpcionFiltro[];
  value: string | null;
  onChange: (value: string | null) => void;
}

/** Buscador de medidas con sugerencias iniciales y expansión bajo demanda. */
export function CatalogSizeFilter({
  title,
  options,
  value,
  onChange,
}: CatalogSizeFilterProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredOptions = useMemo(() => {
    const selectedOption = options.find((option) => option.value === value);
    const orderedOptions = selectedOption
      ? [selectedOption, ...options.filter((option) => option.value !== value)]
      : options;
    const normalizedQuery = normalizarBusqueda(query);

    if (!normalizedQuery) return orderedOptions;
    return orderedOptions.filter((option) =>
      normalizarBusqueda(`${option.label} ${option.value}`).includes(
        normalizedQuery,
      ),
    );
  }, [options, query, value]);

  const visibleOptions = expanded
    ? filteredOptions
    : filteredOptions.slice(0, LIMITE_MEDIDAS_VISIBLES);
  const hiddenOptionsCount = filteredOptions.length - visibleOptions.length;

  if (options.length === 0) return null;

  function selectSize(nextValue: string | null) {
    onChange(nextValue);
    setQuery("");
    setExpanded(false);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;

    const normalizedQuery = normalizarBusqueda(query);
    const exactMatch = filteredOptions.find(
      (option) =>
        normalizarBusqueda(option.label) === normalizedQuery ||
        normalizarBusqueda(option.value) === normalizedQuery,
    );
    const option =
      exactMatch ??
      (filteredOptions.length === 1 ? filteredOptions[0] : undefined);

    if (!option) return;
    event.preventDefault();
    selectSize(option.value);
  }

  return (
    <div className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Escribí una medida o elegí una opción.
          </p>
        </div>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() => selectSize(null)}
          >
            Quitar
          </Button>
        )}
      </div>

      <div className="relative mt-3">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setExpanded(false);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Ej. 120 x 100"
          aria-label="Buscar medida"
          className="h-9 rounded-xl border-border bg-background pl-9"
        />
      </div>

      <div className="mt-2" aria-label="Medidas disponibles">
        {visibleOptions.length > 0 ? (
          <>
            <CatalogFilterOptionList
              options={visibleOptions}
              value={value}
              onChange={selectSize}
            />
            {filteredOptions.length > LIMITE_MEDIDAS_VISIBLES && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-xs text-muted-foreground"
                onClick={() => setExpanded((current) => !current)}
              >
                {expanded
                  ? "Ver menos"
                  : `Ver ${hiddenOptionsCount} medidas más`}
                {expanded ? (
                  <ChevronUp data-icon="inline-end" />
                ) : (
                  <ChevronDown data-icon="inline-end" />
                )}
              </Button>
            )}
          </>
        ) : (
          <p className="px-2 py-5 text-center text-xs text-muted-foreground">
            No encontramos esa medida.
          </p>
        )}
      </div>
    </div>
  );
}
