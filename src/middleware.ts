import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/account", "/admin"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

/* ── Security Headers ── */
const securityHeaders = {
  // Prevent clickjacking — only allow our own site to frame pages
  "X-Frame-Options": "DENY",
  // Stop browsers from MIME-sniffing the content-type
  "X-Content-Type-Options": "nosniff",
  // Control referrer info sent with requests
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Enforce HTTPS for 1 year (includeSubDomains once you're confident)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  // Restrict browser features the site doesn't need
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=()",
  // Content Security Policy — allow our own origin + required third-party assets
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://logo.clearbit.com https://www.google.com https://*.gstatic.com https://*.supabase.co",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
  // Prevent cross-origin attacks
  "X-DNS-Prefetch-Control": "on",
};

function applySecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Use getUser() instead of getSession() — it validates the JWT
  // server-side rather than just reading the session cookie (which can be spoofed).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirectTo", pathname);
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  // Redirect authenticated users away from auth routes (no need to sign in again)
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  return applySecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
