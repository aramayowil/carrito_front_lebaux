import type { CampoCheckoutId, FormaPagoCheckout } from "@/types";

export type FormaPago = FormaPagoCheckout;

export interface ValorCampoCheckout {
  id: CampoCheckoutId;
  etiqueta: string;
  valor: string;
}

export interface DatosCheckout {
  campos: ValorCampoCheckout[];
  formaPago: FormaPago;
  formaPagoEtiqueta: string;
  saludoWhatsapp: string;
}
