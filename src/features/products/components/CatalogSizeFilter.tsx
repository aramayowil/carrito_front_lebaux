"use client"

import { useMemo, useState } from "react"
import { Check, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { OpcionFiltro } from "@/features/products/lib/facets"
import { cn } from "@/lib/utils"

const LIMITE_MEDIDAS_COMPACTAS = 8

function normalizarBusqueda(valor: string) {
  return valor
    .toLocaleLowerCase("es")
    .replaceAll("×", "x")
    .replace(/\s+/g, "")
    .trim()
}

interface CatalogSizeFilterProps {
  title: string
  options: OpcionFiltro[]
  value: string | null
  onChange: (value: string | null) => void
}

/**
 * Selector de medidas del catálogo.
 *
 * Con pocas opciones conserva los chips rápidos. Si la línea tiene muchas
 * medidas, cambia automáticamente a un buscador con lista compacta y scroll
 * interno para evitar que el sidebar crezca indefinidamente.
 */
export function CatalogSizeFilter({
  title,
  options,
  value,
  onChange,
}: CatalogSizeFilterProps) {
  const [query, setQuery] = useState("")

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizarBusqueda(query)
    if (!normalizedQuery) return options

    return options.filter((option) => {
      const searchable = normalizarBusqueda(`${option.label} ${option.value}`)
      return searchable.includes(normalizedQuery)
    })
  }, [options, query])

  if (options.length === 0) return null

  if (options.length <= LIMITE_MEDIDAS_COMPACTAS) {
    return (
      <div className="border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => {
            const active = option.value === value
            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                className="h-auto min-h-8 rounded-full px-3 py-1.5 whitespace-normal"
                aria-pressed={active}
                onClick={() => onChange(active ? null : option.value)}
              >
                {option.label}
                <span className={active ? "opacity-70" : "text-muted-foreground"}>
                  {option.count}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {options.length} medidas disponibles
          </p>
        </div>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() => onChange(null)}
          >
            Quitar
          </Button>
        )}
      </div>

      <div className="relative mt-3">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar medida..."
          aria-label="Buscar medida"
          className="h-9 rounded-xl border-border bg-background pl-9"
        />
      </div>

      <div
        className="mt-2 max-h-56 space-y-1 overflow-y-auto overscroll-contain pr-1"
        role="listbox"
        aria-label="Medidas disponibles"
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const active = option.value === value
            return (
              <Button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                variant="ghost"
                onClick={() => onChange(active ? null : option.value)}
                className={cn(
                  "h-auto min-h-9 w-full justify-start gap-2 rounded-xl px-2.5 py-2 text-left whitespace-normal",
                  active && "bg-primary/10 text-foreground hover:bg-primary/15",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border border-border",
                    active && "border-primary bg-primary text-primary-foreground",
                  )}
                  aria-hidden="true"
                >
                  {active && <Check className="size-3" />}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {option.label}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {option.count}
                </span>
              </Button>
            )
          })
        ) : (
          <p className="px-2 py-5 text-center text-xs text-muted-foreground">
            No encontramos esa medida.
          </p>
        )}
      </div>
    </div>
  )
}
