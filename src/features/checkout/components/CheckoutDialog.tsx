"use client";

import { useState, type FormEvent } from "react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  calcularTotalesCarrito,
  useCartStore,
} from "@/features/cart/store/use-cart-store";
import { useUICarrito } from "@/features/cart/hooks/use-ui-carrito";
import { buildOrderMessage } from "@/features/checkout/lib/order-message";
import type { FormaPago } from "@/features/checkout/types/checkout";
import { formatProductPrice } from "@/features/products/lib/product-card-formatters";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CampoCheckoutId, ConfiguracionCheckoutPublica } from "@/types";

const TEXTOS_CHECKOUT = {
  titulo: "Confirmá tu pedido",
  descripcion:
    "Completá tus datos y enviaremos el detalle configurado por WhatsApp.",
  opcional: "opcional",
  campoRequerido: "Completá este campo.",
  formaPagoTitulo: "Forma de pago preferida",
  resumenEtiqueta: "Total estimado",
  botonVolver: "Volver al carrito",
  botonEnviar: "Enviar pedido",
} as const;

const CAMPOS_CHECKOUT: Record<
  CampoCheckoutId,
  {
    etiqueta: string;
    placeholder: string;
    tipo: "text" | "tel" | "email";
    autoComplete?: string;
  }
> = {
  nombre: {
    etiqueta: "Nombre y apellido",
    placeholder: "Ej.: Juan Pérez",
    tipo: "text",
    autoComplete: "name",
  },
  telefono: {
    etiqueta: "Teléfono",
    placeholder: "Ej.: 381 555 0000",
    tipo: "tel",
    autoComplete: "tel",
  },
  email: {
    etiqueta: "Correo electrónico",
    placeholder: "Ej.: nombre@email.com",
    tipo: "email",
    autoComplete: "email",
  },
  localidad: {
    etiqueta: "Localidad",
    placeholder: "Ej.: Yerba Buena",
    tipo: "text",
    autoComplete: "address-level2",
  },
  notas: {
    etiqueta: "Comentarios",
    placeholder: "Contanos cualquier detalle adicional",
    tipo: "text",
  },
};

const FORMAS_PAGO: Record<
  FormaPago,
  {
    etiqueta: string;
    descripcion: string;
    etiquetaMensaje: string;
  }
> = {
  contado: {
    etiqueta: "Contado",
    descripcion: "Efectivo o transferencia",
    etiquetaMensaje: "Contado / transferencia",
  },
  tarjeta: {
    etiqueta: "Tarjeta",
    descripcion: "Precio de lista",
    etiquetaMensaje: "Tarjeta",
  },
};

interface CampoCheckoutVisible {
  id: CampoCheckoutId;
  requerido: boolean;
}

