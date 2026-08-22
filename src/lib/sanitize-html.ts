import DOMPurify from 'isomorphic-dompurify'

/**
 * Etiquetas y atributos permitidos, acotados al vocabulario real que emite
 * el editor Tiptap del proyecto admin (ver los selectores `.rich-text-content
 * h1/ul/a/img/table/…` en `src/index.css`, que documentan qué tags espera
 * poder estilar el contenido ya guardado). No se permite `class` a propósito:
 * todo el estilado se resuelve con selectores descendientes desde afuera, así
 * que una clase inyectada no tiene ningún uso legítimo acá.
 */
const TAGS_PERMITIDAS = [
  'h1',
  'h2',
  'h3',
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'img',
  'blockquote',
  'code',
  'pre',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

const ATRIBUTOS_PERMITIDOS = ['href', 'target', 'rel', 'src', 'alt', 'style']

// Cualquier <a target="_blank"> que venga del editor debe forzar
// rel="noopener noreferrer": sin esto, la pestaña abierta puede acceder a
// `window.opener` y redirigir la página original (tabnabbing). DOMPurify no
// lo hace por sí solo, así que se agrega acá vía hook, siguiendo el patrón
// que la propia documentación de DOMPurify recomienda para este caso.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

/**
 * Sanitiza HTML enriquecido antes de renderizarlo con `dangerouslySetInnerHTML`.
 *
 * El HTML se origina en el proyecto admin (Tiptap) y se persiste en Supabase;
 * el carrito lo consume como una fuente externa en la que no puede confiar
 * ciegamente (cuenta admin comprometida, edición manual de la fila, un bug
 * de serialización, etc.). Esta es la única barrera que el carrito controla
 * antes de que ese HTML llegue al navegador de un cliente real, así que se
 * sanitiza acá aunque el origen sea "de confianza" en el flujo normal.
 *
 * `"use cache"`: internamente DOMPurify/jsdom tocan `Date` al inicializar,
 * lo que Next marca como "valor inestable" si se llama directo dentro de
 * una página que se prerenderiza estáticamente (ver `cacheComponents` en
 * next.config.mjs). Como esta función es pura — mismo `html` de entrada,
 * mismo resultado siempre —, cachearla por argumento (mismo patrón que
 * `src/server/datos-publicos.ts`) resuelve el error de prerender y de paso
 * evita correr DOMPurify de nuevo en cada render del mismo contenido.
 */
export async function sanitizarHtml(html: string): Promise<string> {
  'use cache'
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: TAGS_PERMITIDAS,
    ALLOWED_ATTR: ATRIBUTOS_PERMITIDOS,
    // Por defecto DOMPurify deja pasar cualquier atributo data-*
    // independientemente de ALLOWED_ATTR; acá no hay ningún uso legítimo.
    ALLOW_DATA_ATTR: false,
  })
}
