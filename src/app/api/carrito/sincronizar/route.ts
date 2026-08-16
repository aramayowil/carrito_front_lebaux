import { NextResponse } from "next/server"

import { respuestaLimiteExcedido, verificarLimite } from "@/lib/rate-limit"
import { cargarDatosSincronizacionCarrito } from "@/server/datos-publicos"

export async function POST(request: Request) {
  const limite = verificarLimite(request, {
    ruta: "carrito-sincronizar",
    limite: 30,
    ventanaMs: 60_000,
  })
  if (!limite.permitido) {
    return respuestaLimiteExcedido(limite.reintentarEnSegundos)
  }

  const cuerpo = (await request.json().catch(() => null)) as { ids?: unknown } | null
  const ids = Array.isArray(cuerpo?.ids)
    ? cuerpo.ids.filter((id): id is string => typeof id === "string")
    : []

  return NextResponse.json(await cargarDatosSincronizacionCarrito(ids))
}
