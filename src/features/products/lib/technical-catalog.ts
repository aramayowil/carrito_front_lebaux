/** Devuelve una URL HTTPS normalizada o null si no es segura/valida. */
export function normalizarUrlCatalogoTecnico(
  value: string | undefined,
): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Presenta una fecha ISO de edicion sin desplazamientos por zona horaria. */
export function formatearFechaCatalogoTecnico(
  value: string | undefined,
): string | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
