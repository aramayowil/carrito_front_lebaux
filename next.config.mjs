/** @type {import('next').NextConfig} */

import { withSentryConfig } from '@sentry/nextjs'

const esDesarrollo = process.env.NODE_ENV !== 'production'

// Next.js necesita 'unsafe-inline' en script-src porque inyecta el payload
// de hidratación de RSC como <script> inline sin nonce. Si en algún momento
// se agrega un middleware que genere un nonce por request, esto se puede
// endurecer más. 'unsafe-eval' solo se permite en desarrollo (lo usa el
// Fast Refresh de webpack); en producción no hace falta.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  // Mapa embebido del footer (contacto.urlMapaEmbebido, cargado desde el
  // panel admin). Sin esto, el iframe de Google Maps queda bloqueado por
  // el default-src 'self'.
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // El token solo hace falta para subir source maps en el build; sin él,
  // el build sigue funcionando pero los stack traces de Sentry se ven
  // minificados.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Silencia el output del CLI de Sentry salvo en CI.
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,

  // Estas dos opciones vivían en el nivel superior; desde @sentry/nextjs
  // 10.x quedaron deprecadas ahí en favor de `webpack.*` (aplican solo a
  // builds con webpack, no a Turbopack — que es lo que usa `next dev`/`build`
  // acá; sin efecto en ese caso, pero no rompen nada si se dejan).
  webpack: {
    treeshake: { removeDebugLogging: true },
    reactComponentAnnotation: { enabled: true },
  },

  // Los reportes de error del navegador salen por /monitoring (nuestro
  // propio dominio) en vez de pegarle directo a *.sentry.io: evita tocar
  // la Content-Security-Policy (connect-src sigue en 'self') y esquiva
  // bloqueadores de publicidad que filtran dominios de telemetría.
  tunnelRoute: '/monitoring',
})
