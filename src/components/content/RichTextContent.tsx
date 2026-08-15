import DOMPurify from "isomorphic-dompurify"

import { cn } from "@/lib/utils"

interface RichTextContentProps {
  html: string
  className?: string
}

/**
 * El HTML proviene del editor privado del administrador. Aun así se
 * sanitiza acá, en el único punto donde se renderiza en la tienda pública,
 * como segunda capa de defensa: si alguna vez se compromete una cuenta de
 * admin o el editor permite pegar HTML crudo, esto evita que se sirva un
 * script/iframe/handler malicioso a los visitantes del sitio.
 */
export function RichTextContent({ html, className }: RichTextContentProps) {
  const htmlSeguro = DOMPurify.sanitize(html, {
    // Coincide con lo que realmente puede producir el editor del admin
    // (ver los selectores .rich-text-content en index.css): si se agrega
    // una extensión nueva al editor, hay que sumarla acá también.
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "blockquote",
      "code",
      "pre",
      "hr",
      "img",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt", "style"],
  })

  return (
    <div
      className={cn("rich-text-content outline-none", className)}
      dangerouslySetInnerHTML={{ __html: htmlSeguro }}
    />
  )
}
