/** Utilidades para mostrar y enlazar la ubicación pública sin incrustar URLs bloqueadas. */

function decodificarEntidadesBasicas(valor: string) {
  return valor
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function extraerSrcIframe(valor: string) {
  const coincidencia = valor.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return coincidencia?.[1]?.trim() ?? "";
}

function esUrlGoogleMapsEmbebible(valor: string) {
  try {
    const url = new URL(valor);
    if (url.protocol !== "https:") return false;

    const host = url.hostname.toLowerCase();
    const esGoogle =
      host === "google.com" ||
      host === "www.google.com" ||
      host === "maps.google.com" ||
      host.endsWith(".google.com");

    if (!esGoogle) return false;

    return (
      url.pathname.startsWith("/maps/embed") ||
      url.pathname.startsWith("/maps/d/embed") ||
      url.searchParams.get("output") === "embed"
    );
  } catch {
    return false;
  }
}

function obtenerValorUrl(valor: string) {
  const limpio = valor.trim();
  if (!limpio) return "";

  const src = limpio.toLowerCase().includes("<iframe")
    ? extraerSrcIframe(limpio)
    : limpio;

  return decodificarEntidadesBasicas(src);
}

/**
 * Devuelve una URL apta para `iframe`.
 *
 * Si desde administración se pegó el iframe completo de Google Maps, extrae su
 * `src`. Si se pegó un enlace normal/compartido (que Google bloquea dentro de
 * iframes), construye una búsqueda embebida a partir de la dirección pública.
 */
export function obtenerUrlMapaEmbebido({
  urlConfigurada,
  direccion,
  ciudad,
}: {
  urlConfigurada: string;
  direccion: string;
  ciudad: string;
}) {
  const url = obtenerValorUrl(urlConfigurada);
  if (esUrlGoogleMapsEmbebible(url)) return url;

  const ubicacion = [direccion.trim(), ciudad.trim()]
    .filter(Boolean)
    .join(", ");
  if (!ubicacion) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(ubicacion)}&output=embed`;
}

/** URL universal para abrir la ubicación en Google Maps fuera del iframe. */
export function obtenerUrlGoogleMaps({
  urlConfigurada,
  direccion,
  ciudad,
}: {
  urlConfigurada: string;
  direccion: string;
  ciudad: string;
}) {
  const url = obtenerValorUrl(urlConfigurada);

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const esGoogleMaps =
      host === "maps.app.goo.gl" ||
      host === "maps.google.com" ||
      ((host === "google.com" ||
        host === "www.google.com" ||
        host.endsWith(".google.com")) &&
        parsed.pathname.startsWith("/maps"));

    if (
      parsed.protocol === "https:" &&
      esGoogleMaps &&
      !esUrlGoogleMapsEmbebible(url)
    ) {
      return url;
    }
  } catch {
    // Si el valor configurado no es una URL válida, usamos la dirección pública.
  }

  const ubicacion = [direccion.trim(), ciudad.trim()]
    .filter(Boolean)
    .join(", ");
  if (!ubicacion) return "https://www.google.com/maps";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`;
}
