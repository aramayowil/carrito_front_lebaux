import { sanitizarHtml } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'

interface RichTextContentProps {
  html: string
  className?: string
}

/**
 * El HTML proviene del editor privado de un proyecto admin separado y se
 * persiste en Supabase; el carrito lo consume como fuente externa, así que
 * se sanitiza acá (ver `sanitizarHtml`) antes de inyectarlo, en vez de
 * confiar en que el otro proyecto se comportó bien. En la tienda se
 * renderiza como contenido estático, evitando enviar Tiptap al navegador
 * sólo para visualizar texto ya persistido.
 */
export async function RichTextContent({
  html,
  className,
}: RichTextContentProps) {
  const htmlSeguro = await sanitizarHtml(html)

  return (
    <div
      className={cn('rich-text-content outline-none', className)}
      dangerouslySetInnerHTML={{ __html: htmlSeguro }}
    />
  )
}
