/**
 * Tipos de configuración del sitio — CARRITO LEBAUX
 *
 * Datos globales de la marca/negocio que no cambian por producto ni por
 * pedido: logo, datos de contacto, redes sociales, horarios. Pensado para
 * cargarse una sola vez (ej: en un contexto o al iniciar la app) y
 * consumirse desde el Header, Footer, página de contacto, etc.
 */

/** Redes sociales soportadas hoy en los enlaces del sitio. */
export type PlataformaSocial =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "youtube"
  | "tiktok"
  | "x"
  | "linkedin"
  | "pinterest"
  | "threads"
  | "telegram"
  | "discord"
  | "twitch"
  | "snapchat"

/**
 * @example
 * const logo: LogoSitio = {
 *   origen: "/logo.png",
 *   textoAlternativo: "Lebaux — carritos de aluminio",
 * };
 */
export interface LogoSitio {
  origen: string;
  textoAlternativo: string;
}

/**
 * @example
 * const horario: HorarioComercial = {
 *   etiqueta: "Lunes a viernes",
 *   valor: "9:00 a 18:00",
 * };
 */
export interface HorarioComercial {
  etiqueta: string;
  valor: string;
}

/**
 * @example
 * const instagram: EnlaceSocial = {
 *   plataforma: "instagram",
 *   url: "https://instagram.com/lebaux",
 *   etiqueta: "@lebaux",
 * };
 */
export interface EnlaceSocial {
  plataforma: PlataformaSocial;
  url: string;
  etiqueta: string;
}

/**
 * @example
 * const contacto: ConfiguracionContacto = {
 *   direccion: "Av. Siempre Viva 123",
 *   ciudad: "San Miguel de Tucumán",
 *   telefonoWhatsapp: "+5493810000000",
 *   horarios: [
 *     { etiqueta: "Lunes a viernes", valor: "9:00 a 18:00" },
 *     { etiqueta: "Sábados", valor: "9:00 a 13:00" },
 *   ],
 *   redesSociales: [
 *     { plataforma: "instagram", url: "https://instagram.com/lebaux", etiqueta: "@lebaux" },
 *   ],
 *   urlMapaEmbebido: "https://www.google.com/maps/embed?...",
 * };
 */
export interface ConfiguracionContacto {
  direccion: string;
  ciudad: string;
  telefonoWhatsapp: string;
  horarios: HorarioComercial[];
  redesSociales: EnlaceSocial[];
  urlMapaEmbebido: string;
}

/**
 * Configuración global del sitio, consumida desde la fuente remota de
 * contenido por componentes de `components/layout` y `features/`.
 *
 * @example
 * const sitio: ConfiguracionSitio = {
 *   nombre: "Lebaux",
 *   nombreLegal: "Lebaux S.R.L.",
 *   descripcion: "Carritos de aluminio a medida.",
 *   logo: { origen: "/logo.png", textoAlternativo: "Lebaux" },
 *   contacto: {
 *     direccion: "Av. Siempre Viva 123",
 *     ciudad: "San Miguel de Tucumán",
 *     telefonoWhatsapp: "+5493810000000",
 *     horarios: [{ etiqueta: "Lunes a viernes", valor: "9:00 a 18:00" }],
 *     redesSociales: [
 *       { plataforma: "instagram", url: "https://instagram.com/lebaux", etiqueta: "@lebaux" },
 *     ],
 *     urlMapaEmbebido: "https://www.google.com/maps/embed?...",
 *   },
 * };
 */
export interface ConfiguracionSitio {
  nombre: string;
  nombreLegal: string;
  descripcion: string;
  logo: LogoSitio;
  contacto: ConfiguracionContacto;
}
