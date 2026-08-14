/** Configuración pública que sí necesita persistirse en backend. */

export type IdSeccionInicio =
  | "hero"
  | "catalogos"
  | "catalogosTecnicos"
  | "promociones"
  | "destacados"
  | "beneficios"
  | "obras"
  | "nosotros"

export interface EstadoSeccionInicio {
  id: IdSeccionInicio
  visible: boolean
  orden: number
}

/** En Experiencia, Inicio solo controla composición: orden y visibilidad. */
export interface ConfiguracionInicioPublica {
  secciones: EstadoSeccionInicio[]
}

export interface ConfiguracionCatalogoLineaPublica {
  asesoramientoMensajeWhatsapp: string
}

export interface ConfiguracionCatalogosTecnicosPublica {
  imagenBannerEscritorio: string
  imagenBannerMovil: string
  textoAlternativoBanner?: string
}

export type CampoCheckoutId =
  "nombre" | "telefono" | "email" | "localidad" | "notas"

export interface CampoCheckoutConfig {
  id: CampoCheckoutId
  activo: boolean
  requerido: boolean
}

export type FormaPagoCheckout = "contado" | "tarjeta"

export interface FormaPagoCheckoutConfig {
  id: FormaPagoCheckout
  activa: boolean
}

export interface ConfiguracionCheckoutPublica {
  campos: CampoCheckoutConfig[]
  formasPago: FormaPagoCheckoutConfig[]
  saludoWhatsapp: string
}

export interface ConfiguracionExperienciaPublica {
  inicio: ConfiguracionInicioPublica
  catalogoLinea: ConfiguracionCatalogoLineaPublica
  catalogosTecnicos: ConfiguracionCatalogosTecnicosPublica
  checkout: ConfiguracionCheckoutPublica
}
