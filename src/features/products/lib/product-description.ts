import { htmlComoTextoPlano } from "@/lib/public-text";

/** Convierte el HTML enriquecido del editor en texto apto para resúmenes. */
export function descripcionProductoComoTexto(
  descripcion: string | undefined,
): string {
  return htmlComoTextoPlano(descripcion);
}
