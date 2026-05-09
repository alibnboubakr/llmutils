import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/history",
    "/settings",
    "/prompts",
    // Tools — must be signed in to use
    "/markdown",
    "/markdown-preview",
    "/sanitize",
    "/un-sanitizer",
    "/json",
    "/json-formatter",
    "/csv-to-json",
    "/regex",
    "/diff",
    "/transcribe",
    "/image-ocr",
    "/html-to-jsx",
    "/code-minifier",
    "/chat-exporter",
    "/token-estimator",
    "/request",
  ];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname === path ||
    request.nextUrl.pathname.startsWith(path + "/")
  );

  // If user is not signed in and the path is protected, redirect to login
  if (!user && isProtectedPath) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in and tries to access auth pages, redirect to dashboard
  const authPaths = ["/login", "/signup"];
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (user && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
};