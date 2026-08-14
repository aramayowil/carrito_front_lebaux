import { cacheLife, cacheTag } from "next/cache"

import { crearClienteSupabaseServidor } from "@/services/supabase/server"
import type {
  AccesorioLinea,
  Beneficio,
  ConfiguracionCheckoutPublica,
  ConfiguracionExperienciaPublica,
  ConfiguracionInicio,
  ConfiguracionSitio,
  LineaProducto,
  Obra,
  Producto,
  TipoAperturaProducto,
  TipologiaProducto,
} from "@/types"

type ClaveDocumento = "sitio" | "inicio" | "experiencia"
type KindCatalogo =
  | "linea"
  | "tipologia"
  | "tipo_apertura"
  | "accesorio"
  | "obra"
  | "beneficio"

interface FilaCatalogo {
  payload: unknown
}

function escaparHtml(texto: string) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function obtenerMensajeWhatsappObrasAnterior(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return ""
  const experiencia = payload as Record<string, unknown>
  const inicio = experiencia.inicio
  if (!inicio || typeof inicio !== "object" || Array.isArray(inicio)) return ""
  const obras = (inicio as Record<string, unknown>).obras
  if (!obras || typeof obras !== "object" || Array.isArray(obras)) return ""
  const mensaje = (obras as Record<string, unknown>).ctaMensajeWhatsapp
  return typeof mensaje === "string" ? mensaje : ""
}

function normalizarConfiguracionInicio(
  payload: unknown,
  mensajeWhatsappObrasAnterior?: string,
): ConfiguracionInicio {
  const inicio = (payload ?? {}) as Record<string, unknown>
  const acerca = inicio.acercaDeNosotros
  const normalizado: Record<string, unknown> = { ...inicio }

  const obrasActual =
    inicio.obras && typeof inicio.obras === "object" && !Array.isArray(inicio.obras)
      ? (inicio.obras as Record<string, unknown>)
      : {}
  const mensajeWhatsappActual =
    typeof obrasActual.mensajeWhatsapp === "string"
      ? obrasActual.mensajeWhatsapp.trim()
      : ""

  normalizado.obras = {
    ...obrasActual,
    mensajeWhatsapp:
      mensajeWhatsappActual ||
      mensajeWhatsappObrasAnterior?.trim() ||
      "Hola! Vi los proyectos realizados y quiero asesoramiento para mi obra.",
  }

  if (!acerca || typeof acerca !== "object" || Array.isArray(acerca)) {
    return normalizado as unknown as ConfiguracionInicio
  }

  const acercaActual = acerca as Record<string, unknown>
  const acercaNormalizada: Record<string, unknown> = { ...acercaActual }

  if (typeof acercaActual.textoDescriptivo !== "string") {
    const parrafos = Array.isArray(acercaActual.parrafos)
      ? acercaActual.parrafos.filter(
          (parrafo): parrafo is string => typeof parrafo === "string",
        )
      : []
    acercaNormalizada.textoDescriptivo = parrafos
      .map((parrafo) => parrafo.trim())
      .filter(Boolean)
      .map((parrafo) => `<p>${escaparHtml(parrafo)}</p>`)
      .join("")
  }
  delete acercaNormalizada.parrafos

  const antetitulo = [
    acercaActual.antetitulo,
    acercaActual.sobrelinea,
    acercaActual.eyebrow,
  ].find(
    (valor): valor is string =>
      typeof valor === "string" && valor.trim().length > 0,
  )

  delete acercaNormalizada.sobrelinea
  delete acercaNormalizada.eyebrow
  if (antetitulo) acercaNormalizada.antetitulo = antetitulo.trim()
  else delete acercaNormalizada.antetitulo

  if (Array.isArray(acercaActual.fortalezas)) {
    acercaNormalizada.fortalezas = acercaActual.fortalezas
      .filter(
        (fortaleza): fortaleza is Record<string, unknown> =>
          Boolean(fortaleza) &&
          typeof fortaleza === "object" &&
          !Array.isArray(fortaleza),
      )
      .map((fortaleza) => ({
        ...fortaleza,
        activo:
          typeof fortaleza.activo === "boolean" ? fortaleza.activo : true,
      }))
  }

  return {
    ...normalizado,
    acercaDeNosotros: acercaNormalizada,
  } as unknown as ConfiguracionInicio
}

