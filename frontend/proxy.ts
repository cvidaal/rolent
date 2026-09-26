import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el usuario no está autenticado y está intentando acceder a una página protegida, lo redirigimos a la página de inicio.

  const isPrivateRoute = ["/dashboard", "/session", "/history", "/profile"].some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!user && isPrivateRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Sin sesión intentando acceder a onboarding, lo redirigimos a la página de inicio.
  if (!user && request.nextUrl.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    const hasCompletedOnboarding = profile?.onboarding_completed === true;

    // Tiene sesión y está en landing → onboarding o dashboard
    if (request.nextUrl.pathname === "/") {
      if (!hasCompletedOnboarding) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Tiene sesión, tiene onboarding, intenta ir a /onboarding se redirige a dashboard
    if (
      hasCompletedOnboarding &&
      request.nextUrl.pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Tiene sesión, sin onboarding, intenta ir a ruta privada -> onboarding
    if (!hasCompletedOnboarding && isPrivateRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return supabaseResponse; // Devolvemos la respuesta de Supabase.
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // El middleware se aplicará a todas las rutas excepto a las estáticas de Next.js.
};
