export interface OpcionesEntregaCloudinary {
  ancho?: number;
  alto?: number;
  recorte?: "fill" | "limit" | "scale";
}

const MARCADOR_CLOUDINARY = "/image/upload/";

/**
 * Inserta transformaciones de entrega en una URL de Cloudinary.
 * Si la URL no pertenece al formato estándar de Cloudinary, la devuelve intacta.
 */
export function crearUrlCloudinaryOptimizada(
  url: string,
  opciones: OpcionesEntregaCloudinary = {},
) {
  if (!url.includes(MARCADOR_CLOUDINARY)) return url;

  const transformaciones: string[] = [];
  const { ancho, alto, recorte = "limit" } = opciones;

  if (ancho || alto) {
    const dimensiones = [
      `c_${recorte}`,
      ancho ? `w_${Math.max(1, Math.round(ancho))}` : "",
      alto ? `h_${Math.max(1, Math.round(alto))}` : "",
    ].filter(Boolean);
    transformaciones.push(dimensiones.join(","));
  }

  // Cloudinary recomienda aplicar formato y calidad automáticos al final.
  transformaciones.push("f_auto", "q_auto");

  return url.replace(
    MARCADOR_CLOUDINARY,
    `${MARCADOR_CLOUDINARY}${transformaciones.join("/")}/`,
  );
}

export function crearSrcSetCloudinary(
  url: string,
  anchos: readonly number[],
  opciones: Omit<OpcionesEntregaCloudinary, "ancho"> = {},
) {
  if (!url.includes(MARCADOR_CLOUDINARY)) return undefined;

  return anchos
    .map(
      (ancho) =>
        `${crearUrlCloudinaryOptimizada(url, { ...opciones, ancho })} ${ancho}w`,
    )
    .join(", ");
}
