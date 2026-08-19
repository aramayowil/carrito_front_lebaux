"use client"

import { useState } from "react"
import {
  AlertCircle,
  BadgePercent,
  ChevronDown,
  Minus,
  Plus,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/features/cart/store/use-cart-store"
import { useUICarrito } from "@/features/cart/hooks/use-ui-carrito"
import { useProductConfigurator } from "@/features/products/hooks/use-product-configurator"
import { ProductSizeSelector } from "@/features/products/components/ProductSizeSelector"
import { emparejarAccesorioConVariante } from "@/features/products/lib/accesorios"
import {
  etiquetaDescuento,
  obtenerVariantesPromocion,
} from "@/features/products/lib/discounts"
import { formatProductPrice } from "@/features/products/lib/product-card-formatters"
import { buildConfiguredProductMessage } from "@/features/products/lib/product-inquiry"
import { debeConsultarPrecio } from "@/features/products/lib/pricing"
import { completarTextoPublico } from "@/lib/public-text"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import type {
  AccesorioLinea,
  Producto,
  SlugColorPerfil,
  SlugOpcionVidrio,
  VarianteProducto,
} from "@/types"

interface ProductConfiguratorProps {
  product: Producto
  catalogoAccesorios: AccesorioLinea[]
  telefonoWhatsapp: string
}

function esColorDisponible(
  product: Producto,
  value: unknown,
): value is SlugColorPerfil {
  return (
    typeof value === "string" &&
    product.coloresDisponibles.some((color) => color.slug === value)
  )
}
function etiquetaCombinacion(
  product: Producto,
  variante: VarianteProducto,
): string {
  const medida = product.medidasDisponibles.find(
    (item) => item.id === variante.medidaId,
  )?.etiqueta
  const color = product.coloresDisponibles.find(
    (item) => item.slug === variante.colorSlug,
  )?.etiqueta
  const vidrio = product.opcionesVidrio.find(
    (item) => item.slug === variante.vidrioSlug,
  )?.etiqueta
  return [medida, color, vidrio].filter(Boolean).join(" · ")
}

/** Configura una abertura, calcula ambos precios y la agrega al carrito persistente. */
export function ProductConfigurator({
  product,
  catalogoAccesorios,
  telefonoWhatsapp,
}: ProductConfiguratorProps) {
  const [accesoriosAbiertos, setAccesoriosAbiertos] = useState(false)
  const {
    seleccion,
    cantidad,
    cantidadMaxima,
    desglose,
    varianteActual,
    disponible,
    setCantidad,
    setMedida,
    setColor,
    setVidrio,
    setVariante,
    toggleAccesorio,
    setManoApertura,
    medidaTieneStock,
    colorTieneStock,
    vidrioTieneStock,
  } = useProductConfigurator(product, catalogoAccesorios)
  const agregarItem = useCartStore((state) => state.agregarItem)
  const { abrirCarrito } = useUICarrito()
  const accesoriosDisponibles = product.llevaAccesorios
    ? product.accesorios
        .map((activado) =>
          catalogoAccesorios.find((item) => item.slug === activado.slug),
        )
        .filter((item): item is (typeof catalogoAccesorios)[number] =>
          Boolean(item),
        )
    : []
  const variantesPromocion = obtenerVariantesPromocion(product)
  const opcionesVariantesPromocion = variantesPromocion.map((variante) => ({
    value: variante.id,
    label: etiquetaCombinacion(product, variante),
  }))
  const opcionesVidrioSelect = product.opcionesVidrio.map((vidrio) => ({
    value: vidrio.slug,
    label: vidrio.etiqueta,
  }))
  const medidaSeleccionada = product.medidasDisponibles.find(
    (item) => item.id === seleccion.medidaId,
  )
  const colorSeleccionado = product.coloresDisponibles.find(
    (item) => item.slug === seleccion.colorSlug,
  )
  const vidrioSeleccionado = product.opcionesVidrio.find(
    (item) => item.slug === seleccion.vidrioSlug,
  )
  const cantidadAccesoriosSeleccionados = seleccion.accesoriosSlug.length
  const consultarPrecio = debeConsultarPrecio(product, varianteActual)
  const handleColorChange = (value: unknown) => {
    if (esColorDisponible(product, value)) setColor(value)
  }
  const whatsappHref = buildWhatsAppUrl(
    buildConfiguredProductMessage(
      product,
      seleccion,
      cantidad,
      desglose,
      catalogoAccesorios,
    ),
    telefonoWhatsapp,
  )

  // El producto requiere elegir vidrio cuando tiene opciones disponibles;
  // si `opcionesVidrio` está vacío (ej. puerta ciega) no hay nada que exigir.
  // `crearSeleccionInicial` ya autoselecciona la primera opción por defecto,
  // así que esto solo bloquea el caso donde el usuario dejó `vidrioSlug`
  // explícitamente en null (o el producto no tiene default posible).
  const tieneVariantes = product.variantes.length > 0
  const faltaElegirVidrio =
    tieneVariantes &&
    product.opcionesVidrio.length > 0 &&
    seleccion.vidrioSlug === null
  const faltaElegirMano =
    Boolean(product.manoApertura) && seleccion.manoApertura === null
  const puedeAgregar =
    !consultarPrecio && !faltaElegirVidrio && !faltaElegirMano && disponible

  const handleAgregarAlCarrito = () => {
    if (!puedeAgregar) return
    agregarItem(product, seleccion, cantidad, catalogoAccesorios)
    abrirCarrito()
  }

  return (
    <div className="pb-24 sm:pb-0">
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="flex items-start justify-between gap-4 border-b p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold">{"Configurá tu abertura"}</h2>
              {tieneVariantes ? (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {[
                    medidaSeleccionada?.etiqueta,
                    colorSeleccionado?.etiqueta,
                    vidrioSeleccionado?.etiqueta ?? "Sin vidrio",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  {"Producto sin variantes"}
                </p>
              )}
            </div>
          </div>
          <Badge
            variant={disponible ? "secondary" : "outline"}
            className={cn(
              "shrink-0 rounded-full",
              disponible && "bg-success/15 text-success",
            )}
          >
            {disponible ? "Disponible" : "Sin stock"}
          </Badge>
        </div>

        <div className="border-b border-border/70 bg-catalog-line p-4 sm:p-5">
          {consultarPrecio ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {"Configuración seleccionada"}
              </p>
              <p className="mt-1 text-xl font-bold">{"Precio a consultar"}</p>
              <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                {"Te cotizamos esta abertura según la configuración elegida."}
              </p>
            </div>
          ) : (
            <div>
              {desglose.descuentoAplicado && (
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-success text-success-foreground">
                    {etiquetaDescuento(desglose.descuentoAplicado)}
                  </Badge>
                  <span className="text-xs font-medium text-success">
                    {completarTextoPublico("Ahorrás {monto}", {
                      monto: formatProductPrice(desglose.ahorroTotal),
                    })}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {"Contado / transferencia"}
                  </p>
                  {desglose.descuentoAplicado && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatProductPrice(desglose.totalContadoOriginal)}
                    </p>
                  )}
                  <p
                    key={desglose.totalContado}
                    className="text-3xl font-bold tracking-tight text-success transition-all duration-200"
                  >
                    {formatProductPrice(desglose.totalContado)}
                  </p>
                </div>
                <div className="pb-0.5">
                  <p className="text-xs text-muted-foreground">{"Tarjeta"}</p>
                  <p
                    key={desglose.totalTarjeta}
                    className="text-base font-semibold transition-all duration-200"
                  >
                    {formatProductPrice(desglose.totalTarjeta)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {!consultarPrecio && variantesPromocion.length > 0 && (
            <div className="rounded-xl border border-success/25 bg-success/5 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className="rounded-full bg-success text-success-foreground">
                  <BadgePercent data-icon="inline-start" />
                  {etiquetaDescuento(product.descuento)}
                </Badge>
                <span className="text-xs font-medium text-success">
                  {"Hay configuraciones incluidas en esta promoción"}
                </span>
              </div>
              <Select
                items={opcionesVariantesPromocion}
                value={
                  desglose.descuentoAplicado && varianteActual
                    ? varianteActual.id
                    : ""
                }
                onValueChange={(varianteId) => {
                  const variante = variantesPromocion.find(
                    (item) => item.id === varianteId,
                  )
                  if (variante) setVariante(variante)
                }}
              >
                <SelectTrigger className="mt-3 h-10 w-full border-success/25 bg-background">
                  <SelectValue placeholder={"Ver combinaciones con oferta"} />
                </SelectTrigger>
                <SelectContent align="start">
                  {variantesPromocion.map((variante) => (
                    <SelectItem key={variante.id} value={variante.id}>
                      {etiquetaCombinacion(product, variante)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {tieneVariantes && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <ProductSizeSelector
                  productId={product.id}
                  medidas={product.medidasDisponibles}
                  medidaId={seleccion.medidaId}
                  onChange={setMedida}
                  isAvailable={medidaTieneStock}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>{"Color del perfil"}</Label>
                  <span className="text-xs text-muted-foreground">
                    {colorSeleccionado?.etiqueta}
                  </span>
                </div>
                <RadioGroup
                  value={seleccion.colorSlug}
                  onValueChange={handleColorChange}
                  className="flex flex-wrap gap-2"
                >
                  {product.coloresDisponibles.map((color) => {
                    const sinStock = !colorTieneStock(color.slug)
                    const selected = seleccion.colorSlug === color.slug
                    return (
                      <Label
                        key={color.slug}
                        htmlFor={"color-" + product.id + "-" + color.slug}
                        className={cn(
                          "relative flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/30",
                          selected
                            ? "border-primary bg-accent text-foreground"
                            : "border-border bg-background hover:border-primary/50",
                          sinStock && "cursor-not-allowed opacity-40",
                        )}
                      >
                        <span
                          className="size-5 shrink-0 rounded-full border border-foreground/15 shadow-inner"
                          style={{ backgroundColor: color.hexadecimal }}
                          aria-hidden="true"
                        />
                        <span>{color.etiqueta}</span>
                        <RadioGroupItem
                          id={"color-" + product.id + "-" + color.slug}
                          value={color.slug}
                          disabled={sinStock}
                          className="sr-only"
                        />
                      </Label>
                    )
                  })}
                </RadioGroup>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={"vidrio-" + product.id}>{"Vidrio"}</Label>
                  {product.opcionesVidrio.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {completarTextoPublico("{cantidad} disponible(s)", {
                        cantidad: product.opcionesVidrio.length,
                      })}
                    </span>
                  )}
                </div>
                {product.opcionesVidrio.length > 0 ? (
                  <Select
                    items={opcionesVidrioSelect}
                    value={seleccion.vidrioSlug ?? ""}
                    onValueChange={(value) =>
                      value && setVidrio(value as SlugOpcionVidrio)
                    }
                  >
                    <SelectTrigger
                      id={"vidrio-" + product.id}
                      className={cn(
                        "h-11 w-full border-border bg-background px-3",
                        faltaElegirVidrio && "border-destructive/50",
                      )}
                    >
                      <SelectValue placeholder={"Elegí un vidrio"} />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {product.opcionesVidrio.map((vidrio) => (
                        <SelectItem
                          key={vidrio.slug}
                          value={vidrio.slug}
                          disabled={!vidrioTieneStock(vidrio.slug)}
                        >
                          {vidrio.etiqueta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex h-11 items-center rounded-xl border border-dashed px-3 text-sm text-muted-foreground">
                    {"Este modelo no lleva vidrio"}
                  </div>
                )}
              </div>
            </div>
          )}

          {product.manoApertura && (
            <>
              <Separator />
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,1fr)] sm:items-center">
                <div>
                  <Label id={"mano-label-" + product.id}>
                    {"Mano de apertura"}
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {"Elegí el sentido de apertura."}
                  </p>
                </div>
                <RadioGroup
                  value={seleccion.manoApertura ?? ""}
                  onValueChange={(value) =>
                    value && setManoApertura(value as "izquierda" | "derecha")
                  }
                  className="grid grid-cols-2 gap-2"
                  aria-labelledby={"mano-label-" + product.id}
                >
                  {product.manoApertura.opciones.map((mano) => (
                    <Label
                      key={mano}
                      htmlFor={"mano-" + product.id + "-" + mano}
                      className={cn(
                        "flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 capitalize transition-colors",
                        seleccion.manoApertura === mano
                          ? "border-primary bg-accent"
                          : "hover:border-primary/50",
                      )}
                    >
                      <RadioGroupItem
                        id={"mano-" + product.id + "-" + mano}
                        value={mano}
                      />
                      {mano}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {accesoriosDisponibles.length > 0 && (
            <>
              <Separator />
              <Collapsible
                open={accesoriosAbiertos}
                onOpenChange={setAccesoriosAbiertos}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
                  <span>
                    <span className="block text-sm font-medium">
                      {"Accesorios opcionales"}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {cantidadAccesoriosSeleccionados > 0
                        ? completarTextoPublico("{cantidad} seleccionado(s)", {
                            cantidad: cantidadAccesoriosSeleccionados,
                          })
                        : "Mosquiteros, premarcos y complementos"}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {accesoriosDisponibles.length}
                    </Badge>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        accesoriosAbiertos && "rotate-180",
                      )}
                    />
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {accesoriosDisponibles.map((accesorio) => {
                      const checked = seleccion.accesoriosSlug.includes(
                        accesorio.slug,
                      )
                      const esObligatorio = product.accesorios.some(
                        (item) =>
                          item.slug === accesorio.slug && item.obligatorio,
                      )
                      const emparejado = medidaSeleccionada
                        ? emparejarAccesorioConVariante(
                            accesorio,
                            medidaSeleccionada,
                          )
                        : null
                      const precio = emparejado?.medida?.precio ?? null
                      return (
                        <Label
                          key={accesorio.slug}
                          htmlFor={
                            "accesorio-" + product.id + "-" + accesorio.slug
                          }
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                            checked
                              ? "border-primary bg-accent"
                              : "hover:border-primary/50",
                            precio === null && "opacity-60",
                          )}
                        >
                          <Checkbox
                            id={
                              "accesorio-" + product.id + "-" + accesorio.slug
                            }
                            checked={checked}
                            disabled={precio === null || esObligatorio}
                            onCheckedChange={() =>
                              toggleAccesorio(accesorio.slug)
                            }
                          />
                          <span className="min-w-0 flex-1 text-sm font-medium">
                            {accesorio.etiqueta}
                            {esObligatorio && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({"incluido"})
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {precio === null
                              ? "No disponible"
                              : consultarPrecio
                                ? "Consultar"
                                : "+ " + formatProductPrice(precio)}
                          </span>
                        </Label>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          {!disponible && (
            <p className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {tieneVariantes
                ? "Esa combinación de medida, color y vidrio no tiene stock por ahora."
                : "Este producto no tiene stock por ahora."}
            </p>
          )}
        </div>

        <div className="space-y-4 border-t border-border/70 bg-muted/20 p-4 sm:p-5">
          {!consultarPrecio && (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{"Cantidad"}</p>
                <p className="text-xs text-muted-foreground">
                  {"Elegí cuántas unidades necesitás."}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border bg-background p-1">
                <span className="pl-2 text-xs font-medium text-muted-foreground">
                  {"Unidades"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setCantidad(cantidad - 1)}
                  aria-label="Restar una unidad"
                  disabled={cantidad <= 1}
                >
                  <Minus />
                </Button>
                <span
                  className="w-6 text-center text-sm font-bold"
                  aria-live="polite"
                >
                  {cantidad}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setCantidad(cantidad + 1)}
                  aria-label="Sumar una unidad"
                  disabled={
                    cantidadMaxima !== null && cantidad >= cantidadMaxima
                  }
                >
                  <Plus />
                </Button>
              </div>
            </div>
          )}

          {!consultarPrecio &&
            cantidadMaxima !== null &&
            cantidadMaxima > 0 && (
              <p className="-mt-2 text-xs text-muted-foreground">
                {completarTextoPublico(
                  "Quedan {cantidad} unidades disponibles.",
                  {
                    cantidad: cantidadMaxima,
                  },
                )}
              </p>
            )}

          {faltaElegirVidrio && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {"Elegí un tipo de vidrio para continuar."}
            </p>
          )}
          {faltaElegirMano && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {"Elegí la mano de apertura para continuar."}
            </p>
          )}

          <div
            className={cn("grid gap-2", !consultarPrecio && "sm:grid-cols-2")}
          >
            {!consultarPrecio && (
              <Button
                size="lg"
                className="h-11"
                onClick={handleAgregarAlCarrito}
                disabled={!puedeAgregar}
              >
                <ShoppingCart data-icon="inline-start" />
                {"Agregar al carrito"}
              </Button>
            )}
            <Button
              variant={consultarPrecio ? "whatsapp" : "outline"}
              size="lg"
              className={cn(
                "h-11",
                !consultarPrecio &&
                  "border-whatsapp/40 text-whatsapp hover:bg-whatsapp/10 hover:text-whatsapp",
              )}
              render={
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <WhatsAppIcon data-icon="inline-start" />
                  {consultarPrecio
                    ? "Consultar precio por WhatsApp"
                    : "Consultar por WhatsApp"}
                </a>
              }
            />
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur-sm sm:hidden">
        <div className="container flex items-center gap-2 px-0">
          <div className="min-w-0 flex-1">
            {consultarPrecio ? (
              <>
                <p className="truncate text-xs leading-none text-muted-foreground">
                  {"Configuración seleccionada"}
                </p>
                <p className="truncate text-sm font-bold">
                  {"Precio a consultar"}
                </p>
              </>
            ) : (
              <>
                <p className="truncate text-xs leading-none text-muted-foreground">
                  {"Contado"}
                </p>
                {desglose.descuentoAplicado && (
                  <p className="truncate text-xs leading-none text-muted-foreground line-through">
                    {formatProductPrice(desglose.totalContadoOriginal)}
                  </p>
                )}
                <p
                  key={desglose.totalContado}
                  className="truncate text-lg font-bold text-success"
                >
                  {formatProductPrice(desglose.totalContado)}
                </p>
              </>
            )}
          </div>
          <Button
            variant={consultarPrecio ? "whatsapp" : "outline"}
            size={consultarPrecio ? "lg" : "icon-lg"}
            className={cn(
              "shrink-0",
              !consultarPrecio &&
                "border-whatsapp/40 text-whatsapp hover:bg-whatsapp/10 hover:text-whatsapp",
            )}
            aria-label="Consultar por WhatsApp"
            render={<a href={whatsappHref} target="_blank" rel="noreferrer" />}
          >
            <WhatsAppIcon />
            {consultarPrecio && "Consultar precio"}
          </Button>
          {!consultarPrecio && (
            <Button
              size="lg"
              className="shrink-0"
              onClick={handleAgregarAlCarrito}
              disabled={!puedeAgregar}
            >
              <ShoppingCart data-icon="inline-start" />
              {"Agregar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
