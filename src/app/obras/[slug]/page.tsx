import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CATEGORIAS_OBRAS_MOCK, OBRAS_MOCK } from "@/data/mock/obras";
import { WorkDetailPage } from "@/screens/works/WorkDetailPage";
import { cargarSitio } from "@/server/datos-publicos";

type ParamsPromise = Promise<{ slug: string }>;

export function generateStaticParams() {
  return OBRAS_MOCK.map((obra) => ({ slug: obra.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: ParamsPromise;
}): Promise<Metadata> {
  const { slug } = await params;
  const obra = OBRAS_MOCK.find((item) => item.slug === slug);

  if (!obra) return { title: "Obra no encontrada" };

  return {
    title: obra.titulo,
    description: obra.detalleEspecial,
  };
}

export default async function Page({ params }: { params: ParamsPromise }) {
  const { slug } = await params;
  const obra = OBRAS_MOCK.find((item) => item.slug === slug);
  if (!obra) notFound();

  const sitio = await cargarSitio();
  const categoria = CATEGORIAS_OBRAS_MOCK.find(
    (item) => item.id === obra.categoriaId,
  );

  return (
    <WorkDetailPage
      obra={obra}
      categoria={categoria}
      telefonoWhatsapp={sitio.contacto.telefonoWhatsapp}
    />
  );
}
