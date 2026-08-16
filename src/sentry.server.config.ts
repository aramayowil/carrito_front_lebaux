// Se ejecuta una sola vez cuando arranca el servidor Next.js, importado
// desde instrumentation.ts. Sin SENTRY_DSN configurado, Sentry.init no hace
// nada (no rompe local/desarrollo si todavía no se configuró la cuenta).
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",

  // Solo captura errores por ahora, sin tracing de performance (podés subir
  // esto a un valor > 0 más adelante si querés monitoreo de performance).
  tracesSampleRate: 0,

  // Imprime info útil en la consola del servidor mientras se configura.
  debug: false,
})
