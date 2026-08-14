import type { Metadata } from "next"

import { HomePage } from "@/screens/home/HomePage"
import { cargarDatosHome } from "@/server/datos-publicos"

export const metadata: Metadata = {
  title: "Puertas y ventanas de aluminio a medida",
  description:
    "Fábrica de aberturas de aluminio a medida en Tucumán. Líneas Herrero, Módena y A30.",
}

export default async function Page() {
  return <HomePage datos={await cargarDatosHome()} />
}
