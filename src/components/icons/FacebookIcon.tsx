import type { SVGProps } from "react";

/**
 * Ícono de Facebook como SVG inline. lucide-react (desde v1.x) ya no
 * incluye íconos de marcas/logos, así que se define acá igual que
 * WhatsAppIcon. Usa `currentColor`, hereda el color de texto del padre.
 */
export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.196 2.238.196v2.475h-1.26c-1.242 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94" />
    </svg>
  );
}
