"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, LoaderCircle, Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { ProductImage } from "@/components/media/ProductImage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ResultadoBusquedaProducto } from "@/server/datos-publicos"

function normalizarBusqueda(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

/** Buscador global: carga un índice liviano únicamente cuando se abre. */
export function ProductSearchDialog({ compact = false }: { compact?: boolean }) {
  const [abierto, setAbierto] = useState(false)
  const [consulta, setConsulta] = useState("")
  const [indice, setIndice] = useState<ResultadoBusquedaProducto[] | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!abierto || indice || cargando) return
    let activo = true
    setCargando(true)
    setError(false)

    void fetch("/api/busqueda", { cache: "force-cache" })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("No se pudo cargar el buscador")
        return respuesta.json() as Promise<ResultadoBusquedaProducto[]>
      })
      .then((datos) => {
        if (activo) setIndice(datos)
      })
      .catch(() => {
        if (activo) setError(true)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [abierto, cargando, indice])

  const consultaNormalizada = normalizarBusqueda(consulta)
  const resultados = useMemo(() => {
    if (!indice || consultaNormalizada.length < 2) return []
    return indice
      .filter((producto) =>
        normalizarBusqueda(producto.indice).includes(consultaNormalizada),
      )
      .slice(0, 8)
  }, [consultaNormalizada, indice])

  function irAlProducto(slug: string) {
    setAbierto(false)
    setConsulta("")
    router.push(`/producto/${slug}`)
  }

  return (
    <Dialog
      open={abierto}
      onOpenChange={(open) => {
        setAbierto(open)
        if (!open) setConsulta("")
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size={compact ? "icon-lg" : "default"}
            className={cn(
              "shrink-0 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white",
              compact
                ? "size-11 rounded-xl"
                : "size-10 overflow-hidden rounded-full px-0 xl:w-48 xl:justify-start xl:px-4 2xl:w-56",
            )}
            aria-label="Buscar productos"
          />
        }
      >
        <Search className="shrink-0" />
        {!compact && (
          <span className="hidden min-w-0 truncate xl:inline">Buscar productos</span>
        )}
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-5 py-5 pr-14">
          <DialogTitle>Buscar productos</DialogTitle>
          <DialogDescription>
            Escribí el nombre, la línea, la tipología o una característica.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={consulta}
              onChange={(event) => setConsulta(event.target.value)}
              placeholder="Ej.: ventana corrediza negra"
              className="h-12 pl-10 text-base"
              aria-label="Buscar en el catálogo"
            />
          </div>
        </div>

        <div className="max-h-[min(60svh,32rem)] overflow-y-auto p-3">
          {cargando ? (
            <div className="flex min-h-44 items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" /> Cargando catálogo...
            </div>
          ) : error ? (
            <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
              <p className="font-medium">No pudimos cargar el buscador</p>
              <p className="mt-1 text-sm text-muted-foreground">Cerralo y volvé a intentarlo.</p>
            </div>
          ) : consultaNormalizada.length < 2 ? (
            <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Search className="size-5" />
              </span>
              <p className="mt-4 font-medium">¿Qué abertura estás buscando?</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Ingresá al menos dos caracteres para explorar el catálogo.
              </p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
              <p className="font-medium">No encontramos coincidencias</p>
              <p className="mt-1 text-sm text-muted-foreground">Probá con otro nombre, una línea o un tipo de abertura.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
              </p>
              {resultados.map((producto) => (
                <Button
                  key={producto.id}
                  type="button"
                  variant="ghost"
                  className="h-auto w-full justify-start gap-3 rounded-xl p-2 text-left"
                  onClick={() => irAlProducto(producto.slug)}
                >
                  <ProductImage
                    src={producto.imagenUrl}
                    alt={producto.imagenAlt}
                    className="size-16 shrink-0 rounded-lg border bg-muted"
                    imgClassName="object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{producto.nombre}</span>
                    <span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
                      {[producto.linea, producto.tipologia].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
