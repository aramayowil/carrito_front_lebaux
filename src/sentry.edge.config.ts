// Se ejecuta cuando el código corre en el runtime Edge de Next.js. Hoy el
// proyecto no tiene middleware.ts, pero Next igual puede invocar este
// runtime para ciertas rutas; se deja inicializado por completitud.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0,
  debug: false,
});
