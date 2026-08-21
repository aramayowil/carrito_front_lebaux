import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ProductImage } from "@/components/media/ProductImage";
import { Button } from "@/components/ui/button";
import { getPrimaryProductImage } from "@/features/products/lib/product-card-formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { LineaProducto, MosaicoInicioLinea, Producto } from "@/types";

interface ImagenMosaico {
  src: string;
  alt: string;
  href: string;
}

function nombreCortoLinea(nombre: string) {
  return nombre.replace(/^línea\s+/i, "").trim() || nombre;
}

function imagenDeProducto(producto: Producto): ImagenMosaico | null {
  const imagen = getPrimaryProductImage(producto);
  if (!imagen?.url) return null;

  return {
    src: imagen.url,
    alt: imagen.textoAlternativo || producto.nombre,
    href: `/producto/${producto.slug}`,
  };
}

function obtenerImagenesMosaico(
  line: LineaProducto,
  products: Producto[],
): ImagenMosaico[] {
  const productosVisibles = products.filter(
    (product) =>
      product.linea === line.slug && product.visibilidad === "visible",
  );
  const porId = new Map(productosVisibles.map((product) => [product.id, product]));

  const seleccionados = line.mosaicoInicio.productosIds
    .map((id) => porId.get(id))
    .filter((product): product is Producto => Boolean(product));

  const idsSeleccionados = new Set(seleccionados.map((product) => product.id));
  const relleno = productosVisibles.filter(
    (product) => !idsSeleccionados.has(product.id),
  );

  const imagenesProductos = [...seleccionados, ...relleno]
    .map(imagenDeProducto)
    .filter((imagen): imagen is ImagenMosaico => imagen !== null)
    .slice(0, 3);

  const fallbackBanner: ImagenMosaico | null = line.imagenBannerEscritorio
    ? {
        src: line.imagenBannerEscritorio,
        alt: line.textoAlternativoBanner || line.nombre,
        href: `/${line.slug}`,
      }
    : null;

  if (imagenesProductos.length === 0 && !fallbackBanner) {
    return Array.from({ length: 3 }, (_, index) => ({
      src: "",
      alt: `${line.nombre} · imagen ${index + 1}`,
      href: `/${line.slug}`,
    }));
  }

  const candidatos = fallbackBanner
    ? [...imagenesProductos, fallbackBanner]
    : imagenesProductos;

  return Array.from(
    { length: 3 },
    (_, index) => candidatos[index % candidatos.length],
  );
}

