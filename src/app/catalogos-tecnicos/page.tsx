import type { Metadata } from "next";
import { Suspense } from "react";

import { TechnicalCatalogsPage } from "@/screens/technical-catalogs/TechnicalCatalogsPage";
import { TechnicalCatalogsPageSkeleton } from "@/screens/technical-catalogs/TechnicalCatalogsPageSkeleton";
import { cargarDatosCatalogosTecnicos } from "@/server/datos-publicos";

export const metadata: Metadata = {
  title: "Catálogos técnicos",
  description:
    "Documentación técnica y catálogos de las líneas de aberturas Lebaux.",
};

async function TechnicalCatalogsPageData() {
  const { lineas, telefonoWhatsapp } = await cargarDatosCatalogosTecnicos();
  return (
    <TechnicalCatalogsPage lines={lineas} telefonoWhatsapp={telefonoWhatsapp} />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<TechnicalCatalogsPageSkeleton />}>
      <TechnicalCatalogsPageData />
    </Suspense>
  );
}
