import { NextResponse } from "next/server";

import { respuestaLimiteExcedido, verificarLimite } from "@/lib/rate-limit";
import { cargarIndiceBusqueda } from "@/server/datos-publicos";

export async function GET(request: Request) {
  const limite = verificarLimite(request, {
    ruta: "busqueda",
    limite: 30,
    ventanaMs: 60_000,
  });
  if (!limite.permitido) {
    return respuestaLimiteExcedido(limite.reintentarEnSegundos);
  }

  return NextResponse.json(await cargarIndiceBusqueda(), {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
