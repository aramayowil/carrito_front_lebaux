import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { OpcionFiltro } from "@/features/products/lib/facets";
import { cn } from "@/lib/utils";

interface CatalogFilterOptionListProps {
  options: OpcionFiltro[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

/** Lista compacta de opciones de selección exclusiva para filtros de catálogo. */
export function CatalogFilterOptionList({
  options,
  value,
  onChange,
  className,
}: CatalogFilterOptionListProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            aria-pressed={active}
            onClick={() => onChange(active ? null : option.value)}
            className={cn(
              "h-auto min-h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 py-2 text-left whitespace-normal",
              active && "bg-primary/10 text-foreground hover:bg-primary/15",
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border border-foreground/20",
                active && "border-primary bg-primary text-primary-foreground",
              )}
              aria-hidden="true"
            >
              {active && <Check className="size-3" />}
            </span>
            <span className="min-w-0 flex-1 font-medium">{option.label}</span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {option.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
