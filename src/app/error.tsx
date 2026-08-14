"use client"

import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="container flex min-h-[60svh] items-center justify-center py-16">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          No pudimos cargar esta sección
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Hubo un problema al consultar la información. Podés volver a intentarlo sin recargar todo el sitio.
        </p>
        <Button className="mt-6" onClick={reset}>
          <RotateCcw data-icon="inline-start" />
          Reintentar
        </Button>
      </div>
    </section>
  )
}
