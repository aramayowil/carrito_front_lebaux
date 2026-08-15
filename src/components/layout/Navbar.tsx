"use client"

import { useState, type ReactNode } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { Logo } from "@/components/layout/Logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ProductSearchDialog } from "@/features/products/components/ProductSearchDialog"
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import type { LineaProducto } from "@/types"

function EnlaceNavegacion({
  href,
  children,
  className,
  activo,
  onClick,
  title,
}: {
  href: string
  children: ReactNode
  className?: string
  activo: boolean
  onClick?: () => void
  title?: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={title}
      aria-current={activo ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  )
}

/** Header sticky, compacto y estable con búsqueda y navegación de catálogo. */
export function Navbar({
  lineas,
  telefonoWhatsapp,
  nombreSitio,
}: {
  lineas: LineaProducto[]
  telefonoWhatsapp: string
  nombreSitio: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const whatsappHref = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE, telefonoWhatsapp)

  return (
    <header className="sticky top-0 z-50 h-navbar shrink-0 border-b border-white/10 bg-brand-black/95 shadow-md backdrop-blur supports-backdrop-filter:bg-brand-black/90">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-3 px-4 sm:px-6">
        <div className="shrink-0">
          <Logo nombreSitio={nombreSitio} />
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-2 lg:flex xl:gap-3">
          <ProductSearchDialog />

          <nav
            aria-label="Navegación principal"
            className="flex min-w-0 flex-1 items-center justify-center gap-1 xl:gap-2"
          >
            {lineas.map((linea) => {
              const href = `/${linea.slug}`
              const activo = pathname === href
              return (
                <EnlaceNavegacion
                  key={linea.slug}
                  href={href}
                  title={linea.nombre}
                  activo={activo}
                  className={cn(
                    "min-w-0 max-w-32 truncate rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors 2xl:max-w-44 2xl:px-4",
                    activo
                      ? "bg-primary/10 text-primary"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {linea.nombre.replace("Línea ", "")}
                </EnlaceNavegacion>
              )
            })}

            <EnlaceNavegacion
              href="/catalogos-tecnicos"
              title="Documentación técnica"
              activo={pathname === "/catalogos-tecnicos"}
              className={cn(
                "hidden shrink-0 rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors lg:inline-flex 2xl:px-4",
                pathname === "/catalogos-tecnicos"
                  ? "bg-primary/10 text-primary"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              Documentación
            </EnlaceNavegacion>
          </nav>

          <Button
            variant="whatsapp"
            size="lg"
            className="size-11 shrink-0 rounded-full px-0 xl:w-auto xl:px-4"
            render={
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Pedir presupuesto por WhatsApp"
              />
            }
          >
            <WhatsAppIcon aria-hidden="true" />
            <span className="hidden xl:inline">Presupuesto</span>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ProductSearchDialog compact />
          <Button
            variant="whatsapp"
            size="lg"
            className="size-11 rounded-xl px-0 sm:w-auto sm:px-4"
            render={
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Pedir presupuesto por WhatsApp"
              />
            }
          >
            <WhatsAppIcon aria-hidden="true" />
            <span className="hidden sm:inline">Presupuesto</span>
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Abrir menú de navegación"
                  className="size-11 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-primary/10 hover:text-primary"
                />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              data-mobile-navigation=""
              className="w-[min(92vw,24rem)] max-w-none gap-0 border-l border-white/10 bg-brand-black p-0 text-white"
            >
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

              <div className="flex h-navbar shrink-0 items-center justify-between border-b border-white/10 px-4">
                <Logo nombreSitio={nombreSitio} />
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-primary/10 hover:text-primary"
                      aria-label="Cerrar menú de navegación"
                    />
                  }
                >
                  <X className="size-5" />
                </SheetClose>
              </div>

              <nav
                aria-label="Navegación principal mobile"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 scheme-dark"
              >
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Catálogos
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Elegí una línea para explorar sus modelos disponibles.
                  </p>
                </div>

                <div className="grid gap-2">
                  {lineas.map((linea) => {
                    const href = `/${linea.slug}`
                    const activo = pathname === href
                    return (
                      <EnlaceNavegacion
                        key={linea.slug}
                        href={href}
                        activo={activo}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-white",
                          activo &&
                            "border-primary/30 bg-primary/10 text-primary",
                        )}
                      >
                        {linea.nombre}
                        <span aria-hidden="true">→</span>
                      </EnlaceNavegacion>
                    )
                  })}
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <EnlaceNavegacion
                    href="/catalogos-tecnicos"
                    activo={pathname === "/catalogos-tecnicos"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-white transition-colors hover:bg-primary/10",
                      pathname === "/catalogos-tecnicos" &&
                        "border-primary/40 bg-primary/10 text-primary",
                    )}
                  >
                    <span>
                      <span className="block text-[0.625rem] font-semibold uppercase tracking-widest text-primary">
                        Recursos para profesionales
                      </span>
                      <span className="mt-1 block text-sm font-semibold">
                        Documentación técnica
                      </span>
                    </span>
                    <span aria-hidden="true">→</span>
                  </EnlaceNavegacion>
                </div>
              </nav>

              <div className="shrink-0 border-t border-white/10 bg-brand-graphite/60 p-4">
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full rounded-xl"
                  render={
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  }
                >
                  <WhatsAppIcon data-icon="inline-start" />
                  Pedir presupuesto
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
