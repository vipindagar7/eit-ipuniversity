import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { headers } from "next/headers";
import { buildMetadata } from "@/lib/seo";
import { themeInitScript } from "@/lib/themeInitScript";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by middleware.ts per request — required so this inline script is
  // allowed under the nonce-based Content-Security-Policy instead of
  // needing a blanket 'unsafe-inline' for script-src.
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
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
