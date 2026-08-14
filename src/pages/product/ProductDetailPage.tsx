import {
  MessageCircleMore,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CatalogProductCard } from "@/features/products/components/CatalogProductCard"
import { ProductConfigurator } from "@/features/products/components/ProductConfigurator"
import { ProductGallery } from "@/features/products/components/ProductGallery"
import { ProductRichText } from "@/features/products/components/ProductRichText"
import { descripcionProductoComoTexto } from "@/features/products/lib/product-description"
import { completarTextoPublico } from "@/lib/public-text"
import type { DatosProductoPublico } from "@/server/datos-publicos"

function tieneDescripcionExtensa(descripcion: string): boolean {
  return (
    descripcionProductoComoTexto(descripcion).length > 0 ||
    /<(img|table|hr)\b/i.test(descripcion)
  )
}

const BLOQUES_CONFIANZA = [
  {
    id: "fabricacion",
    Icono: ShieldCheck,
    titulo: "Fabricación cuidada",
    descripcion: "Aberturas preparadas según la configuración elegida.",
  },
  {
    id: "medidas",
    Icono: Ruler,
    titulo: "Medidas para tu proyecto",
    descripcion: "Opciones listas para comparar antes de comprar.",
  },
  {
    id: "entrega",
    Icono: Truck,
    titulo: "Entrega coordinada",
    descripcion: "Acordamos con vos la preparación y la entrega.",
  },
  {
    id: "asesoramiento",
    Icono: MessageCircleMore,
    titulo: "Asesoramiento real",
    descripcion: "Te ayudamos por WhatsApp antes de confirmar.",
  },
] as const

/** Ficha comercial del producto: galería, configuración, compra y contenido técnico. */
export function ProductDetailPage({ datos }: { datos: DatosProductoPublico }) {
  const {
    producto: product,
    linea: line,
    tipologia,
    relacionados: related,
    tipologias,
    tiposApertura,
    accesorios,
    telefonoWhatsapp,
  } = datos
  const mostrarDescripcionExtensa = tieneDescripcionExtensa(
    product.descripcionExtensa,
  )

  return (
    <div className="bg-background pb-12 pt-5 sm:pb-16 sm:pt-8">
      <div className="container">
        <Breadcrumb className="mb-5 sm:mb-7">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/${product.linea}`} />}>
                {line.nombre}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.nombre}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:gap-x-10 lg:gap-y-5 xl:gap-x-14">
          <header className="order-1 min-w-0 lg:col-start-2 lg:row-start-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{line.nombre}</Badge>
              <Badge variant="outline">
                {tipologia?.nombre ?? "Producto"}
              </Badge>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {product.nombre}
            </h1>
            <ProductRichText
              html={product.descripcion}
              className="mt-3 max-w-2xl leading-7 text-muted-foreground"
            />
          </header>

          <div className="order-2 min-w-0 lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <ProductGallery
              key={product.id}
              images={product.imagenes}
              productName={product.nombre}
            />
          </div>

          <div className="order-3 min-w-0 lg:col-start-2 lg:row-start-2">
            <ProductConfigurator
              key={product.id}
              product={product}
              catalogoAccesorios={accesorios}
              telefonoWhatsapp={telefonoWhatsapp}
            />
          </div>
        </div>

        <section
          aria-label="Información de compra"
          className="mt-10 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {BLOQUES_CONFIANZA.map(({ id, Icono, titulo, descripcion }) => (
            <article key={id} className="bg-card p-5">
              <Icono className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold">{titulo}</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {descripcion}
              </p>
            </article>
          ))}
        </section>

        {(mostrarDescripcionExtensa || tipologia?.descripcion) && (
          <section
            className="mt-16 border-t border-border/70 pt-12 sm:mt-20 sm:pt-16"
            aria-labelledby="product-information-title"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow mb-2">{"Conocé la abertura"}</p>
                <h2
                  id="product-information-title"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  {"Detalles del producto"}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  {"Información editorial sobre su fabricación, características y usos recomendados."}
                </p>
              </div>

              <div className="space-y-4">
                {mostrarDescripcionExtensa && (
                  <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {"Descripción completa"}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      {completarTextoPublico("Todo sobre {producto}", {
                        producto: product.nombre,
                      })}
                    </h3>
                    <ProductRichText
                      html={product.descripcionExtensa}
                      className="mt-5 text-base leading-7"
                    />
                  </article>
                )}

                {tipologia?.descripcion && (
                  <article className="rounded-3xl bg-brand-black p-5 text-white sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {"Sobre la tipología"}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      {tipologia.nombre}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                      {tipologia.descripcion}
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-5"
                      render={<Link href={`/${product.linea}`} />}
                    >
                      {completarTextoPublico("Ver más modelos de {linea}", {
                        linea: line.nombre,
                      })}
                    </Button>
                  </article>
                )}
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section
            className="mt-16 border-t border-border/70 pt-12 sm:mt-20 sm:pt-16"
            aria-labelledby="related-title"
          >
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-2">{"Seguí explorando"}</p>
                <h2 id="related-title" className="text-2xl font-bold">
                  {"Productos relacionados"}
                </h2>
              </div>
              <Button
                variant="outline"
                render={<Link href={`/${product.linea}`} />}
              >
                {completarTextoPublico("Ver todo {linea}", {
                  linea: line.nombre,
                })}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {related.map((item) => (
                <CatalogProductCard
                  key={item.id}
                  product={item}
                  tipologiaNombre={tipologias.find((tip) => tip.id === item.tipologiaId)?.nombre}
                  aperturaNombre={tiposApertura.find((apertura) => apertura.slug === item.tipoApertura)?.nombre}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
