import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { descripcionProductoComoTexto } from "@/features/products/lib/product-description"
import { ProductDetailPage } from "@/screens/product/ProductDetailPage"
import { cargarDatosProducto } from "@/server/datos-publicos"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const datos = await cargarDatosProducto(slug)
  if (!datos) return { title: "Producto no encontrado" }

  return {
    title: datos.producto.nombre,
    description: descripcionProductoComoTexto(datos.producto.descripcion),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const datos = await cargarDatosProducto(slug)
  if (!datos) notFound()
  return <ProductDetailPage datos={datos} />
}
