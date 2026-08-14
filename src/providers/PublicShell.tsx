import type { ReactNode } from "react"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { CarritoGlobal } from "@/features/cart/components/CarritoGlobal"
import { cargarDatosLayout } from "@/server/datos-publicos"

/** Shell público mayormente de servidor. Solo navegación y carrito hidratan JS. */
export async function PublicShell({ children }: { children: ReactNode }) {
  const { sitio, lineas, tipologias, checkout } = await cargarDatosLayout()

  return (
    <CarritoGlobal
      checkout={checkout}
      telefonoWhatsapp={sitio.contacto.telefonoWhatsapp}
    >
      <div className="isolate flex min-h-svh flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Saltar al contenido
        </a>
        <Navbar
          lineas={lineas}
          telefonoWhatsapp={sitio.contacto.telefonoWhatsapp}
          nombreSitio={sitio.nombre}
        />
        <main id="main-content" className="flex-1 overflow-x-clip">
          {children}
        </main>
        <Footer sitio={sitio} lineas={lineas} tipologias={tipologias} />
      </div>
    </CarritoGlobal>
  )
}
