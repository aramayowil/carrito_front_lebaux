/** Mensaje por defecto de las llamadas a la acción de contacto. */
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola! Vi la página web y quiero consultar por un presupuesto."

/** Construye un enlace wa.me con mensaje pre-cargado. */
export function buildWhatsAppUrl(message: string, phone: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
