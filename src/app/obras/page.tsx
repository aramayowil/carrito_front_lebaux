import type { Metadata } from "next";

import { WorksPage } from "@/screens/works/WorksPage";
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

export default async function Page() {
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
