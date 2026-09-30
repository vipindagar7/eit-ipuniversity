import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { headers } from "next/headers";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { themeInitScript } from "@/lib/themeInitScript";
import { siteConfig } from "@/lib/data";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({});

// Explicit viewport + theme-color. Next.js 14+ moved these out of
// `metadata` into their own export — without this export no viewport meta
// tag is emitted at all, which is both a mobile-usability ranking signal
// and what makes the browser chrome match the brand color.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by middleware.ts per request — required so this inline script is
  // allowed under the nonce-based Content-Security-Policy instead of
  // needing a blanket 'unsafe-inline' for script-src.
  const nonce = (await headers()).get("x-nonce") || undefined;

  // Organization + WebSite structured data, site-wide — establishes the
  // entity behind the site and makes it eligible for the sitelinks search
  // box, the way a WordPress+Yoast/RankMath site does by default.
  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
<meta name="google-site-verification" content="BAx_pBkXfFDeGRU6sxbml_bjbEYySjYvmrP37N6JY6M" />
      </head>
      <body className="font-body bg-paper text-ink antialiased transition-colors dark:bg-indigo-950 dark:text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-indigo-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}