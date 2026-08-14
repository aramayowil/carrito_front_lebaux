"use client"

import { useMemo, useState } from "react"
import {
  ArrowDownUp,
  Download,
  Filter,
  SlidersHorizontal,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/features/products/components/ProductGrid"
import { resumirPromocionProducto } from "@/features/products/lib/discounts"
import { obtenerPrecioInicial } from "@/features/products/lib/pricing"
import { normalizarUrlCatalogoTecnico } from "@/features/products/lib/technical-catalog"
import { CatalogLineMoreContent } from "@/screens/catalog/sections/CatalogLineMoreContent"
import type { Producto } from "@/types"
import type { DatosCatalogoLineaPublica } from "@/server/datos-publicos"

const PARAMS = {
  typology: "tipologia",
  tag: "etiqueta",
  opening: "apertura",
  color: "color",
  size: "medida",
  promotion: "promocion",
  order: "orden",
} as const
const ALL = "todas"
const FILTER_PARAMS = [
  PARAMS.tag,
  PARAMS.opening,
  PARAMS.color,
  PARAMS.size,
  PARAMS.promotion,
]
type CatalogOrder = "relevancia" | "precio-asc" | "precio-desc"
const EMPTY_SEARCH_PARAMS = new URLSearchParams()

const TEXTOS_CATALOGO = {
  sobrelineaHero: "Línea de fabricación",
  botonExplorar: "Explorar productos",
  botonCatalogoTecnico: "Descargar catálogo técnico",
  botonCatalogoTecnicoPendiente: "Catálogo técnico próximamente",
  filtrosTitulo: "Afiná tu búsqueda",
  filtrosDescripcion: "Combiná las opciones disponibles.",
  filtrosLimpiar: "Limpiar",
  filtroApertura: "Tipo de apertura",
  filtroMedida: "Medida",
  filtroColor: "Color",
  filtroCaracteristicas: "Características",
  filtroOportunidades: "Oportunidades",
  promocionEtiqueta: "Con promoción",
  botonFiltrar: "Filtrar",
  panelFiltrosTitulo: "Filtrar productos",
  panelFiltrosDescripcion: "Elegí las características de tu abertura.",
  botonVerProductos: "Ver {cantidad} productos",
  tipologiasTodos: "Todos",
  ordenRelevancia: "Relevancia",
  ordenMenorPrecio: "Menor precio",
  ordenMayorPrecio: "Mayor precio",
  contadorProductos: "{visibles} de {total} productos",
  tituloTodosModelos: "Todos los modelos {linea}",
  filtrosActivos: "Filtros activos",
  limpiarTodo: "Limpiar todo",
  filtrosPanelTitulo: "Filtros",
} as const

function completarPlantilla(
  texto: string,
  valores: Record<string, string | number>,
): string {
  return Object.entries(valores).reduce(
    (resultado, [clave, valor]) =>
      resultado.replaceAll("{" + clave + "}", String(valor)),
    texto,
  )
}

interface FilterOption {
  value: string
  label: string
  count: number
}

function buildOptions(values: Array<{ value: string; label: string }>) {
  const options = new Map<string, FilterOption>()
  values.forEach(({ value, label }) => {
    if (!value) return
    const current = options.get(value)
    options.set(value, { value, label, count: (current?.count ?? 0) + 1 })
  })
  return Array.from(options.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  )
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: FilterOption[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value
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
          )
        })}
      </div>
    </div>
  )
}

interface FiltersProps {
  openingOptions: FilterOption[]
  colorOptions: FilterOption[]
  sizeOptions: FilterOption[]
  tagOptions: FilterOption[]
  promotionCount: number
  selected: Record<"opening" | "color" | "size" | "tag", string | null> & {
    promotion: boolean
  }
  activeCount: number
  onChange: (key: string, value: string | null) => void
  onClear: () => void
}

function CatalogFilters(props: FiltersProps) {
  const { selected } = props
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
      <FilterGroup
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
  )
}

