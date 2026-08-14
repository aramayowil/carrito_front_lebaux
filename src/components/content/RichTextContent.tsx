import { cn } from "@/lib/utils"

interface RichTextContentProps {
  html: string
  className?: string
}

/**
 * El HTML proviene exclusivamente del editor privado del administrador.
 * En la tienda se renderiza como contenido estático, evitando enviar Tiptap
 * al navegador sólo para visualizar texto ya persistido.
 */
export function RichTextContent({ html, className }: RichTextContentProps) {
  return (
    <div
      className={cn("rich-text-content outline-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
