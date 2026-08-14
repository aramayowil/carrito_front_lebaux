import type { Metadata } from "next"

import { TechnicalCatalogsPage } from "@/screens/technical-catalogs/TechnicalCatalogsPage"
import { cargarDatosCatalogosTecnicos } from "@/server/datos-publicos"

export const metadata: Metadata = {
  title: "Catálogos técnicos",
  description:
    "Documentación técnica y catálogos de las líneas de aberturas Lebaux.",
}

export default async function Page() {
  const { lineas, banner } = await cargarDatosCatalogosTecnicos()
  return <TechnicalCatalogsPage lines={lineas} banner={banner} />
}
