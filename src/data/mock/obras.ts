import datosObras from "@/data/mock/obras.json";
import type { Obra } from "@/types";

export interface CategoriaObraMock {
  id: string;
  nombre: string;
}

export interface ObraMock extends Obra {
  slug: string;
  categoriaId: string;
  detalleEspecial: string;
  ubicacion: string;
  galeria: string[];
  desafio: string;
  solucion: string;
  materiales: string[];
}

export interface RemodelacionObraMock {
  id: string;
  categoriaId: string;
  ubicacion: string;
  imagenAntes: string;
  imagenDespues: string;
  descripcion: string;
}

export interface SedeObrasMock {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
  cobertura: string;
}

/** Adaptador tipado del JSON temporal que luego será reemplazado por el administrador. */
export const CATEGORIAS_OBRAS_MOCK =
  datosObras.categorias satisfies CategoriaObraMock[];
export const OBRAS_MOCK = datosObras.obras satisfies ObraMock[];
export const REMODELACIONES_OBRAS_MOCK =
  datosObras.remodelaciones satisfies RemodelacionObraMock[];
export const SEDES_OBRAS_MOCK = datosObras.sedes satisfies SedeObrasMock[];
export const ESLOGAN_FINAL_OBRAS_MOCK = datosObras.esloganFinal;
