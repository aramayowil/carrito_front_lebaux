/**
 * Tipos de contenido editorial — CARRITO LEBAUX
 *
 * No pertenece al catálogo ni al carrito: son bloques de contenido para
 * secciones de marketing de la home (obras realizadas, beneficios de
 * comprarle a Lebaux, etc.). Viven separados para que un cambio en el
 * catálogo o el carrito no obligue a tocar este archivo, y viceversa.
 */

/**
 * Nombre del ícono de `lucide-react` a renderizar en la tarjeta de
 * beneficio. Unión cerrada a propósito: evita pasar un string cualquiera
 * que no exista como ícono y romper el render en runtime.
 */
export type IconoBeneficio =
  "Ruler" | "SlidersHorizontal" | "BadgeDollarSign" | "MessageCircle" | "Truck";

/**
 * Caso de éxito / testimonio para la sección "Obras realizadas".
 *
 * @example
 * const obra: Obra = {
 *   id: "obra-001",
 *   esPrincipal: true,
 *   titulo: "Ampliación de casa en San Miguel de Tucumán",
 *   tipo: "Proyecto residencial",
 *   especificacion: "Aberturas corredizas",
 *   imagen: "/img/obras/obra-001.jpg",
 *   testimonio: "El asesoramiento fue excelente y la instalación impecable.",
 *   autor: "Marcela G.",
 * };
 */
export interface CategoriaObra {
  id: string;
  slug: string;
  nombre: string;
}

export interface AntesYDespuesObra {
  activo: boolean;
  imagenAntes: string;
  imagenDespues: string;
  descripcion: string;
}

/** Proyecto del portfolio, con selección editorial opcional para Inicio. */
export interface Obra {
  id: string;
  slug: string;
  publicada: boolean;
  destacadaEnInicio: boolean;
  esPrincipal: boolean;
  ordenInicio: number;
  categoriaId: string;
  titulo: string;
  tipo: string;
  especificacion: string;
  imagen: string;
  /**
   * Contenido enriquecido (HTML del editor Tiptap del admin). Se renderiza
   * con `RichTextContent` en las vistas completas; en tarjetas con
   * `line-clamp` y en `description` de metadata/SEO se convierte antes a
   * texto plano con `htmlComoTextoPlano` (ver `@/lib/public-text`).
   */
  detalleEspecial: string;
  ubicacion: string;
  /**
   * Contenido enriquecido (HTML del editor Tiptap del admin). Se renderiza
   * con `RichTextContent` usando la variante `.rich-text-content--quote`
   * (ver `src/index.css`), que fuerza el contenido a fluir en línea y agrega
   * las comillas tipográficas por CSS — el `<blockquote>` que lo envuelve ya
   * no debe llevar comillas literales en el JSX.
   */
  testimonio: string;
  autor: string;
  galeria: string[];
  /** Contenido enriquecido (HTML del editor Tiptap del admin). Se sanitiza y renderiza con `RichTextContent`. */
  desafio: string;
  /** Contenido enriquecido (HTML del editor Tiptap del admin). Se sanitiza y renderiza con `RichTextContent`. */
  solucion: string;
  materiales: string[];
  antesYDespues?: AntesYDespuesObra;
}

/**
 * Ítem de la grilla de ventajas del proceso de compra y fabricación.
 *
 * @example
 * const beneficio: Beneficio = {
 *   id: "beneficio-medida",
 *   icono: "Ruler",
 *   titulo: "Fabricación a medida",
 *   descripcion: "Fabricamos cada abertura según las necesidades del proyecto.",
 * };
 */
export interface Beneficio {
  id: string;
  icono: IconoBeneficio;
  titulo: string;
  descripcion: string;
}

/** Pieza visual del carrusel principal de la portada. */
export interface BannerInicio {
  id: string;
  imagenEscritorioUrl: string;
  imagenMovilUrl: string;
  textoAlternativo: string;
  enlace: string;
  activo: boolean;
}

/** Nombre de un ícono de Lucide guardado en el contenido administrable. */
export type IconoFortalezaInicio = string;

export interface FortalezaInicio {
  id: string;
  icono: IconoFortalezaInicio;
  titulo: string;
  descripcion: string;
  activo: boolean;
}

/** Textos editables que acompañan las tarjetas de beneficios. */
export interface EncabezadoBeneficiosInicio {
  titulo: string;
  descripcion: string;
}

/** Contenido completo de la sección "Acerca de nosotros". */
export interface AcercaDeNosotrosInicio {
  antetitulo?: string;
  titulo: string;
  textoDescriptivo: string;
  imagenUrl: string;
  imagenAlt: string;
  fortalezas: FortalezaInicio[];
}

export interface ConfiguracionObrasInicio {
  mensajeWhatsapp: string;
}

/** Contenido administrable de la página de inicio. */
export interface ConfiguracionInicio {
  banners: BannerInicio[];
  porQueElegirnos: EncabezadoBeneficiosInicio;
  acercaDeNosotros: AcercaDeNosotrosInicio;
  obras: ConfiguracionObrasInicio;
}
