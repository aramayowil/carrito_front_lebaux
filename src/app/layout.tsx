import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/index.css";
import { PublicShell } from "@/providers/PublicShell";

export const metadata: Metadata = {
  title: {
    default: "Aberturas Lebaux",
    template: "%s | Aberturas Lebaux",
  },
  description:
    "Fábrica de aberturas de aluminio a medida en Tucumán. Líneas Herrero, Módena y A30.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
