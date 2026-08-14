/** Reemplaza variables editoriales como {linea} o {cantidad}. */
export function completarTextoPublico(
  texto: string,
  valores: Record<string, string | number>,
): string {
  return Object.entries(valores).reduce(
    (resultado, [clave, valor]) =>
      resultado.replaceAll("{" + clave + "}", String(valor)),
    texto,
  )
}
