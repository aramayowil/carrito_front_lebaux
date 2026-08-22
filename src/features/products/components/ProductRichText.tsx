import { RichTextContent } from "@/components/content/RichTextContent";

interface ProductRichTextProps {
  html: string;
  className?: string;
}

/** Compatibilidad semántica para las descripciones enriquecidas de producto. */
export function ProductRichText({ html, className }: ProductRichTextProps) {
  return <RichTextContent html={html} className={className} />;
}
