import type { Obra } from "@/types";

/** Datos mínimos que una tarjeta necesita para presentar una obra. */
export type WorkCardData = Obra & {
  detalleEspecial?: string;
  ubicacion?: string;
};

/** Categoría administrable utilizada por los filtros de la galería. */
export interface WorkCategory {
  id: string;
  nombre: string;
}

/** Resumen navegable requerido por el listado público de obras. */
export type WorkGalleryItem = WorkCardData & {
  slug: string;
  categoriaId: string;
};
