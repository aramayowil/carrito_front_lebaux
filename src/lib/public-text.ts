/** Reemplaza variables editoriales como {linea} o {cantidad}. */
export function completarTextoPublico(
  texto: string,
  valores: Record<string, string | number>,
): string {
  return Object.entries(valores).reduce(
    (resultado, [clave, valor]) =>
      resultado.replaceAll("{" + clave + "}", String(valor)),
    texto,
  );
}

/**
 * Convierte HTML enriquecido del editor Tiptap del admin en texto plano.
 *
 * Se usa para contextos que no pueden llevar HTML: `description` de
 * metadata/SEO, tarjetas de listado con `line-clamp`, etc. Para renderizar el
 * HTML tal cual (con sus etiquetas), usar `RichTextContent` en su lugar.
 */
export function htmlComoTextoPlano(html: string | undefined): string {
  return (html ?? "")
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
