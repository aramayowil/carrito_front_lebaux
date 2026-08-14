import { Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { completarTextoPublico } from "@/lib/public-text"
import type { OpcionMedida } from "@/types"

interface ProductSizeSelectorProps {
  productId: string
  medidas: OpcionMedida[]
  medidaId: string
  onChange: (medidaId: string) => void
  isAvailable?: (medidaId: string) => boolean
}

/** Selector híbrido: medidas frecuentes visibles y listado completo cuando abundan. */
export function ProductSizeSelector({
  productId,
  medidas,
  medidaId,
  onChange,
  isAvailable,
}: ProductSizeSelectorProps) {
  const selectedMeasure = medidas.find((medida) => medida.id === medidaId)
  const hasMore = medidas.length > 6
  const firstMeasures = hasMore ? medidas.slice(0, 4) : medidas
  const quickMeasures =
    hasMore &&
    selectedMeasure &&
    !firstMeasures.some((medida) => medida.id === selectedMeasure.id)
      ? [...firstMeasures, selectedMeasure]
      : hasMore
        ? medidas.slice(0, 5)
        : firstMeasures

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label id={"medida-label-" + productId}>{"Medida"}</Label>
        <span className="text-xs text-muted-foreground">
          {completarTextoPublico("{cantidad} opciones", {
            cantidad: medidas.length,
          })}
        </span>
      </div>

      <div
        className="flex flex-wrap gap-2"
        aria-labelledby={`medida-label-${productId}`}
      >
        {quickMeasures.map((medida) => {
          const selected = medida.id === medidaId
          const available = isAvailable?.(medida.id) ?? true
          return (
            <Button
              key={medida.id}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              className="rounded-xl"
              aria-pressed={selected}
              disabled={!available}
              onClick={() => onChange(medida.id)}
            >
              {medida.etiqueta}
            </Button>
          )
        })}

        {hasMore && (
          <Select
            value={medidaId}
            onValueChange={(value) => value && onChange(value)}
          >
            <SelectTrigger
              size="default"
              className="h-9 rounded-xl border-border bg-background"
              aria-label="Ver todas las medidas"
            >
              <Ruler className="size-4 text-muted-foreground" />
              Ver todas
            </SelectTrigger>
            <SelectContent align="start">
              {medidas.map((medida) => (
                <SelectItem
                  key={medida.id}
                  value={medida.id}
                  disabled={!(isAvailable?.(medida.id) ?? true)}
                >
                  {medida.etiqueta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
