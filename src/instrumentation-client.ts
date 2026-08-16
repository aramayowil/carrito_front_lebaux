// Se ejecuta en el navegador. NEXT_PUBLIC_SENTRY_DSN es pública a propósito
// (así funciona el DSN de Sentry: identifica el proyecto, no es un secreto).
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0,
  debug: false,
})

// Instrumenta las navegaciones entre páginas (App Router). No hace nada por
// sí solo mientras tracesSampleRate esté en 0.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
