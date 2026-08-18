import { Button } from "@/components/ui/button";
import { CatalogFilterOptionList } from "@/features/products/components/CatalogFilterOptionList";
import { CatalogSizeFilter } from "@/features/products/components/CatalogSizeFilter";
import type { OpcionFiltro } from "@/features/products/lib/facets";

export type CatalogFilterKey =
  "apertura" | "color" | "vidrio" | "medida" | "etiqueta" | "promocion";

interface CatalogFiltersPanelProps {
  openingOptions: OpcionFiltro[];
  colorOptions: OpcionFiltro[];
  glassOptions: OpcionFiltro[];
  sizeOptions: OpcionFiltro[];
  tagOptions: OpcionFiltro[];
  promotionCount: number;
  selected: Record<
    "opening" | "color" | "glass" | "size" | "tag",
    string | null
  > & {
    promotion: boolean;
  };
  activeCount: number;
  onChange: (key: CatalogFilterKey, value: string | null) => void;
  onClear: () => void;
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: OpcionFiltro[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  if (options.length === 0) return null;

  return (
    <section className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <CatalogFilterOptionList
        options={options}
        value={value}
        onChange={onChange}
        className={
          options.length > 7
            ? "max-h-64 overflow-y-auto overscroll-contain pr-1"
            : undefined
        }
      />
    </section>
  );
}

/** Grupos de filtros compartidos por el sidebar desktop y el Sheet mobile. */
export function CatalogFiltersPanel(props: CatalogFiltersPanelProps) {
  const { selected } = props;

  return (
    <div>
      {props.activeCount > 0 && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/60 px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">
            {props.activeCount === 1
              ? "1 filtro aplicado"
              : `${props.activeCount} filtros aplicados`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={props.onClear}
          >
            Limpiar
          </Button>
        </div>
      )}

      <FilterGroup
        title="Tipo de apertura"
        options={props.openingOptions}
        value={selected.opening}
        onChange={(value) => props.onChange("apertura", value)}
      />
      <CatalogSizeFilter
        title="Medida"
        options={props.sizeOptions}
        value={selected.size}
        onChange={(value) => props.onChange("medida", value)}
      />
      <FilterGroup
        title="Color"
        options={props.colorOptions}
        value={selected.color}
        onChange={(value) => props.onChange("color", value)}
      />
      <FilterGroup
        title="Tipo de vidrio"
        options={props.glassOptions}
        value={selected.glass}
        onChange={(value) => props.onChange("vidrio", value)}
      />
      <FilterGroup
        title="Características"
        options={props.tagOptions}
        value={selected.tag}
        onChange={(value) => props.onChange("etiqueta", value)}
      />
      {props.promotionCount > 0 && (
        <FilterGroup
          title="Oportunidades"
          options={[
            {
              value: "si",
              label: "Con promoción",
              count: props.promotionCount,
            },
          ]}
          value={selected.promotion ? "si" : null}
          onChange={(value) => props.onChange("promocion", value)}
        />
      )}
    </div>
  );
}
