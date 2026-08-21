import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ProductImage } from "@/components/media/ProductImage";
import { Button } from "@/components/ui/button";
import { getPrimaryProductImage } from "@/features/products/lib/product-card-formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { LineaProducto, Producto } from "@/types";

interface ConfiguracionLineaMosaico {
  slug: "modena" | "herrero";
  titulo: string;
  descripcion: string;
  colores: string;
  vidrios: string;
  idealPara: string;
  mensajeWhatsapp: string;
}

const LINEAS_MOSAICO: ConfiguracionLineaMosaico[] = [
  {
    slug: "modena",
    titulo: "Módena",
    descripcion:
      "La Línea Módena ofrece aberturas de alta prestación con perfiles resistentes, excelente hermeticidad y herrajes de calidad, brindando durabilidad, funcionalidad y un óptimo desempeño en todo tipo de proyectos.",
    colores: "Blanco / Negro",
    vidrios: "Estándar, laminado 3+3, DVH",
    idealPara: "Viviendas y locales comerciales",
    mensajeWhatsapp:
      "Hola! Vi la página web y quiero consultar por la Línea Módena.",
  },
  {
    slug: "herrero",
    titulo: "Herrero",
    descripcion:
      "La Línea Herrero de Lebaux está diseñada para brindar resistencia, durabilidad y un excelente desempeño frente a las condiciones climáticas. Una solución funcional, de fácil mantenimiento y larga vida útil.",
    colores: "Blanco / Negro",
    vidrios: "Estándar",
    idealPara: "Viviendas",
    mensajeWhatsapp:
      "Hola! Vi la página web y quiero consultar por la Línea Herrero.",
  },
];

interface ImagenMosaico {
  src: string;
  alt: string;
  href: string;
}

function normalizarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buscarLinea(
  lines: LineaProducto[],
  configuracion: ConfiguracionLineaMosaico,
) {
  return lines.find((line) => {
    const slug = normalizarSlug(line.slug);
    const nombre = normalizarSlug(line.nombre);
    return (
      slug.includes(configuracion.slug) || nombre.includes(configuracion.slug)
    );
  });
}

function obtenerImagenesMosaico(
  line: LineaProducto,
  products: Producto[],
): ImagenMosaico[] {
  const imagenesProductos = products
    .filter(
      (product) =>
        product.linea === line.slug && product.visibilidad === "visible",
    )
    .map((product) => {
      const imagen = getPrimaryProductImage(product);
      if (!imagen?.url) return null;

      return {
        src: imagen.url,
        alt: imagen.textoAlternativo || product.nombre,
        href: `/producto/${product.slug}`,
      };
    })
    .filter((imagen): imagen is ImagenMosaico => imagen !== null);

  const candidatos: ImagenMosaico[] = [
    ...imagenesProductos,
    ...(line.imagenBannerEscritorio
      ? [
          {
            src: line.imagenBannerEscritorio,
            alt: line.textoAlternativoBanner || `Línea ${line.nombre}`,
            href: `/${line.slug}`,
          },
        ]
      : []),
  ];

  if (candidatos.length === 0) {
    return Array.from({ length: 3 }, (_, index) => ({
      src: "",
      alt: `${line.nombre} · imagen ${index + 1}`,
      href: `/${line.slug}`,
    }));
  }

  return Array.from(
    { length: 3 },
    (_, index) => candidatos[index % candidatos.length],
  );
}

function LineaSpecs({
  configuracion,
}: {
  configuracion: ConfiguracionLineaMosaico;
}) {
  const specs = [
    ["Colores disponibles", configuracion.colores],
    ["Vidrios", configuracion.vidrios],
    ["Ideal para", configuracion.idealPara],
  ];

  return (
    <dl className="mt-5 border-b border-border/70">
      {specs.map(([etiqueta, valor]) => (
        <div
          key={etiqueta}
          className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 border-t border-border/70 py-2.5 text-sm sm:py-3"
        >
          <dt className="text-muted-foreground">{etiqueta}</dt>
          <dd className="text-right font-semibold text-foreground">{valor}</dd>
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
  configuracion,
  line,
  products,
  invertida,
  telefonoWhatsapp,
}: {
  configuracion: ConfiguracionLineaMosaico;
  line: LineaProducto;
  products: Producto[];
  invertida: boolean;
  telefonoWhatsapp: string;
}) {
  const whatsappHref = buildWhatsAppUrl(
    configuracion.mensajeWhatsapp,
    telefonoWhatsapp,
  );

  return (
    <article className="grid items-center gap-7 rounded-2xl border border-border/70 bg-card px-4 py-6 shadow-sm sm:px-6 sm:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8 lg:py-9">
      <div className={invertida ? "lg:order-2" : undefined}>
        <h3 className="text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          {configuracion.titulo}
        </h3>
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-[0.95rem] sm:leading-7">
          {configuracion.descripcion}
        </p>

        <LineaSpecs configuracion={configuracion} />

        <div className="mt-6 grid gap-2.5 md:grid-cols-[1.15fr_0.85fr]">
          <Button
            size="lg"
            className="group h-12 w-full justify-center rounded-xl px-4 text-sm font-bold shadow-sm md:px-3 lg:text-[0.78rem] xl:px-4 xl:text-sm"
            render={<Link href={`/${line.slug}`} />}
          >
            {`Ver catálogo Línea ${configuracion.titulo}`}
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
                aria-label={`Consultar por Línea ${configuracion.titulo} en WhatsApp`}
              />
            }
          >
            <WhatsAppIcon className="size-4" data-icon="inline-start" />
            {`Consultar por Línea ${configuracion.titulo}`}
          </Button>
        </div>
      </div>

      <div className={invertida ? "lg:order-1" : undefined}>
        <LineaGallery line={line} products={products} />
      </div>
    </article>
  );
}

/** Prototipo editorial hardcodeado para evaluar el mosaico de Módena y Herrero en Inicio. */
export function HomeCatalogsSection({
  lines,
  products,
  telefonoWhatsapp,
}: {
  lines: LineaProducto[];
  products: Producto[];
  telefonoWhatsapp: string;
}) {
  const lineasDisponibles = LINEAS_MOSAICO.map((configuracion) => ({
    configuracion,
    line: buscarLinea(lines, configuracion),
  })).filter(
    (
      item,
    ): item is {
      configuracion: ConfiguracionLineaMosaico;
      line: LineaProducto;
    } => Boolean(item.line),
  );

  if (lineasDisponibles.length === 0) return null;

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
          {lineasDisponibles.map(({ configuracion, line }, index) => (
            <LineaMosaico
              key={configuracion.slug}
              configuracion={configuracion}
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
