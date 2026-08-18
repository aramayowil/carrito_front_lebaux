"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogSizeFilter } from "@/features/products/components/CatalogSizeFilter";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { resumirPromocionProducto } from "@/features/products/lib/discounts";
import { TIPOLOGIA_TODAS } from "@/features/products/lib/facets";
import { obtenerPrecioInicial } from "@/features/products/lib/pricing";
import { normalizarUrlCatalogoTecnico } from "@/features/products/lib/technical-catalog";
import {
  CatalogLineToolbar,
  type CatalogOrder,
} from "@/screens/catalog/components/CatalogLineToolbar";
import { CatalogLineMoreContent } from "@/screens/catalog/sections/CatalogLineMoreContent";
import type { Producto } from "@/types";
import type {
  DatosCatalogoLineaPublica,
  PaginaProductosLinea,
} from "@/server/datos-publicos";
import type { OpcionFiltro } from "@/features/products/lib/facets";

const PARAMS = {
  typology: "tipologia",
  tag: "etiqueta",
  opening: "apertura",
  color: "color",
  size: "medida",
  promotion: "promocion",
  order: "orden",
} as const;
const ALL = TIPOLOGIA_TODAS;
const FILTER_PARAMS = [
  PARAMS.tag,
  PARAMS.opening,
  PARAMS.color,
  PARAMS.size,
  PARAMS.promotion,
];
const EMPTY_SEARCH_PARAMS = new URLSearchParams();

const TEXTOS_CATALOGO = {
  sobrelineaHero: "Línea de fabricación",
  botonCatalogoTecnico: "Descargar catálogo técnico",
  filtrosTitulo: "Afiná tu búsqueda",
  filtrosDescripcion: "Combiná las opciones disponibles.",
  filtrosLimpiar: "Limpiar",
  filtroApertura: "Tipo de apertura",
  filtroMedida: "Medida",
  filtroColor: "Color",
  filtroCaracteristicas: "Características",
  filtroOportunidades: "Oportunidades",
  promocionEtiqueta: "Con promoción",
  contadorProductos: "{visibles} de {total} productos",
  tituloTodosModelos: "Todos los modelos {linea}",
  filtrosActivos: "Filtros activos",
  limpiarTodo: "Limpiar todo",
  filtrosPanelTitulo: "Filtros",
} as const;

function completarPlantilla(
  texto: string,
  valores: Record<string, string | number>,
): string {
  return Object.entries(valores).reduce(
    (resultado, [clave, valor]) =>
      resultado.replaceAll("{" + clave + "}", String(valor)),
    texto,
  );
}

type FilterOption = OpcionFiltro;

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              className="h-auto min-h-8 rounded-full px-3 py-1.5 whitespace-normal"
              aria-pressed={active}
              onClick={() => onChange(active ? null : option.value)}
            >
              {option.label}
              <span className={active ? "opacity-70" : "text-muted-foreground"}>
                {option.count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

interface FiltersProps {
  openingOptions: FilterOption[];
  colorOptions: FilterOption[];
  sizeOptions: FilterOption[];
  tagOptions: FilterOption[];
  promotionCount: number;
  selected: Record<"opening" | "color" | "size" | "tag", string | null> & {
    promotion: boolean;
  };
  activeCount: number;
  onChange: (key: string, value: string | null) => void;
  onClear: () => void;
}

function CatalogFilters(props: FiltersProps) {
  const { selected } = props;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{TEXTOS_CATALOGO.filtrosTitulo}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {TEXTOS_CATALOGO.filtrosDescripcion}
          </p>
        </div>
        {props.activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={props.onClear}>
            {TEXTOS_CATALOGO.filtrosLimpiar}
          </Button>
        )}
      </div>
      <FilterGroup
        title={TEXTOS_CATALOGO.filtroApertura}
        options={props.openingOptions}
        value={selected.opening}
        onChange={(value) => props.onChange(PARAMS.opening, value)}
      />
      <CatalogSizeFilter
        title={TEXTOS_CATALOGO.filtroMedida}
        options={props.sizeOptions}
        value={selected.size}
        onChange={(value) => props.onChange(PARAMS.size, value)}
      />
      <FilterGroup
        title={TEXTOS_CATALOGO.filtroColor}
        options={props.colorOptions}
        value={selected.color}
        onChange={(value) => props.onChange(PARAMS.color, value)}
      />
      <FilterGroup
        title={TEXTOS_CATALOGO.filtroCaracteristicas}
        options={props.tagOptions}
        value={selected.tag}
        onChange={(value) => props.onChange(PARAMS.tag, value)}
      />
      {props.promotionCount > 0 && (
        <FilterGroup
          title={TEXTOS_CATALOGO.filtroOportunidades}
          options={[
            {
              value: "si",
              label: TEXTOS_CATALOGO.promocionEtiqueta,
              count: props.promotionCount,
            },
          ]}
          value={selected.promotion ? "si" : null}
          onChange={(value) => props.onChange(PARAMS.promotion, value)}
        />
      )}
    </div>
  );
}

