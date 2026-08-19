# Resumen institucional administrable en Home

`AcercaDeNosotrosInicio` incorpora el campo opcional `resumenHome`, persistido
dentro del documento `inicio` de Supabase. La Home muestra como máximo sus dos
primeros párrafos; si el campo todavía no fue cargado, utiliza los dos primeros
párrafos de `textoDescriptivo` como compatibilidad.

El texto completo permanece intacto para una futura página institucional. La
normalización pública corrige además el valor heredado “¿QUIENES SOMOS?” a
“¿QUIÉNES SOMOS?” y la composición se alinea arriba para mantener visible el CTA
sin incrementar la altura de la sección.
