import { createClient } from "@supabase/supabase-js"

function obtenerConfiguracionSupabase() {
  const url = process.env.SUPABASE_URL?.trim()
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase no está configurado. Revisá SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY.",
    )
  }

  return { url, publishableKey }
}

/** Cliente de solo lectura utilizado por los Server Components del carrito. */
export function crearClienteSupabaseServidor() {
  const { url, publishableKey } = obtenerConfiguracionSupabase()

  return createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
