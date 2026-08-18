import type { MetadataRoute } from "next";

import { OBRAS_MOCK } from "@/data/mock/obras";
import { obtenerUrlSitio } from "@/lib/site-url";
import { cargarIndiceBusqueda, cargarLineas } from "@/server/datos-publicos";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = obtenerUrlSitio();
  const [lineas, productos] = await Promise.all([
    cargarLineas(),
    cargarIndiceBusqueda(),
  ]);

  const estaticas: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/catalogos-tecnicos`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/obras`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const deLineas: MetadataRoute.Sitemap = lineas.map((linea) => ({
    url: `${base}/${linea.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const deProductos: MetadataRoute.Sitemap = productos.map((producto) => ({
    url: `${base}/producto/${producto.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const deObras: MetadataRoute.Sitemap = OBRAS_MOCK.map((obra) => ({
    url: `${base}/obras/${obra.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...estaticas, ...deLineas, ...deProductos, ...deObras];
}
