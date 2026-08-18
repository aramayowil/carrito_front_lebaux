import { LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActiveFilter {
  key: string;
  label: string;
}

interface CatalogResultsHeaderProps {
  title: string;
  visibleCount: number;
  totalCount: number;
  pending: boolean;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
}

/** Título, estado y resumen removible de los resultados del catálogo. */
export function CatalogResultsHeader({
  title,
  visibleCount,
  totalCount,
  pending,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
}: CatalogResultsHeaderProps) {
  return (
    <header className="mb-7 border-b border-border/70 pb-5 sm:mb-8 sm:pb-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p
          className="mt-1.5 flex min-h-5 items-center gap-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          {pending ? (
            <>
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
              Actualizando resultados…
            </>
          ) : (
            `Mostrando ${visibleCount} de ${totalCount} productos`
          )}
        </p>
      </div>

      {activeFilters.length > 0 && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2"
          aria-label="Filtros aplicados"
        >
          {activeFilters.map((filter) => (
            <Button
              key={filter.key}
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-lg bg-background px-2.5 text-xs"
              onClick={() => onRemoveFilter(filter.key)}
            >
              {filter.label}
              <X data-icon="inline-end" />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs text-muted-foreground"
            onClick={onClearFilters}
          >
            Limpiar todo
          </Button>
        </div>
      )}
    </header>
  );
}
