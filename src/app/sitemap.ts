import type { MetadataRoute } from "next"

import { obtenerUrlSitio } from "@/lib/site-url"
import { cargarIndiceBusqueda, cargarLineas } from "@/server/datos-publicos"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = obtenerUrlSitio()
  const [lineas, productos] = await Promise.all([
    cargarLineas(),
    cargarIndiceBusqueda(),
  ])

  const estaticas: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/catalogos-tecnicos`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const deLineas: MetadataRoute.Sitemap = lineas.map((linea) => ({
    url: `${base}/${linea.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const deProductos: MetadataRoute.Sitemap = productos.map((producto) => ({
    url: `${base}/producto/${producto.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [...estaticas, ...deLineas, ...deProductos]
}
