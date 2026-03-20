import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/account", "/admin", "/company-dashboard"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

/* ── Static security headers (non-CSP) ── */
const STATIC_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Stop browsers from MIME-sniffing the content-type
  "X-Content-Type-Options": "nosniff",
  // Control referrer info sent with requests
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Enforce HTTPS for 1 year
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  // Restrict browser features the site doesn't need
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-DNS-Prefetch-Control": "on",
};

/**
 * Build a per-request CSP header that embeds a nonce.
 * The nonce eliminates the need for 'unsafe-inline' on script-src.
 * 'strict-dynamic' allows scripts loaded by trusted (nonced) scripts.
 * 'unsafe-inline' is kept on style-src — required by Tailwind.
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://logo.clearbit.com https://www.google.com https://*.gstatic.com https://*.supabase.co",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, nonce: string) {
  for (const [key, value] of Object.entries(STATIC_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate a fresh cryptographic nonce for this request.
  // Next.js App Router reads x-nonce from the request and automatically
  // attaches it to its own generated inline scripts.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Build patched request headers that include the nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
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
          // Pass the nonce-patched headers through when Supabase replaces the response
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /* ── Password Gate ── */
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "password_gate_enabled")
      .single();

    const gateEnabled = setting?.value === true;

    if (gateEnabled) {
      const hasAccess = request.cookies.get("site_access")?.value === "granted";

      if (!hasAccess && !pathname.startsWith("/password")) {
        const url = request.nextUrl.clone();
        url.pathname = "/password";
        return applySecurityHeaders(NextResponse.redirect(url), nonce);
      }

      if (hasAccess && pathname.startsWith("/password")) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return applySecurityHeaders(NextResponse.redirect(url), nonce);
      }
    }
  }

  // IMPORTANT: Use getUser() instead of getSession() — it validates the JWT
  // server-side rather than just reading the session cookie (which can be spoofed).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirectTo", pathname);
    return applySecurityHeaders(NextResponse.redirect(url), nonce);
  }

  // Redirect authenticated users away from auth routes
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return applySecurityHeaders(NextResponse.redirect(url), nonce);
  }

  return applySecurityHeaders(supabaseResponse, nonce);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
