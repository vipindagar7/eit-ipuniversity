# Security Measures

This document covers what's implemented in the app, and — just as
important — what genuinely can't be solved at the application layer and
needs infrastructure alongside it. Being upfront about the limits here
matters more than a checklist that implies everything is handled.

## What's implemented in the app

### Rate limiting (`lib/rateLimit.ts`, enforced in `middleware.ts`)
Per-IP, per-route sliding-window limits on every `/api/*` request:
- `/api/counselling` — 5 requests/hour (public form, main spam target)
- `/api/auth/callback/credentials` — 10 attempts/15 min per IP
- `/api/upload` — 30 requests/hour
- Everything else under `/api/*` — 60 requests/min (default)

Plus a **per-email** login throttle in `lib/auth.ts` (5 attempts/15 min) that
catches credential-stuffing spread across many IPs targeting one admin
account, which the per-IP limit alone wouldn't catch.

**Limitation:** this is in-memory, scoped to a single Node process. Correct
for one server (your Ubuntu VPS setup). If you ever run multiple instances
behind a load balancer, each instance has its own counters — swap
`lib/rateLimit.ts` for Redis/Upstash at that point (same function signature).

### NoSQL injection prevention (`lib/sanitizeMongoInput.ts`)
Every API route that passes a request body into a Mongoose
`create`/`findByIdAndUpdate` call runs it through `sanitizeMongoInput()`
first, which strips any key starting with `$` or containing `.`. Without
this, a JSON body like `{"email": {"$ne": null}}` sent to certain query
shapes could manipulate the filter instead of being treated as a literal
value. Applied in the blogs, colleges, and settings routes.

The counselling form route doesn't need this — it builds the Mongo
document from explicitly-named fields pulled off a Zod-validated object,
never from a spread of raw input, so there's no key-injection surface
there to begin with.

### Stored XSS prevention (`lib/sanitizeRichText.ts`)
Blog and college descriptions come from the Tiptap rich text editor and are
rendered with `dangerouslySetInnerHTML`. Before anything is saved, it's run
through `sanitize-html` with a strict allowlist matching exactly what the
editor's toolbar can produce (headings, formatting, links, tables, and the
color/highlight `style` attributes) — no `<script>`, no `on*` event
handlers, no `javascript:` URLs. This matters even though only an
authenticated admin can submit this content: if that session is ever
compromised, sanitizing at write-time means the stored data stays safe to
render regardless of what produced it.

### CSRF / cross-origin request forgery (`middleware.ts`)
Every state-changing request (`POST`/`PUT`/`PATCH`/`DELETE`) to `/api/*` is
checked: if it carries an `Origin` header that doesn't match the request's
own `Host`, it's rejected with 403 before reaching the route handler. This
is on top of NextAuth's own CSRF token handling for its login flow.

### Security headers (`middleware.ts`)
Applied to every response:
- **Content-Security-Policy** — nonce-based `script-src` (a fresh nonce per
  request, threaded through `app/layout.tsx` into the one inline script the
  app uses), `frame-ancestors 'none'`, `object-src 'none'`, restricted
  `img-src`/`font-src`/`connect-src`.
- **X-Frame-Options: DENY** — blocks the site from being embedded in an
  iframe (clickjacking / UI-redress attacks, including phishing pages that
  frame a real site to steal credentials).
- **X-Content-Type-Options: nosniff** — stops the browser from guessing
  content types in a way that could turn an uploaded file into executable
  script.
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Permissions-Policy** — camera/microphone/geolocation denied by default.
- **Strict-Transport-Security** — production only (meaningless without TLS
  in front of it — see below).

### File upload hardening (`app/api/upload/route.ts`)
- Size capped at 5MB, type restricted to PNG/JPEG/WEBP.
- **Magic-byte check**: the actual file bytes are inspected and must match
  the claimed type. A client can lie about `Content-Type` in the upload
  request; it can't lie about what the first bytes of the file actually
  are. This is what stops a renamed script from posing as an image.
- Filenames are server-generated UUIDs, never derived from user input — no
  path traversal surface.

### Object ID validation
Every dynamic `[id]` route checks the id looks like a real Mongo ObjectId
before querying, returning a clean 400 instead of letting a malformed value
reach the database driver.

## What this does NOT fully solve — and what to add

### DDoS
The rate limiter blunts small-to-medium volumetric abuse and scripted
attacks, but a real distributed denial-of-service (thousands of IPs) will
saturate your server's network/CPU before the app-layer limiter even gets a
chance to reject requests. That layer belongs in front of the origin:
- Put **Cloudflare** (or similar) in front of the server — free tier
  includes DDoS mitigation, and it's the standard answer here.
- At the Nginx level (since you're on a self-hosted Ubuntu VPS), add
  connection and request-rate limits as a second layer:
  ```nginx
  # /etc/nginx/nginx.conf, inside http { }
  limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
  limit_conn_zone $binary_remote_addr zone=perip:10m;

  # inside your site's server { } block
  limit_req zone=general burst=20 nodelay;
  limit_conn perip 20;
  ```
- Consider `fail2ban` watching Nginx access logs for repeated 429/401/403
  responses and temp-banning offending IPs at the firewall level.

### Phishing
This is the one that can't be "prevented" from inside your own app at
all — phishing happens on attacker-controlled infrastructure impersonating
your brand, not on your server. What actually helps:
- **X-Frame-Options / CSP `frame-ancestors`** (already in place) stops your
  *real* site from being framed inside a fake page to steal credentials via
  UI overlay — that's the one phishing-adjacent technique this app can
  block.
- **Email spoofing** (attackers sending phishing mail that appears to come
  from your domain) is a DNS problem, not a code problem — set these DNS
  records for whatever domain `MAIL_FROM` uses:
  - **SPF**: authorize your SMTP provider's sending IPs
  - **DKIM**: sign outgoing mail so recipients can verify it's really from you
  - **DMARC**: tell receiving mail servers what to do with mail that fails
    SPF/DKIM (`p=reject` once you're confident it's configured correctly)
- Educate whoever manages the admin account: the login page has a per-email
  attempt throttle now, but no app-level control stops someone from being
  tricked into typing their password into a convincing fake login page.
  Enabling a password manager (which won't autofill on the wrong domain) is
  the practical mitigation here.

### General operational hygiene (not code, but matters as much)
- Keep `npm audit` clean and dependencies updated — most real-world
  breaches exploit known CVEs in outdated packages, not novel attacks.
- Rotate `NEXTAUTH_SECRET` and the admin password periodically.
- Restrict MongoDB Atlas network access to your server's IP rather than
  "allow from anywhere."
- Make sure TLS/HTTPS is actually terminated somewhere (Nginx + Let's
  Encrypt, or your host's equivalent) — several of the headers above
  (HSTS, secure cookies) only do anything over HTTPS.
