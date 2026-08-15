/**
 * URL base pública del sitio, usada para metadataBase, sitemap, robots y
 * URLs absolutas en metadatos (Open Graph, JSON-LD, etc.).
 *
 * Configurar NEXT_PUBLIC_SITE_URL en producción (ej: https://lebaux.com.ar).
 * Sin esa variable, cae a la URL que provee Vercel en cada deploy, y como
 * último recurso a localhost para no romper `next build` en desarrollo.
 */
export function obtenerUrlSitio(): string {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configurada) return configurada.replace(/\/+$/, "")

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl}`

  return "http://localhost:3000"
}