function sortProducts(products: Producto[], order: CatalogOrder) {
  const result = [...products];
  if (order === "relevancia") {
    return result.sort((a, b) => Number(b.destacado) - Number(a.destacado));
  }
  return result.sort((a, b) => {
    const priceA = obtenerPrecioInicial(a)?.contado ?? null;
    const priceB = obtenerPrecioInicial(b)?.contado ?? null;
    if (priceA === null) return 1;
    if (priceB === null) return -1;
    return order === "precio-asc" ? priceA - priceB : priceB - priceA;
  });
}

/** Catálogo editorial por línea con filtros responsive, estado en la URL y scroll infinito. */
export function CatalogLinePage({
  datos,
}: {
  datos: DatosCatalogoLineaPublica;
}) {
  const lineaSlug = datos.linea.slug;
  const searchParams = useSearchParams() ?? EMPTY_SEARCH_PARAMS;
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { lineas, tipologias, tiposApertura } = datos;
  const lineInfo = datos.linea;

  // --- Carga bajo demanda -------------------------------------------------
  // `datos.productos` trae únicamente la primera tanda (ver PRODUCTOS_POR_TANDA
  // en datos-publicos.ts). El resto se pide a /api/productos-linea/[lineaSlug]
  // a medida que hace falta: por scroll infinito en la vista sin filtrar, o
  // de una sola vez cuando el usuario activa un filtro/tipología/orden que
  // necesita el catálogo completo para dar resultados correctos.
  const [products, setProducts] = useState<Producto[]>(datos.productos);
  const [offset, setOffset] = useState(datos.productos.length);
  const [hasMore, setHasMore] = useState(
    datos.productos.length < datos.totalProductos,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const cargarSiguienteTanda = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoadingMore(true);
    try {
      const respuesta = await fetch(
        `/api/productos-linea/${lineaSlug}?offset=${offset}`,
      );
      if (!respuesta.ok) return;
      const pagina = (await respuesta.json()) as PaginaProductosLinea;
      setProducts((actual) => {
        const idsActuales = new Set(actual.map((item) => item.id));
        const nuevos = pagina.productos.filter(
          (item) => !idsActuales.has(item.id),
        );
        return [...actual, ...nuevos];
      });
      setOffset((actual) => actual + pagina.productos.length);
      setHasMore(pagina.hasMore);
    } catch {
      // Si falla, dejamos hasMore como está para permitir reintentar.
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, lineaSlug, offset]);

  // A diferencia del scroll infinito (que pide de a una tanda), acá hace
  // falta el catálogo completo cuanto antes, así que se repite el pedido
  // hasta agotar `hasMore` en vez de esperar a que el usuario haga scroll.
  const cargarTodoElResto = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoadingMore(true);
    try {
      let cursor = offset;
      let sigue = hasMore;
      while (sigue) {
        const respuesta = await fetch(
          `/api/productos-linea/${lineaSlug}?offset=${cursor}&limit=100`,
        );
        if (!respuesta.ok) break;
        const pagina = (await respuesta.json()) as PaginaProductosLinea;
        setProducts((actual) => {
          const idsActuales = new Set(actual.map((item) => item.id));
          const nuevos = pagina.productos.filter(
            (item) => !idsActuales.has(item.id),
          );
          return [...actual, ...nuevos];
        });
        cursor += pagina.productos.length;
        sigue = pagina.hasMore;
        setOffset(cursor);
        setHasMore(sigue);
        if (pagina.productos.length === 0) break;
      }
    } catch {
      // Si falla, dejamos hasMore como está para permitir reintentar.
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, lineaSlug, offset]);

  const lineProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.linea === lineaSlug && product.visibilidad === "visible",
      ),
    [lineaSlug, products],
  );
  const lineTypologies = useMemo(
    () =>
      [...tipologias]
        .filter((typology) => typology.lineaSlug === lineaSlug)
        .sort((a, b) => a.orden - b.orden),
    [lineaSlug, tipologias],
  );

  const typologyParam = searchParams.get(PARAMS.typology);
  const activeTypologyId = lineTypologies.some(
    (typology) => typology.id === typologyParam,
  )
    ? (typologyParam ?? ALL)
    : ALL;
  const activeTypology = lineTypologies.find(
    (typology) => typology.id === activeTypologyId,
  );
  const typologyProducts =
    activeTypologyId === ALL
      ? lineProducts
      : lineProducts.filter(
          (product) => product.tipologiaId === activeTypologyId,
        );

  // Las opciones de filtro (con sus conteos) ya vienen calculadas del
  // servidor sobre el catálogo completo de la línea, así que están
  // disponibles y son correctas incluso antes de terminar de cargar todos
  // los productos en el cliente.
  const facetasActivas =
    datos.facetas[activeTypologyId] ?? datos.facetas[TIPOLOGIA_TODAS];
  const {
    totalProductos: totalProductosTipologia,
    openingOptions,
    colorOptions,
    sizeOptions,
    tagOptions,
    promotionCount,
  } = facetasActivas;

  function validValue(name: string, options: FilterOption[]) {
    const value = searchParams.get(name);
    return value && options.some((option) => option.value === value)
      ? value
      : null;
  }

  const selected = {
    opening: validValue(PARAMS.opening, openingOptions),
    color: validValue(PARAMS.color, colorOptions),
    size: validValue(PARAMS.size, sizeOptions),
    tag: validValue(PARAMS.tag, tagOptions),
    promotion:
      searchParams.get(PARAMS.promotion) === "si" && promotionCount > 0,
  };
  const activeFilterCount = Object.values(selected).filter(Boolean).length;
  const orderParam = searchParams.get(PARAMS.order);
  const order: CatalogOrder = [
    "relevancia",
    "precio-asc",
    "precio-desc",
  ].includes(orderParam ?? "")
    ? (orderParam as CatalogOrder)
    : "relevancia";

  // Filtrar por tipología, algún filtro puntual, u ordenar por precio solo
  // da resultados correctos con el catálogo completo de la línea en memoria
  // (no podemos pedirle a Supabase esas combinaciones por tanda porque esos
  // campos viven dentro del payload del producto, no en columnas propias).
  // Por eso, apenas se activa alguno de estos, disparamos la carga del resto
  // en el momento, en vez de esperar a que el usuario llegue al final de la
  // grilla.
  const necesitaCatalogoCompleto =
    activeTypologyId !== ALL || activeFilterCount > 0 || order !== "relevancia";

  useEffect(() => {
    if (necesitaCatalogoCompleto && hasMore && !loadingRef.current) {
      void cargarTodoElResto();
    }
  }, [necesitaCatalogoCompleto, hasMore, cargarTodoElResto]);

  // Scroll infinito: solo mientras se navega el catálogo sin filtrar, que es
  // el caso en el que sí podemos pedir tandas sucesivas directo a Supabase.
  useEffect(() => {
    if (necesitaCatalogoCompleto || !hasMore) return;
    const nodo = sentinelRef.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void cargarSiguienteTanda();
      },
      { rootMargin: "600px" },
    );
    observer.observe(nodo);
    return () => observer.disconnect();
  }, [necesitaCatalogoCompleto, hasMore, cargarSiguienteTanda]);

  const filteredProducts = typologyProducts.filter((product) => {
    if (selected.opening && product.tipoApertura !== selected.opening)
      return false;
    if (
      selected.color &&
      !product.coloresDisponibles.some((color) => color.slug === selected.color)
    ) {
      return false;
    }
    if (
      selected.size &&
      !product.medidasDisponibles.some(
        (size) => size.etiqueta === selected.size,
      )
    ) {
      return false;
    }
    if (selected.tag && !product.etiquetas.includes(selected.tag)) return false;
    if (selected.promotion && !resumirPromocionProducto(product)) return false;
    return true;
  });
  const visibleProducts = sortProducts(filteredProducts, order);
  const totalCatalogo = totalProductosTipologia;

  function updateParam(name: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === ALL) next.delete(name);
    else next.set(name, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function selectTypology(value: string | number) {
    const next = new URLSearchParams(searchParams);
    const id = String(value);
    if (id === ALL) next.delete(PARAMS.typology);
    else next.set(PARAMS.typology, id);
    FILTER_PARAMS.forEach((param) => next.delete(param));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams);
    FILTER_PARAMS.forEach((param) => next.delete(param));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  if (!lineInfo) return null;

  const catalogoTecnicoUrl = normalizarUrlCatalogoTecnico(
    lineInfo.catalogoTecnicoUrl,
  );

  const activeFilters: Array<{ key: string; label: string }> = [];
  const activeOpening = openingOptions.find(
    (item) => item.value === selected.opening,
  )?.label;
  const activeColor = colorOptions.find(
    (item) => item.value === selected.color,
  )?.label;
  if (selected.opening && activeOpening) {
    activeFilters.push({ key: PARAMS.opening, label: activeOpening });
  }
  if (selected.size) {
    activeFilters.push({ key: PARAMS.size, label: selected.size });
  }
  if (selected.color && activeColor) {
    activeFilters.push({ key: PARAMS.color, label: activeColor });
  }
  if (selected.tag)
    activeFilters.push({ key: PARAMS.tag, label: selected.tag });
  if (selected.promotion) {
    activeFilters.push({
      key: PARAMS.promotion,
      label: TEXTOS_CATALOGO.promocionEtiqueta,
    });
  }

  const filtersProps: FiltersProps = {
    openingOptions,
    colorOptions,
    sizeOptions,
    tagOptions,
    promotionCount,
    selected,
    activeCount: activeFilterCount,
    onChange: updateParam,
    onClear: clearFilters,
  };

  return (
    <div className="bg-background">
      <section
        aria-labelledby="titulo-linea"
        className="border-b border-border/70 bg-muted/30 py-8 sm:py-10 lg:py-12"
      >
        <div className="container grid items-end gap-7 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">{TEXTOS_CATALOGO.sobrelineaHero}</p>
            <h1
              id="titulo-linea"
              className="text-4xl font-bold uppercase tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              {lineInfo.nombre}
            </h1>
            <p className="mt-4 text-lg font-medium text-foreground sm:text-xl">
              {lineInfo.subtitulo}
            </p>
          </div>

          <div className="max-w-xl border-l-2 border-primary pl-5 sm:pl-6 lg:justify-self-end">
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              {lineInfo.descripcion}
            </p>
            {catalogoTecnicoUrl && (
              <Button
                size="lg"
                variant="outline"
                className="mt-6"
                render={
                  <a
                    href={catalogoTecnicoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <Download data-icon="inline-start" />
                {TEXTOS_CATALOGO.botonCatalogoTecnico}
              </Button>
            )}
          </div>
        </div>
      </section>

      <CatalogLineToolbar
        allValue={ALL}
        activeTypologyId={activeTypologyId}
        typologies={lineTypologies}
        order={order}
        activeFilterCount={activeFilterCount}
        visibleProductsCount={visibleProducts.length}
        resultsPending={necesitaCatalogoCompleto && hasMore}
        filtersOpen={filtersOpen}
        filters={<CatalogFilters {...filtersProps} />}
        onFiltersOpenChange={setFiltersOpen}
        onTypologyChange={selectTypology}
        onOrderChange={(value) => updateParam(PARAMS.order, value)}
      />

      <main
        id="catalogo-productos"
        className="scroll-mt-36 bg-muted/25 py-8 sm:py-10"
      >
        <div className="container">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {necesitaCatalogoCompleto && hasMore
                  ? "Actualizando resultados…"
                  : completarPlantilla(TEXTOS_CATALOGO.contadorProductos, {
                      visibles: visibleProducts.length,
                      total: totalCatalogo,
                    })}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {activeTypology?.nombre ??
                  completarPlantilla(TEXTOS_CATALOGO.tituloTodosModelos, {
                    linea: lineInfo.nombre,
                  })}
              </h2>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div
              className="mb-7 flex flex-wrap items-center gap-2"
              aria-label="Filtros aplicados"
            >
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {TEXTOS_CATALOGO.filtrosActivos}
              </span>
              {activeFilters.map((filter) => (
                <Button
                  key={filter.key}
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => updateParam(filter.key, null)}
                >
                  {filter.label}
                  <X data-icon="inline-end" />
                </Button>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {TEXTOS_CATALOGO.limpiarTodo}
              </Button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-4">
            <aside className="hidden lg:block">
              <Card className="sticky top-36 max-h-[calc(100dvh-10rem)] gap-0 overflow-hidden py-0">
                <CardHeader className="shrink-0 border-b py-5">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <SlidersHorizontal className="size-4 text-primary" />
                    {TEXTOS_CATALOGO.filtrosPanelTitulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-5">
                  <CatalogFilters {...filtersProps} />
                </CardContent>
              </Card>
            </aside>
            <div className="min-w-0 lg:col-span-3">
              <ProductGrid
                products={visibleProducts}
                tipologias={tipologias}
                tiposApertura={tiposApertura}
                className="md:grid-cols-2 xl:grid-cols-3"
                onClearFilters={
                  activeFilterCount > 0 ? clearFilters : undefined
                }
              />

              {!necesitaCatalogoCompleto && hasMore && (
                <div
                  ref={sentinelRef}
                  aria-hidden="true"
                  className="h-1 w-full"
                />
              )}

              {loadingMore && (
                <div className="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-112 rounded-2xl xs:h-80 sm:h-96"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <CatalogLineMoreContent
            lineInfo={lineInfo}
            lines={lineas}
            mensajeWhatsapp={datos.mensajeWhatsapp}
            telefonoWhatsapp={datos.telefonoWhatsapp}
          />
        </div>
      </main>
    </div>
  );
}