async function consultarDocumentoSinCache<T>(key: ClaveDocumento): Promise<T> {
  const supabase = crearClienteSupabaseServidor()
  const { data, error } = await supabase
    .from("site_documents")
    .select("payload")
    .eq("key", key)
    .eq("published", true)
    .maybeSingle()

  if (error) throw new Error(`No se pudo cargar ${key}: ${error.message}`)
  if (!data) throw new Error(`Falta el documento público \"${key}\".`)
  return data.payload as T
}

async function consultarCatalogoSinCache<T>(
  kind: KindCatalogo,
  parentSlug?: string,
): Promise<T[]> {
  const supabase = crearClienteSupabaseServidor()
  let query = supabase
    .from("catalog_items")
    .select("payload")
    .eq("kind", kind)
    .eq("published", true)
    .order("sort_order", { ascending: true })

  if (parentSlug) query = query.eq("parent_slug", parentSlug)

  const { data, error } = await query
  if (error) {
    throw new Error(`No se pudo cargar el catálogo ${kind}: ${error.message}`)
  }
  return ((data ?? []) as FilaCatalogo[]).map((fila) => fila.payload as T)
}

export async function cargarSitio() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("sitio")
  return consultarDocumentoSinCache<ConfiguracionSitio>("sitio")
}

export async function cargarExperiencia() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("experiencia")
  return consultarDocumentoSinCache<ConfiguracionExperienciaPublica>("experiencia")
}

async function cargarInicioCrudo() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("inicio")
  return consultarDocumentoSinCache<unknown>("inicio")
}

export async function cargarLineas() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("lineas")
  return consultarCatalogoSinCache<LineaProducto>("linea")
}

export async function cargarTipologias() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("tipologias")
  return consultarCatalogoSinCache<TipologiaProducto>("tipologia")
}

export async function cargarTiposApertura() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("aperturas")
  return consultarCatalogoSinCache<TipoAperturaProducto>("tipo_apertura")
}

export async function cargarAccesorios() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("accesorios")
  return consultarCatalogoSinCache<AccesorioLinea>("accesorio")
}

async function cargarObras() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("obras")
  return consultarCatalogoSinCache<Obra>("obra")
}

async function cargarBeneficios() {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("beneficios")
  return consultarCatalogoSinCache<Beneficio>("beneficio")
}

async function cargarProductosVisibles(): Promise<Producto[]> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("productos")

  const supabase = crearClienteSupabaseServidor()
  const { data, error } = await supabase
    .from("products")
    .select("payload")
    .eq("visibility", "visible")
    .order("updated_at", { ascending: false })
  if (error) throw new Error(`No se pudieron cargar productos: ${error.message}`)
  return (data ?? []).map((fila) => fila.payload as Producto)
}

async function cargarProductosLinea(lineaSlug: string): Promise<Producto[]> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("productos", `productos-linea:${lineaSlug}`)

  const supabase = crearClienteSupabaseServidor()
  const { data, error } = await supabase
    .from("products")
    .select("payload")
    .eq("line_slug", lineaSlug)
    .eq("visibility", "visible")
    .order("updated_at", { ascending: false })
  if (error) throw new Error(`No se pudo cargar ${lineaSlug}: ${error.message}`)
  return (data ?? []).map((fila) => fila.payload as Producto)
}

async function cargarProductosPorIds(ids: string[]): Promise<Producto[]> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("productos")

  const idsUnicos = [...new Set(ids.filter(Boolean))]
  if (idsUnicos.length === 0) return []

  const supabase = crearClienteSupabaseServidor()
  const { data, error } = await supabase
    .from("products")
    .select("payload")
    .in("id", idsUnicos)
    .eq("visibility", "visible")

  if (error) {
    throw new Error(
      `No se pudieron cargar productos relacionados: ${error.message}`,
    )
  }

  const productos = (data ?? []).map((fila) => fila.payload as Producto)
  const porId = new Map(productos.map((item) => [item.id, item]))

  return idsUnicos.flatMap((id) => {
    const producto = porId.get(id)
    return producto ? [producto] : []
  })
}

