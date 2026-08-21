import type { Metadata } from "next";
import { Suspense } from "react";

import { WorksPage } from "@/screens/works/WorksPage";
import { WorksPageSkeleton } from "@/screens/works/WorksPageSkeleton";
import {
  cargarCategoriasObras,
  cargarObras,
  cargarSitio,
} from "@/server/datos-publicos";

export const metadata: Metadata = {
  title: "Nuestras obras",
  description:
    "Recorré proyectos realizados con aberturas Lebaux y descubrí ideas para transformar tus espacios.",
};

async function WorksPageData() {
  const [sitio, obras, categorias] = await Promise.all([
    cargarSitio(),
    cargarObras(),
    cargarCategoriasObras(),
  ]);

  return (
    <WorksPage
      telefonoWhatsapp={sitio.contacto.telefonoWhatsapp}
      obras={obras}
      categorias={categorias}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<WorksPageSkeleton />}>
      <WorksPageData />
    </Suspense>
  );
}
