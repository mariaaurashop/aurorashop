import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    // Permit unauthenticated access to /store and /chat routes
    // Estas rutas se excluyen del middleware de autenticación, permitiendo el acceso libre.
    // El patrón negativo (?!store|chat) asegura que cualquier ruta que comience con /store o /chat
    // no será interceptada por este middleware.
  
    "/((?!_next/static|_next/image|favicon.ico|store|chat|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
