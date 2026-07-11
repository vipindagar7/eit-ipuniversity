import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const isProd = process.env.NODE_ENV === "production";

/**
 * Runs on every request (see matcher below). Layers several defenses in
 * one place since Next.js only supports a single middleware file:
 *
 * 1. Security headers (CSP w/ per-request nonce, clickjacking, MIME-sniffing,
 *    referrer leakage, HSTS) — applied to every response.
 * 2. Origin/Referer check on state-changing API requests — first-line CSRF
 *    defense, rejects cross-site POST/PATCH/DELETE before they reach a route.
 * 3. Per-IP rate limiting on /api/* — blunts brute force, scraping, and
 *    small-to-medium volumetric abuse. NOT a substitute for a real DDoS
 *    mitigation layer (Cloudflare, etc.) in front of the origin — see the
 *    note in lib/rateLimit.ts.
 * 4. Admin route auth gate (replaces the old withAuth-only middleware).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // ---- 1. CSP nonce, generated fresh per request ----
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  // ---- 2. CSRF: reject cross-origin state-changing API requests ----
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if (pathname.startsWith("/api/") && isMutating) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    // Same-origin browser requests always send Origin on cross-origin
    // fetches, and modern browsers send it on same-origin POSTs too. A
    // missing Origin with a present Referer from a different host is also
    // rejected. Server-to-server calls (no browser) won't send Origin at
    // all — this check only bites requests that look like a browser POST.
    if (origin) {
      let originHost: string | null = null;
      try {
        originHost = new URL(origin).host;
      } catch {
        originHost = null;
      }
      if (originHost !== host) {
        return NextResponse.json({ error: "Cross-origin request blocked" }, { status: 403 });
      }
    }
  }

  // ---- 3. Rate limiting on API routes ----
  if (pathname.startsWith("/api/")) {
    // Tighter limits on high-value/abuse-prone endpoints; a sane default
    // elsewhere. Keyed per-IP per-route so one endpoint's abuse doesn't
    // exhaust another's quota.
    const routeLimits: { match: (p: string) => boolean; limit: number; windowMs: number }[] = [
      { match: (p) => p.startsWith("/api/counselling"), limit: 5, windowMs: 60 * 60 * 1000 }, // 5/hour — public form
      { match: (p) => p.startsWith("/api/auth/callback/credentials"), limit: 10, windowMs: 15 * 60 * 1000 }, // login attempts
      { match: (p) => p.startsWith("/api/upload"), limit: 30, windowMs: 60 * 60 * 1000 },
      { match: () => true, limit: 60, windowMs: 60 * 1000 }, // default: 60/min
    ];

    const rule = routeLimits.find((r) => r.match(pathname))!;
    const result = rateLimit(`${ip}:${pathname}`, rule.limit, rule.windowMs);

    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // ---- 4. Admin auth gate (everything under /admin except /admin/login) ----
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // ---- Security headers on every response ----
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `'self' 'nonce-${nonce}' 'unsafe-eval'`; // Next dev's HMR (react-refresh) needs eval

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    // Tailwind + the rich text editor's inline color/highlight styles need
    // unsafe-inline here — style-src nonces aren't practical for editor
    // output. allowedStyles in lib/sanitizeRichText.ts is what keeps this safe.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (isProd) {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
