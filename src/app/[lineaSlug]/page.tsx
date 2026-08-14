import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CatalogLinePage } from "@/pages/catalog/CatalogLinePage"
import { cargarDatosCatalogoLinea } from "@/server/datos-publicos"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lineaSlug: string }>
}): Promise<Metadata> {
  const { lineaSlug } = await params
  const datos = await cargarDatosCatalogoLinea(lineaSlug)
  if (!datos) return { title: "Catálogo" }
  return { title: datos.linea.nombre, description: datos.linea.descripcion }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lineaSlug: string }>
}) {
  const { lineaSlug } = await params
  const datos = await cargarDatosCatalogoLinea(lineaSlug)
  if (!datos) notFound()
  return <CatalogLinePage datos={datos} />
}
