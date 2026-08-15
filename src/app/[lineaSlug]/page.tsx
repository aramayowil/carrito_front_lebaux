import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { CatalogLinePage } from "@/screens/catalog/CatalogLinePage"
import { CatalogLinePageSkeleton } from "@/screens/catalog/CatalogLinePageSkeleton"
import { cargarDatosCatalogoLinea } from "@/server/datos-publicos"

type ParamsPromise = Promise<{ lineaSlug: string }>

export async function generateMetadata({
  params,
}: {
  params: ParamsPromise
}): Promise<Metadata> {
  const { lineaSlug } = await params
  const datos = await cargarDatosCatalogoLinea(lineaSlug)
  if (!datos) return { title: "Catálogo" }
  return { title: datos.linea.nombre, description: datos.linea.descripcion }
}

async function CatalogLinePageData({ params }: { params: ParamsPromise }) {
  const { lineaSlug } = await params
  const datos = await cargarDatosCatalogoLinea(lineaSlug)
  if (!datos) notFound()
  return <CatalogLinePage key={lineaSlug} datos={datos} />
}

export default function Page({ params }: { params: ParamsPromise }) {
  return (
    <Suspense fallback={<CatalogLinePageSkeleton />}>
      <CatalogLinePageData params={params} />
    </Suspense>
  )
}
