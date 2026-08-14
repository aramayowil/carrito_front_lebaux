import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

const TAGS_FIJOS = new Set([
  "sitio",
  "experiencia",
  "inicio",
  "lineas",
  "tipologias",
  "aperturas",
  "accesorios",
  "obras",
  "beneficios",
  "productos",
  "busqueda",
])

const PREFIJOS_TAG = ["producto:", "productos-linea:"] as const

function tagValido(tag: string) {
  return TAGS_FIJOS.has(tag) || PREFIJOS_TAG.some((prefijo) => tag.startsWith(prefijo))
}

function pathValido(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && path.length <= 256
}

export async function POST(request: Request) {
  const secretoEsperado = process.env.REVALIDATION_SECRET?.trim()
  const autorizacion = request.headers.get("authorization")
  const secretoRecibido = autorizacion?.startsWith("Bearer ")
    ? autorizacion.slice("Bearer ".length).trim()
    : ""

  if (!secretoEsperado || secretoRecibido !== secretoEsperado) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })
  }

  const cuerpo = (await request.json().catch(() => null)) as
    | { tags?: unknown; paths?: unknown }
    | null

  const tags = Array.isArray(cuerpo?.tags)
    ? [...new Set(cuerpo.tags.filter((item): item is string => typeof item === "string"))]
        .map((item) => item.trim())
        .filter((item) => item && tagValido(item))
        .slice(0, 30)
    : []

  const paths = Array.isArray(cuerpo?.paths)
    ? [...new Set(cuerpo.paths.filter((item): item is string => typeof item === "string"))]
        .map((item) => item.trim())
        .filter((item) => item && pathValido(item))
        .slice(0, 30)
    : []

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No se recibieron tags o paths válidos" },
      { status: 400 },
    )
  }

  for (const tag of tags) revalidateTag(tag, "max")
  for (const path of paths) revalidatePath(path)

  return NextResponse.json({ ok: true, tags, paths })
}
