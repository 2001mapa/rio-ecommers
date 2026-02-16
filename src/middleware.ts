import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server' // <--- CAMBIAR 'request' por 'server'

// 💡 CAMBIA ESTO: 'true' para cerrar la web, 'false' para abrirla
const MODO_MANTENIMIENTO = false; 

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Si el mantenimiento está activo y el usuario no está ya en /mantenimiento
  if (MODO_MANTENIMIENTO && !pathname.startsWith('/mantenimiento')) {
    // Redirigimos a la página que creaste
    return NextResponse.redirect(new URL('/mantenimiento', req.url))
  }

  return NextResponse.next()
}

// Esto evita que el middleware bloquee tus imágenes o archivos del sistema
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}