async function cargarProductoPorSlug(slug: string): Promise<Producto | null> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("productos", `producto:${slug}`)

  const supabase = crearClienteSupabaseServidor()
  const { data, error } = await supabase
    .from("products")
    .select("payload")
    .eq("slug", slug)
    .neq("visibility", "oculto")
    .maybeSingle()
  if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`)
  return data ? (data.payload as Producto) : null
}

export interface DatosLayoutPublico {
  sitio: ConfiguracionSitio
  lineas: LineaProducto[]
  tipologias: TipologiaProducto[]
  checkout: ConfiguracionCheckoutPublica
}

export async function cargarDatosLayout(): Promise<DatosLayoutPublico> {
  const [sitio, lineas, tipologias, experiencia] = await Promise.all([
    cargarSitio(),
    cargarLineas(),
    cargarTipologias(),
    cargarExperiencia(),
  ])
  return { sitio, lineas, tipologias, checkout: experiencia.checkout }
}

export interface DatosHomePublica {
  productos: Producto[]
  lineas: LineaProducto[]
  obras: Obra[]
  beneficios: Beneficio[]
  inicio: ConfiguracionInicio
  experienciaInicio: ConfiguracionExperienciaPublica["inicio"]
  telefonoWhatsapp: string
  tipologias: TipologiaProducto[]
}

export async function cargarDatosHome(): Promise<DatosHomePublica> {
  const [productos, lineas, obras, beneficios, inicioCrudo, experiencia, sitio, tipologias] =
    await Promise.all([
      cargarProductosVisibles(),
      cargarLineas(),
      cargarObras(),
      cargarBeneficios(),
      cargarInicioCrudo(),
      cargarExperiencia(),
      cargarSitio(),
      cargarTipologias(),
    ])

  return {
    productos,
    lineas,
    obras,
    beneficios,
    inicio: normalizarConfiguracionInicio(
      inicioCrudo,
      obtenerMensajeWhatsappObrasAnterior(experiencia),
    ),
    experienciaInicio: experiencia.inicio,
    telefonoWhatsapp: sitio.contacto.telefonoWhatsapp,
    tipologias,
  }
}

export interface DatosCatalogoLineaPublica {
  linea: LineaProducto
  lineas: LineaProducto[]
  productos: Producto[]
  tipologias: TipologiaProducto[]
  tiposApertura: TipoAperturaProducto[]
  mensajeWhatsapp: string
  telefonoWhatsapp: string
}

export async function cargarDatosCatalogoLinea(
  lineaSlug: string,
): Promise<DatosCatalogoLineaPublica | null> {
  const [lineas, productos, tipologiasTodas, tiposApertura, experiencia, sitio] =
    await Promise.all([
      cargarLineas(),
      cargarProductosLinea(lineaSlug),
      cargarTipologias(),
      cargarTiposApertura(),
      cargarExperiencia(),
      cargarSitio(),
    ])
  const linea = lineas.find((item) => item.slug === lineaSlug)
  if (!linea) return null

  return {
    linea,
    lineas,
    productos,
    tipologias: tipologiasTodas.filter((item) => item.lineaSlug === lineaSlug),
    tiposApertura,
    mensajeWhatsapp: experiencia.catalogoLinea.asesoramientoMensajeWhatsapp,
    telefonoWhatsapp: sitio.contacto.telefonoWhatsapp,
  }
}

export interface DatosProductoPublico {
  producto: Producto
  linea: LineaProducto
  tipologia?: TipologiaProducto
  relacionados: Producto[]
  tipologias: TipologiaProducto[]
  tiposApertura: TipoAperturaProducto[]
  accesorios: AccesorioLinea[]
  telefonoWhatsapp: string
}

export async function cargarDatosProducto(
  slug: string,
): Promise<DatosProductoPublico | null> {
  const producto = await cargarProductoPorSlug(slug)
  if (!producto) return null

  const usaRelacionadosManuales = producto.productosRelacionadosIds.length > 0
  const [lineas, tipologias, tiposApertura, candidatosRelacionados, accesorios, sitio] =
    await Promise.all([
      cargarLineas(),
      cargarTipologias(),
      cargarTiposApertura(),
      usaRelacionadosManuales
        ? cargarProductosPorIds(producto.productosRelacionadosIds)
        : cargarProductosLinea(producto.linea),
      cargarAccesorios(),
      cargarSitio(),
    ])
  const linea = lineas.find((item) => item.slug === producto.linea)
  if (!linea) return null
  const tipologia = tipologias.find((item) => item.id === producto.tipologiaId)

  const candidatosSinActual = candidatosRelacionados.filter(
    (item) => item.id !== producto.id,
  )
  const relacionados = (usaRelacionadosManuales
    ? candidatosSinActual
    : candidatosSinActual.sort(
        (a, b) =>
          Number(b.tipologiaId === producto.tipologiaId) -
          Number(a.tipologiaId === producto.tipologiaId),
      )
  ).slice(0, 4)

  const slugsAccesorios = new Set(producto.accesorios.map((item) => item.slug))

  return {
    producto,
    linea,
    tipologia,
    relacionados,
    tipologias,
    tiposApertura,
    accesorios: accesorios.filter(
      (item) => item.lineaSlug === producto.linea && slugsAccesorios.has(item.slug),
    ),
    telefonoWhatsapp: sitio.contacto.telefonoWhatsapp,
  }
}

export async function cargarDatosCatalogosTecnicos() {
  const [lineas, experiencia] = await Promise.all([
    cargarLineas(),
    cargarExperiencia(),
  ])
  return { lineas, banner: experiencia.catalogosTecnicos }
}

export async function cargarDatosSincronizacionCarrito(ids: string[]) {
  const idsUnicos = [...new Set(ids.filter(Boolean))].slice(0, 50)
  if (idsUnicos.length === 0) return { productos: [] as Producto[], accesorios: [] as AccesorioLinea[] }

  const supabase = crearClienteSupabaseServidor()
  const [productosRes, accesorios] = await Promise.all([
    supabase
      .from("products")
      .select("payload")
      .in("id", idsUnicos)
      .neq("visibility", "oculto"),
    cargarAccesorios(),
  ])
  if (productosRes.error) {
    throw new Error(`No se pudo sincronizar el carrito: ${productosRes.error.message}`)
  }
  return {
    productos: (productosRes.data ?? []).map((fila) => fila.payload as Producto),
    accesorios,
  }
}

export interface ResultadoBusquedaProducto {
  id: string
  slug: string
  nombre: string
  imagenUrl: string
  imagenAlt: string
  linea: string
  tipologia: string
  indice: string
}

export async function cargarIndiceBusqueda(): Promise<ResultadoBusquedaProducto[]> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 })
  cacheTag("busqueda", "productos", "lineas", "tipologias", "aperturas")

  const [productos, lineas, tipologias, tiposApertura] = await Promise.all([
    cargarProductosVisibles(),
    cargarLineas(),
    cargarTipologias(),
    cargarTiposApertura(),
  ])

  return productos.map((producto) => {
    const linea = lineas.find((item) => item.slug === producto.linea)
    const tipologia = tipologias.find((item) => item.id === producto.tipologiaId)
    const apertura = tiposApertura.find((item) => item.slug === producto.tipoApertura)
    const imagen =
      producto.imagenes.find((item) => item.esPrincipal) ?? producto.imagenes[0]
    const descripcionPlano = producto.descripcion.replace(/<[^>]*>/g, " ")
    return {
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      imagenUrl: imagen?.url ?? "",
      imagenAlt: imagen?.textoAlternativo ?? producto.nombre,
      linea: linea?.nombre ?? producto.linea,
      tipologia: tipologia?.nombre ?? "",
      indice: [
        producto.nombre,
        descripcionPlano,
        producto.etiquetas.join(" "),
        linea?.nombre ?? producto.linea,
        tipologia?.nombre ?? "",
        apertura?.nombre ?? producto.tipoApertura ?? "",
      ].join(" "),
    }
  })
}

