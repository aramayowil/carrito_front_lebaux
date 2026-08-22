import type { MetadataRoute } from "next";

import { obtenerUrlSitio } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = obtenerUrlSitio();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
