import { Button } from "@/components/ui/button";
import { CatalogProductCard } from "@/features/products/components/CatalogProductCard";
import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";
import { cn } from "@/lib/utils";
import type {
  Producto,
  TipoAperturaProducto,
  TipologiaProducto,
} from "@/types";

interface ProductGridProps {
  products: Producto[];
  tipologias?: TipologiaProducto[];
  tiposApertura?: TipoAperturaProducto[];
  loading?: boolean;
  className?: string;
  onClearFilters?: () => void;
}

/** Grilla responsive única para los catálogos por línea. */
export function ProductGrid({
  products,
  tipologias = [],
  tiposApertura = [],
  loading = false,
  className,
  onClearFilters,
}: ProductGridProps) {
  const gridClassName = cn(
    "grid grid-cols-1 items-stretch gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4",
    className,
  );

  if (loading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-background px-6 py-16 text-center">
        <p className="text-lg font-semibold">
          {"No encontramos coincidencias"}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {"Probá quitando algún filtro para volver a ampliar los resultados."}
        </p>
        {onClearFilters && (
          <Button variant="outline" className="mt-5" onClick={onClearFilters}>
            {"Limpiar filtros"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product, index) => (
        <CatalogProductCard
          key={product.id}
          product={product}
          tipologiaNombre={
            tipologias.find((item) => item.id === product.tipologiaId)?.nombre
          }
          aperturaNombre={
            tiposApertura.find((item) => item.slug === product.tipoApertura)
              ?.nombre
          }
          priority={index === 0}
        />
      ))}
    </div>
  );
}
