import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code"); // Código de autenticación que nos devuelve Supabase. (Google)

  if (code) {
    const supabase = await createClient(); // Creamos una instancia de Supabase.
    await supabase.auth.exchangeCodeForSession(code); // Intercambiamos el código por una sesión.
  }

  return NextResponse.redirect(`${origin}/dashboard`); // Redirigimos al usuario a la página de dashboard.
}
