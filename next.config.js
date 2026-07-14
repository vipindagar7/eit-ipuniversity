/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // don't leak "Next.js" + version in response headers
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // tighten to your CDN domain(s) in production
    ],
    // Self-hosted Next.js behind Nginx makes an internal HTTP round-trip
    // back through your own domain to optimize local images — in some
    // reverse-proxy/DNS setups that self-referential request loops back
    // incorrectly and returns an HTML error page instead of image bytes
    // ("The requested resource isn't a valid image ... received
    // text/html"). Since uploads are already resized client-side (512px
    // square crop) and served with long-lived cache headers directly by
    // Nginx, there's no real benefit to Next's runtime optimizer here —
    // disabling it sidesteps the whole class of problem.
    unoptimized: true,
  },
  eslint: { ignoreDuringBuilds: false },
  // Keep mongoose as a single shared native module instead of letting Next.js
  // bundle a separate copy of it into each server layer (RSC vs Route
  // Handlers). Bundling separate copies is what causes the Mongoose
  // "Cannot overwrite model once compiled" error in dev mode.
  serverExternalPackages: ["mongoose"],
};

module.exports = nextConfig;