import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { descripcionProductoComoTexto } from "@/features/products/lib/product-description"
import { ProductDetailPage } from "@/screens/product/ProductDetailPage"
import { ProductDetailPageSkeleton } from "@/screens/product/ProductDetailPageSkeleton"
import { cargarDatosProducto } from "@/server/datos-publicos"

type ParamsPromise = Promise<{ slug: string }>

export async function generateMetadata({
  params,
}: {
  params: ParamsPromise
}): Promise<Metadata> {
  const { slug } = await params
  const datos = await cargarDatosProducto(slug)
  if (!datos) return { title: "Producto no encontrado" }

  return {
    title: datos.producto.nombre,
    description: descripcionProductoComoTexto(datos.producto.descripcion),
  }
}

async function ProductDetailPageData({ params }: { params: ParamsPromise }) {
  const { slug } = await params
  const datos = await cargarDatosProducto(slug)
  if (!datos) notFound()
  return <ProductDetailPage datos={datos} />
}

export default function Page({ params }: { params: ParamsPromise }) {
  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
      <ProductDetailPageData params={params} />
    </Suspense>
  )
}
