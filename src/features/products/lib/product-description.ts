/** Convierte el HTML enriquecido del editor en texto apto para resúmenes. */
export function descripcionProductoComoTexto(
  descripcion: string | undefined,
): string {
  return (descripcion ?? "")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
