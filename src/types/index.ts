/**
 * Barrel de tipos globales del proyecto.
 *
 * Permite importar cualquier tipo global como `@/types` en vez de apuntar
 * al archivo puntual, por ejemplo:
 *
 *   import type { Producto, ItemCarrito } from "@/types";
 *
 * en lugar de:
 *
 *   import type { Producto } from "@/types/catalogo";
 *   import type { ItemCarrito } from "@/types/carrito";
 *
 * Nota: los tipos que son exclusivos de un único componente o hook NO van
 * acá — se quedan junto a ese archivo. Este barrel es solo para tipos de
 * dominio compartidos entre features/páginas.
 */
export * from "./catalogo";
export * from "./carrito";
export * from "./contenido";
export * from "./sitio";
export * from "./experiencia";