function sortProducts(products: Producto[], order: CatalogOrder) {
  const result = [...products]
  if (order === "relevancia") {
    return result.sort((a, b) => Number(b.destacado) - Number(a.destacado))
  }
  return result.sort((a, b) => {
    const priceA = obtenerPrecioInicial(a)?.contado ?? null
    const priceB = obtenerPrecioInicial(b)?.contado ?? null
    if (priceA === null) return 1
    if (priceB === null) return -1
    return order === "precio-asc" ? priceA - priceB : priceB - priceA
  })
}

/** Catálogo editorial por línea con filtros responsive y estado en la URL. */
export function CatalogLinePage({ datos }: { datos: DatosCatalogoLineaPublica }) {
  const lineaSlug = datos.linea.slug
  const searchParams = useSearchParams() ?? EMPTY_SEARCH_PARAMS
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { productos, lineas, tipologias, tiposApertura } = datos
  const lineInfo = datos.linea
  const lineProducts = useMemo(
    () =>
      productos.filter(
        (product) =>
          product.linea === lineaSlug && product.visibilidad === "visible",
      ),
    [lineaSlug, productos],
  )
  const presentTypologyIds = useMemo(
    () => new Set(lineProducts.map((product) => product.tipologiaId)),
    [lineProducts],
  )
  const lineTypologies = useMemo(
    () =>
      tipologias
        .filter(
          (typology) =>
            typology.lineaSlug === lineaSlug &&
            presentTypologyIds.has(typology.id),
        )
        .sort((a, b) => a.orden - b.orden),
    [lineaSlug, presentTypologyIds, tipologias],
  )

  const typologyParam = searchParams.get(PARAMS.typology)
  const activeTypologyId = lineTypologies.some(
    (typology) => typology.id === typologyParam,
  )
    ? (typologyParam ?? ALL)
    : ALL
  const activeTypology = lineTypologies.find(
    (typology) => typology.id === activeTypologyId,
  )
  const typologyProducts =
    activeTypologyId === ALL
      ? lineProducts
      : lineProducts.filter(
          (product) => product.tipologiaId === activeTypologyId,
        )

  const openingOptions = buildOptions(
    typologyProducts.flatMap((product) => {
      if (!product.tipoApertura) return []
      const opening = tiposApertura.find(
        (item) => item.slug === product.tipoApertura,
      )
      return [
        {
          value: product.tipoApertura,
          label: opening?.nombre ?? product.tipoApertura,
        },
      ]
    }),
  )
  const colorOptions = buildOptions(
    typologyProducts.flatMap((product) =>
      product.coloresDisponibles.map((color) => ({
        value: color.slug,
        label: color.etiqueta,
      })),
    ),
  )
  const sizeOptions = buildOptions(
    typologyProducts.flatMap((product) =>
      product.medidasDisponibles.map((size) => ({
        value: size.etiqueta,
        label: size.etiqueta,
      })),
    ),
  )
  const tagOptions = buildOptions(
    typologyProducts.flatMap((product) =>
      product.etiquetas.map((tag) => ({ value: tag, label: tag })),
    ),
  )
  const promotionCount = typologyProducts.filter((product) =>
    resumirPromocionProducto(product),
  ).length

  function validValue(name: string, options: FilterOption[]) {
    const value = searchParams.get(name)
    return value && options.some((option) => option.value === value)
      ? value
      : null
  }

  const selected = {
    opening: validValue(PARAMS.opening, openingOptions),
    color: validValue(PARAMS.color, colorOptions),
    size: validValue(PARAMS.size, sizeOptions),
    tag: validValue(PARAMS.tag, tagOptions),
    promotion:
      searchParams.get(PARAMS.promotion) === "si" && promotionCount > 0,
  }
  const activeFilterCount = Object.values(selected).filter(Boolean).length
  const orderParam = searchParams.get(PARAMS.order)
  const order: CatalogOrder = [
    "relevancia",
    "precio-asc",
    "precio-desc",
  ].includes(orderParam ?? "")
    ? (orderParam as CatalogOrder)
    : "relevancia"

  const filteredProducts = typologyProducts.filter((product) => {
    if (selected.opening && product.tipoApertura !== selected.opening)
      return false
    if (
      selected.color &&
      !product.coloresDisponibles.some((color) => color.slug === selected.color)
    ) {
      return false
    }
    if (
      selected.size &&
      !product.medidasDisponibles.some(
        (size) => size.etiqueta === selected.size,
      )
    ) {
      return false
    }
    if (selected.tag && !product.etiquetas.includes(selected.tag)) return false
    if (selected.promotion && !resumirPromocionProducto(product)) return false
    return true
  })
  const visibleProducts = sortProducts(filteredProducts, order)

  function updateParam(name: string, value: string | null) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === ALL) next.delete(name)
    else next.set(name, value)
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function selectTypology(value: string | number) {
    const next = new URLSearchParams(searchParams)
    const id = String(value)
    if (id === ALL) next.delete(PARAMS.typology)
    else next.set(PARAMS.typology, id)
    FILTER_PARAMS.forEach((param) => next.delete(param))
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams)
    FILTER_PARAMS.forEach((param) => next.delete(param))
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  if (!lineInfo) return null

  const imagenBannerEscritorio = lineInfo.imagenBannerEscritorio || ""
  const imagenBannerMovil = lineInfo.imagenBannerMovil || imagenBannerEscritorio
  const catalogoTecnicoUrl = normalizarUrlCatalogoTecnico(
    lineInfo.catalogoTecnicoUrl,
  )

  const activeFilters: Array<{ key: string; label: string }> = []
  const activeOpening = openingOptions.find(
    (item) => item.value === selected.opening,
  )?.label
  const activeColor = colorOptions.find(
    (item) => item.value === selected.color,
  )?.label
  if (selected.opening && activeOpening) {
    activeFilters.push({ key: PARAMS.opening, label: activeOpening })
  }
  if (selected.size) {
    activeFilters.push({ key: PARAMS.size, label: selected.size })
  }
  if (selected.color && activeColor) {
    activeFilters.push({ key: PARAMS.color, label: activeColor })
  }
  if (selected.tag) activeFilters.push({ key: PARAMS.tag, label: selected.tag })
  if (selected.promotion) {
    activeFilters.push({
      key: PARAMS.promotion,
      label: TEXTOS_CATALOGO.promocionEtiqueta,
    })
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
  }

  return (
    <div className="bg-background">
      <section
        aria-labelledby="titulo-linea"
        className="relative isolate overflow-hidden bg-brand-black text-white"
      >
        {imagenBannerMovil && (
          <picture className="absolute inset-0 -z-20">
            <source
              media="(min-width: 48rem)"
              srcSet={imagenBannerEscritorio}
            />
            <img
              src={imagenBannerMovil}
              alt={lineInfo.textoAlternativoBanner}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-black via-brand-black/80 to-brand-black/15" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-brand-black/70 via-transparent to-brand-black/20 md:hidden" />

        <div className="container flex min-h-128 flex-col justify-between py-6 md:min-h-112 md:py-8">
          <Breadcrumb>
            <BreadcrumbList className="text-white/65">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/" />}
                  className="hover:text-white"
                >
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white/90">
                  {lineInfo.nombre}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-2xl pb-2 pt-16 md:pb-4 md:pt-12">
            <p className="eyebrow mb-3">{TEXTOS_CATALOGO.sobrelineaHero}</p>
            <h1
              id="titulo-linea"
              className="text-4xl font-bold uppercase tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              {lineInfo.nombre}
            </h1>
            <p className="mt-4 text-lg font-medium text-white/85 sm:text-xl">
              {lineInfo.subtitulo}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              {lineInfo.descripcion}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<a href="#catalogo-productos" />}>
                {TEXTOS_CATALOGO.botonExplorar}
              </Button>
              {catalogoTecnicoUrl ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand-black"
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
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white"
                  disabled
                >
                  {TEXTOS_CATALOGO.botonCatalogoTecnicoPendiente}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-navbar z-30 border-y border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90">
        <div className="container flex items-center gap-3 py-3">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" className="shrink-0 lg:hidden" />
              }
            >
              <Filter data-icon="inline-start" />
              {TEXTOS_CATALOGO.botonFiltrar}
              {activeFilterCount > 0 && (
                <Badge className="ml-1 size-5 justify-center rounded-full p-0 text-[0.625rem]">
                  {activeFilterCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="left" className="w-11/12 max-w-sm">
              <SheetHeader className="border-b">
                <SheetTitle>{TEXTOS_CATALOGO.panelFiltrosTitulo}</SheetTitle>
                <SheetDescription>
                  {TEXTOS_CATALOGO.panelFiltrosDescripcion}
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <CatalogFilters {...filtersProps} />
              </div>
              <SheetFooter className="border-t">
                <SheetClose render={<Button size="lg" className="w-full" />}>
                  {completarPlantilla(TEXTOS_CATALOGO.botonVerProductos, {
                    cantidad: visibleProducts.length,
                  })}
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Tabs
            value={activeTypologyId}
            onValueChange={selectTypology}
            className="min-w-0 flex-1"
          >
            <div className="overflow-x-auto pb-1">
              <TabsList variant="line" className="h-10 min-w-max gap-2">
                <TabsTrigger value={ALL} className="px-3">
                  {TEXTOS_CATALOGO.tipologiasTodos}
                </TabsTrigger>
                {lineTypologies.map((typology) => (
                  <TabsTrigger
                    key={typology.id}
                    value={typology.id}
                    className="px-3"
                  >
                    {typology.nombre}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <ArrowDownUp className="size-4 text-muted-foreground" />
            <Select
              value={order}
              onValueChange={(value) =>
                value && updateParam(PARAMS.order, String(value))
              }
            >
              <SelectTrigger className="h-10 min-w-40 border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="relevancia">
                  {TEXTOS_CATALOGO.ordenRelevancia}
                </SelectItem>
                <SelectItem value="precio-asc">
                  {TEXTOS_CATALOGO.ordenMenorPrecio}
                </SelectItem>
                <SelectItem value="precio-desc">
                  {TEXTOS_CATALOGO.ordenMayorPrecio}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main
        id="catalogo-productos"
        className="scroll-mt-36 bg-muted/25 py-8 sm:py-10"
      >
        <div className="container">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {completarPlantilla(TEXTOS_CATALOGO.contadorProductos, {
                  visibles: visibleProducts.length,
                  total: typologyProducts.length,
                })}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {activeTypology?.nombre ??
                  completarPlantilla(TEXTOS_CATALOGO.tituloTodosModelos, {
                    linea: lineInfo.nombre,
                  })}
              </h2>
            </div>
            <div className="sm:hidden">
              <Select
                value={order}
                onValueChange={(value) =>
                  value && updateParam(PARAMS.order, String(value))
                }
              >
                <SelectTrigger className="h-10 w-full border-border bg-background">
                  <ArrowDownUp className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="relevancia">
                    {TEXTOS_CATALOGO.ordenRelevancia}
                  </SelectItem>
                  <SelectItem value="precio-asc">
                    {TEXTOS_CATALOGO.ordenMenorPrecio}
                  </SelectItem>
                  <SelectItem value="precio-desc">
                    {TEXTOS_CATALOGO.ordenMayorPrecio}
                  </SelectItem>
                </SelectContent>
              </Select>
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
              <Card className="sticky top-36 gap-0 py-0">
                <CardHeader className="border-b py-5">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <SlidersHorizontal className="size-4 text-primary" />
                    {TEXTOS_CATALOGO.filtrosPanelTitulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-5">
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
  )
}
