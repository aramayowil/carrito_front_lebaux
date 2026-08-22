import sanitizeHtmlLib from "sanitize-html";

/**
 * Etiquetas y atributos permitidos, acotados al vocabulario real que emite
 * el editor Tiptap del proyecto admin (ver los selectores `.rich-text-content
 * h1/ul/a/img/table/…` en `src/index.css`, que documentan qué tags espera
 * poder estilar el contenido ya guardado). No se permite `class` a propósito:
 * todo el estilado se resuelve con selectores descendientes desde afuera, así
 * que una clase inyectada no tiene ningún uso legítimo acá.
 */
const TAGS_PERMITIDAS = [
  "h1",
  "h2",
  "h3",
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "img",
  "blockquote",
  "code",
  "pre",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const ATRIBUTOS_PERMITIDOS = ["href", "target", "rel", "src", "alt", "style"];

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
 * Se usa `sanitize-html` (puro JS, sin `jsdom`) en vez de `isomorphic-dompurify`:
 * la cadena de dependencias de `jsdom` (vía `html-encoding-sniffer`) incluye
 * un paquete ESM-only (`@exodus/bytes`) que revienta con `ERR_REQUIRE_ESM` al
 * quedar bundleado como CommonJS en el runtime serverless de Netlify/Vercel.
 * Ese crash durante el render de Server Component cortaba el stream de RSC a
 * mitad de camino, lo que el navegador reportaba como "Minified React error
 * #412: Connection closed".
 *
 * `"use cache"`: la función es pura (mismo `html` de entrada, mismo resultado
 * siempre), así que cachearla por argumento —mismo patrón que
 * `src/server/datos-publicos.ts`— evita volver a sanitizar el mismo
 * contenido en cada render.
 */
export async function sanitizarHtml(html: string): Promise<string> {
  "use cache";
  return sanitizeHtmlLib(html, {
    allowedTags: TAGS_PERMITIDAS,
    allowedAttributes: { "*": ATRIBUTOS_PERMITIDOS },
    // Por defecto sanitize-html ya descarta cualquier atributo que no esté
    // en `allowedAttributes` (a diferencia de DOMPurify, que deja pasar
    // data-* aunque no esté en ALLOWED_ATTR), así que acá no hace falta un
    // equivalente a `ALLOW_DATA_ATTR: false`.
    transformTags: {
      // Cualquier <a target="_blank"> que venga del editor debe forzar
      // rel="noopener noreferrer": sin esto, la pestaña abierta puede
      // acceder a `window.opener` y redirigir la página original
      // (tabnabbing).
      a: (tagName, attribs) => ({
        tagName,
        attribs:
          attribs.target === "_blank"
            ? { ...attribs, rel: "noopener noreferrer" }
            : attribs,
      }),
    },
  });
}
