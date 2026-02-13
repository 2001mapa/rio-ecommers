import { createBrowserClient } from '@supabase/ssr'

// Función para crear el cliente de Supabase en el lado del cliente (Browser)
// Esto se usará en componentes interactivos, login, carrito, etc.
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}