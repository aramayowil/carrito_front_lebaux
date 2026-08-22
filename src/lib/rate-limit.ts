import { NextResponse } from "next/server";

interface ContadorVentana {
  cantidad: number;
  reiniciaEn: number;
}

/**
 * Rate limiting en memoria, por proceso. Es una defensa "suficiente" contra
 * scraping/abuso casual de un mismo origen, no una garantía dura: en un
 * deploy con varias instancias (ej. varias regiones de Vercel) cada una
 * lleva su propio contador, así que el límite real termina siendo
 * "por instancia", no global. Para un límite verdaderamente global entre
 * instancias hace falta un store compartido (ej. Upstash Redis +
 * @upstash/ratelimit), pero eso implica dar de alta un servicio externo
 * nuevo — se deja como mejora posible, no incluida acá.
 */
const contadores = new Map<string, ContadorVentana>();

// Barre entradas vencidas cada tanto para que el Map no crezca sin límite
// si el sitio recibe tráfico de muchas IPs distintas a lo largo del tiempo.
let ultimaLimpieza = Date.now();
const INTERVALO_LIMPIEZA_MS = 5 * 60 * 1000;

function limpiarVencidos() {
  const ahora = Date.now();
  if (ahora - ultimaLimpieza < INTERVALO_LIMPIEZA_MS) return;
  ultimaLimpieza = ahora;
  for (const [clave, contador] of contadores) {
    if (contador.reiniciaEn < ahora) contadores.delete(clave);
  }
}

function obtenerIpCliente(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Sin proxy delante (ej. desarrollo local) no hay forma de distinguir
  // clientes; se agrupan todos bajo la misma clave.
  return "sin-ip";
}

export interface OpcionesLimite {
  /** Identifica la ruta protegida (para no compartir contador entre rutas distintas). */
  ruta: string;
  /** Cantidad máxima de pedidos permitidos dentro de la ventana. */
  limite: number;
  /** Duración de la ventana, en milisegundos. */
  ventanaMs: number;
}

export interface ResultadoLimite {
  permitido: boolean;
  /** Segundos que hay que esperar antes de reintentar (solo si `permitido` es false). */
  reintentarEnSegundos: number;
}

export function verificarLimite(
  request: Request,
  opciones: OpcionesLimite,
): ResultadoLimite {
  limpiarVencidos();

  const clave = `${opciones.ruta}:${obtenerIpCliente(request)}`;
  const ahora = Date.now();
  const actual = contadores.get(clave);

  if (!actual || actual.reiniciaEn < ahora) {
    contadores.set(clave, {
      cantidad: 1,
      reiniciaEn: ahora + opciones.ventanaMs,
    });
    return { permitido: true, reintentarEnSegundos: 0 };
  }

  if (actual.cantidad >= opciones.limite) {
    return {
      permitido: false,
      reintentarEnSegundos: Math.ceil((actual.reiniciaEn - ahora) / 1000),
    };
  }

  actual.cantidad += 1;
  return { permitido: true, reintentarEnSegundos: 0 };
}

/** Respuesta 429 estándar, con Retry-After, para cuando se excede el límite. */
export function respuestaLimiteExcedido(reintentarEnSegundos: number) {
  return NextResponse.json(
    { error: "Demasiados pedidos. Probá de nuevo en unos segundos." },
    {
      status: 429,
      headers: { "Retry-After": String(reintentarEnSegundos) },
    },
  );
}
