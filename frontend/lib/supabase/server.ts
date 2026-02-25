import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies(); // Acceso a las cookies del servidor.

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Al poner NEXT_PUBLIC_ se hace público el valor para el cliente
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // Como obtenemos todas las cookies del servidor.
        },
        setAll(cookiesToSet) {
          // Como escribir nuevas cookies en el servidor.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );
}
