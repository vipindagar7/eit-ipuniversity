# College Blog Platform

Next.js 15 (App Router) + Tailwind + shadcn-style UI + MongoDB. SEO-first,
fully responsive, with an admin CMS for blogs, colleges (with manual
drag-and-drop ranking), and counselling leads.

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy `.env.example` to `.env` and fill in every value:

```bash
cp .env.example .env
```

- **MONGODB_URI** — your MongoDB Atlas (or self-hosted) connection string.
- **NEXTAUTH_SECRET** — generate with `openssl rand -base64 32`.
- **ADMIN_EMAIL / ADMIN_PASSWORD** — used once by the seed script below, then
  you can delete `ADMIN_PASSWORD` from `.env`.
- **SMTP_* / MAIL_FROM** — Gmail SMTP. Use a Gmail **App Password**, not your
  real password (Google Account → Security → 2-Step Verification → App
  Passwords).
- **GOOGLE_SHEETS_* / GOOGLE_SHEET_ID** — a Google Cloud service account:
  1. Create a project in Google Cloud Console → enable "Google Sheets API".
  2. Create a Service Account → generate a JSON key.
  3. Open your Google Sheet → Share it with the service account's
     `client_email` (Editor access).
  4. Copy the Sheet ID from its URL into `GOOGLE_SHEET_ID`.

## 3. Seed the admin account

```bash
npm run seed:admin
```

This creates the single admin login from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
Log in at `/admin/login`.

## 4. Run

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## What's included

- **`lib/data.ts`** — single centralized file for site config, nav links,
  SEO defaults, course categories, blog categories. Edit this one file to
  rebrand or restructure nav/categories.
- **Shared layout** — `(site)` route group wraps Home, Colleges, Blog, and
  Counselling in one shared Header/Footer (`app/(site)/layout.tsx`). Admin
  has its own sidebar layout with no public chrome.
- **SEO** — per-page `generateMetadata`, dynamic `sitemap.ts` and
  `robots.ts`, JSON-LD (`BlogPosting`, `CollegeOrUniversity`) via
  `lib/seo.ts`, canonical URLs, OG/Twitter cards.
- **Counselling form** → `POST /api/counselling` → saves to MongoDB, appends
  a row to your Google Sheet, and sends a confirmation email — all three
  happen even if one fails (each is logged independently, nothing is lost
  since the DB write happens first).
- **College ranking** — `rank` field on the College model, editable only via
  drag-and-drop in `/admin/colleges`. This is completely independent of
  `rating` — you decide the public order.
- **Blog CMS** — Tiptap rich-text editor, draft/publish workflow, tags,
  per-post SEO fields.

## Next steps you may want

- Wire up image uploads (currently expects direct image URLs — easy to swap
  in Cloudinary/S3/UploadThing).
- Add pagination to `/admin/blogs`, `/admin/colleges`, `/blog`, `/colleges`
  once content volume grows.
- Add a contact/privacy/terms page (linked in the footer, not yet built).
- Replace `public/logo-dark.svg` / `logo-light.svg` with your real logo, and
  add a real `public/og-default.jpg` (1200×630).