/** Recoge los datos mínimos y genera el pedido final para WhatsApp. */
export function CheckoutDialog({
  configuracion,
  telefonoWhatsapp,
}: {
  configuracion: ConfiguracionCheckoutPublica;
  telefonoWhatsapp: string;
}) {
  const {
    checkoutAbierto: open,
    setCheckoutAbierto: setOpen,
    setExitoAbierto,
    abrirCarrito,
  } = useUICarrito();
  const items = useCartStore((state) => state.items);
  const totals = calcularTotalesCarrito(items);
  const camposActivos: CampoCheckoutVisible[] = [
    { id: "nombre", requerido: true },
    ...configuracion.campos
      .filter((campo) => campo.activo && campo.id !== "nombre")
      .map((campo) => ({ id: campo.id, requerido: campo.requerido })),
  ];
  const formasPagoActivas = configuracion.formasPago.filter(
    (forma) => forma.activa,
  );

  const [valores, setValores] = useState<
    Partial<Record<CampoCheckoutId, string>>
  >({});
  const [formaPagoPreferida, setFormaPago] = useState<FormaPago>(
    formasPagoActivas[0]?.id ?? "contado",
  );
  const [submitted, setSubmitted] = useState(false);

  const formaPago = formasPagoActivas.some(
    (forma) => forma.id === formaPagoPreferida,
  )
    ? formaPagoPreferida
    : (formasPagoActivas[0]?.id ?? "contado");

  const hayCamposInvalidos = camposActivos.some(
    (campo) => campo.requerido && !valores[campo.id]?.trim(),
  );
  const formaPagoSeleccionada =
    formasPagoActivas.find((forma) => forma.id === formaPago) ??
    configuracion.formasPago.find((forma) => forma.id === formaPago);
  const total =
    formaPago === "contado" ? totals.totalContado : totals.totalTarjeta;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (hayCamposInvalidos || !formaPagoSeleccionada || items.length === 0) {
      return;
    }

    const message = buildOrderMessage(items, {
      campos: camposActivos.map((campo) => ({
        id: campo.id,
        etiqueta: CAMPOS_CHECKOUT[campo.id].etiqueta,
        valor: valores[campo.id]?.trim() ?? "",
      })),
      formaPago,
      formaPagoEtiqueta: FORMAS_PAGO[formaPagoSeleccionada.id].etiquetaMensaje,
      saludoWhatsapp: configuracion.saludoWhatsapp,
    });
    window.open(
      buildWhatsAppUrl(message, telefonoWhatsapp),
      "_blank",
      "noopener,noreferrer",
    );
    setOpen(false);
    setExitoAbierto(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl uppercase tracking-wide">
            {TEXTOS_CHECKOUT.titulo}
          </DialogTitle>
          <DialogDescription>{TEXTOS_CHECKOUT.descripcion}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {camposActivos.map((campo) => {
            const meta = CAMPOS_CHECKOUT[campo.id];
            const campoInvalido =
              submitted && campo.requerido && !valores[campo.id]?.trim();
            const id = `checkout-${campo.id}`;
            const value = valores[campo.id] ?? "";
            const onChange = (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) =>
              setValores((actuales) => ({
                ...actuales,
                [campo.id]: event.target.value,
              }));

            return (
              <div key={campo.id} className="space-y-2">
                <Label htmlFor={id}>
                  {meta.etiqueta}
                  {!campo.requerido && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({TEXTOS_CHECKOUT.opcional})
                    </span>
                  )}
                </Label>
                {campo.id === "notas" ? (
                  <Textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={meta.placeholder}
                    aria-invalid={campoInvalido}
                    required={campo.requerido}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={meta.placeholder}
                    aria-invalid={campoInvalido}
                    required={campo.requerido}
                    type={meta.tipo}
                    autoComplete={meta.autoComplete}
                  />
                )}
                {campoInvalido && (
                  <p className="text-xs text-destructive">
                    {TEXTOS_CHECKOUT.campoRequerido}
                  </p>
                )}
              </div>
            );
          })}

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">
              {TEXTOS_CHECKOUT.formaPagoTitulo}
            </legend>
            <RadioGroup
              value={formaPago}
              onValueChange={(value) => setFormaPago(value as FormaPago)}
              className="grid gap-3 sm:grid-cols-2"
            >
              {formasPagoActivas.map((forma) => {
                const meta = FORMAS_PAGO[forma.id];
                return (
                  <Label
                    key={forma.id}
                    htmlFor={`payment-${forma.id}`}
                    className={cn(
                      "flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-[border-color,background-color,box-shadow] has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/30",
                      formaPago === forma.id
                        ? "border-primary bg-accent shadow-sm ring-1 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50",
                    )}
                  >
                    <RadioGroupItem
                      id={`payment-${forma.id}`}
                      value={forma.id}
                      className="mt-0.5"
                    />
                    <span className="space-y-1">
                      <span className="block font-medium">{meta.etiqueta}</span>
                      <span className="block text-xs leading-relaxed text-muted-foreground">
                        {meta.descripcion}
                      </span>
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </fieldset>

          <Separator />

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted p-4">
            <div>
              <p className="text-sm font-medium">
                {totals.cantidadItems} unidades
              </p>
              <p className="text-xs text-muted-foreground">
                {TEXTOS_CHECKOUT.resumenEtiqueta}{" "}
                {formaPagoSeleccionada
                  ? FORMAS_PAGO[formaPagoSeleccionada.id].etiqueta.toLowerCase()
                  : ""}
              </p>
            </div>
            <div className="text-right">
              {formaPago === "contado" && totals.ahorroTotal > 0 && (
                <p className="text-xs font-medium text-success">
                  Ahorrás {formatProductPrice(totals.ahorroTotal)}
                </p>
              )}
              <p className="text-xl font-bold">{formatProductPrice(total)}</p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={abrirCarrito}>
              {TEXTOS_CHECKOUT.botonVolver}
            </Button>
            <Button
              type="submit"
              variant="whatsapp"
              disabled={items.length === 0 || formasPagoActivas.length === 0}
            >
              <WhatsAppIcon data-icon="inline-start" />
              {TEXTOS_CHECKOUT.botonEnviar}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
