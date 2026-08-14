import { NextResponse } from "next/server"
import { cargarIndiceBusqueda } from "@/server/datos-publicos"

export async function GET() {
  return NextResponse.json(await cargarIndiceBusqueda(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  })
}
