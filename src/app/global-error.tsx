"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          color: "#202223",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: 520, padding: 32, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#d88416",
            }}
          >
            Aberturas Lebaux
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: 28 }}>
            No pudimos cargar el sitio
          </h1>
          <p style={{ margin: "14px 0 0", lineHeight: 1.6, color: "#5f6364" }}>
            Ocurrió un problema al obtener la información. Intentá nuevamente en unos segundos.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              border: 0,
              borderRadius: 12,
              padding: "12px 18px",
              background: "#f5a83d",
              color: "#202223",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  )
}
