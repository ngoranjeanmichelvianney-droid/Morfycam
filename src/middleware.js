import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROUTES_PUBLIQUES = [
  "/",
  "/login",
  "/register",
  "/auth/callback",
  "/support",
  "/confidentialite",
  "/conditions-utilisation",
];

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesAEcrire) {
          cookiesAEcrire.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesAEcrire.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const estRoutePublique = ROUTES_PUBLIQUES.some((route) =>
    pathname === route || pathname.startsWith("/auth/callback")
  );

  // Pas connecté → accès route privée → redirect login
  if (!user && !estRoutePublique) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Connecté → essaie d'accéder à l'accueil/login/register → redirect dashboard
  if (
    user &&
    (pathname === "/" || pathname === "/login" || pathname === "/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  response.headers.set("Cache-Control", "no-store, must-revalidate");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};