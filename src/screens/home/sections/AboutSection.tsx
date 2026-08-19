import { Building2, MapPin } from "lucide-react";

import { RichTextContent } from "@/components/content/RichTextContent";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ProductImage } from "@/components/media/ProductImage";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import {
  crearSrcSetCloudinary,
  crearUrlCloudinaryOptimizada,
} from "@/services/cloudinary/imagen-entrega";
import type { AcercaDeNosotrosInicio } from "@/types";

/** Presentación institucional completamente administrable de la fábrica. */
export function AboutSection({
  contenido,
  telefonoWhatsapp,
}: {
  contenido: AcercaDeNosotrosInicio;
  telefonoWhatsapp: string;
}) {
  const imagenOptimizada = crearUrlCloudinaryOptimizada(contenido.imagenUrl, {
    ancho: 1200,
    recorte: "limit",
  });

  const imagenSrcSet = crearSrcSetCloudinary(
    contenido.imagenUrl,
    [480, 640, 800, 960, 1200],
    { recorte: "limit" },
  );

  const whatsappHref = buildWhatsAppUrl(
    DEFAULT_WHATSAPP_MESSAGE,
    telefonoWhatsapp,
  );
  const resumenHome =
    contenido.resumenHome?.trim() || contenido.textoDescriptivo;

  return (
    <section
      id="nosotros"
      className="border-t border-border/60 bg-muted/30 py-12 sm:py-14"
      aria-labelledby="about-title"
    >
      <div className="container grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="w-full lg:col-span-3">
          <ProductImage
            src={imagenOptimizada}
            srcSet={imagenSrcSet}
            sizes="(min-width: 1024px) 60vw, 100vw"
            alt={contenido.imagenAlt}
            className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-white lg:aspect-video"
            imgClassName="object-cover"
          />
        </div>

        <div className="min-w-0 lg:col-span-2">
          {contenido.antetitulo && (
            <p className="eyebrow mb-2">{contenido.antetitulo}</p>
          )}

          <h2
            id="about-title"
            className="section-title section-title-left mb-4"
          >
            {contenido.titulo}
          </h2>

          {resumenHome && (
            <RichTextContent
              html={resumenHome}
              className="text-sm leading-6 text-muted-foreground"
            />
          )}

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-y border-border/70 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Tucumán
            </p>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="size-4 text-primary" aria-hidden="true" />
              Buenos Aires · Casa central
            </p>
          </div>

          <Button
            variant="whatsapp"
            size="lg"
            className="mt-6 h-12 w-full justify-center rounded-xl px-6 text-base font-bold"
            render={
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Contactar a Lebaux por WhatsApp"
              />
            }
          >
            <WhatsAppIcon className="size-5" data-icon="inline-start" />
            Contactanos
          </Button>
        </div>
      </div>
    </section>
  );
}
