import { NextResponse } from "next/server"

import { respuestaLimiteExcedido, verificarLimite } from "@/lib/rate-limit"
import {
  PRODUCTOS_POR_TANDA,
  cargarProductosLineaPagina,
} from "@/server/datos-publicos"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lineaSlug: string }> },
) {
  const limite = verificarLimite(request, {
    ruta: "productos-linea",
    limite: 60,
    ventanaMs: 60_000,
  })
  if (!limite.permitido) {
    return respuestaLimiteExcedido(limite.reintentarEnSegundos)
  }

  const { lineaSlug } = await params
  const { searchParams } = new URL(request.url)

  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0)
  const limiteSolicitado = Number(searchParams.get("limit"))
  const limite =
    Number.isFinite(limiteSolicitado) && limiteSolicitado > 0
      ? Math.min(limiteSolicitado, 100)
      : PRODUCTOS_POR_TANDA

  const pagina = await cargarProductosLineaPagina(lineaSlug, offset, limite)

  return NextResponse.json(pagina, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  })
}
