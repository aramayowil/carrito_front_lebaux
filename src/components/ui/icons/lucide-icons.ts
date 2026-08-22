import { dynamicIconImports, type IconName } from "lucide-react/dynamic.mjs";

const ICONO_FALLBACK: IconName = "sparkles";
const ICONOS_LEGACY: Record<string, IconName> = {
  BadgeDollarSign: "badge-dollar-sign",
  Wrench: "wrench",
  Clock3: "clock-3",
  ShieldCheck: "shield-check",
  Maximize2: "maximize-2",
  Sparkles: "sparkles",
};

/** Normaliza nombres persistidos para renderizar cualquier ícono de Lucide de forma segura. */
export function normalizarNombreIconoLucide(nombre?: string): IconName {
  if (!nombre) return ICONO_FALLBACK;
  if (ICONOS_LEGACY[nombre]) return ICONOS_LEGACY[nombre];
  return nombre in dynamicIconImports ? (nombre as IconName) : ICONO_FALLBACK;
}
