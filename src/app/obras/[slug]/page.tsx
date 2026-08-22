import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { htmlComoTextoPlano } from "@/lib/public-text";
import { WorkDetailPage } from "@/screens/works/WorkDetailPage";
import {
  cargarCategoriasObras,
  cargarObraPorSlug,
  cargarSitio,
} from "@/server/datos-publicos";

type ParamsPromise = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: ParamsPromise;
}): Promise<Metadata> {
  const { slug } = await params;
  const obra = await cargarObraPorSlug(slug);

  if (!obra) return { title: "Obra no encontrada" };

  return {
    title: obra.titulo,
    description: htmlComoTextoPlano(obra.detalleEspecial),
  };
}

export default async function Page({ params }: { params: ParamsPromise }) {
  const { slug } = await params;
  const obra = await cargarObraPorSlug(slug);
  if (!obra) notFound();

  const [sitio, categorias] = await Promise.all([
    cargarSitio(),
    cargarCategoriasObras(),
  ]);
  const categoria = categorias.find((item) => item.id === obra.categoriaId);

  return (
    <WorkDetailPage
      obra={obra}
      categoria={categoria}
      telefonoWhatsapp={sitio.contacto.telefonoWhatsapp}
    />
  );
}