function LineaSpecs({ mosaico }: { mosaico: MosaicoInicioLinea }) {
  const specs = [
    ["Colores disponibles", mosaico.coloresDisponibles],
    ["Vidrios", mosaico.vidrios],
    ["Ideal para", mosaico.idealPara],
  ];

  return (
    <dl className="mt-5 border-b border-border/70">
      {specs.map(([etiqueta, valor]) => (
        <div
          key={etiqueta}
          className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 border-t border-border/70 py-2.5 text-sm sm:py-3"
        >
          <dt className="text-muted-foreground">{etiqueta}</dt>
          <dd className="text-right font-semibold text-foreground">
            {valor.trim() || "A consultar"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function LineaGallery({
  line,
  products,
}: {
  line: LineaProducto;
  products: Producto[];
}) {
  const imagenes = obtenerImagenesMosaico(line, products);

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2">
      {imagenes.map((imagen, index) => (
        <Link
          key={`${imagen.href}-${index}`}
          href={imagen.href}
          aria-label={`Ver ${imagen.alt}`}
          className={
            index === 0
              ? "group relative col-span-2 row-span-2 block aspect-square overflow-hidden rounded-xl bg-muted outline-none ring-1 ring-border/60 focus-visible:ring-3 focus-visible:ring-ring/40"
              : "group relative block aspect-square overflow-hidden rounded-xl bg-muted outline-none ring-1 ring-border/60 focus-visible:ring-3 focus-visible:ring-ring/40"
          }
        >
          <ProductImage
            src={imagen.src}
            alt={imagen.alt}
            sizes={
              index === 0
                ? "(max-width: 40rem) 66vw, (max-width: 64rem) 66vw, 38vw"
                : "(max-width: 40rem) 33vw, (max-width: 64rem) 33vw, 19vw"
            }
            className="h-full w-full"
            imgClassName="object-contain"
          />
        </Link>
      ))}
    </div>
  );
}

function LineaMosaico({
  line,
  products,
  invertida,
  telefonoWhatsapp,
}: {
  line: LineaProducto;
  products: Producto[];
  invertida: boolean;
  telefonoWhatsapp: string;
}) {
  const titulo = nombreCortoLinea(line.nombre);
  const mosaico = line.mosaicoInicio;
  const whatsappHref = buildWhatsAppUrl(
    `Hola! Vi la página web y quiero consultar por ${line.nombre}.`,
    telefonoWhatsapp,
  );

  return (
    <article className="grid items-center gap-7 rounded-2xl border border-border/70 bg-card px-4 py-6 shadow-sm sm:px-6 sm:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8 lg:py-9">
      <div className={invertida ? "lg:order-2" : undefined}>
        <h3 className="text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          {titulo}
        </h3>
        {mosaico.descripcion.trim() ? (
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-[0.95rem] sm:leading-7">
            {mosaico.descripcion}
          </p>
        ) : null}

        <LineaSpecs mosaico={mosaico} />

        <div className="mt-6 grid gap-2.5 md:grid-cols-[1.15fr_0.85fr]">
          <Button
            size="lg"
            className="group h-12 w-full justify-center rounded-xl px-4 text-sm font-bold shadow-sm md:px-3 lg:text-[0.78rem] xl:px-4 xl:text-sm"
            render={<Link href={`/${line.slug}`} />}
          >
            {`Ver catálogo ${line.nombre}`}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              data-icon="inline-end"
              aria-hidden="true"
            />
          </Button>

          <Button
            variant="whatsapp"
            size="lg"
            className="h-11 w-full justify-center rounded-xl px-4 text-sm font-bold md:h-12 md:px-3 lg:text-[0.78rem] xl:px-4 xl:text-sm"
            render={
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`Consultar por ${line.nombre} en WhatsApp`}
              />
            }
          >
            <WhatsAppIcon className="size-4" data-icon="inline-start" />
            {`Consultar por ${line.nombre}`}
          </Button>
        </div>
      </div>

      <div className={invertida ? "lg:order-1" : undefined}>
        <LineaGallery line={line} products={products} />
      </div>
    </article>
  );
}

/** Mosaico editorial de líneas administrado desde la ficha de cada línea. */
export function HomeCatalogsSection({
  lines,
  products,
  telefonoWhatsapp,
}: {
  lines: LineaProducto[];
  products: Producto[];
  telefonoWhatsapp: string;
}) {
  if (lines.length === 0) return null;

  return (
    <section
      id="productos"
      aria-labelledby="catalog-lines-title"
      className="scroll-mt-navbar bg-background px-4 py-10 text-foreground sm:px-5 sm:py-12 lg:px-6"
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:pb-7 md:flex-row md:items-end md:justify-between md:gap-8">
          <div>
            <p className="eyebrow mb-3">Nuestras líneas</p>
            <h2
              id="catalog-lines-title"
              className="max-w-2xl text-2xl font-bold uppercase tracking-tight text-balance sm:text-3xl"
            >
              Encontrá la abertura para tu proyecto
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
            Explorá nuestros sistemas y elegí la solución que mejor se adapta a
            tu espacio.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:mt-7 lg:gap-7">
          {lines.map((line, index) => (
            <LineaMosaico
              key={line.id}
              line={line}
              products={products}
              invertida={index % 2 === 1}
              telefonoWhatsapp={telefonoWhatsapp}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
