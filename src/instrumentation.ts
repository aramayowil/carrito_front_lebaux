import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

// Captura errores lanzados en Server Components, Server Actions y route
// handlers que Next.js no expone de otra forma (no llegan a error.tsx).
export const onRequestError = Sentry.captureRequestError
