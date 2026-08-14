import { NextResponse } from "next/server"
import { cargarDatosSincronizacionCarrito } from "@/server/datos-publicos"

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { ids?: unknown } | null
  const ids = Array.isArray(cuerpo?.ids)
    ? cuerpo.ids.filter((id): id is string => typeof id === "string")
    : []

  return NextResponse.json(await cargarDatosSincronizacionCarrito(ids))
}
