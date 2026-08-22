import type { SVGProps } from "react";

/**
 * Ícono de Instagram como SVG inline. lucide-react (desde v1.x) ya no
 * incluye íconos de marcas/logos, así que se define acá igual que
 * WhatsAppIcon. Usa `currentColor`, hereda el color de texto del padre.
 */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
